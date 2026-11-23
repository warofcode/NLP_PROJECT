import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Sparkles, Clipboard, ArrowRight, Loader2 } from 'lucide-react';
import { SampleContract } from '../../types';

interface UploadZoneProps {
  onAnalyze: (payload: { file?: File; text?: string }) => void;
  isLoading: boolean;
  sampleContracts: SampleContract[];
  onLoadSample: (sample: SampleContract) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onAnalyze,
  isLoading,
  sampleContracts,
  onLoadSample,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (activeTab === 'upload' && selectedFile) {
      onAnalyze({ file: selectedFile });
    } else if (activeTab === 'paste' && pastedText.trim()) {
      onAnalyze({ text: pastedText.trim() });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs">
      {/* Tab Switcher & Quick Loaders */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-zinc-800">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            Upload Document (PDF / DOCX)
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'paste'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900'
            }`}
          >
            Paste Legal Text
          </button>
        </div>

        {/* Viva Demo: Quick Sample Contract Loaders */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Quick Demo:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {sampleContracts.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setPastedText(sample.content);
                  setActiveTab('paste');
                  onLoadSample(sample);
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-medium border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                title={`Load ${sample.title}`}
              >
                {sample.id === 'sample_nda'
                  ? 'Sample NDA'
                  : sample.id === 'sample_freelance_agreement'
                  ? 'Freelance Agrmt'
                  : 'Commercial Lease'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Upload / Input Area */}
      <div className="pt-5">
        {activeTab === 'upload' ? (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 bg-slate-50/50 dark:bg-zinc-950/30'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3 text-slate-600 dark:text-zinc-300">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                {selectedFile ? (
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                ) : (
                  'Drag and drop your contract here, or click to browse'
                )}
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Supports PDF, DOCX, and TXT (up to 25 MB)
              </p>
            </div>
          </div>
        ) : (
          <div>
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste clauses or full contract text here (e.g. Confidentiality, Indemnification, Termination clauses)..."
              rows={7}
              className="w-full text-xs font-mono p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-600 resize-y"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              (activeTab === 'upload' && !selectedFile) ||
              (activeTab === 'paste' && !pastedText.trim())
            }
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium flex items-center gap-2 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Clauses & Legal Risks...
              </>
            ) : (
              <>
                Analyze Document
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
