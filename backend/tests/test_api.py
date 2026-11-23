"""
Domain-Specific Legal Document & Contract Clause Classifier
Comprehensive Unit & Integration Test Suite.
"""

import os
import sys
import pytest
import asyncio

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import (
    app,
    health_check,
    get_sample_contracts,
    analyze_single_clause,
    analyze_full_document,
    process_document_analysis,
    get_model_metrics,
    ClauseAnalysisRequest,
    model_a,
    model_b,
)
from nlp.extractor import segment_into_clauses
from nlp.preprocessor import clean_legal_text, preprocess_for_vectorizer
from nlp.categories import CLAUSE_CATEGORIES, DOCUMENT_TYPES, get_risk_level

def test_text_preprocessor():
    raw = "  \u201cSection 1.1: Confidentiality Obligations\u201d\n\n\n\nAll non-public data...  "
    cleaned = clean_legal_text(raw)
    assert '"Section 1.1: Confidentiality Obligations"' in cleaned
    assert "\n\n\n" not in cleaned
    
    vec_ready = preprocess_for_vectorizer(cleaned)
    assert "confidentiality obligations" in vec_ready
    assert "all non-public data" in vec_ready

def test_clause_segmentation():
    sample_text = """
    1. CONFIDENTIALITY
    Recipient shall hold all proprietary information in strict confidence and shall not disclose without written permission.

    2. TERMINATION
    Either party may terminate this agreement upon thirty days written notice if the other party breaches.

    3. GOVERNING LAW
    This contract shall be governed by the laws of the State of Delaware.
    """
    clauses = segment_into_clauses(sample_text)
    assert len(clauses) >= 3
    headers = [c["header"].upper() for c in clauses]
    assert any("CONFIDENTIALITY" in h for h in headers)
    assert any("TERMINATION" in h for h in headers)
    assert any("GOVERNING LAW" in h for h in headers)

def test_risk_level_assignment():
    assert get_risk_level("Termination") == "High"
    assert get_risk_level("Indemnification") == "High"
    assert get_risk_level("Confidentiality") == "Medium"
    assert get_risk_level("Governing Law") == "Low"
    # Dynamic trigger elevation
    elevated = get_risk_level("Governing Law", "party accepts unlimited liability and waives all rights")
    assert elevated == "High"

def test_baseline_model_inference():
    text = "Recipient shall keep all business trade secrets strictly confidential for a period of five years."
    res = model_a.predict_clause(text)
    assert res["predicted_category"] == "Confidentiality"
    assert res["confidence"] > 0
    assert len(res["top_3"]) == 3
    assert res["risk_level"] in ["Low", "Medium", "High"]

def test_legal_bert_inference():
    text = "Either party may terminate this Agreement immediately upon written notice if the other party breaches."
    res = model_b.predict_clause(text)
    assert res["predicted_category"] == "Termination"
    assert res["confidence"] > 0
    assert len(res["top_3"]) == 3
    assert res["risk_level"] == "High"

def test_api_health_endpoint():
    data = health_check()
    assert data["status"] == "healthy"
    assert "models" in data
    assert data["models"]["model_a"]["is_trained"] is True
    assert data["models"]["model_b"]["is_loaded"] is True
    assert len(data["available_clause_categories"]) == 10
    assert len(data["available_document_types"]) == 5

def test_api_samples_endpoint():
    samples = get_sample_contracts()
    assert isinstance(samples, list)
    assert len(samples) >= 3
    sample_ids = [s["id"] for s in samples]
    assert "sample_nda" in sample_ids
    assert "sample_freelance_agreement" in sample_ids
    assert "sample_commercial_lease" in sample_ids

def test_api_analyze_clause_endpoint():
    req = ClauseAnalysisRequest(
        text="Contractor agrees to indemnify and hold harmless Client against any third-party claims.",
        model_type="baseline"
    )
    res = analyze_single_clause(req)
    assert res["predicted_category"] == "Indemnification"
    assert res["risk_level"] == "High"
    assert len(res["top_3"]) == 3

def test_api_analyze_document_endpoint():
    doc_text = """
    1. CONFIDENTIALITY
    The receiving party shall not disclose any proprietary code or business secrets to any unauthorized third party.

    2. INDEMNIFICATION
    Contractor agrees to indemnify, defend, and hold harmless Client from any damages resulting from patent infringement.

    3. LIMITATION OF LIABILITY
    In no event shall either party be liable for any lost profits or consequential damages.
    """
    res = process_document_analysis(doc_text, "test_doc.txt", "baseline")
    assert res["total_clauses"] >= 3
    assert res["high_risk_count"] >= 1
    assert "clauses" in res
    assert len(res["clauses"]) >= 3
    assert res["processing_time_ms"] > 0

def test_api_metrics_endpoint():
    data = get_model_metrics()
    assert "model_a" in data
    assert "model_b" in data
    assert "per_category_comparison" in data
    assert data["model_a"]["accuracy"] > 50
    assert data["model_b"]["accuracy"] > 50
    assert len(data["per_category_comparison"]) == 10
