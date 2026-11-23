"""
Domain-Specific Legal Document & Contract Clause Classifier
FastAPI Backend Application Entrypoint.
"""

import os
import sys
import time
import json
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from nlp.categories import (
    CLAUSE_CATEGORIES,
    DOCUMENT_TYPES,
    RISK_LEVELS,
    CATEGORY_DESCRIPTIONS,
    get_risk_level,
)
from nlp.extractor import extract_document_text, segment_into_clauses
from nlp.dataset import CLAUSE_TRAINING_DATA, DOC_TRAINING_DATA
from nlp.baseline_model import BaselineLegalClassifier
from nlp.legal_bert import LegalBertClassifier

DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "data"))
SAMPLE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "sample_docs"))
JOBLIB_PATH = os.path.join(DATA_DIR, "baseline_model.joblib")
METRICS_PATH = os.path.join(DATA_DIR, "metrics.json")

# Global models
model_a = BaselineLegalClassifier()
model_b = LegalBertClassifier()

# Immediate eager load if joblib exists
if os.path.exists(JOBLIB_PATH):
    model_a.load(JOBLIB_PATH)
else:
    model_a.train(CLAUSE_TRAINING_DATA, DOC_TRAINING_DATA)
    model_a.save(JOBLIB_PATH)
model_b.initialize()

app = FastAPI(
    title="Domain-Specific Legal Document & Contract Clause Classifier API",
    description="Dual-model NLP system comparing Classical ML Baseline (TF-IDF + SVM) vs. Legal-BERT for legal clause analysis and bulk sorting.",
    version="1.0.0",
)

# Enable CORS for React Frontend (Vite default port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request / Response Schemas
class ClauseAnalysisRequest(BaseModel):
    text: str
    model_type: Optional[str] = "legal_bert"  # "baseline" or "legal_bert"

@app.get("/api/health")
def health_check():
    """Returns service health, active models, and runtime device."""
    return {
        "status": "healthy",
        "models": {
            "model_a": {
                "name": "TF-IDF + Logistic Regression",
                "is_trained": model_a.is_trained,
                "type": "Classical ML Baseline",
            },
            "model_b": {
                "name": "Legal-BERT (nlpaueb/legal-bert-base-uncased)",
                "is_loaded": model_b.is_loaded,
                "device": model_b.device,
                "fallback_mode": model_b.fallback_mode,
            }
        },
        "available_clause_categories": CLAUSE_CATEGORIES,
        "available_document_types": DOCUMENT_TYPES,
    }

@app.get("/api/samples")
def get_sample_contracts():
    """Returns built-in sample legal contracts for instant viva testing."""
    samples = []
    
    sample_files = [
        ("sample_nda.txt", "Mutual Non-Disclosure Agreement (NDA)", "Non-Disclosure Agreement (NDA)"),
        ("sample_freelance_agreement.txt", "Independent Contractor Services Agreement", "Service / Vendor Agreement"),
        ("sample_commercial_lease.txt", "Commercial Real Estate Lease Agreement", "Commercial Lease Agreement"),
    ]
    
    for filename, title, doc_type in sample_files:
        filepath = os.path.join(SAMPLE_DIR, filename)
        if os.path.exists(filepath):
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            samples.append({
                "id": filename.replace(".txt", ""),
                "filename": filename,
                "title": title,
                "document_type": doc_type,
                "content": content,
            })
            
    return samples

@app.post("/api/analyze/clause")
def analyze_single_clause(req: ClauseAnalysisRequest):
    """Classifies a single legal clause snippet."""
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Clause text cannot be empty.")
        
    model_choice = (req.model_type or "legal_bert").lower()
    if "baseline" in model_choice or "svm" in model_choice or "tfidf" in model_choice:
        result = model_a.predict_clause(text)
    else:
        result = model_b.predict_clause(text)
        
    return result

def process_document_analysis(
    document_text: str,
    filename: str = "Pasted Contract.txt",
    model_type: str = "legal_bert",
) -> Dict[str, Any]:
    """Core synchronous processing engine for document clause analysis."""
    start_total_time = time.perf_counter()
    if not document_text or not document_text.strip():
        raise HTTPException(status_code=400, detail="Document text could not be extracted or is empty.")

    clauses = segment_into_clauses(document_text)
    if not clauses:
        raise HTTPException(status_code=400, detail="Could not detect clauses in the provided document.")

    model_choice = (model_type or "legal_bert").lower()
    use_baseline = ("baseline" in model_choice or "svm" in model_choice or "tfidf" in model_choice)

    classified_clauses = []
    risk_summary = {"High": 0, "Medium": 0, "Low": 0}
    category_counts = {}

    for c in clauses:
        c_text = c["text"]
        if use_baseline:
            pred = model_a.predict_clause(c_text)
        else:
            pred = model_b.predict_clause(c_text)

        risk = pred["risk_level"]
        risk_summary[risk] = risk_summary.get(risk, 0) + 1
        cat = pred["predicted_category"]
        category_counts[cat] = category_counts.get(cat, 0) + 1

        classified_clauses.append({
            "clause_id": c["clause_id"],
            "index": c["index"],
            "header": c["header"],
            "text": c_text,
            "char_length": c["char_length"],
            "word_count": c["word_count"],
            "predicted_category": cat,
            "confidence": pred["confidence"],
            "risk_level": risk,
            "description": pred["description"],
            "top_3": pred["top_3"],
            "latency_ms": pred["latency_ms"],
        })

    # Predict overall document type
    if use_baseline:
        doc_pred = model_a.predict_document(document_text)
    else:
        doc_pred = model_b.predict_document(document_text)

    total_latency_ms = round((time.perf_counter() - start_total_time) * 1000, 2)

    return {
        "filename": filename,
        "model_used": "Model A: TF-IDF + Logistic Regression" if use_baseline else "Model B: Legal-BERT Transformer",
        "total_clauses": len(classified_clauses),
        "document_type": doc_pred["document_type"],
        "document_type_confidence": doc_pred["confidence"],
        "high_risk_count": risk_summary["High"],
        "medium_risk_count": risk_summary["Medium"],
        "low_risk_count": risk_summary["Low"],
        "risk_breakdown": risk_summary,
        "category_distribution": category_counts,
        "processing_time_ms": total_latency_ms,
        "clauses": classified_clauses,
    }

@app.post("/api/analyze/document")
async def analyze_full_document(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
    model_type: Optional[str] = Form("legal_bert"),
):
    """
    Ingests a legal document (PDF, DOCX, or text), segments into clauses,
    and returns comprehensive clause classifications with risk scoring.
    """
    document_text = ""
    filename = "Pasted Contract.txt"

    if file is not None and file.filename:
        filename = file.filename
        content_bytes = await file.read()
        try:
            document_text = extract_document_text(content_bytes, filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to extract document text: {e}")
    elif text:
        document_text = text.strip()
    else:
        raise HTTPException(status_code=400, detail="Must provide either a file upload or text content.")

    return process_document_analysis(document_text, filename, model_type)

@app.post("/api/bulk/sort")
async def bulk_sort_documents(
    files: List[UploadFile] = File(...),
    model_type: Optional[str] = Form("legal_bert"),
):
    """
    Due Diligence Bulk Sorter:
    Accepts 5-50 files, classifies each document type, assesses overall risk,
    and returns a clean structured list for sorting and CSV export.
    """
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")
        
    model_choice = (model_type or "legal_bert").lower()
    use_baseline = ("baseline" in model_choice or "svm" in model_choice or "tfidf" in model_choice)
    
    results = []
    
    for file in files:
        start_t = time.perf_counter()
        try:
            content_bytes = await file.read()
            text = extract_document_text(content_bytes, file.filename)
            
            if not text.strip():
                results.append({
                    "filename": file.filename,
                    "document_type": "Unknown",
                    "confidence": 0.0,
                    "risk_level": "Low",
                    "high_risk_clauses": 0,
                    "total_clauses": 0,
                    "status": "Extraction Error: Empty Text",
                    "latency_ms": 0.0,
                })
                continue
                
            # Document classification
            if use_baseline:
                doc_pred = model_a.predict_document(text)
            else:
                doc_pred = model_b.predict_document(text)
                
            # Quick clause scan for high-risk count
            clauses = segment_into_clauses(text)
            high_risk_count = 0
            for c in clauses:
                if use_baseline:
                    cp = model_a.predict_clause(c["text"])
                else:
                    cp = model_b.predict_clause(c["text"])
                if cp["risk_level"] == "High":
                    high_risk_count += 1
                    
            elapsed_ms = round((time.perf_counter() - start_t) * 1000, 2)
            
            overall_risk = "High" if high_risk_count >= 2 else ("Medium" if high_risk_count == 1 else "Low")
            
            results.append({
                "filename": file.filename,
                "document_type": doc_pred["document_type"],
                "confidence": doc_pred["confidence"],
                "risk_level": overall_risk,
                "high_risk_clauses": high_risk_count,
                "total_clauses": len(clauses),
                "status": "Analyzed",
                "top_3": doc_pred["top_3"],
                "latency_ms": elapsed_ms,
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "document_type": "Unknown",
                "confidence": 0.0,
                "risk_level": "Low",
                "high_risk_clauses": 0,
                "total_clauses": 0,
                "status": f"Error: {str(e)}",
                "latency_ms": 0.0,
            })
            
    return {
        "total_files": len(files),
        "model_used": "Model A: TF-IDF + Logistic Regression" if use_baseline else "Model B: Legal-BERT Transformer",
        "documents": results,
    }

@app.get("/api/metrics")
def get_model_metrics():
    """
    Returns comparative evaluation metrics (Accuracy, Macro F1, Confusion Matrix, Latency)
    for Model A vs. Model B.
    """
    if os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
            
    from scripts.evaluate import run_evaluation
    return run_evaluation()
