import Link from "next/link";
import { Hammer, FileText, CheckSquare, Award, HelpCircle, GraduationCap, ArrowRight } from "lucide-react";

export const metadata = {
  title: "AI Career Tools | Fresherr.in",
  description: "Boost your job application success with Fresherr's AI-powered career tools. Check your ATS score, map your skills gaps, and optimize your resume.",
};

export default function ToolsHubPage() {
  const tools = [
    {
      name: "ATS Resume Checker",
      description: "Upload your resume in PDF/DOCX format to extract content, grade formatting, find key gaps, and get a realistic ATS compatibility score instantly.",
      path: "/tools/ats-resume-checker",
      icon: CheckSquare,
      status: "Live & Free",
      isLive: true
    },
    {
      name: "Resume Builder",
      description: "Create an ATS-friendly, professional resume from scratch using clean layouts and download a print-ready PDF file.",
      path: "#",
      icon: FileText,
      status: "Phase 3",
      isLive: false
    },
    {
      name: "Resume vs Job Description",
      description: "Directly compare your resume against a specific target job posting to identify matching criteria and optimize role alignment.",
      path: "#",
      icon: Award,
      status: "Phase 3",
      isLive: false
    },
    {
      name: "Skill Gap Analysis",
      description: "Analyze your profile against industry standards for roles (Software, AI/ML, DevOps) to identify missing skills and recommended training.",
      path: "#",
      icon: GraduationCap,
      status: "Phase 3",
      isLive: false
    },
    {
      name: "Interview Question Generator",
      description: "Generate personalized technical and behavioral interview preparation questions based on your actual experience and projects.",
      path: "#",
      icon: HelpCircle,
      status: "Phase 3",
      isLive: false
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex p-3 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 text-cyan-400 mb-4">
          <Hammer size={24} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          AI-Powered Career Tools
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Leverage advanced AI features to analyze your application strength, write better bullet points, and prepare for tech interviews.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <div
              key={index}
              className={`flex flex-col p-6 rounded-2xl border transition relative overflow-hidden ${
                tool.isLive
                  ? "border-white/10 bg-slate-900/10 hover:border-cyan-500/30 hover:bg-slate-900/20"
                  : "border-white/5 bg-slate-950/40 opacity-70"
              }`}
            >
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-white/5 text-slate-300 border border-white/5`}>
                  <Icon size={18} className={tool.isLive ? "text-cyan-400" : "text-slate-500"} />
                </div>
                <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                  tool.isLive 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse" 
                    : "bg-white/5 text-slate-500 border border-white/5"
                }`}>
                  {tool.status}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {tool.description}
              </p>

              {tool.isLive ? (
                <Link
                  href={tool.path}
                  className="mt-auto flex items-center justify-center gap-1.5 bg-white text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:bg-slate-200 transition"
                >
                  Open Tool <ArrowRight size={12} />
                </Link>
              ) : (
                <div className="mt-auto text-center text-[10px] text-slate-600 font-medium py-2.5 border border-dashed border-white/5 rounded-xl">
                  Available in Phase 3
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
