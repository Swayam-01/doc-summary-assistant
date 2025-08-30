# main.py
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tempfile, shutil, os
from .pdf_utils import extract_text_from_pdf
from .ocr_utils import extract_text_from_image
from .summarizer import orchestrate_document_summary
from typing import Optional

app = FastAPI(title="Doc Summary Assistant")

# Allow CORS from frontend (development)
app.add_middleware(
    CORSMiddleware,
    # allow_origins=[
    #     "https://doc-summary-assistant-eight.vercel.app/",
    #     "https://doc-summary-assistant-swayam-singhs-projects.vercel.app/",
    #     "https://doc-summary-assistant-jqls6p7qk-swayam-singhs-projects.vercel.app/",
    #     "http://localhost:3000",
    #     "http://127.0.0.1:3000",
    #     "http://localhost:5173",
    #     "http://127.0.0.1:5173"
    # ],
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/api/process")
async def process(file: UploadFile = File(...), length: Optional[str] = Form("MEDIUM")):
    suffix = os.path.splitext(file.filename)[1].lower()
    tmpdir = tempfile.mkdtemp()
    path = os.path.join(tmpdir, file.filename)
    try:
        with open(path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        if suffix == ".pdf":
            full_text = extract_text_from_pdf(path)
        elif suffix in [".png", ".jpg", ".jpeg", ".tiff", ".bmp"]:
            full_text = extract_text_from_image(path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        if not full_text or not full_text.strip():
            raise HTTPException(status_code=422, detail="No text extracted from document")

        result = orchestrate_document_summary(full_text, length=length or "MEDIUM")
        return JSONResponse(result)
    finally:
        try:
            shutil.rmtree(tmpdir, ignore_errors=True)
        except Exception:
            pass
