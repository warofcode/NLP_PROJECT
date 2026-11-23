import React from 'react';
import { ModelType } from '../../types';
import { ShieldAlert, Cpu, Zap, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentTab: 'analyzer' | 'bulk' | 'benchmarks';
  selectedModel: ModelType;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, selectedModel }) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'analyzer':
        return {
          title: 'Single-Contract Clause Analysis',
          subtitle: 'Segment legal text into clauses, classify provisions, and flag legal risks',
        };
      case 'bulk':
        return {
          title: 'Bulk Document Sorting (Due Diligence)',
          subtitle: 'Batch classify 5–50 legal contracts into agreement types with risk ranking',
        };
      case 'benchmarks':
        return {
          title: 'Model Evaluation & Benchmarks',
          subtitle: 'Comparative metrics: Classical ML Baseline (TF-IDF + SVM) vs. Domain Legal-BERT',
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-8 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-base font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-zinc-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Active Model Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-xs font-medium text-slate-700 dark:text-zinc-300">
          {selectedModel === 'legal_bert' ? (
            <>
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Model B: Legal-BERT</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Model A: TF-IDF + SVM</span>
            </>
          )}
        </div>

        {/* Academic Project Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 text-[11px] font-medium text-blue-700 dark:text-blue-300">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>University NLP Project</span>
        </div>
      </div>
    </header>
  );
};
