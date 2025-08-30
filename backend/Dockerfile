# A small Dockerfile (for production, customize)
FROM python:3.11-slim

RUN apt-get update && apt-get install -y tesseract-ocr libjpeg-dev zlib1g-dev build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY ./app /app/app
COPY requirements.txt /app/requirements.txt

RUN pip install --upgrade pip
# Install CPU torch wheel (this might require modification for other platforms)
RUN pip install torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install -r /app/requirements.txt

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
