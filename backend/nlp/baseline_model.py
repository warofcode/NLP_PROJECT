"""
Domain-Specific Legal Document & Contract Clause Classifier
Model A: Classical ML Baseline (TF-IDF + Calibrated Linear Classifier).
"""

import os
import time
from typing import Dict, List, Any, Optional, Tuple
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
from sklearn.pipeline import Pipeline

from .categories import (
    CLAUSE_CATEGORIES,
    DOCUMENT_TYPES,
    get_risk_level,
    CATEGORY_DESCRIPTIONS,
)
from .preprocessor import preprocess_for_vectorizer

class BaselineLegalClassifier:
    """
    Classical Machine Learning Baseline using TF-IDF + Logistic Regression / Calibrated SVM.
    Lightweight, deterministic, and executes in ~1-5ms per clause.
    """
    
    def __init__(self):
        # Clause Pipeline
        self.clause_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=4000,
                sublinear_tf=True,
                token_pattern=r"(?u)\b\w+\b",
                preprocessor=preprocess_for_vectorizer,
            )),
            ("clf", LogisticRegression(
                C=1.5,
                max_iter=1000,
                class_weight="balanced",
                random_state=42,
            )),
        ])
        
        # Document Pipeline for Bulk Sorting
        self.doc_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=2500,
                sublinear_tf=True,
                preprocessor=preprocess_for_vectorizer,
            )),
            ("clf", LogisticRegression(
                C=1.0,
                max_iter=1000,
                class_weight="balanced",
                random_state=42,
            )),
        ])
        
        self.is_trained = False
        
    def train(
        self,
        clause_data: List[Tuple[str, str]],
        doc_data: List[Tuple[str, str]],
    ):
        """Trains both clause and document classifiers."""
        X_clause, y_clause = zip(*clause_data)
        self.clause_pipeline.fit(X_clause, y_clause)
        
        X_doc, y_doc = zip(*doc_data)
        self.doc_pipeline.fit(X_doc, y_doc)
        
        self.is_trained = True

    def save(self, filepath: str):
        """Serializes trained pipelines to a single joblib file."""
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        joblib.dump({
            "clause_pipeline": self.clause_pipeline,
            "doc_pipeline": self.doc_pipeline,
            "is_trained": self.is_trained,
        }, filepath)

    def load(self, filepath: str) -> bool:
        """Loads serialized model if it exists."""
        if not os.path.exists(filepath):
            return False
        data = joblib.load(filepath)
        self.clause_pipeline = data["clause_pipeline"]
        self.doc_pipeline = data["doc_pipeline"]
        self.is_trained = data.get("is_trained", True)
        return True

    def predict_clause(self, text: str) -> Dict[str, Any]:
        """
        Classifies a single clause.
        Returns predicted category, calibrated confidence, risk score, and top-3 probabilities.
        """
        if not self.is_trained:
            raise RuntimeError("Baseline model has not been trained or loaded yet.")
            
        start_time = time.perf_counter()
        
        probs = self.clause_pipeline.predict_proba([text])[0]
        classes = self.clause_pipeline.classes_
        
        # Top-3 predictions
        top_indices = np.argsort(probs)[::-1][:3]
        top_3 = []
        for idx in top_indices:
            top_3.append({
                "category": classes[idx],
                "probability": round(float(probs[idx]) * 100, 2),
            })
            
        best_cat = top_3[0]["category"]
        best_conf = top_3[0]["probability"]
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        
        risk = get_risk_level(best_cat, text)
        
        return {
            "model": "TF-IDF + Logistic Regression (Model A)",
            "predicted_category": best_cat,
            "confidence": best_conf,
            "risk_level": risk,
            "description": CATEGORY_DESCRIPTIONS.get(best_cat, ""),
            "top_3": top_3,
            "latency_ms": max(latency_ms, 0.5),
        }

    def predict_document(self, text: str) -> Dict[str, Any]:
        """
        Classifies whole document for bulk sorting.
        """
        if not self.is_trained:
            raise RuntimeError("Baseline model has not been trained or loaded yet.")
            
        start_time = time.perf_counter()
        
        probs = self.doc_pipeline.predict_proba([text])[0]
        classes = self.doc_pipeline.classes_
        
        top_indices = np.argsort(probs)[::-1][:3]
        top_3 = []
        for idx in top_indices:
            top_3.append({
                "category": classes[idx],
                "probability": round(float(probs[idx]) * 100, 2),
            })
            
        best_doc = top_3[0]["category"]
        best_conf = top_3[0]["probability"]
        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        
        return {
            "model": "TF-IDF + Logistic Regression (Model A)",
            "document_type": best_doc,
            "confidence": best_conf,
            "top_3": top_3,
            "latency_ms": max(latency_ms, 0.5),
        }
