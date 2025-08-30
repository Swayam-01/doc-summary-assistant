Document Summary Assistant — README

Smart summaries for PDFs & scanned images. React frontend + FastAPI backend. Works locally, via Docker, or deployed (Vercel + Render). This README walks someone from zero → running the app on their machine.

Table of contents

Project overview

Features

Repo structure

Prerequisites (what to install)

Quick start (short commands)

Detailed local setup

Backend (venv, requirements, Tesseract)

Frontend (Node, npm, Vite)

Environment variables

Running backend & frontend (dev)

Docker (build & run)

Deploy notes (Vercel frontend + Render backend with Docker)

Testing / API examples (curl)

Troubleshooting (common errors you saw)

How to switch summarizer (extractive vs. abstractive)

Files you may want to edit

Credits & license

1 — Project overview

Document Summary Assistant extracts text from PDFs and images, then generates short/medium/long summaries plus highlights and suggested actions. The stack:

Frontend: React + Vite (plain CSS, no Tailwind)

Backend: FastAPI (Uvicorn/Gunicorn) + text extraction (PDF / OCR) + summarizer (either extractive or Transformers-based abstractive)

Optional: Dockerfile for the backend (recommended for production hosting)

2 — Features

Upload PDF or scanned images

Text extraction: PDF parsing + OCR

Smart summarization (short/medium/long)

Highlights (key points) & suggested actions

Mobile responsive UI (light/dark theme)

Designed to run locally or be deployed

3 — Repo structure (important files)
doc-summary-assistant/
├─ backend/
│  ├─ app/
│  │  ├─ main.py                # FastAPI app + /api/process endpoint
│  │  ├─ pdf_utils.py           # PDF parsing code
│  │  ├─ ocr_utils.py           # image OCR wrapper
│  │  ├─ summarizer.py          # summarization logic (extractive or abstractive)
│  ├─ requirements.txt
│  ├─ Dockerfile
│  ├─ .dockerignore
│
├─ frontend/
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ components/
│  │  │  ├─ UploadArea.jsx
│  │  │  ├─ SummaryView.jsx
│  │  │  └─ ThemeMenu.jsx
│  │  ├─ index.css
│  ├─ package.json
│
└─ README.md

4 — Prerequisites (install these first)

Windows / macOS / Linux (recommended)

Python 3.10+ (3.11 recommended)

Node.js 16+ and npm (or yarn)

git

(Optional for Docker) Docker Desktop

If you plan to run full OCR locally:

Tesseract OCR (system binary). See below for platform-specific install.

If you plan to run abstractive summarizer (transformers + torch):

CPU-only inference can be heavy. Ensure you have enough RAM/disk (~>4–8 GB free). Installing torch on CPU is required.

5 — Quick start (fastest path)

If you want to test quickly (no Docker, local dev):

# Backend (in one terminal)
cd doc-summary-assistant/backend
python -m venv .venv
.\.venv\Scripts\activate      # Windows PowerShell/Command Prompt
pip install --upgrade pip
pip install -r requirements.txt
# If you use Tesseract OCR, install tesseract on OS (see below)

python -m uvicorn app.main:app --reload --port 8000

# Frontend (in another terminal)
cd ../frontend
npm install
npm run dev
# open http://localhost:5173

6 — Detailed local setup
A) Backend (Windows instructions)

Open PowerShell or CMD.

Create and activate virtual environment:

cd D:\doc-summary-assistant\backend
python -m venv .venv
.\.venv\Scripts\activate
python -m pip install --upgrade pip


Install Python dependencies:

pip install -r requirements.txt


If requirements.txt includes transformers and torch, installation may take long and use large disk space.

Tesseract OCR (if you need OCR):

Windows: download & install from https://github.com/UB-Mannheim/tesseract/wiki
 (choose the Windows installer). After install, ensure the tesseract executable is on PATH.

macOS: brew install tesseract

Linux (Debian/Ubuntu): sudo apt update && sudo apt install -y tesseract-ocr libtesseract-dev

(Optional) NLTK punkt data (if backend uses NLTK):

python -c "import nltk; nltk.download('punkt')"


Run the backend:

# dev run
python -m uvicorn app.main:app --reload --port 8000


If you prefer gunicorn (production-like):

# ensure gunicorn is in requirements
gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

B) Frontend (Windows)

Install Node.js (https://nodejs.org/
) and npm.

From repo root:

cd frontend
npm install
# If using pnpm or yarn, use those instead
npm run dev
# open http://localhost:5173

C) Environment variables

Frontend expects Vite build var VITE_API_URL in build env (used on Vercel). For local dev it falls back to http://localhost:8000 automatically.

Backend optional envs:

ALLOWED_ORIGINS (comma-separated) — if you prefer configuring origins via env.

Do not store secrets in source; use render/vercel env var UIs for production keys.

D) Frontend change to set API endpoint

UploadArea uses:

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const ENDPOINT = `${API_BASE.replace(/\/$/, "")}/api/process`;


Make sure that is present if you forked.

7 — Docker (run backend in container)

Dockerfile should be in backend/. Build & run locally:

cd backend
docker build -t doc-summary-backend .
docker run -p 8000:8000 doc-summary-backend
# then open http://localhost:8000/docs


Notes:

Dockerfile in project installs system packages (poppler-utils & tesseract) so OCR works inside container.

If Docker command not found on Windows, install Docker Desktop and enable WSL2.

8 — Deploy notes (Vercel frontend + Render backend with Docker)

Frontend (Vercel):

Set project root to frontend on import.

Add environment variable VITE_API_URL = https://<your-backend-url> (the Render service URL).

Build command: npm run build, Output dir: dist.

Backend (Render):

Choose Web Service → Docker environment and point at backend/ folder with your Dockerfile.

Provide env var ALLOWED_ORIGINS if your backend reads it, or add specific allowed origins to CORS in main.py.

Note: Transformers/models are large — prefer Docker so you can pre-bake models or use extractive summarizer on smaller tiers.

9 — API testing examples (curl)

Replace <BACKEND_URL> with http://localhost:8000 or deployed domain.

curl -v -X POST "<BACKEND_URL>/api/process" \
  -F "file=@/path/to/sample.pdf" \
  -F "length=MEDIUM"


Expected: JSON with keys summary, highlights (or key_points), suggested_actions, stats.

10 — Troubleshooting (common problems & fixes)
"uvicorn is not recognized"

Activate venv where you installed uvicorn, or install with pip install uvicorn[standard].

Use python -m uvicorn app.main:app --reload if uvicorn command not on PATH.

ModuleNotFoundError: No module named 'app'

Ensure you run uvicorn from the backend directory and that app is a package (backend/app/__init__.py optional).

On Render, set the Root Directory to backend.

CORS errors

If browser console: No 'Access-Control-Allow-Origin' header, update main.py CORS middleware to include your Vercel origin or use allow_origins=["*"] temporarily for debugging.

Example (secure):

app.add_middleware(
  CORSMiddleware,
  allow_origins=["https://your-vercel-url.vercel.app"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

"Token indices sequence length is longer than specified maximum"

This means the abstractive model's context window is exceeded. Use token-aware chunking or switch to extractive summarizer for large docs. The repo contains a robust token-aware summarizer and/or extractive fallback. Use the extractive summarizer for CPU-only environments.

Slow responses or timeouts (model downloads)

On first run, transformers will download large files (hundreds of MB to GB). Pre-download models during build time (Dockerfile or build script) or use extractive summarizer for fast responses on free tiers.

pytesseract errors / OCR not working

Ensure system tesseract binary is installed and available on PATH. On Render or other providers, you may need a Docker image that installs apt packages.

11 — Switching summarizers

app/summarizer.py contains the summarization logic. There are two modes:

Extractive: Fast, no heavy dependencies. Good for free hosting.

Abstractive (Transformers): Higher quality but heavy (requires transformers, torch).

To switch: replace summarizer.py with the desired implementation in backend/app/ and restart backend.

12 — Files you may want to edit

backend/app/main.py — CORS origins & endpoint behavior

backend/app/summarizer.py — summarization strategy

frontend/src/components/UploadArea.jsx — API endpoint constant (ENDPOINT)

frontend/src/index.css — UI styling

backend/requirements.txt — dependencies for deployment

13 — Helpful notes from development

If you host frontend on Vercel and backend on Render, make sure Vercel’s VITE_API_URL matches your Render URL and that the backend allows that origin via CORS.

For production-grade backends using Transformers, prefer a larger machine (GPU or CPU with high RAM) or use an inference API.

The repo intentionally provides an extractive fallback summarizer that works well on free tiers.

14 — Credits & License

Built with React, FastAPI, Transformers (optional), Tesseract OCR, PDF parsing libraries.

License: (Please add your preferred license file. For example MIT).

Final checklist before running

Clone repo

Set up backend venv & install requirements

Install system dependencies (Tesseract/poppler) if using OCR

Run backend: python -m uvicorn app.main:app --reload --port 8000

Set frontend API env if needed or rely on local default

Run frontend: npm install && npm run dev

Open http://localhost:5173 (Vite default)
