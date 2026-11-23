export type ModelType = 'legal_bert' | 'baseline';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Top3Prediction {
  category: string;
  probability: number;
}

export interface Clause {
  clause_id: string;
  index: number;
  header: string;
  text: string;
  char_length: number;
  word_count: number;
  predicted_category: string;
  confidence: number;
  risk_level: RiskLevel;
  description: string;
  top_3: Top3Prediction[];
  latency_ms: number;
}

export interface DocumentAnalysisResult {
  filename: string;
  model_used: string;
  total_clauses: number;
  document_type: string;
  document_type_confidence: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  risk_breakdown: {
    High: number;
    Medium: number;
    Low: number;
  };
  category_distribution: Record<string, number>;
  processing_time_ms: number;
  clauses: Clause[];
}

export interface BulkDocumentItem {
  filename: string;
  document_type: string;
  confidence: number;
  risk_level: RiskLevel;
  high_risk_clauses: number;
  total_clauses: number;
  status: string;
  top_3?: Top3Prediction[];
  latency_ms: number;
}

export interface BulkSortResult {
  total_files: number;
  model_used: string;
  documents: BulkDocumentItem[];
}

export interface ModelMetricDetails {
  name: string;
  type: string;
  accuracy: number;
  macro_precision: number;
  macro_recall: number;
  macro_f1: number;
  avg_latency_ms: number;
  confusion_matrix: number[][];
}

export interface PerCategoryComparison {
  category: string;
  model_a_f1: number;
  model_b_f1: number;
  support: number;
}

export interface MetricsResult {
  evaluation_timestamp: string;
  test_sample_size: number;
  categories: string[];
  model_a: ModelMetricDetails;
  model_b: ModelMetricDetails;
  per_category_comparison: PerCategoryComparison[];
  summary: {
    f1_delta: number;
    accuracy_delta: number;
    latency_tradeoff: string;
  };
}

export interface SampleContract {
  id: string;
  filename: string;
  title: string;
  document_type: string;
  content: string;
}

export interface HealthStatus {
  status: string;
  models: {
    model_a: {
      name: string;
      is_trained: boolean;
      type: string;
    };
    model_b: {
      name: string;
      is_loaded: boolean;
      device: string;
      fallback_mode: boolean;
    };
  };
  available_clause_categories: string[];
  available_document_types: string[];
}
