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
    <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-8 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <h3 className="text-base font-semibold text-white tracking-tight">Fresherr</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              AI-powered ATS Resume Analyzer and career optimization platform for students, freshers, and job seekers in India and globally.
            </p>
            <div className="flex gap-4 text-xs">
              <a
                target="_blank"
                rel="noreferrer"
                href={siteConfig.social.instagram}
                className="hover:text-white transition"
              >
                Instagram
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href={siteConfig.social.linkedin}
                className="hover:text-white transition"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Column 2: Resume Examples */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resume Examples</h4>
            <ul className="space-y-2 text-xs">
              {popularNiches.slice(0, 5).map((niche) => (
                <li key={niche.slug}>
                  <Link href={`/resume-examples/${niche.slug}`} className="hover:text-white transition">
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
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-xs">
              {popularNiches.slice(4, 9).map((niche) => (
                <li key={niche.slug}>
                  <Link href={`/resume-summary/${niche.slug}`} className="hover:text-white transition">
                    {niche.name} Summaries
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`/resume-formats/ats-friendly-resume-templates`} className="hover:text-white transition">
                  ATS Formats
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Interview Prep & Letters */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Interview Prep</h4>
            <ul className="space-y-2 text-xs">
              {popularNiches.slice(0, 4).map((niche) => (
                <li key={niche.slug}>
                  <Link href={`/interview-prep/${niche.slug}`} className="hover:text-white transition">
                    {niche.name} Q&A
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Fresherr
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fresherr | Building India's Professional Career Launchpad.</p>
        </div>
      </div>
    </footer>
  );
}
