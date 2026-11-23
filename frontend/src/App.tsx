import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { UploadZone } from './components/ClauseAnalyzer/UploadZone';
import { SummaryBar } from './components/ClauseAnalyzer/SummaryBar';
import { ClauseCard } from './components/ClauseAnalyzer/ClauseCard';
import { ClauseInspector } from './components/ClauseAnalyzer/ClauseInspector';
import { BulkSorterView } from './components/BulkSorter/BulkSorterView';
import { BenchmarksView } from './components/Benchmarks/BenchmarksView';
import {
  DocumentAnalysisResult,
  Clause,
  ModelType,
  RiskLevel,
  SampleContract,
} from './types';
import { analyzeDocument, checkHealth, fetchSampleContracts } from './api';
import { RefreshCw, FileText, ArrowLeft } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'analyzer' | 'bulk' | 'benchmarks'>('analyzer');
  const [selectedModel, setSelectedModel] = useState<ModelType>('legal_bert');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean>(false);
  const [sampleContracts, setSampleContracts] = useState<SampleContract[]>([]);

  // Clause Analyzer State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync dark mode class with HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Initial load: Health and Samples
  useEffect(() => {
    const init = async () => {
      try {
        const health = await checkHealth();
        setIsBackendHealthy(health.status === 'healthy');
      } catch {
        setIsBackendHealthy(false);
      }

      try {
        const samples = await fetchSampleContracts();
        setSampleContracts(samples);
      } catch (err) {
        console.error('Failed to load sample contracts:', err);
      }
    };
    init();
  }, []);

  // Handle Document Ingestion & Clause Analysis
  const handleAnalyzeDocument = async (payload: { file?: File; text?: string }) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await analyzeDocument(payload, selectedModel);
      setAnalysisResult(res);
      if (res.clauses.length > 0) {
        setSelectedClause(res.clauses[0]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Analysis failed. Please check backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  // Export JSON Report
  const handleExportJSON = () => {
    if (!analysisResult) return;
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Legal_Analysis_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV Report
  const handleExportCSV = () => {
    if (!analysisResult) return;
    const headers = [
      'Clause ID',
      'Index',
      'Section Header',
      'Classified Category',
      'Risk Level',
      'Confidence (%)',
      'Word Count',
      'Clause Text',
    ];
    const rows = analysisResult.clauses.map((c) => [
      c.clause_id,
      c.index,
      `"${(c.header || '').replace(/"/g, '""')}"`,
      `"${c.predicted_category}"`,
      c.risk_level,
      c.confidence.toFixed(1),
      c.word_count,
      `"${c.text.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encodedUri;
    a.download = `Legal_Clause_Report_${Date.now()}.csv`;
    a.click();
  };

  const filteredClauses = analysisResult?.clauses.filter((c) => {
    if (riskFilter === 'All') return true;
    return c.risk_level === riskFilter;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isBackendHealthy={isBackendHealthy}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <Header currentTab={currentTab} selectedModel={selectedModel} />

        {/* Dynamic Workspace */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-center justify-between">
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg(null)}
                  className="text-rose-500 hover:text-rose-700 font-bold ml-4"
                >
                  &times;
                </button>
              </div>
            )}

            {/* TAB 1: CLAUSE ANALYZER */}
            {currentTab === 'analyzer' && (
              <div className="space-y-6">
                {!analysisResult ? (
                  <>
                    <UploadZone
                      onAnalyze={handleAnalyzeDocument}
                      isLoading={isLoading}
                      sampleContracts={sampleContracts}
                      onLoadSample={(sample) => {
                        // Automatically trigger analysis on sample load if desired
                        handleAnalyzeDocument({ text: sample.content });
                      }}
                    />

                    {/* Feature overview cards for initial state */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
                      <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          10 Legal Taxonomies
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Classifies clauses into Confidentiality, Termination, Indemnification, Liability caps, Auto-Renewal, IP, and more.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          Risk Severity Engine
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Flags high-liability provisions, uncapped damages, unilateral warranties, and hidden evergreen auto-renewals.
                        </p>
                      </div>

                      <div className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                          <FileText className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                          Confidence &amp; Top-3 Distributions
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          Softmax-calibrated prediction probabilities visualize alternative label interpretations for academic audit.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    {/* Top Action / Reset Bar */}
                    <div className="mb-4 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setAnalysisResult(null);
                          setSelectedClause(null);
                        }}
                        className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center gap-1.5 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Analyze Another Contract
                      </button>

                      <span className="text-xs text-slate-400 font-mono">
                        Model: {analysisResult.model_used}
                      </span>
                    </div>

                    {/* Summary Bar */}
                    <SummaryBar
                      result={analysisResult}
                      riskFilter={riskFilter}
                      setRiskFilter={setRiskFilter}
                      onExportJSON={handleExportJSON}
                      onExportCSV={handleExportCSV}
                    />

                    {/* Split View: Left Document Clauses, Right Sticky Inspector */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                      {/* Left: Clause List (7 cols) */}
                      <div className="lg:col-span-7 space-y-3">
                        {filteredClauses && filteredClauses.length > 0 ? (
                          filteredClauses.map((clause) => (
                            <ClauseCard
                              key={clause.clause_id}
                              clause={clause}
                              isSelected={selectedClause?.clause_id === clause.clause_id}
                              onSelect={() => setSelectedClause(clause)}
                            />
                          ))
                        ) : (
                          <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800">
                            No clauses match the current filter "{riskFilter}".
                          </div>
                        )}
                      </div>

                      {/* Right: Clause Detail Inspector (5 cols) */}
                      <div className="lg:col-span-5">
                        <ClauseInspector
                          clause={selectedClause}
                          modelUsed={analysisResult.model_used}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: BULK SORTER (DUE DILIGENCE) */}
            {currentTab === 'bulk' && <BulkSorterView selectedModel={selectedModel} />}

            {/* TAB 3: MODEL BENCHMARKS */}
            {currentTab === 'benchmarks' && <BenchmarksView />}
          </div>
        </main>
      </div>
    </div>
  );
};
