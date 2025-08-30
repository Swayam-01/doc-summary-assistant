# prompts.py
SYSTEM_PROMPT = """
You are DocSumm — an assistant that creates accurate, concise summaries from documents.
Goals:
- Capture the document's main ideas, structure, and actionable points.
- Produce user-ready output in clean JSON according to the requested length.
- Preserve factual content and don't hallucinate details.
Output rules:
- Return JSON only (no extra commentary).
- Respect requested length category: short / medium / long.
- Provide a list of highlights (concise bullets).
- Provide optional per_page summaries if provided with page-separated text.
"""

OUTPUT_JSON_SCHEMA = """
Return the result as strict JSON only (no markdown, no extra text) with these keys:
- summary: string
- highlights: array of strings (max 10)
- suggested_actions: array of short strings (optional; 0..5)
- per_page: array of objects {page: integer, short: string} (optional)
Example:
{"summary":"...","highlights":["point1","point2"],"suggested_actions":["Do X","Do Y"],"per_page":[{"page":1,"short":"..."}]}
"""

CHUNK_PROMPT = """
{system}
You will be given a CHUNK of document text labelled CHUNK_TEXT.
Task:
1) Produce a short chunk_summary (1-3 sentences) capturing the chunk's main idea.
2) Extract up to 3 concise key_points (each 3-12 words).
3) If the chunk contains no meaningful content, return empty strings/arrays.
Return as JSON only:
{{"chunk_summary":"...","key_points":["...","..."]}}
{schema}
CHUNK_TEXT:
\"\"\"{chunk_text}\"\"\"
"""

AGGREGATION_PROMPT = """
{system}
You are given an ordered list of chunk summaries and key points.
Task:
1) Combine them to create a single coherent final summary matching the requested LENGTH.
2) De-duplicate repeated key points and produce a ranked highlights list.
3) If per_page data is available, include a short per_page summary array.
Constraints:
- LENGTH option: SHORT (≤50 words), MEDIUM (~150 words), LONG (~350-450 words).
- Provide 3 highlights for SHORT, 5 highlights for MEDIUM, 8-10 highlights for LONG.
- Provide 0-5 suggested_actions for MEDIUM and LONG; omit for SHORT unless strongly relevant.
Return JSON only with keys: summary, highlights, suggested_actions (optional), per_page (optional).
Input (replace placeholders):
CHUNK_SUMMARIES: {chunk_summaries}
CHUNK_KEYPOINTS: {chunk_keypoints}
{schema}
"""

DIRECT_SUMMARY_PROMPT = """
{system}
Task:
Summarize the following document according to LENGTH = {length}.
Produce:
- A final summary (concise and faithful).
- A highlights array (bulleted key ideas).
- Suggested short actions (if applicable).
Return JSON only.
{schema}

DOCUMENT_TEXT:
\"\"\"{document_text}\"\"\"
"""
