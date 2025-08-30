
"""
Hybrid summarizer:
- If document is small (tokens <= THRESHOLD) uses abstractive summarizer (transformers).
- If large, uses a fast extractive summarizer (sentence scoring) for snappy responses.
- Adds timing logs so you can see where time is spent.
"""

import re, time, logging
from typing import List, Dict
from transformers import pipeline, AutoTokenizer

logger = logging.getLogger("summarizer_hybrid")
logger.setLevel(logging.INFO)

# --- Abstractive model setup (keeps existing model) ---
SUM_MODEL = "sshleifer/distilbart-cnn-12-6"
logger.info("Initializing tokenizer/model (may take time on first run)...")
tokenizer = AutoTokenizer.from_pretrained(SUM_MODEL)
try:
    summarizer = pipeline("summarization", model=SUM_MODEL)
except Exception as e:
    summarizer = None
    logger.warning("Could not initialize summarizer pipeline: %s", e)

# --- Limits and targets ---
MODEL_MAX_TOKENS = 1024
SAFETY_MARGIN = 50
CHUNK_MAX_TOKENS = MODEL_MAX_TOKENS - SAFETY_MARGIN
ABSTR_ACTIVE_TOKEN_THRESHOLD = 3000  # if doc tokens <= this, use abstractive; else use extractive

SUMMARY_TOKEN_TARGETS = {
    "SHORT": {"min": 20, "max": 60},
    "MEDIUM": {"min": 60, "max": 160},
    "LONG": {"min": 150, "max": 400},
}

# --- Helpers ---
COMMON_STOPWORDS = {
 "the","and","is","in","it","of","to","a","for","on","that","this","with","as","are","be","by","an","or","from","at","was","which","have","has","but","not","they","their","we","our","you","your","I"
}

def sentence_split(text: str) -> List[str]:
    text = text.strip()
    if not text:
        return []
    parts = re.split(r'(?<=[.!?])\s+', text)
    parts = [p.strip() for p in parts if p.strip()]
    if parts:
        return parts
    return [p.strip() for p in text.splitlines() if p.strip()]

def count_tokens(text: str) -> int:
    try:
        return len(tokenizer.encode(text, truncation=False, add_special_tokens=False))
    except Exception:
        return max(1, len(text.split()))

# --- Fast extractive summarizer (sentence scoring) ---
def extractive_summary(text: str, length: str="MEDIUM") -> Dict:
    """
    Score sentences by term-frequency (excluding stopwords). Choose top-K sentences.
    Returns result dict with summary, highlights, suggested_actions.
    """
    start = time.time()
    sents = sentence_split(text)
    if not sents:
        return {"summary":"", "highlights":[], "suggested_actions":[], "per_page":[]}
    # compute word frequencies
    freq = {}
    for sent in sents:
        for w in re.findall(r"\w+", sent.lower()):
            if w in COMMON_STOPWORDS or len(w) <= 2:
                continue
            freq[w] = freq.get(w,0) + 1
    if not freq:
        # fallback: join first few sentences
        summary = " ".join(sents[:3])
        highlights = sents[:3]
        elapsed = time.time()-start
        logger.info("Extractive fallback (empty freq) done in %.2fs", elapsed)
        return {"summary": summary, "highlights": highlights, "suggested_actions": derive_actions_from_highlights(highlights), "per_page":[]}

    # score each sentence
    scores = []
    for i,s in enumerate(sents):
        score = 0
        for w in re.findall(r"\w+", s.lower()):
            score += freq.get(w,0)
        scores.append((i, score, s))

    # choose number of sentences based on length
    if length.upper() == "SHORT":
        k = max(1, min(3, len(sents)//6))
    elif length.upper() == "LONG":
        k = max(4, min(12, len(sents)//4))
    else:
        k = max(2, min(6, len(sents)//5))

    # pick top-k by score, then sort back by original order for coherence
    scores_sorted = sorted(scores, key=lambda x: x[1], reverse=True)
    topK = sorted(scores_sorted[:k], key=lambda x: x[0])
    selected_sents = [t[2] for t in topK]
    summary = " ".join(selected_sents)
    highlights = selected_sents[:min(6, len(selected_sents))]
    actions = derive_actions_from_highlights(highlights)
    elapsed = time.time()-start
    logger.info("Extractive summary done in %.2fs (sents=%d, k=%d)", elapsed, len(sents), k)
    return {"summary": summary, "highlights": highlights, "suggested_actions": actions, "per_page":[]}

def derive_actions_from_highlights(highlights, max_actions=5):
    actions=[]
    for h in highlights[:max_actions]:
        low = h.lower()
        if any(k in low for k in ("increase","decrease","growth","decline","drop","rise","fall","grew")):
            actions.append(f"Verify the figures mentioned: \"{h}\"")
        elif any(k in low for k in ("recommend","should","need","must","consider","propose")):
            actions.append(f"Create an action plan for: \"{h}\"")
        elif any(k in low for k in ("error","issue","problem","risk","concern")):
            actions.append(f"Investigate the issue: \"{h}\"")
        else:
            short = h if len(h)<=80 else (h[:77].rsplit(" ",1)[0]+"...")
            actions.append(f"Review: \"{short}\"")
    # dedupe
    seen=set(); out=[]
    for a in actions:
        if a not in seen:
            out.append(a); seen.add(a)
    return out[:max_actions]

# --- Abstractive helpers (token-aware chunking) ---
def token_aware_chunks(text: str, max_tokens: int = CHUNK_MAX_TOKENS) -> List[str]:
    sents = sentence_split(text)
    if not sents:
        return []
    chunks=[]
    cur=[]; cur_tokens=0
    for sent in sents:
        t = count_tokens(sent)
        if t > max_tokens:
            # break by words
            words = sent.split()
            tmp=""
            for w in words:
                if count_tokens((tmp+" "+w).strip()) > max_tokens:
                    if tmp: chunks.append(tmp.strip())
                    tmp=w
                else:
                    tmp=(tmp+" "+w).strip()
            if tmp: chunks.append(tmp.strip())
            cur=[]; cur_tokens=0
            continue
        if cur and (cur_tokens + t) > max_tokens:
            chunks.append(" ".join(cur).strip())
            cur=[sent]; cur_tokens=t
        else:
            cur.append(sent); cur_tokens+=t
    if cur:
        chunks.append(" ".join(cur).strip())
    return chunks

def summarize_chunk_text(chunk: str, min_tokens: int = 20, max_tokens: int = 80) -> str:
    try:
        if summarizer is None:
            raise RuntimeError("abstractive summarizer not initialized")
        if count_tokens(chunk) > CHUNK_MAX_TOKENS:
            # truncate roughly
            approx_chars = int(len(chunk) * (CHUNK_MAX_TOKENS / (count_tokens(chunk)+1)))
            chunk = chunk[:approx_chars]
        out = summarizer(chunk, max_length=max_tokens, min_length=min_tokens, do_sample=False)
        return out[0].get("summary_text","").strip()
    except Exception as e:
        logger.warning("Abstractive summarizer failed, fallback to extractive for this chunk: %s", e)
        sents = sentence_split(chunk)
        return " ".join(sents[:2]) if sents else chunk[:200]

# --- Orchestration ---
def orchestrate_document_summary(full_text: str, length: str = "MEDIUM") -> Dict:
    start_total = time.time()
    if not full_text or not full_text.strip():
        return {"summary":"", "highlights":[], "suggested_actions":[], "per_page":[]}
    length = (length or "MEDIUM").upper()
    total_tokens = count_tokens(full_text)

    # If document is large, use extractive fallback (fast)
    if total_tokens > ABSTR_ACTIVE_TOKEN_THRESHOLD or summarizer is None:
        logger.info("Using FAST extractive summarizer (tokens=%d)", total_tokens)
        result = extractive_summary(full_text, length=length)
        logger.info("Total time: %.2fs", time.time()-start_total)
        return result

    # else use abstractive hierarchical pipeline (token-aware)
    logger.info("Using ABSTR active pipeline (tokens=%d)", total_tokens)
    chunks = token_aware_chunks(full_text, max_tokens=CHUNK_MAX_TOKENS)
    if not chunks:
        chunks = [full_text.strip()]

    # summarize each chunk
    chunk_summaries=[]
    t0 = time.time()
    for c in chunks:
        s = summarize_chunk_text(c, min_tokens=12, max_tokens=60)
        chunk_summaries.append(s)
    logger.info("Chunk summarization done in %.2fs (chunks=%d)", time.time()-t0, len(chunks))

    merged = " ".join(chunk_summaries).strip()
    if count_tokens(merged) > CHUNK_MAX_TOKENS:
        parts = token_aware_chunks(merged, max_tokens=CHUNK_MAX_TOKENS)
        merged_parts=[]
        for p in parts:
            merged_parts.append(summarize_chunk_text(p, min_tokens=20, max_tokens=80))
        merged = " ".join(merged_parts)

    target = SUMMARY_TOKEN_TARGETS.get(length, SUMMARY_TOKEN_TARGETS["MEDIUM"])
    final_min, final_max = target["min"], target["max"]
    if count_tokens(merged) <= final_max:
        final_summary = merged
    else:
        final_summary = summarize_chunk_text(merged, min_tokens=final_min, max_tokens=final_max)

    # highlights: choose first sentence of chunk summaries
    highlights=[]
    for s in chunk_summaries:
        if not s: continue
        f = sentence_split(s)[0] if sentence_split(s) else s.split(".")[0].strip()
        if f and f not in highlights:
            highlights.append(f)
        if len(highlights) >= (3 if length=="SHORT" else 5 if length=="MEDIUM" else 8):
            break

    suggested_actions = derive_actions_from_highlights(highlights)
    logger.info("Total orchestration time: %.2fs", time.time()-start_total)
    return {"summary": final_summary, "highlights": highlights, "suggested_actions": suggested_actions, "per_page":[]}
