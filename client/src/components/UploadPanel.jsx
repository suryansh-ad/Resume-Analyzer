import { FileText, LoaderCircle, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function UploadPanel({
  file,
  previewUrl,
  progress,
  loading,
  error,
  isAuthenticated,
  onFileSelect,
  onRemove,
  onAnalyze,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFiles(files) {
    const selected = files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  }

  return (
    <section id="analyzer" className="glass-card p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Resume Upload</p>
          <h2 className="section-title mt-3">Upload and analyze in one flow</h2>
        </div>
        <button
          type="button"
          onClick={onAnalyze}
          disabled={!file || loading || !isAuthenticated}
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2"><LoaderCircle size={16} className="animate-spin" /> Analyzing...</span>
          ) : (
            isAuthenticated ? "Analyze Resume" : "Sign in to Analyze"
          )}
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            handleFiles(event.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`group relative cursor-pointer overflow-hidden rounded-[2rem] border border-dashed p-8 transition ${
            dragOver
              ? "border-cyan-400 bg-cyan-500/10"
              : "border-slate-300 bg-white/70 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/60"
          }`}
        >
          <div className="absolute inset-x-16 top-0 h-24 rounded-full bg-cyan-400/20 blur-3xl" />
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <div className="relative flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-sky-500 text-white shadow-lg shadow-cyan-500/20">
              <UploadCloud size={32} />
            </div>
            <h3 className="mt-6 text-xl font-semibold">Drag and drop your resume</h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              Upload PDF or DOCX files up to 10MB. We extract the text, analyze it with Gemini, and surface ATS and skill insights in a polished dashboard.
            </p>
            <div className="mt-6 rounded-full border border-slate-200 bg-white/80 px-5 py-2 text-sm font-medium dark:border-slate-800 dark:bg-slate-900/70">
              Choose File
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/30 bg-white/60 p-6 dark:border-white/10 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">File preview</h3>
            {file ? (
              <button type="button" onClick={onRemove} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-800">
                <Trash2 size={18} />
              </button>
            ) : null}
          </div>

          {file ? (
            <div className="mt-5">
              <div className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 dark:bg-slate-950/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
                  <FileText size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{file.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <div className="mt-5 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{progress}% uploaded</p>
              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                {file.type === "application/pdf" && previewUrl ? (
                  <iframe src={previewUrl} title="Resume preview" className="h-72 w-full" />
                ) : (
                  <div className="flex h-72 items-center justify-center p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                    DOCX preview is summarized here. The file will still be fully parsed and analyzed after upload.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 flex h-[22rem] items-center justify-center rounded-3xl border border-dashed border-slate-300 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Your selected file preview will appear here.
            </div>
          )}

          {!isAuthenticated ? (
            <p className="mt-4 text-sm text-cyan-700 dark:text-cyan-200">Sign in below before running an analysis.</p>
          ) : null}
          {error ? <p className="mt-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
