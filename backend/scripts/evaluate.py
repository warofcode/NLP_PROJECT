"""
Domain-Specific Legal Document & Contract Clause Classifier
Standalone Model Evaluation & Benchmark Script.
Computes Accuracy, Macro F1-Score, Per-Class Metrics, Confusion Matrices,
and Latency comparisons between Model A (Baseline) and Model B (Legal-BERT).
Saves output to backend/data/metrics.json for the /api/metrics endpoint.
"""

import os
import sys
import json
import time
from typing import Dict, List, Any
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    confusion_matrix,
    classification_report,
)

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from nlp.categories import CLAUSE_CATEGORIES
from nlp.dataset import CLAUSE_EVALUATION_DATA, CLAUSE_TRAINING_DATA, DOC_TRAINING_DATA
from nlp.baseline_model import BaselineLegalClassifier
from nlp.legal_bert import LegalBertClassifier

def run_evaluation() -> Dict[str, Any]:
    print("=" * 70)
    print("RUNNING BENCHMARK EVALUATION: Model A (Baseline) vs. Model B (Legal-BERT)")
    print("=" * 70)
    
    # 1. Initialize & Load Model A
    model_a = BaselineLegalClassifier()
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
    joblib_path = os.path.join(data_dir, "baseline_model.joblib")
    
    if not model_a.load(joblib_path):
        print("[*] Training Baseline Model A first...")
        model_a.train(CLAUSE_TRAINING_DATA, DOC_TRAINING_DATA)
        model_a.save(joblib_path)
        
    # 2. Initialize Model B
    model_b = LegalBertClassifier()
    model_b.initialize()
    
    # 3. Prepare Test Split
    test_texts, true_labels = zip(*CLAUSE_EVALUATION_DATA)
    
    # 4. Evaluate Model A
    print("\n[*] Evaluating Model A (TF-IDF + Linear Classifier)...")
    preds_a = []
    latencies_a = []
    for text in test_texts:
        res = model_a.predict_clause(text)
        preds_a.append(res["predicted_category"])
        latencies_a.append(res["latency_ms"])
        
    acc_a = round(float(accuracy_score(true_labels, preds_a)) * 100, 2)
    p_a, r_a, f1_a, _ = precision_recall_fscore_support(true_labels, preds_a, average="macro", zero_division=0)
    cm_a = confusion_matrix(true_labels, preds_a, labels=CLAUSE_CATEGORIES).tolist()
    
    per_class_p_a, per_class_r_a, per_class_f1_a, support_a = precision_recall_fscore_support(
        true_labels, preds_a, labels=CLAUSE_CATEGORIES, zero_division=0
    )
    
    # 5. Evaluate Model B
    print("[*] Evaluating Model B (Legal-BERT / Domain Transformer)...")
    preds_b = []
    latencies_b = []
    for text in test_texts:
        res = model_b.predict_clause(text)
        preds_b.append(res["predicted_category"])
        latencies_b.append(res["latency_ms"])
        
    acc_b = round(float(accuracy_score(true_labels, preds_b)) * 100, 2)
    p_b, r_b, f1_b, _ = precision_recall_fscore_support(true_labels, preds_b, average="macro", zero_division=0)
    cm_b = confusion_matrix(true_labels, preds_b, labels=CLAUSE_CATEGORIES).tolist()
    
    per_class_p_b, per_class_r_b, per_class_f1_b, support_b = precision_recall_fscore_support(
        true_labels, preds_b, labels=CLAUSE_CATEGORIES, zero_division=0
    )
    
    # Structure per-category breakdown
    categories_breakdown = []
    for i, cat in enumerate(CLAUSE_CATEGORIES):
        categories_breakdown.append({
            "category": cat,
            "model_a_f1": round(float(per_class_f1_a[i]) * 100, 1),
            "model_b_f1": round(float(per_class_f1_b[i]) * 100, 1),
            "support": int(support_a[i]),
        })
        
    results = {
        "evaluation_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "test_sample_size": len(test_texts),
        "categories": CLAUSE_CATEGORIES,
        "model_a": {
            "name": "Model A: TF-IDF + Logistic Regression",
            "type": "Classical ML Baseline",
            "accuracy": acc_a,
            "macro_precision": round(float(p_a) * 100, 2),
            "macro_recall": round(float(r_a) * 100, 2),
            "macro_f1": round(float(f1_a) * 100, 2),
            "avg_latency_ms": round(float(np.mean(latencies_a)), 2),
            "confusion_matrix": cm_a,
        },
        "model_b": {
            "name": "Model B: Legal-BERT (Domain Transformer)",
            "type": "Transformer (nlpaueb/legal-bert-base-uncased)",
            "accuracy": acc_b,
            "macro_precision": round(float(p_b) * 100, 2),
            "macro_recall": round(float(r_b) * 100, 2),
            "macro_f1": round(float(f1_b) * 100, 2),
            "avg_latency_ms": round(float(np.mean(latencies_b)), 2),
            "confusion_matrix": cm_b,
        },
        "per_category_comparison": categories_breakdown,
        "summary": {
            "f1_delta": round(float(f1_b - f1_a) * 100, 2),
            "accuracy_delta": round(float(acc_b - acc_a), 2),
            "latency_tradeoff": f"{round(float(np.mean(latencies_b)) / max(float(np.mean(latencies_a)), 0.1), 1)}x slower inference for transformer contextual accuracy",
        }
    }
    
    # Save to metrics.json
    metrics_path = os.path.join(data_dir, "metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
        
    print(f"\n[+] Metrics successfully written to: {metrics_path}")
    print("\n" + "=" * 70)
    print(f"{'METRIC':<25} | {'MODEL A (Baseline)':<20} | {'MODEL B (Legal-BERT)':<20}")
    print("-" * 70)
    print(f"{'Accuracy':<25} | {results['model_a']['accuracy']}%{'':<15} | {results['model_b']['accuracy']}%")
    print(f"{'Macro F1-Score':<25} | {results['model_a']['macro_f1']}%{'':<15} | {results['model_b']['macro_f1']}%")
    print(f"{'Avg Latency':<25} | {results['model_a']['avg_latency_ms']} ms{'':<13} | {results['model_b']['avg_latency_ms']} ms")
    print("=" * 70)
    
    return results

if __name__ == "__main__":
    run_evaluation()
