import React from 'react';
import { Clause, RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';

interface ClauseCardProps {
  clause: Clause;
  isSelected: boolean;
  onSelect: () => void;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({
  clause,
  isSelected,
  onSelect,
}) => {
  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
            <ShieldAlert className="w-3 h-3" />
            High Risk
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
            <AlertTriangle className="w-3 h-3" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle className="w-3 h-3" />
            Low Risk
          </span>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
        isSelected
          ? 'bg-slate-50 dark:bg-zinc-800/80 border-slate-900 dark:border-zinc-300 shadow-xs ring-1 ring-slate-900 dark:ring-zinc-300'
          : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-850'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
            {clause.header || `Clause ${clause.index}`}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
            {clause.predicted_category}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {getRiskBadge(clause.risk_level)}
          <ChevronRight
            className={`w-4 h-4 transition-transform ${
              isSelected
                ? 'text-slate-900 dark:text-zinc-100 translate-x-0.5'
                : 'text-slate-300 dark:text-zinc-600'
            }`}
          />
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed font-sans">
        {clause.text}
      </p>

      {/* Footer info: Confidence & word count */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-zinc-500">
        <div className="flex items-center gap-2">
          <span>Confidence:</span>
          <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                clause.confidence > 75
                  ? 'bg-emerald-500'
                  : clause.confidence > 50
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
              style={{ width: `${Math.min(100, clause.confidence)}%` }}
            />
          </div>
          <span className="font-semibold text-slate-700 dark:text-zinc-300">
            {clause.confidence.toFixed(1)}%
          </span>
        </div>
        <div>{clause.word_count} words</div>
      </div>
    </div>
  );
};
