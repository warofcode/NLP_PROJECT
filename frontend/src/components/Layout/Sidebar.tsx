import React from 'react';
import {
  FileText,
  Layers,
  BarChart3,
  Scale,
  Sun,
  Moon,
  Cpu,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { ModelType } from '../../types';

interface SidebarProps {
  currentTab: 'analyzer' | 'bulk' | 'benchmarks';
  setCurrentTab: (tab: 'analyzer' | 'bulk' | 'benchmarks') => void;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isBackendHealthy: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  selectedModel,
  setSelectedModel,
  darkMode,
  setDarkMode,
  isBackendHealthy,
}) => {
  const navItems = [
    {
      id: 'analyzer' as const,
      label: 'Clause Analyzer',
      description: 'Single-contract breakdown',
      icon: FileText,
    },
    {
      id: 'bulk' as const,
      label: 'Bulk Sorter',
      description: 'Due diligence mode',
      icon: Layers,
    },
    {
      id: 'benchmarks' as const,
      label: 'Model Benchmarks',
      description: 'ML vs Transformer metrics',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between shrink-0 h-screen select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
                LegalDoc NLP
              </div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                Domain-Specific Classifier
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Workflows
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors ${
                  isActive
                    ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-medium'
                    : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-400 dark:text-zinc-500'
                  }`}
                />
                <div>
                  <div className="text-xs leading-none">{item.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* NLP Architecture Model Switcher */}
        <div className="p-4 mx-3 mt-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/40">
          <div className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 mb-2 flex items-center justify-between">
            <span>Inference Model</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 uppercase font-mono">
              Dual
            </span>
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedModel('legal_bert')}
              className={`w-full p-2 rounded-lg text-left border transition-all ${
                selectedModel === 'legal_bert'
                  ? 'bg-white dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 shadow-xs'
                  : 'border-transparent hover:bg-white/50 dark:hover:bg-zinc-900/60 text-slate-500 dark:text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  Legal-BERT
                </span>
                {selectedModel === 'legal_bert' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                Domain Transformer (LEDGAR)
              </div>
            </button>

            <button
              onClick={() => setSelectedModel('baseline')}
              className={`w-full p-2 rounded-lg text-left border transition-all ${
                selectedModel === 'baseline'
                  ? 'bg-white dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 shadow-xs'
                  : 'border-transparent hover:bg-white/50 dark:hover:bg-zinc-900/60 text-slate-500 dark:text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  TF-IDF + SVM
                </span>
                {selectedModel === 'baseline' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                Classical ML Baseline (&lt;1ms)
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="p-4 border-t border-slate-100 dark:border-zinc-800/80 space-y-3">
        {/* Backend health pill */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 px-1">
          <span className="text-[11px]">API Service</span>
          <span className="flex items-center gap-1.5 text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy
                  ? 'bg-emerald-500 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            {isBackendHealthy ? 'Ready' : 'Connecting...'}
          </span>
        </div>

        {/* Dark mode switch */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {darkMode ? 'Light Theme' : 'Dark Theme'}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            {darkMode ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </aside>
  );
};
