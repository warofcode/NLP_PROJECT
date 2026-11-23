import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  BarChart3,
  Cpu,
  Zap,
  TrendingUp,
  Clock,
  Layers,
  Award,
  RefreshCw,
  Loader2,
  Table,
} from 'lucide-react';
import { MetricsResult } from '../../types';
import { fetchModelMetrics } from '../../api';

export const BenchmarksView: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMatrixModel, setSelectedMatrixModel] = useState<'model_a' | 'model_b'>('model_b');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadMetrics = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchModelMetrics();
      setMetrics(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load model metrics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-16 text-center shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-3" />
        <div className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          Computing &amp; Loading Model Evaluation Benchmarks...
        </div>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          Evaluating Test Set across Model A (TF-IDF + Linear Classifier) and Model B (Legal-BERT)
        </p>
      </div>
    );
  }

  if (errorMsg || !metrics) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 text-center text-rose-600 shadow-xs">
        <div className="text-sm font-semibold">Error Loading Evaluation Data</div>
        <p className="text-xs mt-1 text-slate-500">{errorMsg}</p>
        <button
          onClick={loadMetrics}
          className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium"
        >
          Retry Benchmark Run
        </button>
      </div>
    );
  }

  const { model_a, model_b, per_category_comparison, summary, categories } = metrics;
  const activeMatrix = selectedMatrixModel === 'model_a' ? model_a : model_b;

  return (
    <div className="space-y-6">
      {/* KPI Cards: Model A vs Model B side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Model A Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  Model A: Classical Baseline
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  TF-IDF (1-2 grams) + Calibrated Linear Classifier
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
              Fast Baseline
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Accuracy
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                {model_a.accuracy.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Macro F1
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                {model_a.macro_f1.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Avg Latency
              </div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                {model_a.avg_latency_ms.toFixed(1)}ms
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
            <div className="flex justify-between">
              <span>Macro Precision:</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                {model_a.macro_precision.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Macro Recall:</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                {model_a.macro_recall.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Hardware Target:</span>
              <span className="font-mono text-slate-700 dark:text-zinc-300">
                Lightweight CPU / Edge
              </span>
            </div>
          </div>
        </div>

        {/* Model B Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                  Model B: Legal-BERT
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  nlpaueb/legal-bert-base-uncased (Domain Adapted)
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
              Transformer
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Accuracy
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                {model_b.accuracy.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Macro F1
              </div>
              <div className="text-xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                {model_b.macro_f1.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Avg Latency
              </div>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-0.5 font-mono">
                {model_b.avg_latency_ms.toFixed(1)}ms
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400 space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800 text-[11px]">
            <div className="flex justify-between">
              <span>Macro Precision:</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                {model_b.macro_precision.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Macro Recall:</span>
              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                {model_b.macro_recall.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Semantic Attention:</span>
              <span className="font-mono text-slate-700 dark:text-zinc-300">
                12-layer Self-Attention
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Category F1-Score Comparative Bar Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              Per-Category F1-Score Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Comparison across all 10 legal clause taxonomies on held-out test data
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-500" />
              <span className="text-slate-600 dark:text-zinc-400">Model A (TF-IDF)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-600" />
              <span className="text-slate-600 dark:text-zinc-400">Model B (Legal-BERT)</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={per_category_comparison}
              margin={{ top: 10, right: 20, left: 0, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="category"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 10, fill: '#64748b' }}
                height={55}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} unit="%" />
              <Tooltip
                formatter={(val: number) => [`${val}%`, 'F1 Score']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="model_a_f1" name="Model A (TF-IDF + SVM)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="model_b_f1" name="Model B (Legal-BERT)" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Confusion Matrix Visual Grid */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Table className="w-4 h-4 text-emerald-500" />
              Confusion Matrix Heatmap
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Inspect true vs. predicted classifications across test clauses
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg">
            <button
              onClick={() => setSelectedMatrixModel('model_b')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedMatrixModel === 'model_b'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                  : 'text-slate-500'
              }`}
            >
              Legal-BERT Matrix
            </button>
            <button
              onClick={() => setSelectedMatrixModel('model_a')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedMatrixModel === 'model_a'
                  ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-2xs font-bold'
                  : 'text-slate-500'
              }`}
            >
              Baseline TF-IDF Matrix
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <div className="text-[10px] text-slate-400 dark:text-zinc-500 mb-1 text-center font-mono">
            &larr; Predicted Categories &rarr;
          </div>
          <table className="mx-auto text-center border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-[10px] font-bold text-slate-400 text-right pr-3">
                  True \ Pred
                </th>
                {categories.map((c, i) => (
                  <th
                    key={i}
                    className="p-1.5 text-[9px] font-mono text-slate-500 dark:text-zinc-400 w-12 truncate"
                    title={c}
                  >
                    {c.slice(0, 4)}..
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeMatrix.confusion_matrix.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td className="p-1.5 text-[10px] font-semibold text-slate-600 dark:text-zinc-300 text-right pr-3 truncate max-w-[120px]">
                    {categories[rIdx]}
                  </td>
                  {row.map((val, cIdx) => {
                    const isDiagonal = rIdx === cIdx;
                    return (
                      <td
                        key={cIdx}
                        className={`w-12 h-9 text-xs font-mono font-bold border border-slate-100 dark:border-zinc-800 ${
                          val > 0
                            ? isDiagonal
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                            : 'bg-slate-50/40 dark:bg-zinc-950/20 text-slate-300 dark:text-zinc-700'
                        }`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
