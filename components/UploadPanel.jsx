"use client";

import { useRef, useState, useEffect } from "react";
import { 
  FileText, LoaderCircle, Trash2, UploadCloud, Laptop, Database, 
  Shield, Cloud, Briefcase, Coins, Megaphone, Users, Palette, 
  GraduationCap, CheckCircle2, Sparkles, Paperclip, ChevronRight 
} from "lucide-react";
import { roleLibrary, recommendRoles } from "../lib/roleLibrary.js";

function formatSize(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// Maps domains to visual icons
const domainIcons = {
  "Software Development": Laptop,
  "Data & AI": Database,
  "Cybersecurity": Shield,
  "Cloud & DevOps": Cloud,
  "Business & Management": Briefcase,
  "Finance": Coins,
  "Marketing": Megaphone,
  "Human Resources": Users,
  "Design": Palette,
  "Freshers": GraduationCap
};

export function UploadPanel({
  file,
  previewUrl,
  progress,
  loading,
  error,
  authReady = true,
  isAuthenticated,
  onFileSelect,
  onRemove,
  onAnalyze,

  // New JD states and handlers passed from FresherrApp
  analysisMode,
  setAnalysisMode,
  jdText,
  setJdText,
  jdFile,
  setJdFile,
  jdFileProgress,
  jdFileLoading,
  onJdFileSelect,
  onJdFileRemove,
  selectedDomain,
  setSelectedDomain,
  selectedRoleId,
  setSelectedRoleId,
  onAnalyzeJd,
  resumeExtractedText
}) {
  const inputRef = useRef(null);
  const jdFileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [jdDragOver, setJdDragOver] = useState(false);
  const [jdInputType, setJdInputType] = useState("text"); // "text" or "file"

  // Recommendations calculated dynamically on the fly if resume extracted text is available
  const recommendations = resumeExtractedText ? recommendRoles(resumeExtractedText) : [];

  function handleFiles(files) {
    const selected = files?.[0];
    if (selected) {
      onFileSelect(selected);
    }
  }

  function handleJdFiles(files) {
    const selected = files?.[0];
    if (selected) {
      onJdFileSelect(selected);
    }
  }

  // Set default role ID when domain changes
  useEffect(() => {
    if (roleLibrary[selectedDomain] && roleLibrary[selectedDomain].length > 0) {
      const firstRole = roleLibrary[selectedDomain][0];
      setSelectedRoleId(firstRole.id);
    }
  }, [selectedDomain, setSelectedRoleId]);

  const selectedRole = roleLibrary[selectedDomain]?.find(r => r.id === selectedRoleId) || null;

  const handleSelectRecommendation = (rec) => {
    setAnalysisMode("library");
    setSelectedDomain(rec.domain);
    setSelectedRoleId(rec.id);
  };

  // Determine if the analyze action button should be enabled
  const isAnalyzeDisabled = () => {
    if (loading || jdFileLoading || !authReady || !isAuthenticated || !file) {
      return true;
    }
    if (analysisMode === "company-jd") {
      if (jdInputType === "text" && !jdText.trim()) return true;
      if (jdInputType === "file" && !jdFile) return true;
    }
    return false;
  };

  const handleRunAnalysis = () => {
    if (analysisMode === "standard") {
      onAnalyze();
    } else if (analysisMode === "company-jd") {
      onAnalyzeJd();
    } else if (analysisMode === "library") {
      onAnalyzeJd();
    }
  };

  return (
    <section id="analyzer" className="glass-card p-6 md:p-8 text-slate-100">
      
      {/* Title block */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-800 pb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-500">ATS Optimization Engine</p>
          <h2 className="section-title mt-2 text-white">Upload Resume & Select Analysis Mode</h2>
        </div>
        
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzeDisabled()}
          className="rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 shadow-lg shadow-cyan-500/10"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={16} className="animate-spin" /> Analyzing Resume...
            </span>
          ) : jdFileLoading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={16} className="animate-spin" /> Extracting JD...
            </span>
          ) : (
            authReady ? (
              isAuthenticated ? (
                analysisMode === "standard" ? "Analyze Resume Standard" : "Run Match Analysis"
              ) : "Sign in to Analyze"
            ) : "Preparing Session..."
          )}
        </button>
      </div>

      {/* Main Grid */}
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        
        {/* LEFT COLUMN: Resume Upload & Preview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-400 border border-cyan-500/20">1</span>
              Upload Resume
            </h3>
            {file && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 size={14} /> Resume Uploaded
              </span>
            )}
          </div>

          {!file ? (
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
                  ? "border-cyan-400 bg-cyan-500/5"
                  : "border-slate-800 bg-slate-900/30 hover:border-slate-700/80 hover:-translate-y-1"
              }`}
            >
              <div className="absolute inset-x-16 top-0 h-24 rounded-full bg-cyan-500/10 blur-3xl opacity-50" />
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                  <UploadCloud size={28} />
                </div>
                <h3 className="mt-5 text-lg font-bold">Drag & drop your resume</h3>
                <p className="mt-2.5 max-w-sm text-xs leading-relaxed text-slate-400">
                  Upload PDF, DOC, or DOCX files up to 10MB. We parse the structure, keywords, and skill matches instantly.
                </p>
                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-200 transition">
                  Choose File
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900/20 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">{file.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={onRemove} 
                  className="rounded-full p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {progress > 0 && progress < 100 && (
                <div className="mt-4">
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-400 font-medium">{progress}% uploaded</p>
                </div>
              )}

              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40">
                {file.type === "application/pdf" && previewUrl ? (
                  <iframe src={previewUrl} title="Resume preview" className="h-56 w-full" />
                ) : (
                  <div className="flex h-56 items-center justify-center p-6 text-center text-xs text-slate-400 leading-relaxed italic">
                    Word document loaded. Click "Analyze" above to review complete extracted insights on the dashboard.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Role Recommendations Chip Row */}
          {file && recommendations.length > 0 && (
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-2xl rounded-full" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles size={13} className="animate-pulse" /> Smart Recommendations
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">Based on extracted resume signals, you may be suitable for:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendations.map((rec) => {
                  const isSelected = analysisMode === "library" && selectedRoleId === rec.id;
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => handleSelectRecommendation(rec)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                        isSelected
                          ? "bg-cyan-500 border-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {rec.title} <span className={isSelected ? "text-slate-900 font-bold opacity-80" : "text-cyan-400"}>({rec.confidence}%)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Mode Selector & Inputs */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/10 text-xs font-semibold text-cyan-400 border border-cyan-500/20">2</span>
            Choose Analysis Mode
          </h3>

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 rounded-2xl bg-slate-950/40 p-1 border border-slate-850">
            {[
              { id: "standard", label: "ATS Check" },
              { id: "company-jd", label: "Custom JD" },
              { id: "library", label: "Role Library" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAnalysisMode(tab.id)}
                className={`rounded-xl py-2.5 text-xs font-bold transition ${
                  analysisMode === tab.id
                    ? "bg-slate-900 text-cyan-400 shadow-sm border border-slate-800"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Standard Mode Message */}
          {analysisMode === "standard" && (
            <div className="p-5 rounded-3xl border border-slate-800/80 bg-slate-900/30 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <CheckCircle2 size={18} />
              </div>
              <h4 className="text-sm font-bold text-white">Standard ATS Resume Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Scan your resume structure, keyword densities, sections completeness, and get bullet point optimizations without comparing to a job description.
              </p>
            </div>
          )}

          {/* Company JD Mode */}
          {analysisMode === "company-jd" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-200">Custom Job Description</h4>
                
                {/* JD Input Format Toggles */}
                <div className="flex rounded-lg bg-slate-950/60 p-0.5 border border-slate-850 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setJdInputType("text")}
                    className={`px-2.5 py-1 rounded-md transition ${
                      jdInputType === "text" ? "bg-slate-900 text-white" : "text-slate-400"
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdInputType("file")}
                    className={`px-2.5 py-1 rounded-md transition ${
                      jdInputType === "file" ? "bg-slate-900 text-white" : "text-slate-400"
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {/* Paste JD Text */}
              {jdInputType === "text" ? (
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the target job description (responsibilities, requirements, skills) here..."
                  className="w-full h-44 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-xs leading-relaxed outline-none transition focus:border-cyan-500 placeholder-slate-600 text-slate-200 resize-none"
                />
              ) : (
                /* Upload JD File */
                <div className="space-y-3">
                  {!jdFile ? (
                    <div
                      onDragOver={(event) => {
                        event.preventDefault();
                        setJdDragOver(true);
                      }}
                      onDragLeave={() => setJdDragOver(false)}
                      onDrop={(event) => {
                        event.preventDefault();
                        setJdDragOver(false);
                        handleJdFiles(event.dataTransfer.files);
                      }}
                      onClick={() => jdFileInputRef.current?.click()}
                      className={`cursor-pointer overflow-hidden rounded-2xl border border-dashed p-6 text-center transition ${
                        jdDragOver
                          ? "border-cyan-400 bg-cyan-500/5"
                          : "border-slate-800 bg-slate-950/30 hover:border-slate-700/80"
                      }`}
                    >
                      <input
                        ref={jdFileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc"
                        className="hidden"
                        onChange={(event) => handleJdFiles(event.target.files)}
                      />
                      <Paperclip className="mx-auto text-slate-500" size={20} />
                      <p className="mt-3 text-xs font-semibold text-slate-300">Drag & drop JD file or browse</p>
                      <p className="mt-1 text-[10px] text-slate-500">Supports PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/20 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <Paperclip size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-white">{jdFile.name}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500">{formatSize(jdFile.size)}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={onJdFileRemove} 
                        className="rounded-full p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  {jdFileProgress > 0 && jdFileProgress < 100 && (
                    <div className="px-2">
                      <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-1 rounded-full bg-cyan-400 transition-all duration-300" style={{ width: `${jdFileProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Role Library Mode */}
          {analysisMode === "library" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                
                {/* Domain Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Select Domain</label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    {Object.keys(roleLibrary).map((domain) => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Select Role</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    {(roleLibrary[selectedDomain] || []).map((role) => (
                      <option key={role.id} value={role.id}>{role.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected JD Description Preview */}
              {selectedRole && (
                <div className="rounded-2xl border border-slate-850 bg-slate-950/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-2.5">
                    {(() => {
                      const Icon = domainIcons[selectedDomain] || Laptop;
                      return <Icon size={14} />;
                    })()}
                    <span>{selectedRole.title} Job Description Template</span>
                  </div>
                  <div className="h-28 overflow-y-auto text-[11px] leading-relaxed text-slate-400 pr-2 border-t border-slate-900/60 pt-2 scrollbar-thin scrollbar-thumb-slate-800">
                    {selectedRole.description}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
          {authReady && !isAuthenticated && (
            <p className="text-xs font-semibold text-cyan-400">Please sign in below to perform resume analysis.</p>
          )}
        </div>
      </div>

    </section>
  );
}
