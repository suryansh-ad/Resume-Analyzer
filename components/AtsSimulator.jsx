"use client";

import { useState, useEffect } from "react";
import { Sparkles, Plus, Check, Award, Cpu, Layers } from "lucide-react";

const rolesData = {
  "Frontend Developer": {
    baseScore: 50,
    keywords: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Redux Toolkit"],
    critiques: {
      initial: "ATS Warning: Core frontend libraries and type safety annotations are missing.",
      partial: "Improving: Essential frameworks added. Include testing libraries for >85.",
      optimized: "Optimized! Strong match for modern Web applications."
    }
  },
  "Backend Developer": {
    baseScore: 45,
    keywords: ["Node.js", "PostgreSQL", "Docker", "Redis", "REST APIs"],
    critiques: {
      initial: "ATS Warning: Database design and containerization keywords are absent.",
      partial: "Improving: Server runtime and databases matches verified.",
      optimized: "Optimized! Scalable systems stack successfully mapped."
    }
  },
  "Data Scientist": {
    baseScore: 40,
    keywords: ["Python", "Pandas", "SQL", "Scikit-Learn", "Machine Learning"],
    critiques: {
      initial: "ATS Warning: Data querying and algorithmic modeling packages are not detected.",
      partial: "Improving: Basic data manipulation framework keywords added.",
      optimized: "Optimized! Statistical analysis and predictive modeling matched."
    }
  }
};

export function AtsSimulator() {
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [score, setScore] = useState(50);

  const roleInfo = rolesData[selectedRole];

  // Reset selected keywords when role changes
  useEffect(() => {
    setActiveKeywords([]);
    setScore(rolesData[selectedRole].baseScore);
  }, [selectedRole]);

  const toggleKeyword = (kw) => {
    let nextKeywords;
    if (activeKeywords.includes(kw)) {
      nextKeywords = activeKeywords.filter((k) => k !== kw);
    } else {
      nextKeywords = [...activeKeywords, kw];
    }
    setActiveKeywords(nextKeywords);
    
    // Calculate new score
    const addedPoints = nextKeywords.length * 10;
    setScore(roleInfo.baseScore + addedPoints);
  };

  // Determine feedback text
  let feedback = roleInfo.critiques.initial;
  if (activeKeywords.length > 0 && activeKeywords.length < roleInfo.keywords.length) {
    feedback = roleInfo.critiques.partial;
  } else if (activeKeywords.length === roleInfo.keywords.length) {
    feedback = roleInfo.critiques.optimized;
  }

  // Circular gauge calculations
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (score / 100) * circumference;

  // Determine score color
  let scoreColor = "#ef4444"; // red
  if (score >= 80) scoreColor = "#10b981"; // green
  else if (score >= 65) scoreColor = "#06b6d4"; // cyan
  else if (score >= 50) scoreColor = "#f59e0b"; // amber

  return (
    <div className="glass-card p-8 border-white/[0.05] bg-slate-900/10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between h-full before:absolute before:top-0 before:left-6 before:right-6 before:h-[2px] before:bg-gradient-to-r before:from-cyan-500 before:to-indigo-500 before:shadow-[0_1px_8px_rgba(6,182,212,0.35)]">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/[0.01] blur-3xl pointer-events-none" />
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
            <Cpu size={12} className="animate-pulse" />
            ATS Optimizer Sandbox
          </div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Interactive Sim</span>
        </div>

        <h3 className="text-base font-bold text-white mb-2 font-heading">ATS Score Simulation</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
          Select a role and click missing keywords below to simulate how tailoring your resume elevates your score from warning zones to interview-ready status.
        </p>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 rounded-xl bg-slate-950 p-1 border border-white/[0.04] mb-6 text-xs font-bold">
          {Object.keys(rolesData).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`py-2 rounded-lg text-center transition cursor-pointer select-none ${
                selectedRole === role
                  ? "bg-cyan-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {role.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Dynamic Keywords Selection */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Add Missing Keywords</p>
          <div className="flex flex-wrap gap-2.5">
            {roleInfo.keywords.map((kw) => {
              const isSelected = activeKeywords.includes(kw);
              return (
                <button
                  key={kw}
                  onClick={() => toggleKeyword(kw)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                      : "bg-slate-950 border-white/5 text-slate-400 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {isSelected ? <Check size={11} className="shrink-0" /> : <Plus size={11} className="shrink-0" />}
                  <span>{kw}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score Panel & Feedback Card */}
      <div className="mt-4 pt-4 border-t border-white/[0.04] flex flex-col sm:flex-row items-center gap-6 bg-slate-950/40 p-5 rounded-xl border border-white/[0.04]">
        {/* Dynamic Circular Gauge */}
        <div className="h-20 w-20 shrink-0 relative flex items-center justify-center">
          <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke={scoreColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 0.35s ease, stroke 0.35s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-extrabold text-white font-heading">{score}</span>
            <span className="text-[9px] text-slate-500 font-bold uppercase -mt-0.5">Score</span>
          </div>
        </div>

        {/* Dynamic Critique text */}
        <div className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: scoreColor }}>
            <Sparkles size={11} />
            {score >= 80 ? "Optimized Fit" : score >= 65 ? "Good Match" : "ATS Risk"}
          </span>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed transition-all duration-200">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
}
