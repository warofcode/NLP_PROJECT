import React, { useState } from 'react';
import { Clause } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Info,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface ClauseInspectorProps {
  clause: Clause | null;
  modelUsed: string;
}

export const ClauseInspector: React.FC<ClauseInspectorProps> = ({
  clause,
  modelUsed,
}) => {
  const [copied, setCopied] = useState(false);

  if (!clause) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 text-center text-slate-400 dark:text-zinc-500 sticky top-6">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <div className="text-sm font-medium">Select a clause to inspect</div>
        <p className="text-xs mt-1">
          Click any clause card on the left to see classified categories, risk
          factors, and confidence metrics.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(clause.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chartData = clause.top_3.map((item) => ({
    category: item.category,
    probability: item.probability,
  }));

  const getRiskExplanation = () => {
    switch (clause.risk_level) {
      case 'High':
        return 'Critical liability provision. May contain uncapped damages, unilateral indemnification, immediate termination, or automatic lock-in extension.';
      case 'Medium':
        return 'Standard commercial obligation. Verify compliance windows, billing cycles, warranty terms, and non-disclosure durations.';
      case 'Low':
        return 'Procedural administrative clause. Generally adheres to standard jurisdictional or boilerplate templates.';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs sticky top-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Selected Provision
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
            {clause.header || `Clause ${clause.index}`}
          </h2>
        </div>

        {/* Risk Badge */}
        <div>
          {clause.risk_level === 'High' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <ShieldAlert className="w-4 h-4" />
              High Risk
            </span>
          )}
          {clause.risk_level === 'Medium' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
              <AlertTriangle className="w-4 h-4" />
              Medium Risk
            </span>
          )}
          {clause.risk_level === 'Low' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
              <CheckCircle className="w-4 h-4" />
              Low Risk
            </span>
          )}
        </div>
      </div>

      {/* Primary Classification */}
      <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
            Predicted Category
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 font-mono">
            {clause.confidence.toFixed(1)}% Confidence
          </span>
        </div>
        <div className="text-sm font-bold text-slate-900 dark:text-zinc-100 mt-1">
          {clause.predicted_category}
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
          {clause.description}
        </p>
      </div>

      {/* Risk Advisory Note */}
      <div
        className={`p-3 rounded-lg text-xs leading-relaxed border ${
          clause.risk_level === 'High'
            ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-300'
            : clause.risk_level === 'Medium'
            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300'
            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300'
        }`}
      >
        <span className="font-semibold block mb-0.5">Legal Assessment:</span>
        {getRiskExplanation()}
      </div>

      {/* Top-3 Prediction Probabilities Recharts */}
      <div>
        <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          Top 3 Predicted Probabilities
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 10, left: 10, bottom: 4 }}
            >
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="category"
                width={110}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(val: number) => [`${val.toFixed(1)}%`, 'Probability']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="probability" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#3b82f6' : index === 1 ? '#94a3b8' : '#cbd5e1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Verbatim Clause Text & Copy Action */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            Verbatim Clause Text
          </span>
          <button
            onClick={handleCopy}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy Text
              </>
            )}
          </button>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-700 dark:text-zinc-300 max-h-48 overflow-y-auto leading-relaxed select-text">
          {clause.text}
        </div>
      </div>

      {/* Model & Latency Footnote */}
      <div className="pt-3 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500">
        <span className="truncate max-w-[180px]">{modelUsed}</span>
        <span className="flex items-center gap-1 font-mono">
          <Clock className="w-3 h-3" />
          {clause.latency_ms.toFixed(1)} ms
        </span>
      </div>
    </div>
  );
};
