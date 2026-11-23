"""
Domain-Specific Legal Document & Contract Clause Classifier
Text preprocessor and cleaner for legal documents.
"""

import re
from typing import List

SMART_QUOTES = {
    "\u2018": "'",
    "\u2019": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2014": "--",
    "\u2013": "-",
    "\u2026": "...",
    "\u00a0": " ",
}

def clean_legal_text(text: str) -> str:
    """
    Cleans raw legal document text by standardizing unicode quotes,
    collapsing erratic whitespace, and removing control characters.
    """
    if not text:
        return ""
    
    # Replace unicode quotes and non-breaking spaces
    for orig, repl in SMART_QUOTES.items():
        text = text.replace(orig, repl)
    
    # Remove control characters (except standard newlines and tabs)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    
    # Normalize multiple blank lines to a double newline
    text = re.sub(r"\r\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    
    # Strip leading/trailing whitespaces per line
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.split("\n")]
    return "\n".join(lines).strip()

def preprocess_for_vectorizer(text: str) -> str:
    """
    Lightweight cleaning for TF-IDF / linear models.
    Removes clause numbers, section indicators (e.g., 'Section 1.2:'),
    and converts to lowercase while keeping key legal vocabulary intact.
    """
    cleaned = clean_legal_text(text).lower()
    
    # Remove leading numbering like "1.", "1.1", "clause 3:", "(a)", "iv."
    cleaned = re.sub(r"^\s*(\d+(\.\d+)*|[a-z]\.|\([a-z0-9]+\)|section\s+\d+(\.\d+)*[:.-]?|article\s+[ivxlcdm]+[:.-]?)\s*", "", cleaned, flags=re.IGNORECASE)
    
    # Strip excess punctuation while leaving legal words
    cleaned = re.sub(r"[^a-z0-9\s\-_/]", " ", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned
