import {
  ModelType,
  DocumentAnalysisResult,
  BulkSortResult,
  MetricsResult,
  SampleContract,
  HealthStatus,
  Clause,
} from './types';

const API_BASE = '/api';

export async function checkHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to reach backend health endpoint.');
  return res.json();
}

export async function fetchSampleContracts(): Promise<SampleContract[]> {
  const res = await fetch(`${API_BASE}/samples`);
  if (!res.ok) throw new Error('Failed to fetch sample contracts.');
  return res.json();
}

export async function analyzeDocument(
  payload: { file?: File; text?: string },
  modelType: ModelType
): Promise<DocumentAnalysisResult> {
  const formData = new FormData();
  if (payload.file) {
    formData.append('file', payload.file);
  }
  if (payload.text) {
    formData.append('text', payload.text);
  }
  formData.append('model_type', modelType);

  const res = await fetch(`${API_BASE}/analyze/document`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Document analysis failed.');
  }

  return res.json();
}

export async function analyzeClause(
  text: string,
  modelType: ModelType
): Promise<Clause> {
  const res = await fetch(`${API_BASE}/analyze/clause`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_type: modelType }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Clause analysis failed.');
  }

  return res.json();
}

export async function bulkSortFiles(
  files: File[],
  modelType: ModelType
): Promise<BulkSortResult> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('model_type', modelType);

  const res = await fetch(`${API_BASE}/bulk/sort`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Bulk sorting failed.');
  }

  return res.json();
}

export async function fetchModelMetrics(): Promise<MetricsResult> {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error('Failed to load benchmark metrics.');
  return res.json();
}
