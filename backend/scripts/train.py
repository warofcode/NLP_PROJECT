"""
Domain-Specific Legal Document & Contract Clause Classifier
Training script for Model A (TF-IDF + Logistic Regression Baseline).
Saves trained pipeline to backend/data/baseline_model.joblib.
"""

import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from nlp.categories import CLAUSE_CATEGORIES, DOCUMENT_TYPES
from nlp.dataset import CLAUSE_TRAINING_DATA, DOC_TRAINING_DATA
from nlp.baseline_model import BaselineLegalClassifier

def main():
    print("=" * 60)
    print("Starting Training: Model A (Classical ML Baseline)")
    print("=" * 60)
    
    model = BaselineLegalClassifier()
    
    print(f"[*] Training on {len(CLAUSE_TRAINING_DATA)} legal clauses across {len(CLAUSE_CATEGORIES)} categories...")
    print(f"[*] Training on {len(DOC_TRAINING_DATA)} document types across {len(DOCUMENT_TYPES)} categories...")
    
    model.train(CLAUSE_TRAINING_DATA, DOC_TRAINING_DATA)
    
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    os.makedirs(data_dir, exist_ok=True)
    joblib_path = os.path.join(data_dir, "baseline_model.joblib")
    
    model.save(joblib_path)
    print(f"[+] Model successfully serialized to: {joblib_path}")
    
    # Sanity inference check
    test_clause = "Either party may terminate this Agreement immediately upon written notice if the other party breaches any term."
    pred = model.predict_clause(test_clause)
    print("[*] Sanity Check Prediction:")
    print(f"    Text: {test_clause[:60]}...")
    print(f"    Predicted: {pred['predicted_category']} (Confidence: {pred['confidence']}%, Risk: {pred['risk_level']})")
    print(f"    Inference Latency: {pred['latency_ms']} ms")
    print("=" * 60)
    print("Training Complete!")

if __name__ == "__main__":
    main()
