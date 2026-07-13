"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
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
    <section id="analyzer" className="glass-card p-6 md:p-8 text-slate-100 border-white/[0.06] bg-slate-900/10 relative overflow-hidden before:absolute before:top-0 before:left-6 before:right-6 before:h-[2px] before:bg-gradient-to-r before:from-cyan-500 before:to-indigo-500 before:shadow-[0_1px_10px_rgba(6,182,212,0.3)]">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-white/[0.06] pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400">ATS Optimization Engine</p>
          <h2 className="section-title mt-2 text-white font-heading">Upload Resume & Select Analysis Mode</h2>
        </div>
        
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzeDisabled()}
          className="rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-900 disabled:text-slate-600 disabled:border-white/5 disabled:cursor-not-allowed px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:-translate-y-0.5 shadow-lg shadow-cyan-500/10 cursor-pointer"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={14} className="animate-spin" /> Analyzing Resume...
            </span>
          ) : jdFileLoading ? (
            <span className="inline-flex items-center gap-2">
              <LoaderCircle size={14} className="animate-spin" /> Extracting JD...
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
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">1</span>
              Upload Resume
            </h3>
            {file && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-450">
                <CheckCircle2 size={13} /> Resume Uploaded
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
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-dashed p-8 transition ${
                dragOver
                  ? "border-cyan-400 bg-cyan-500/5"
                  : "border-white/10 bg-slate-900/10 hover:border-cyan-500/20 hover:bg-slate-900/20 hover:-translate-y-0.5"
              }`}
            >
              <div className="absolute inset-x-16 top-0 h-24 rounded-full bg-cyan-500/10 blur-3xl opacity-50 pointer-events-none" />
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
              />
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-400 text-slate-950 shadow-lg shadow-cyan-500/10">
                  <UploadCloud size={24} />
                </div>
                <h3 className="mt-5 text-sm font-bold text-white font-heading">Drag & drop your resume</h3>
                <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-400 font-medium">
                  Upload PDF, DOC, or DOCX files up to 10MB. We parse the structure, keywords, and skill matches instantly.
                </p>
                <div className="mt-5 rounded-xl border border-white/5 bg-slate-950 hover:bg-slate-900 px-6 py-2.5 text-[11px] uppercase font-bold text-slate-300 tracking-wider transition-colors">
                  Choose File
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.05] bg-slate-900/15 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{file.name}</p>
                    <p className="mt-0.5 text-[10px] text-slate-500 font-semibold">{formatSize(file.size)}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={onRemove} 
                  className="rounded-full p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-950 transition-colors cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {progress > 0 && progress < 100 && (
                <div className="mt-4">
                  <div className="h-1 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-1 rounded-full bg-cyan-400 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-1.5 text-[9px] text-slate-500 font-bold uppercase tracking-wider">{progress}% uploaded</p>
                </div>
              )}

              <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.05] bg-slate-950/60">
                {file.type === "application/pdf" && previewUrl ? (
                  <iframe src={previewUrl} title="Resume preview" className="h-56 w-full" />
                ) : (
                  <div className="flex h-56 items-center justify-center p-6 text-center text-xs text-slate-400 leading-relaxed italic font-medium">
                    Word document loaded. Click "Analyze" above to review complete extracted insights on the dashboard.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Role Recommendations Chip Row */}
          {file && recommendations.length > 0 && (
            <div className="bg-slate-900/15 border border-white/[0.05] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 blur-2xl rounded-full" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5 font-heading">
                <Sparkles size={11} className="animate-pulse" /> Smart Recommendations
              </h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Based on extracted resume signals, you may be suitable for:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendations.map((rec) => {
                  const isSelected = analysisMode === "library" && selectedRoleId === rec.id;
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => handleSelectRecommendation(rec)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-cyan-500 border-cyan-500 text-slate-950 font-bold"
                          : "bg-slate-950/60 border-white/5 text-slate-300 hover:border-cyan-500/20 hover:text-white"
                      }`}
                    >
                      {rec.title} <span className={isSelected ? "text-slate-900 font-bold opacity-80" : "text-cyan-400 font-semibold"}>({rec.confidence}%)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Mode Selector & Inputs */}
        <div className="space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400 border border-cyan-500/20">2</span>
            Choose Analysis Mode
          </h3>

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 rounded-2xl bg-slate-950 p-1 border border-white/[0.05]">
            {[
              { id: "standard", label: "ATS Check" },
              { id: "company-jd", label: "Custom JD" },
              { id: "library", label: "Role Library" }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setAnalysisMode(tab.id)}
                className={`rounded-xl py-2 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  analysisMode === tab.id
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10 font-bold border border-cyan-500/15"
                    : "text-slate-400 hover:text-white font-semibold"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Standard Mode Message */}
          {analysisMode === "standard" && (
            <div className="p-6 rounded-2xl border border-white/[0.05] bg-slate-900/15 text-center space-y-3.5 relative overflow-hidden">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse-soft">
                <CheckCircle2 size={16} />
              </div>
              <h4 className="text-sm font-bold text-white font-heading">Standard ATS Resume Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto font-medium">
                Scan your resume structure, keyword densities, sections completeness, and get bullet point optimizations without comparing to a job description.
              </p>
            </div>
          )}

          {/* Company JD Mode */}
          {analysisMode === "company-jd" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">Custom Job Description</h4>
                
                {/* JD Input Format Toggles */}
                <div className="flex rounded-xl bg-slate-950 p-1 border border-white/[0.04] text-[9px] font-bold">
                  <button
                    type="button"
                    onClick={() => setJdInputType("text")}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      jdInputType === "text" ? "bg-white/10 text-white font-bold" : "text-slate-500"
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdInputType("file")}
                    className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                      jdInputType === "file" ? "bg-white/10 text-white font-bold" : "text-slate-500"
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
                  className="w-full h-44 rounded-2xl border border-white/10 bg-slate-950 p-4 text-xs leading-relaxed outline-none focus:border-cyan-500/40 text-slate-200 resize-none font-medium transition-all duration-300"
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
                          : "border-white/10 bg-slate-900/10 hover:border-cyan-500/20 hover:bg-slate-900/20"
                      }`}
                    >
                      <input
                        ref={jdFileInputRef}
                        type="file"
                        accept=".pdf,.docx,.doc"
                        className="hidden"
                        onChange={(event) => handleJdFiles(event.target.files)}
                      />
                      <Paperclip className="mx-auto text-slate-500" size={18} />
                      <p className="mt-3 text-xs font-bold text-slate-300 font-heading">Drag & drop JD file or browse</p>
                      <p className="mt-1 text-[10px] text-slate-500 font-semibold">Supports PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/[0.05] bg-slate-900/15 p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          <Paperclip size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-white">{jdFile.name}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500 font-semibold">{formatSize(jdFile.size)}</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={onJdFileRemove} 
                        className="rounded-full p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-950 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}

                  {jdFileProgress > 0 && jdFileProgress < 100 && (
                    <div className="px-2">
                      <div className="h-1 rounded-full bg-slate-950 overflow-hidden">
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
              <div className="grid grid-cols-2 gap-4">
                
                {/* Domain Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-heading">Select Domain</label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 transition-all font-semibold cursor-pointer"
                  >
                    {Object.keys(roleLibrary).map((domain) => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                {/* Role Selector */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-500 font-heading">Select Role</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    className="w-full mt-1.5 rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 transition-all font-semibold cursor-pointer"
                  >
                    {(roleLibrary[selectedDomain] || []).map((role) => (
                      <option key={role.id} value={role.id}>{role.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected JD Description Preview */}
              {selectedRole && (
                <div className="rounded-2xl border border-white/[0.05] bg-slate-900/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-2.5 font-heading">
                    {(() => {
                      const Icon = domainIcons[selectedDomain] || Laptop;
                      return <Icon size={13} className="shrink-0" />;
                    })()}
                    <span>{selectedRole.title} Job Description Template</span>
                  </div>
                  <div className="h-28 overflow-y-auto text-[11px] leading-relaxed text-slate-400 pr-2 border-t border-white/[0.04] pt-2 scrollbar-thin scrollbar-thumb-slate-900 font-medium">
                    {selectedRole.description}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
          {authReady && !isAuthenticated && (
            <p className="text-xs font-semibold text-cyan-450 mt-2">
              Please{" "}
              <Link href="/auth" className="underline hover:text-cyan-400">
                sign in
              </Link>{" "}
              to perform resume analysis.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
