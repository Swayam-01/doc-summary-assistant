# ocr_utils.py
from PIL import Image
import pytesseract
from typing import List

def extract_text_from_image(path: str) -> str:
    """
    Uses pytesseract to extract text from an image file.
    Returns plain text.
    """
    img = Image.open(path)
    # Convert to RGB if needed
    if img.mode != "RGB":
        img = img.convert("RGB")
    text = pytesseract.image_to_string(img)
    return text
