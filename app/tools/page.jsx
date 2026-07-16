import Link from "next/link";
import Script from "next/script";
import { Hammer, FileText, CheckSquare, Award, HelpCircle, GraduationCap, ArrowRight, Sparkles } from "lucide-react";
import { createMetadata, breadcrumbJsonLd } from "../../lib/seo";

export const metadata = createMetadata({
  title: "AI Career Tools | Fresherr.in",
  description: "Boost your job application success with Fresherr's AI-powered career tools. Check your ATS score, map your skills gaps, and optimize your resume.",
  path: "/tools",
});

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
      name: "Smart Opportunity Matching",
      description: "Skip scanning endless generic listings. Upload your resume or specify your skills to instantly see relevant entry-level positions in tech matching your capabilities.",
      path: "/matches",
      icon: Sparkles,
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
    <>
      <Script id="tools-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
          ])
        )}
      </Script>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/[0.02] blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="mb-12 text-center max-w-2xl mx-auto relative z-10">
        <div className="inline-flex p-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 mb-4 animate-pulse-soft">
          <Hammer size={22} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-heading">
          AI-Powered <span className="bg-gradient-to-r from-cyan-400 to-teal-300 bg-clip-text text-transparent">Career Tools</span>
        </h1>
        <p className="text-xs text-slate-400 mt-2.5 font-medium">
          Leverage advanced AI features to analyze your application strength, write better bullet points, and prepare for tech interviews.
        </p>
      </div>

      {/* Grid of Tools */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <div
              key={index}
              className={`flex flex-col p-6 rounded-2xl border transition relative overflow-hidden ${
                tool.isLive
                  ? "border-white/[0.05] bg-slate-900/15 backdrop-blur-sm hover:border-cyan-500/25 hover:bg-slate-900/35 hover:-translate-y-0.5 group shadow-sm hover:shadow-cyan-500/[0.01]"
                  : "border-white/5 bg-slate-950/20 opacity-60"
              }`}
            >
              {/* Top Banner Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl bg-slate-950 border border-white/[0.05] group-hover:border-cyan-500/20 transition duration-300`}>
                  <Icon size={16} className={tool.isLive ? "text-cyan-400" : "text-slate-500"} />
                </div>
                <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-lg border ${
                  tool.isLive 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                    : "bg-slate-950 text-slate-500 border-white/5"
                }`}>
                  {tool.status}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mb-2 leading-snug font-heading group-hover:text-cyan-400 transition duration-200">
                {tool.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                {tool.description}
              </p>

              {tool.isLive ? (
                <Link
                  href={tool.path}
                  className="mt-auto flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl transition shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5 cursor-pointer"
                >
                  Open Tool <ArrowRight size={12} />
                </Link>
              ) : (
                <div className="mt-auto text-center text-[9px] uppercase tracking-wide text-slate-500 font-bold py-2.5 border border-dashed border-white/5 bg-slate-950/30 rounded-xl select-none">
                  Available in Phase 3
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </>
  );
}
