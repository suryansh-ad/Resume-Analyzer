"use client";

import { useState } from "react";
import Link from "next/link";
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, BarChart2, Star, PlusCircle, CheckCircle } from "lucide-react";
import { api } from "../lib/api.js";
import { useAuth } from "./LayoutWrapper.jsx";

export function OpportunityMatchIsland({ opportunityId }) {
  const { user, authReady } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [matchResult, setMatchResult] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setError("");
    setMatchResult(null);
    setProgress(10);

    try {
      // 1. Upload & Extract Text
      const formData = new FormData();
      formData.append("resume", selectedFile);

      setProgress(40);
      const uploadResponse = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const extractedText = uploadResponse?.data?.extractedText;
      if (!extractedText) {
        throw new Error("Could not extract text from the file.");
      }

      setProgress(70);

      // 2. Perform Matching Analysis
      const matchResponse = await fetch(`/api/jobs/${opportunityId}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: extractedText }),
      });

      if (!matchResponse.ok) {
        throw new Error("AI Matching analysis failed.");
      }

      const analysis = await matchResponse.json();
      setMatchResult(analysis);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during analysis.");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setMatchResult(null);
    setError("");
    setProgress(0);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/30 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <BarChart2 className="text-cyan-400" size={20} />
        AI Resume Matcher
      </h2>
      <p className="text-xs text-slate-400 mb-6">
        Analyze your resume against this opportunity to discover match scores, missing skills, and tailored resume optimization suggestions.
      </p>

      {!authReady ? (
        <div className="h-28 rounded-2xl bg-white/5 animate-pulse" />
      ) : !user ? (
        <div className="rounded-xl border border-white/5 bg-slate-950/50 p-6 text-center space-y-4">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-400">
            <UploadCloud size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-white">Sign In Required</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[220px] mx-auto">
              Please sign in to analyze your resume and get compatibility matches.
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 transition text-slate-950 text-xs font-bold px-4 py-2 cursor-pointer w-full shadow-md shadow-cyan-500/10"
          >
            Sign In to Unlock
          </Link>
        </div>
      ) : (
        <>
          {!file && !matchResult && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-cyan-500/30 bg-slate-950/40 hover:bg-slate-950/80 transition cursor-pointer text-center group">
              <UploadCloud className="text-slate-500 group-hover:text-cyan-400 transition mb-3" size={32} />
              <span className="text-xs font-bold text-white mb-1">Upload your resume to check compatibility</span>
              <span className="text-[10px] text-slate-500">Supports PDF, DOC, or DOCX up to 10MB</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950/40 rounded-2xl border border-white/5">
          <RefreshCw className="animate-spin text-cyan-400 mb-3" size={28} />
          <span className="text-xs font-bold text-white mb-1">Analyzing compatibility...</span>
          <span className="text-[10px] text-slate-500">{progress}% complete</span>
          <div className="w-48 bg-white/5 h-1 rounded-full overflow-hidden mt-3">
            <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 flex items-start gap-3 mb-4">
          <AlertCircle className="shrink-0 mt-0.5" size={16} />
          <div className="flex-grow">
            <p className="text-xs font-bold">Analysis Failed</p>
            <p className="text-[10px] text-red-400/80 mt-1">{error}</p>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold text-cyan-400 hover:underline mt-2 flex items-center gap-1"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Results State */}
      {matchResult && (
        <div className="space-y-6">
          {/* Main Score Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">Match Score</span>
              <span className="text-3xl font-extrabold text-cyan-400 mt-1 block">
                {matchResult.overallMatchScore}%
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Role Alignment</span>
            </div>
            
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-semibold block">ATS Readiness</span>
              <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
                {matchResult.atsCompatibilityScore}%
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">Keyword Density</span>
            </div>
          </div>

          {/* AI Feedback Summary */}
          <div className="p-4 rounded-xl bg-slate-950/30 border border-white/5">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <Star size={12} className="text-cyan-400" />
              AI Compatibility Review
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">{matchResult.overallSummary}</p>
          </div>

          {/* Missing Skills & Matching Skills */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle size={12} />
                Matching Skills ({matchResult.matchingSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1">
                {matchResult.matchingSkills?.length > 0 ? (
                  matchResult.matchingSkills.map(skill => (
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-slate-500">None detected</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <PlusCircle size={12} />
                Missing Skills ({matchResult.missingSkills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1">
                {matchResult.missingSkills?.length > 0 ? (
                  matchResult.missingSkills.map(skill => (
                    <span key={skill} className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/10">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-emerald-400">Perfect match! No skills missing.</span>
                )}
              </div>
            </div>
          </div>

          {/* Missing Keywords Table/Details */}
          {matchResult.missingKeywords && matchResult.missingKeywords.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">Required ATS Keywords Missing</h4>
              <div className="overflow-x-auto border border-white/5 rounded-xl bg-slate-950/40">
                <table className="min-w-full divide-y divide-white/5 text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 font-semibold">
                      <th className="px-4 py-2.5">Keyword</th>
                      <th className="px-4 py-2.5">Priority</th>
                      <th className="px-4 py-2.5">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-400">
                    {matchResult.missingKeywords.slice(0, 4).map((kw, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 font-bold text-slate-200">{kw.keyword}</td>
                        <td className="px-4 py-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            kw.importance === "High" ? "bg-red-500/10 text-red-400" : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {kw.importance}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-slate-500">{kw.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bullet Point Rewrites */}
          {matchResult.bulletPointRewrites && matchResult.bulletPointRewrites.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">ATS Bullet Point Optimizations</h4>
              <div className="space-y-2">
                {matchResult.bulletPointRewrites.slice(0, 2).map((rewrite, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-white/5 space-y-1.5">
                    <p className="text-[10px] text-slate-500"><strong className="text-red-400/80">Original:</strong> "{rewrite.original}"</p>
                    <p className="text-[10px] text-slate-300"><strong className="text-emerald-400">ATS Rewrite:</strong> "{rewrite.improved}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Questions topics */}
          {matchResult.interviewPrepTopics && matchResult.interviewPrepTopics.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400">Custom Interview Preparation Topics</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 text-xs">
                {matchResult.interviewPrepTopics.map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
            <span className="text-[10px] text-slate-500">Analysis logged to your profile history</span>
            <button
              onClick={handleReset}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg border border-white/10 transition"
            >
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}
