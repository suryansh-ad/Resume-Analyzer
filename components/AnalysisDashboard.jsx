"use client";

import { motion } from "framer-motion";
import { BarChart3, Copy, Download, Share2 } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { downloadAnalysisPdf } from "../lib/report";
import { ScoreCard } from "./ScoreCard";
import { SkillCloud } from "./SkillCloud";

const chartColors = ["#06b6d4", "#0ea5e9", "#38bdf8", "#7dd3fc"];

function copyAnalysis(record) {
  navigator.clipboard.writeText(JSON.stringify(record.analysis, null, 2));
}

async function shareAnalysis(record) {
  const payload = {
    title: `ResumeIQ report for ${record.analysis.name || "candidate"}`,
    text: `${record.analysis.summary}\nResume Score: ${record.analysis.resumeScore}/100\nATS Score: ${record.analysis.atsScore}/100`,
  };

  if (navigator.share) {
    await navigator.share(payload);
    return;
  }

  await navigator.clipboard.writeText(payload.text);
}

export function AnalysisDashboard({ record, keyword, onKeywordChange }) {
  if (!record) {
    return null;
  }

  const filteredSkills = (record.analysis.skills || []).filter((skill) =>
    skill.toLowerCase().includes(keyword.toLowerCase())
  );

  const pieData = [
    { name: "Technical", value: record.analysis.technicalSkills?.length || 0 },
    { name: "Soft", value: record.analysis.softSkills?.length || 0 },
    { name: "Projects", value: record.analysis.projects?.length || 0 },
    { name: "Certifications", value: record.analysis.certifications?.length || 0 },
  ];
  const atsDetails = record.analysis.atsDetails || [];

  return (
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative">
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between relative z-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-cyan-400">Analysis Dashboard</p>
          <h2 className="section-title mt-3 text-white font-heading">Premium insights for {record.analysis.name || "your candidate"}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadAnalysisPdf(record)}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Download size={13} /> Download PDF
          </button>
          <button
            type="button"
            onClick={() => copyAnalysis(record)}
            className="rounded-xl border border-white/10 bg-slate-900/40 px-5 py-2.5 text-xs font-bold text-slate-300 hover:text-white transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <Copy size={13} /> Copy Analysis
          </button>
          <button
            type="button"
            onClick={() => shareAnalysis(record)}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition hover:-translate-y-0.5 cursor-pointer flex items-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            <Share2 size={13} /> Share
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4 relative z-10">
        <ScoreCard label="Resume Score" value={record.analysis.resumeScore} accent="#06b6d4" />
        <ScoreCard label="ATS Score" value={record.analysis.atsScore} accent="#0ea5e9" />
        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-5 lg:col-span-2">
          <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-heading">AI Summary</p>
          <p className="mt-4 text-xs leading-relaxed text-slate-300 font-medium">{record.analysis.summary}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] relative z-10">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
          <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
            <div>
              <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading">Skill distribution</h3>
              <p className="mt-0.5 text-[10px] text-slate-500 font-semibold">Breakdown of core profile signals</p>
            </div>
            <BarChart3 size={16} className="text-cyan-400" />
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={6}>
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading">Keyword search</h3>
          <input
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search detected skills..."
            className="mt-4 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-500/40 text-slate-200 font-semibold transition-all"
          />
          <div className="mt-4 flex flex-wrap gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {(keyword ? filteredSkills : record.analysis.skills || []).map((skill) => (
              <span key={skill} className="rounded-lg bg-slate-950 text-slate-400 px-2.5 py-1 text-xs border border-white/5 font-semibold">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] relative z-10">
        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading">ATS breakdown</h3>
          <p className="mt-0.5 text-[10px] text-slate-500 font-semibold">Deterministic scoring based on structure, keywords, and readability</p>
          <div className="mt-5 space-y-4">
            {atsDetails.map((item) => {
              const width = item.max ? Math.round((item.score / item.max) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="text-slate-500">{item.score}/{item.max}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-slate-950 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading">ATS notes</h3>
          <p className="mt-0.5 text-[10px] text-slate-500 font-semibold">Practical fixes that usually improve parsing and recruiter scanability</p>
          <ul className="mt-5 space-y-2 text-xs text-slate-300 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {(record.analysis.suggestions || []).slice(0, 6).map((item) => (
              <li key={item} className="rounded-xl bg-slate-950/50 border border-white/[0.04] px-4 py-3 leading-relaxed font-medium">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3 relative z-10">
        <SkillCloud title="Technical Skills" items={record.analysis.technicalSkills} tone="cyan" />
        <SkillCloud title="Soft Skills" items={record.analysis.softSkills} tone="amber" />
        <SkillCloud title="Missing Skills" items={record.analysis.missingSkills} tone="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 relative z-10">
        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading">Strengths</h3>
          <ul className="mt-4 space-y-2 text-xs text-slate-300">
            {(record.analysis.strengths || []).map((item) => (
              <li key={item} className="rounded-xl bg-slate-950/50 border border-white/[0.04] px-4 py-3 leading-relaxed font-medium">{item}</li>
            ))}
          </ul>
        </div>
        <div className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6">
          <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 font-heading">Suggested Improvements</h3>
          <ul className="mt-4 space-y-2 text-xs text-slate-300">
            {(record.analysis.suggestions || []).slice(0, 8).map((item) => (
              <li key={item} className="rounded-xl bg-slate-950/50 border border-white/[0.04] px-4 py-3 leading-relaxed font-medium">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4 relative z-10">
        {[
          ["Experience", record.analysis.experience],
          ["Education", record.analysis.education],
          ["Projects", (record.analysis.projects || []).join(", ")],
          ["Recommended Roles", (record.analysis.jobRoles || []).join(", ")],
        ].map(([title, value]) => (
          <div key={title} className="glass-card border-white/[0.05] bg-slate-900/15 backdrop-blur-md p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-heading">{title}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-300 font-medium">{value || "No data available."}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
