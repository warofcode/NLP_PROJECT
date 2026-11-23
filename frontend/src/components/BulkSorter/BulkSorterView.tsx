import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Filter,
  Download,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  ArrowUpDown,
  Loader2,
  Trash2,
} from 'lucide-react';
import { BulkDocumentItem, BulkSortResult, ModelType, RiskLevel } from '../../types';
import { bulkSortFiles } from '../../api';

interface BulkSorterViewProps {
  selectedModel: ModelType;
}

export const BulkSorterView: React.FC<BulkSorterViewProps> = ({ selectedModel }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sortResult, setSortResult] = useState<BulkSortResult | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      const fileList = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...fileList]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...fileList]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setSortResult(null);
    setErrorMsg(null);
  };

  const handleProcessBatch = async () => {
    if (selectedFiles.length === 0) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await bulkSortFiles(selectedFiles, selectedModel);
      setSortResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Bulk classification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!sortResult || sortResult.documents.length === 0) return;

    const headers = [
      'File Name',
      'Document Type',
      'Confidence (%)',
      'Overall Risk',
      'High-Risk Clauses',
      'Total Clauses',
      'Status',
      'Inference Time (ms)',
    ];

    const rows = sortResult.documents.map((doc) => [
      `"${doc.filename.replace(/"/g, '""')}"`,
      `"${doc.document_type}"`,
      doc.confidence.toFixed(1),
      doc.risk_level,
      doc.high_risk_clauses,
      doc.total_clauses,
      doc.status,
      doc.latency_ms.toFixed(1),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Due_Diligence_Sort_Report_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDocs = sortResult?.documents.filter((doc) => {
    if (selectedCategoryFilter === 'All') return true;
    return doc.document_type === selectedCategoryFilter;
  });

  const uniqueCategories = [
    'All',
    ...Array.from(new Set(sortResult?.documents.map((d) => d.document_type) || [])),
  ];

  return (
    <div className="space-y-6">
      {/* Upload & Dropzone Section */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              Batch Ingestion & Document Routing
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Upload multiple contract files to categorize document types and index high-risk clauses in bulk.
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Files ({selectedFiles.length})
            </button>
          )}
        </div>

        {/* Multi-file Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-950/30'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-slate-600 dark:text-zinc-300">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="text-sm font-medium text-slate-800 dark:text-zinc-200">
            Drop legal files here, or click to browse
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
            Accepts 5 to 50 files simultaneously (.pdf, .docx, .txt)
          </p>
        </div>

        {/* Selected Files Staging List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-2">
              Staged Files ({selectedFiles.length})
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-2">
              {selectedFiles.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-zinc-300 truncate">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({(f.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(i);
                    }}
                    className="text-slate-400 hover:text-rose-500 transition-colors ml-2"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleProcessBatch}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Classifying {selectedFiles.length} Documents...
                  </>
                ) : (
                  <>Classify &amp; Sort Batch ({selectedFiles.length} Files)</>
                )}
              </button>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Results Table Section */}
      {sortResult && (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
          {/* Header & Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                Sorted Contract Portfolio ({sortResult.total_files} Files)
              </div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Classified with {sortResult.model_used}
              </div>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-emerald-500" />
              Export Due Diligence CSV
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="py-3 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" />
              Filter Document Type:
            </span>
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedCategoryFilter === cat
                    ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                  <th className="py-3 px-3">File Name</th>
                  <th className="py-3 px-3">Classified Document Type</th>
                  <th className="py-3 px-3">Confidence</th>
                  <th className="py-3 px-3">Risk Assessment</th>
                  <th className="py-3 px-3">High-Risk Clauses</th>
                  <th className="py-3 px-3">Provisions</th>
                  <th className="py-3 px-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80 text-xs">
                {filteredDocs?.map((doc, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/60 dark:hover:bg-zinc-850/50 transition-colors"
                  >
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-zinc-200 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[200px]" title={doc.filename}>
                        {doc.filename}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/50">
                        {doc.document_type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              doc.confidence > 75
                                ? 'bg-emerald-500'
                                : doc.confidence > 50
                                ? 'bg-amber-500'
                                : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(100, doc.confidence)}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-semibold">
                          {doc.confidence.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {doc.risk_level === 'High' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          <ShieldAlert className="w-3 h-3" />
                          High
                        </span>
                      ) : doc.risk_level === 'Medium' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          Medium
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Low
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700 dark:text-zinc-300">
                      {doc.high_risk_clauses > 0 ? (
                        <span className="text-rose-600 font-bold">
                          {doc.high_risk_clauses} flagged
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-zinc-400">
                      {doc.total_clauses} clauses
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[11px] text-slate-400">
                      {doc.latency_ms.toFixed(1)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
