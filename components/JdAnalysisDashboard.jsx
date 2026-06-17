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
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-3xl border border-slate-800/80 backdrop-blur-md relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent blur-2xl rounded-full opacity-50" />
      <div className="relative flex items-center justify-center">
        <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
          <circle
            stroke="rgba(30, 41, 59, 0.4)"
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
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-3xl font-extrabold text-white tracking-tight">{value}%</span>
      </div>
      <h4 className="mt-4 text-base font-semibold text-slate-100">{label}</h4>
      <p className="mt-1 text-xs text-slate-400 text-center">{subtitle}</p>
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
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-slate-100">
      
      {/* Header bar */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles size={12} className="animate-pulse" /> Job Description Match Active
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-3 text-white">
            Resume Match Insights for {analysis.name || "Candidate"}
          </h2>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Comparing resume structure and keywords against your provided job requirements.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadJdAnalysisPdf(record)}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center gap-2"><Download size={16} /> Download PDF Report</span>
          </button>
          <button
            type="button"
            onClick={() => copyAnalysis(record)}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center gap-2"><Copy size={16} /> Copy Raw Data</span>
          </button>
          <button
            type="button"
            onClick={() => shareAnalysis(record)}
            className="rounded-2xl bg-cyan-500 hover:bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
          >
            <span className="inline-flex items-center gap-2"><Share2 size={16} /> Share Results</span>
          </button>
        </div>
      </div>

      {/* Main score gauges */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="text-cyan-400" size={18} /> AI Overall Summary
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300 font-medium">
            {analysis.overallSummary}
          </p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase className="text-cyan-400" size={18} /> Experience Alignment
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {analysis.experienceMatch}
          </p>
        </div>
      </div>

      {/* Interactive Tabs Menu */}
      <div className="mt-12 flex border-b border-slate-800 overflow-x-auto gap-2 pb-px scrollbar-none">
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
            className={`px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-cyan-500 text-cyan-400 bg-slate-900/20"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="mt-8">
        
        {/* Tab 1: Skills and Keywords */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Top Keywords */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
                <Code className="text-cyan-400" size={16} /> Top Keywords in JD
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.topKeywords || []).map((word) => (
                  <span key={word} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-800/60 border border-slate-800 text-slate-200">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Matching Skills */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-emerald-400" size={16} /> Matching Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.matchingSkills || []).length > 0 ? (
                  (analysis.matchingSkills || []).map((skill) => (
                    <span key={skill} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">No matching skills identified.</p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-slate-200 flex items-center gap-2 mb-4">
                <AlertTriangle className="text-rose-400" size={16} /> Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {(analysis.missingSkills || []).length > 0 ? (
                  (analysis.missingSkills || []).map((skill) => (
                    <span key={skill} className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">
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
          <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/60">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="text-rose-400" size={18} /> Missing Keyword Priority System
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Prioritize resume improvements based on frequency and importance of missing keywords in the job description.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Keyword</th>
                    <th className="py-4 px-6">Priority Importance</th>
                    <th className="py-4 px-6">Reason / Recommendation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
                  {(analysis.missingKeywords || []).length > 0 ? (
                    (analysis.missingKeywords || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20 transition duration-150">
                        <td className="py-4 px-6 font-bold text-white">{item.keyword}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.importance === "High"
                              ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                              : item.importance === "Medium"
                              ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                              : "bg-sky-500/15 text-sky-400 border border-sky-500/20"
                          }`}>
                            {item.importance}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 leading-relaxed max-w-md">{item.reason}</td>
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
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="text-cyan-400" size={18} /> Side-by-Side Tailored Resume Bullet Rewriter
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Compare these generated optimized bullets. Hover or copy to swap into your resume experience section.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {(analysis.bulletPointRewrites || []).map((item, idx) => (
                <div key={idx} className="grid grid-rows-[auto_1fr] bg-slate-900/20 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-slate-700 transition duration-300">
                  <div className="bg-slate-950/40 p-4 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span>Bullet Variant #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(item.improved, idx)}
                      className="text-cyan-400 hover:text-cyan-300 font-bold transition flex items-center gap-1"
                    >
                      {copiedIndex === idx ? "Copied ✓" : "Copy Improved"}
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    {/* Before card */}
                    <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 relative">
                      <span className="absolute top-3 right-3 text-[10px] font-bold text-rose-400 uppercase tracking-widest bg-rose-500/10 px-2 py-0.5 rounded-full">
                        Original
                      </span>
                      <p className="text-xs font-semibold text-rose-300">Before</p>
                      <p className="mt-2 text-sm text-slate-300 italic">"{item.original}"</p>
                    </div>

                    {/* After card */}
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative">
                      <span className="absolute top-3 right-3 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        ATS-Optimized
                      </span>
                      <p className="text-xs font-semibold text-emerald-300">Improved Rewrite</p>
                      <p className="mt-2 text-sm text-slate-100 font-medium">"{item.improved}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Generic Tailored Bullets */}
            {analysis.tailoredResumeBullets && analysis.tailoredResumeBullets.length > 0 && (
              <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
                <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                  <Lightbulb className="text-amber-400" size={16} /> Additional Optimized Bullets
                </h4>
                <ul className="space-y-3">
                  {analysis.tailoredResumeBullets.map((bullet, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-4 rounded-2xl border border-slate-800/60">
                      <ChevronRight className="text-cyan-500 shrink-0 mt-0.5" size={16} />
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
                <div key={idx} className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
                  <h4 className="text-base font-bold text-white flex items-center gap-2.5">
                    <Icon className="text-cyan-400" size={18} /> {section.title}
                  </h4>
                  <p className="mt-3.5 text-sm leading-7 text-slate-300 bg-slate-950/20 p-4 rounded-2xl border border-slate-800/60">
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
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Award className="text-cyan-400" size={18} /> Suggested Certifications
              </h4>
              <ul className="space-y-3">
                {(analysis.suggestedCertifications || []).map((cert, idx) => (
                  <li key={idx} className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3.5 rounded-2xl border border-slate-800/60 flex items-start gap-2.5">
                    <CheckCircle2 className="text-cyan-500 shrink-0 mt-0.5" size={15} />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Projects */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <Lightbulb className="text-amber-400" size={18} /> Recommended Projects
              </h4>
              <ul className="space-y-3">
                {(analysis.projectRecommendations || []).map((proj, idx) => (
                  <li key={idx} className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3.5 rounded-2xl border border-slate-800/60 flex items-start gap-2.5">
                    <Sparkles className="text-amber-400 shrink-0 mt-0.5" size={15} />
                    <span>{proj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interview Prep */}
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-3xl p-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2 mb-4">
                <HelpCircle className="text-violet-400" size={18} /> Interview Prep Topics
              </h4>
              <ul className="space-y-3">
                {(analysis.interviewPrepTopics || []).map((topic, idx) => (
                  <li key={idx} className="text-sm text-slate-300 leading-relaxed bg-slate-950/20 p-3.5 rounded-2xl border border-slate-800/60 flex items-start gap-2.5">
                    <BookOpen className="text-violet-400 shrink-0 mt-0.5" size={15} />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Improvements Bottom Banner */}
      <div className="mt-8 bg-slate-900/20 border border-slate-800 rounded-3xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <ThumbsUp className="text-cyan-400" size={18} /> Direct Actions to Improve Match Score
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {(analysis.suggestions || []).map((sugg, idx) => (
            <div key={idx} className="flex gap-3 text-sm text-slate-300 bg-slate-950/30 p-4 rounded-2xl border border-slate-850">
              <ChevronRight className="text-cyan-500 shrink-0 mt-0.5" size={16} />
              <span>{sugg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future Upgrades Section (Locked Cards) */}
      <div className="mt-16 border-t border-slate-800 pt-16">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Premium Features
          </span>
          <h2 className="text-2xl font-black mt-3 text-white">Unlock Career Growth Upgrades</h2>
          <p className="text-xs text-slate-400 mt-2">
            These features are currently locked but are coming soon to support your job search optimization.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {futureFeatures.map((feat, idx) => (
            <div key={idx} className="relative group bg-slate-950/40 border border-slate-900/60 rounded-3xl p-5 hover:border-slate-800/80 transition duration-300 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-4 right-4 text-slate-600 group-hover:text-slate-400 transition">
                <Lock size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200">{feat.title}</h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
              <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-cyan-500 uppercase tracking-wider">
                <span>Coming Soon</span>
                <ChevronRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
