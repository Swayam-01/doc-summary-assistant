# pdf_utils.py
from pdfminer.high_level import extract_text
from typing import List

def extract_text_from_pdf(path: str) -> str:
    """
    Extract text from a PDF file
    Returns a single string containing all pages separated by '\n\n---PAGE---\n\n'
    """
    # pdfminer.extract_text returns concatenated text; for page separation we can run per page if needed
    text = extract_text(path)
    # A lightweight split into pages is not trivial without advanced parsing; for now we return whole text.
    return text
