import Link from "next/link";
import { siteConfig } from "../lib/site";

export function Footer() {
  const popularNiches = [
    { name: "Software Engineer", slug: "software-engineer" },
    { name: "Java Developer", slug: "java-developer" },
    { name: "Python Developer", slug: "python-developer" },
    { name: "Web Developer", slug: "web-developer" },
    { name: "Data Analyst", slug: "data-analyst" },
    { name: "Data Scientist", slug: "data-scientist" },
    { name: "Marketing Specialist", slug: "marketing-specialist" },
    { name: "Business Analyst", slug: "business-analyst" },
    { name: "Fresher / Student", slug: "fresher-student" }
  ];

  return (
    <footer className="border-t border-white/[0.06] bg-slate-950/80 backdrop-blur-md pt-16 pb-12 text-slate-400 relative overflow-hidden">
      {/* Subtle bottom gradient glow */}
      <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-md font-bold text-white tracking-tight font-heading">
              Fresherr<span className="text-cyan-400">.in</span>
            </h3>
            <p className="text-xs leading-relaxed text-slate-400 font-medium">
              AI-powered ATS Resume Analyzer and career optimization platform for students, freshers, and job seekers in India and globally.
            </p>
            <div className="flex gap-4 text-xs font-semibold">
              <a
                target="_blank"
                rel="noreferrer"
                href={siteConfig.social.instagram}
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-200"
              >
                Instagram
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href={siteConfig.social.linkedin}
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-200"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 2: Resume Examples */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">Resume Examples</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {popularNiches.slice(0, 5).map((niche) => (
                <li key={niche.slug}>
                  <Link href={`/resume-examples/${niche.slug}`} className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                    {niche.name} Resumes
                  </Link>
                </li>
              ))}
              <li>
                <span className="text-slate-600">More roles coming soon</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Summaries & Objectives */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">Resources</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {popularNiches.slice(4, 9).map((niche) => (
                <li key={niche.slug}>
                  <Link href={`/resume-summary/${niche.slug}`} className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                    {niche.name} Summaries
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/resume-formats/ats-friendly-resume-templates`} className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  ATS Formats
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Interview Prep & Letters */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-heading">Interview Prep</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {popularNiches.slice(0, 4).map((niche) => (
                <li key={niche.slug}>
                  <Link href={`/interview-prep/${niche.slug}`} className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                    {niche.name} Q&A
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about" className="text-slate-400 hover:text-cyan-400 transition-colors duration-200">
                  About Fresherr
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/[0.04] pt-8 text-center text-xs text-slate-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Fresherr | Building India's Professional Career Launchpad.</p>
        </div>
      </div>
    </footer>
  );
}
