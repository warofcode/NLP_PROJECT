import React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  FileJson,
  FileSpreadsheet,
  Filter,
  ShieldAlert,
} from 'lucide-react';
import { DocumentAnalysisResult, RiskLevel } from '../../types';

interface SummaryBarProps {
  result: DocumentAnalysisResult;
  riskFilter: 'All' | RiskLevel;
  setRiskFilter: (filter: 'All' | RiskLevel) => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  result,
  riskFilter,
  setRiskFilter,
  onExportJSON,
  onExportCSV,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 shadow-xs mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Document Stats & Type */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
              Document Ingested
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate max-w-xs">
              {result.filename}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Document Type Badge */}
          <div>
            <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
              Predicted Document Type
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50 mt-0.5">
              {result.document_type}
              <span className="text-[10px] opacity-75">
                ({result.document_type_confidence.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Metric KPIs */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700">
              <div className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-500">
                Total Clauses
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                {result.total_clauses}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-400">
              <div className="text-[10px] uppercase font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                High Risk
              </div>
              <div className="text-sm font-bold">{result.high_risk_count}</div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400">
              <div className="text-[10px] uppercase font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Medium
              </div>
              <div className="text-sm font-bold">{result.medium_risk_count}</div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400">
              <div className="text-[10px] uppercase font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Low Risk
              </div>
              <div className="text-sm font-bold">{result.low_risk_count}</div>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400">
              <div className="text-[10px] uppercase font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Latency
              </div>
              <div className="text-sm font-bold font-mono">
                {result.processing_time_ms.toFixed(0)} ms
              </div>
            </div>
          </div>
        </div>

        {/* Export Report Actions */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            onClick={onExportJSON}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-zinc-750 transition-colors shadow-2xs"
            title="Download full analysis report as JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-500" />
            Export JSON
          </button>
          <button
            onClick={onExportCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-zinc-750 transition-colors shadow-2xs"
            title="Export categorized clauses to spreadsheet CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            Filter by Risk:
          </span>
          {(['All', 'High', 'Medium', 'Low'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setRiskFilter(filter)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                riskFilter === filter
                  ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-2xs'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900'
              }`}
            >
              {filter}
              {filter === 'High' && (
                <span className="ml-1 text-[10px] font-bold text-rose-500">
                  ({result.high_risk_count})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
          Showing {result.clauses.length} parsed provisions
        </div>
      </div>
    </div>
  );
};
