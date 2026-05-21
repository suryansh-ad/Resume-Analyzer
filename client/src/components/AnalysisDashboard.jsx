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
    <section id="dashboard" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Analysis Dashboard</p>
          <h2 className="section-title mt-3">Premium insights for {record.analysis.name || "your candidate"}</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadAnalysisPdf(record)}
            className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <span className="inline-flex items-center gap-2"><Download size={16} /> Download PDF</span>
          </button>
          <button
            type="button"
            onClick={() => copyAnalysis(record)}
            className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <span className="inline-flex items-center gap-2"><Copy size={16} /> Copy Analysis</span>
          </button>
          <button
            type="button"
            onClick={() => shareAnalysis(record)}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          >
            <span className="inline-flex items-center gap-2"><Share2 size={16} /> Share</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <ScoreCard label="Resume Score" value={record.analysis.resumeScore} accent="#06b6d4" />
        <ScoreCard label="ATS Score" value={record.analysis.atsScore} accent="#0ea5e9" />
        <div className="glass-card p-5 lg:col-span-2">
          <p className="text-sm text-slate-500 dark:text-slate-400">AI Summary</p>
          <p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-200">{record.analysis.summary}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Skill distribution</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Breakdown of core profile signals</p>
            </div>
            <BarChart3 className="text-cyan-500" />
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

        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-6">
          <h3 className="text-lg font-semibold">Keyword search</h3>
          <input
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Search detected skills"
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-cyan-500 dark:border-slate-800 dark:bg-slate-900/70"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            {(keyword ? filteredSkills : record.analysis.skills || []).map((skill) => (
              <span key={skill} className="rounded-full bg-slate-950 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-950">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold">ATS breakdown</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Deterministic scoring based on structure, keywords, and readability</p>
          <div className="mt-5 space-y-4">
            {atsDetails.map((item) => {
              const width = item.max ? Math.round((item.score / item.max) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-slate-500 dark:text-slate-400">{item.score}/{item.max}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold">ATS notes</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Practical fixes that usually improve parsing and recruiter scanability</p>
          <ul className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {(record.analysis.suggestions || []).slice(0, 6).map((item) => (
              <li key={item} className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-slate-900/50">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <SkillCloud title="Technical Skills" items={record.analysis.technicalSkills} tone="cyan" />
        <SkillCloud title="Soft Skills" items={record.analysis.softSkills} tone="amber" />
        <SkillCloud title="Missing Skills" items={record.analysis.missingSkills} tone="rose" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold">Strengths</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {(record.analysis.strengths || []).map((item) => (
              <li key={item} className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-slate-900/50">{item}</li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold">Suggested Improvements</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            {(record.analysis.suggestions || []).slice(0, 8).map((item) => (
              <li key={item} className="rounded-2xl bg-white/60 px-4 py-3 dark:bg-slate-900/50">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {[
          ["Experience", record.analysis.experience],
          ["Education", record.analysis.education],
          ["Projects", (record.analysis.projects || []).join(", ")],
          ["Recommended Roles", (record.analysis.jobRoles || []).join(", ")],
        ].map(([title, value]) => (
          <div key={title} className="glass-card p-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{value || "No data available."}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
