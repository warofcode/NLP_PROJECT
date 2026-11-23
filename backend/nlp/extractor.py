"""
Domain-Specific Legal Document & Contract Clause Classifier
Document text extractor (PDF, DOCX, TXT) and legal clause segmentation engine.
"""

import re
import io
from typing import List, Dict, Any

from .preprocessor import clean_legal_text

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts clean text from PDF bytes using PyMuPDF or pypdf fallback."""
    text_parts = []
    
    try:
        import pymupdf as fitz
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text_parts.append(page.get_text())
        doc.close()
        return "\n\n".join(text_parts)
    except Exception:
        pass
            
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            t = page.extract_text()
            if t:
                text_parts.append(t)
        return "\n\n".join(text_parts)
    except Exception as e:
        raise RuntimeError(f"Failed to extract PDF text: {e}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extracts text from DOCX bytes using python-docx."""
    try:
        import docx
    except ImportError:
        raise RuntimeError("python-docx is not installed.")
    
    doc = docx.Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    
    # Also extract any text inside tables
    for table in doc.tables:
        for row in table.rows:
            row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_text:
                paragraphs.append(" | ".join(row_text))
                
    return "\n\n".join(paragraphs)

def extract_document_text(file_bytes: bytes, filename: str) -> str:
    """Detects format from filename and extracts raw text."""
    lower_name = filename.lower()
    if lower_name.endswith(".pdf"):
        raw = extract_text_from_pdf(file_bytes)
    elif lower_name.endswith(".docx"):
        raw = extract_text_from_docx(file_bytes)
    else:
        # Default to UTF-8 text
        try:
            raw = file_bytes.decode("utf-8")
        except UnicodeDecodeError:
            raw = file_bytes.decode("latin-1", errors="ignore")
            
    return clean_legal_text(raw)

def segment_into_clauses(full_text: str) -> List[Dict[str, Any]]:
    """
    Intelligently splits full legal document text into individual clauses/sections.
    Preserves section headers, numbering, and paragraph structure.
    """
    clean_text = clean_legal_text(full_text)
    if not clean_text:
        return []
    
    # Heuristic regex patterns that denote section / clause beginnings
    clause_break_pattern = re.compile(
        r"(?m)^(?="
        r"(?:(?:ARTICLE|SECTION|CLAUSE)\s+[0-9IVXLCDM]+(?:\.[0-9]+)*[:.-]?\s*)"
        r"|(?:\d{1,2}\.\d{1,2}(?:\.\d{1,2})*\s+)"
        r"|(?:\b[0-9]{1,2}\.\s+[A-Z])"
        r"|(?:\([a-z0-9]{1,2}\)\s+[A-Z])"
        r"|(?:\b(?:NOW, THEREFORE|IN WITNESS WHEREOF|WHEREAS|RECITALS|DEFINITIONS|CONFIDENTIALITY|TERMINATION|INDEMNIFICATION|GOVERNING LAW|LIABILITY|PAYMENT|WARRANTIES|MISCELLANEOUS)\b[:.-]?)"
        r")",
        re.IGNORECASE
    )
    
    # Split text into major chunks
    raw_chunks = clause_break_pattern.split(clean_text)
    
    clauses = []
    current_index = 1
    
    for chunk in raw_chunks:
        chunk = chunk.strip()
        if not chunk:
            continue
            
        # If a single chunk contains multiple paragraphs that are long, also check for paragraph boundaries
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", chunk) if p.strip()]
        
        for p in paragraphs:
            # Filter out extreme noise like lone page numbers or tiny fragments (< 25 chars)
            if len(p) < 25 and not any(p.lower().startswith(x) for x in ["article", "section", "recitals"]):
                continue
                
            # Extract title/header if present on first line
            lines = p.split("\n")
            first_line = lines[0].strip()
            header = None
            content = p
            
            header_match = re.match(r"^((?:ARTICLE|SECTION|CLAUSE)?\s*[0-9IVXLCDM\.]*[:.-]?\s*[A-Za-z\s,/&\-]{3,40}?)[:.-]?$", first_line, re.IGNORECASE)
            if header_match and len(lines) > 1:
                header = first_line
                content = "\n".join(lines[1:]).strip()
                if not content:
                    content = p
            else:
                # If the first few words look like a title e.g. "1. Confidentiality. The parties agree..."
                inline_match = re.match(r"^((?:[0-9IVXLCDM]+[\.\)]\s*)?[A-Z\s]{4,30}[:.-])\s+(.*)", p, re.DOTALL)
                if inline_match:
                    header = inline_match.group(1).strip()
            
            clauses.append({
                "clause_id": f"clause_{current_index}",
                "index": current_index,
                "header": header or f"Clause {current_index}",
                "text": content,
                "char_length": len(content),
                "word_count": len(content.split()),
            })
            current_index += 1
            
    # Fallback: If heuristic regex failed to extract meaningful segments, split by double newlines
    if len(clauses) <= 1 and "\n\n" in clean_text:
        clauses = []
        parts = [p.strip() for p in clean_text.split("\n\n") if len(p.strip()) >= 25]
        for idx, part in enumerate(parts, start=1):
            clauses.append({
                "clause_id": f"clause_{idx}",
                "index": idx,
                "header": f"Clause {idx}",
                "text": part,
                "char_length": len(part),
                "word_count": len(part.split()),
            })
            
    # Ultimate fallback if entire text is a single paragraph
    if not clauses and clean_text:
        clauses.append({
            "clause_id": "clause_1",
            "index": 1,
            "header": "Section 1",
            "text": clean_text,
            "char_length": len(clean_text),
            "word_count": len(clean_text.split()),
        })
        
    return clauses
