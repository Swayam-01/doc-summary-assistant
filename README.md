# Document Summary Assistant

Smart summaries for PDFs and scanned images.  
React frontend + FastAPI backend. This README explains, step-by-step, how to run the app locally, how to deploy, and how to troubleshoot common problems.

---
### First upload will take time due to connection establishment with backend and files initialization
---
## What this project does
- Upload PDF or scanned image (PNG/JPG/TIFF).
- Extract text from PDF or image (OCR).
- Generate short / medium / long summaries.
- Return summary text, key points/highlights, suggested actions, and simple stats.

---

## Repo structure (important files)
```
doc-summary-assistant/
├─ backend/
│ ├─ app/
│ │ ├─ main.py # FastAPI app; /api/process endpoint
│ │ ├─ pdf_utils.py # PDF text extraction
│ │ ├─ ocr_utils.py # Image OCR wrapper
│ │ └─ summarizer.py # Summarization logic
│ ├─ requirements.txt
│ ├─ Dockerfile
│ └─ .dockerignore
├─ frontend/
│ ├─ src/
│ │ ├─ App.jsx
│ │ ├─ index.css
│ │ └─ components/
│ │ ├─ UploadArea.jsx
│ │ ├─ SummaryView.jsx
│ │ └─ ThemeMenu.jsx
│ ├─ package.json
└─ README.md
```


---

## Prerequisites

Install these before you start:

**Required**
- Python 3.10+ (3.11 recommended)
- Node.js 16+ and npm
- git

**Optional (for OCR and Docker paths)**
- Tesseract OCR (system binary) — if you want image OCR
- Docker Desktop — if you want to build/run the backend in a container

---

## Quick start — run locally (Windows instructions)

Open two terminals (one for backend, one for frontend).

### Backend (Wndows Powershell)
```powershell
cd D:\doc-summary-assistant\backend

# create and activate Python virtual environment
python -m venv .venv
# PowerShell:
.\.venv\Scripts\Activate.ps1
# OR Command Prompt:
# .\.venv\Scripts\activate

# upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# optional: if your summarizer uses NLTK sentence tokenizers
python -c "import nltk; nltk.download('punkt')"

# run the backend (development)
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (Windows Powershell)
```powershell
cd D:\doc-summary-assistant\frontend
npm install
npm run dev
# Open http://localhost:5173 in browser
```

### Tesseract OCR (if you need OCR)
- Windows: install from an official Windows installer (e.g. UB Mannheim builds). Add tesseract to your PATH.
- macOS: brew install tesseract
- Ubuntu/Debian: sudo apt update && sudo apt install -y tesseract-ocr poppler-utils

### Common Error and Fixes
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-vercel-app.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
- For debugging only, you can temporarily set allow_origins=["*"], but do not keep this in production if allow_credentials=True.

### Notes and Tips
- For local development you do not need to install Docker or Tesseract unless you want OCR or container parity.
- Keep track of whether your backend is using the abstractive model — it requires more disk and memory.
- Make frequent small commits and push to GitHub; use Vercel/Render CI logs to debug production issues.

