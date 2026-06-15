"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, FileText } from "lucide-react";

export function SeoCtaCard({ profession, professionName, currentHub }) {
  const hubs = [
    { name: "Resume Examples", path: `/resume-examples/${profession}`, hub: "resume-examples" },
    { name: "Resume Summaries", path: `/resume-summary/${profession}`, hub: "resume-summary" },
    { name: "Resume Skills", path: `/resume-skills/${profession}`, hub: "resume-skills" },
    { name: "Resume Objectives", path: `/resume-objectives/${profession}`, hub: "resume-objectives" },
    { name: "Cover Letters", path: `/cover-letters/${profession}`, hub: "cover-letters" },
    { name: "Interview Questions", path: `/interview-prep/${profession}`, hub: "interview-prep" }
  ];

  const siblingHubs = hubs.filter((h) => h.hub !== currentHub);

  return (
    <div className="mt-12 rounded-3xl border border-white/10 bg-slate-900/60 p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-purple-500/5">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        {/* Core Tool CTA */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1 text-xs font-semibold text-purple-300">
            <Sparkles size={12} />
            AI Resume Analyzer
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Is your {professionName} resume ATS-compatible?
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Upload your resume to our AI-powered ATS resume checker. Get an instant score, scan for missing skills, and unlock improvement suggestions.
          </p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Full ATS score breakdown (100% free)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Scan compatibility against any Job Description</span>
            </div>
          </div>
          <Link
            href="/#analyzer"
            className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition hover:-translate-y-0.5 hover:bg-purple-500"
          >
            Scan Resume Now
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Silod Sibling Links */}
        <div className="border-t border-white/5 pt-6 md:border-t-0 md:border-l md:border-white/5 md:pl-8 md:pt-0">
          <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            More {professionName} Resources
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {siblingHubs.map((sibling) => (
              <Link
                key={sibling.hub}
                href={sibling.path}
                className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm text-slate-300 transition hover:border-purple-500/30 hover:bg-purple-500/5 hover:text-white"
              >
                <FileText size={16} className="text-purple-400 group-hover:scale-110 transition" />
                <span className="font-medium truncate">{sibling.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
