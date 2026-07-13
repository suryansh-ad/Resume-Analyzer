"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, Copy, Share2, Award, CheckCircle2, AlertTriangle, 
  Sparkles, BookOpen, Briefcase, Code, Lock, HelpCircle, RefreshCw,
  Lightbulb, ShieldAlert, GraduationCap, ChevronRight, ThumbsUp
} from "lucide-react";
import { downloadJdAnalysisPdf } from "../lib/report";

function copyAnalysis(record) {
  navigator.clipboard.writeText(JSON.stringify(record.analysis, null, 2));
}

async function shareAnalysis(record) {
  const payload = {
    title: `ResumeIQ JD Match Report for ${record.analysis.name || "candidate"}`,
    text: `${record.analysis.overallSummary}\nMatch Score: ${record.analysis.overallMatchScore}/100\nATS Score: ${record.analysis.atsCompatibilityScore}/100`,
  };

  if (navigator.share) {
    await navigator.share(payload);
    return;
  }

  await navigator.clipboard.writeText(payload.text);
}

function AnimatedGauge({ value, label, color, subtitle }) {
  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/10 rounded-2xl border border-white/[0.05] backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/20 transition duration-200 shadow-sm">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl rounded-full opacity-30 pointer-events-none" />
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(255, 255, 255, 0.04)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-1000 ease-out drop-shadow-[0_0_4px_rgba(6,182,212,0.25)]"
          />
        </svg>
        <span className="absolute text-2xl font-extrabold text-white tracking-tight font-heading">{value}%</span>
      </div>
      <h4 className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">{label}</h4>
      <p className="mt-1 text-[10px] text-slate-400 font-semibold text-center">{subtitle}</p>
    </div>
  );
}

export function JdAnalysisDashboard({ record }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!record) return null;

  const analysis = record.analysis;

  const handleCopyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // 10 Future Features placeholder lists
  const futureFeatures = [
    { title: "Multi-Company Comparison", desc: "Compare one resume against multiple job descriptions simultaneously." },
    { title: "Cover Letter Generator", desc: "Generate tailored cover letters matching the target job description requirements." },
    { title: "Interview Question Generator", desc: "Generate custom interview questions and mock answers based on resume gaps." },
    { title: "Skill Gap Analysis", desc: "Interactive visualization showing specific technical courses and skill trajectories." },
    { title: "Career Path Recommendations", desc: "Predict future growth trajectories, seniority timelines, and transition steps." },
    { title: "Resume Version History", desc: "Save multiple versions of your resume and track match score changes." },
    { title: "Saved Analyses Archive", desc: "Keep a history of past job applications and analyzer dashboard records." },
    { title: "Shareable Public Link", desc: "Generate a beautiful, secure public web link to share your scores with recruiters." },
    { title: "Job Recommendation Engine", desc: "Find live matching jobs matching your resume scores on partner boards." },
    { title: "AI Resume Assistant", desc: "A conversational chat bot to guide you in editing sections or write bullets in real-time." }
  ];

  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-slate-100 relative">
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-8 relative z-10">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles size={11} className="animate-pulse" /> Job Description Match Active
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-3 text-white font-heading">
            Resume Match Insights for {analysis.name || "Candidate"}
          </h2>
          <p className="text-slate-400 mt-2 text-xs font-semibold max-w-2xl leading-relaxed">
            Comparing resume structure and keywords against your provided job requirements.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadJdAnalysisPdf(record)}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Download size={13} /> Download PDF Report
          </button>
          <button
            type="button"
            onClick={() => copyAnalysis(record)}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Copy size={13} /> Copy Raw Data
          </button>
          <button
            type="button"
            onClick={() => shareAnalysis(record)}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            <Share2 size={13} /> Share Results
          </button>
        </div>
      </div>

      {/* Main score gauges */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-10">
        <AnimatedGauge 
          value={analysis.overallMatchScore} 
          label="Overall Match Score" 
          color="#06b6d4" 
          subtitle="Direct alignment with JD guidelines" 
        />
        <AnimatedGauge 
          value={analysis.atsCompatibilityScore} 
          label="ATS Compatibility" 
          color="#3b82f6" 
          subtitle="Parser readability & formatting" 
        />
        <AnimatedGauge 
          value={analysis.semanticSimilarityScore} 
          label="Semantic Similarity" 
          color="#8b5cf6" 
          subtitle="Conceptual relevance of experience" 
        />
      </div>

      {/* AI Summary and Experience Match */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2 relative z-10">
        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={14} /> AI Overall Summary
          </h3>
          <p className="mt-4 text-xs leading-relaxed text-slate-300 font-medium">
            {analysis.overallSummary}
          </p>
        </div>
        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6 relative overflow-hidden">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading flex items-center gap-2">
            <Briefcase className="text-cyan-400" size={14} /> Experience Alignment
          </h3>
          <p className="mt-4 text-xs leading-relaxed text-slate-300 font-medium">
            {analysis.experienceMatch}
          </p>
        </div>
      </div>

      {/* Interactive Tabs Menu */}
      <div className="mt-12 flex border-b border-white/[0.05] overflow-x-auto gap-2 pb-px scrollbar-none relative z-10">
        {[
          { id: "overview", label: "Skills & Keywords" },
          { id: "priority", label: "Missing Priority" },
          { id: "rewrites", label: "Bullet Rewriter" },
          { id: "sections", label: "Section Critique" },
          { id: "recommendations", label: "Learning & Projects" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer font-heading ${
              activeTab === tab.id
                ? "border-cyan-500 text-cyan-400 bg-slate-900/10"
                : "border-transparent text-slate-500 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="mt-8 relative z-10">
        
        {/* Tab 1: Skills and Keywords */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Top Keywords */}
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-slate-400 font-heading flex items-center gap-2 mb-4">
                <Code className="text-cyan-400" size={14} /> Top Keywords in JD
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.topKeywords || []).map((word) => (
                  <span key={word} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 border border-white/5 text-slate-400">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Matching Skills */}
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-slate-400 font-heading flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-emerald-400" size={14} /> Matching Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.matchingSkills || []).length > 0 ? (
                  (analysis.matchingSkills || []).map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No matching skills identified.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-slate-400 font-heading flex items-center gap-2 mb-4">
                <AlertTriangle className="text-rose-400" size={14} /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.missingSkills || []).length > 0 ? (
                  (analysis.missingSkills || []).map((skill) => (
                    <span key={skill} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 border border-rose-500/20 text-rose-455">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-500 font-semibold">Perfect overlap! No missing core skills.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Missing Priority Table */}
        {activeTab === "priority" && (
          <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-white/[0.04]">
              <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2">
                <ShieldAlert className="text-rose-400" size={16} /> Missing Keyword Priority System
              </h4>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Prioritize resume improvements based on frequency and importance of missing keywords in the job description.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.04] bg-slate-950/40 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="py-4 px-6">Keyword</th>
                    <th className="py-4 px-6">Priority Importance</th>
                    <th className="py-4 px-6">Reason / Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs text-slate-300 font-medium">
                  {(analysis.missingKeywords || []).length > 0 ? (
                    (analysis.missingKeywords || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/20 transition duration-150">
                        <td className="py-4 px-6 font-bold text-white font-heading">{item.keyword}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wide border ${
                            item.importance === "High"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/20"
                              : item.importance === "Medium"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
                              : "bg-sky-500/15 text-sky-400 border-sky-500/20"
                          }`}>
                            {item.importance}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-400 leading-relaxed max-w-md">{item.reason}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-8 px-6 text-center text-slate-500 text-xs">
                        No missing keywords found! Excellent job optimization.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Bullet Rewriter Side-by-Side */}
        {activeTab === "rewrites" && (
          <div className="space-y-6">
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2">
                <RefreshCw className="text-cyan-400" size={16} /> Side-by-Side Tailored Resume Bullet Rewriter
              </h4>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Compare these generated optimized bullets. Hover or copy to swap into your resume experience section.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {(analysis.bulletPointRewrites || []).map((item, idx) => (
                <div key={idx} className="grid grid-rows-[auto_1fr] bg-slate-900/10 border border-white/[0.05] rounded-2xl overflow-hidden hover:border-cyan-500/20 transition duration-200">
                  <div className="bg-slate-950/65 p-4 border-b border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider font-heading">
                    <span>Bullet Variant #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(item.improved, idx)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedIndex === idx ? "Copied ✓" : "Copy Improved"}
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    {/* Before card */}
                    <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 relative">
                      <span className="absolute top-3 right-3 text-[8px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20">
                        Original
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-heading">Before</p>
                      <p className="mt-2 text-xs text-slate-400 italic font-medium leading-relaxed">"{item.original}"</p>
                    </div>

                    {/* After card */}
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 relative">
                      <span className="absolute top-3 right-3 text-[8px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                        ATS-Optimized
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-450 font-heading">Improved Rewrite</p>
                      <p className="mt-2 text-xs text-slate-200 font-semibold leading-relaxed">"{item.improved}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Generic Tailored Bullets */}
            {analysis.tailoredResumeBullets && analysis.tailoredResumeBullets.length > 0 && (
              <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
                <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2 mb-4">
                  <Lightbulb className="text-amber-400" size={14} /> Additional Optimized Bullets
                </h4>
                <ul className="space-y-3">
                  {analysis.tailoredResumeBullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-3 text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-white/[0.04] font-medium">
                      <ChevronRight className="text-cyan-500 shrink-0 mt-0.5" size={14} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Section-wise analysis */}
        {activeTab === "sections" && (
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { title: "Skills Analysis", text: analysis.sectionAnalysis?.skills, icon: Code },
              { title: "Projects Review", text: analysis.sectionAnalysis?.projects, icon: BookOpen },
              { title: "Experience Critique", text: analysis.sectionAnalysis?.experience, icon: Briefcase },
              { title: "Education Feedback", text: analysis.sectionAnalysis?.education, icon: GraduationCap }
            ].map((section, idx) => {
              const Icon = section.icon;
              return (
                <div key={idx} className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
                  <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2">
                    <Icon className="text-cyan-400" size={15} /> {section.title}
                  </h4>
                  <p className="mt-3.5 text-xs leading-relaxed text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-white/[0.04] font-medium">
                    {section.text || "No feedback generated for this section."}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: Recommendations */}
        {activeTab === "recommendations" && (
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Certifications */}
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2 mb-4">
                <Award className="text-cyan-400" size={15} /> Suggested Certifications
              </h4>
              <ul className="space-y-3">
                {(analysis.suggestedCertifications || []).map((cert, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-white/[0.04] flex items-start gap-2.5 font-medium">
                    <CheckCircle2 className="text-cyan-500 shrink-0 mt-0.5" size={13} />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2 mb-4">
                <Lightbulb className="text-amber-400" size={15} /> Recommended Projects
              </h4>
              <ul className="space-y-3">
                {(analysis.projectRecommendations || []).map((proj, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-white/[0.04] flex items-start gap-2.5 font-medium">
                    <Sparkles className="text-amber-400 shrink-0 mt-0.5" size={13} />
                    <span>{proj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Prep */}
            <div className="bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6">
              <h4 className="text-xs font-bold text-white font-heading flex items-center gap-2 mb-4">
                <HelpCircle className="text-violet-400" size={15} /> Interview Prep Topics
              </h4>
              <ul className="space-y-3">
                {(analysis.interviewPrepTopics || []).map((topic, idx) => (
                  <li key={idx} className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-xl border border-white/[0.04] flex items-start gap-2.5 font-medium">
                    <BookOpen className="text-violet-400 shrink-0 mt-0.5" size={13} />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Improvements Bottom Banner */}
      <div className="mt-8 bg-slate-900/10 border border-white/[0.05] rounded-2xl p-6 relative z-10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4 font-heading">
          <ThumbsUp className="text-cyan-400" size={16} /> Direct Actions to Improve Match Score
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(analysis.suggestions || []).map((sugg, idx) => (
            <div key={idx} className="flex gap-3 text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-white/[0.04] font-medium leading-relaxed">
              <ChevronRight className="text-cyan-500 shrink-0 mt-0.5" size={14} />
              <span>{sugg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Upgrades Section (Locked Cards) */}
      <div className="mt-16 border-t border-white/[0.05] pt-16 relative z-10">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Premium Features
          </span>
          <h2 className="text-2xl font-black mt-3 text-white font-heading">Unlock Career Growth Upgrades</h2>
          <p className="text-xs text-slate-400 font-semibold mt-2">
            These features are currently locked but are coming soon to support your job search optimization.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {futureFeatures.map((feat, idx) => (
            <div key={idx} className="relative group bg-slate-950/40 border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.08] transition duration-200 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-4 right-4 text-slate-600 group-hover:text-slate-400 transition pointer-events-none">
                <Lock size={13} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200 font-heading">{feat.title}</h4>
                <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-semibold">{feat.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[9px] font-bold text-cyan-500 uppercase tracking-widest select-none">
                <span>Coming Soon</span>
                <ChevronRight size={9} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
