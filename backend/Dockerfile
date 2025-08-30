# # A small Dockerfile (for production, customize)
# FROM python:3.11-slim

# RUN apt-get update && apt-get install -y tesseract-ocr libjpeg-dev zlib1g-dev build-essential && rm -rf /var/lib/apt/lists/*

# WORKDIR /app
# COPY ./app /app/app
# COPY requirements.txt /app/requirements.txt

# RUN pip install --upgrade pip
# # Install CPU torch wheel (this might require modification for other platforms)
# RUN pip install torch --index-url https://download.pytorch.org/whl/cpu
# RUN pip install -r /app/requirements.txt

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]


# Backend Dockerfile

# Use lightweight Python image
FROM python:3.11-slim

# Set environment vars
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working dir
WORKDIR /app

# Install system dependencies (for PyPDF2, OCR, etc.)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Install pipenv/venv deps
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY . /app/

# Expose port
EXPOSE 8000

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

