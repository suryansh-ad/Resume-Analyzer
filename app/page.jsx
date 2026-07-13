import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { prisma } from "../lib/prisma.js";
import { Search, MapPin, Briefcase, Award, TrendingUp, Calendar, ArrowUpRight, FileText, Building2, Sparkles, Code, Cpu, Target } from "lucide-react";
import { CuratedMatchesPromo } from "../components/CuratedMatchesPromo";
import { AtsSimulator } from "../components/AtsSimulator";
import { createMetadata, breadcrumbJsonLd } from "../lib/seo";

export const revalidate = 60; // Revalidate page content at most every 60 seconds

export const metadata = createMetadata({
  title: "Fresherr.in - Discover Jobs, Internships & Hackathons in India",
  description: "India's best career platform for students and fresh graduates. Find entry-level software engineering jobs, internships, and hackathons in Bangalore, Pune, Gurgaon, Noida, and Hyderabad.",
  path: "/",
});

export default async function HomePage() {
  // Fetch trending/latest opportunities on server side
  const [jobs, internships, hackathons, companies] = await Promise.all([
    prisma.job.findMany({
      where: { isApproved: true },
      take: 6,
      include: { company: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.internship.findMany({
      where: { isApproved: true },
      take: 6,
      include: { company: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.hackathon.findMany({
      where: { isApproved: true },
      take: 3,
      orderBy: { deadline: "asc" },
    }),
    prisma.company.findMany({
      where: { isTrending: true },
      take: 6,
    }),
  ]);

  return (
    <>
      <Script id="homepage-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
          ])
        )}
      </Script>
      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Dynamic Glowing Mesh Gradients */}
      <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.03] blur-3xl pointer-events-none dark:block" />
      <div className="absolute top-40 right-1/4 h-[500px] w-[500px] rounded-full bg-indigo-500/[0.02] blur-3xl pointer-events-none dark:block" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200/20 via-slate-50 to-slate-50 dark:from-slate-900/20 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-6 pb-20 sm:px-6 lg:px-8">
        
        {/* Creative 2-Column Hero Area */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center mb-24">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200/80 bg-white text-[9px] font-bold text-slate-500 uppercase tracking-widest dark:border-white/[0.06] dark:bg-slate-900/40 dark:text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></span>
              India's Career Hub for Tech Grads
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-heading">
              Launch your tech career with <span className="bg-gradient-to-r from-cyan-500 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">AI Intelligence</span>.
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl font-medium">
              Optimize your ATS resume score, unlock tailored jobs & internships, and stand out in hiring campaigns using smart keyword mapping.
            </p>

            {/* Universal Search Bar */}
            <form action="/jobs" method="GET" className="relative max-w-xl flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-md focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/10 dark:bg-slate-900/30 dark:border-white/[0.08] dark:shadow-xl dark:shadow-black/40 dark:focus-within:border-cyan-500/40 dark:focus-within:ring-cyan-500/20 transition-all duration-300">
              <div className="flex items-center flex-grow pl-3">
                <Search className="text-slate-400 mr-2 shrink-0" size={15} />
                <input
                  type="text"
                  name="search"
                  placeholder="Search by role, skill, technology, or company..."
                  className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none py-2 font-semibold"
                />
              </div>
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5"
              >
                Search
              </button>
            </form>

            {/* Popular Categories */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mr-1">Popular:</span>
              {["React", "Node.js", "Java", "Python", "Bangalore", "Remote"].map((tag) => (
                <Link
                  key={tag}
                  href={`/jobs?search=${tag.toLowerCase()}`}
                  prefetch={false}
                  className="text-[10px] font-bold px-3 py-1 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:border-cyan-500/50 hover:text-cyan-500 transition-all duration-200 dark:border-white/[0.04] dark:bg-slate-900/20 dark:text-slate-400 dark:hover:border-cyan-500/30 dark:hover:text-cyan-400"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Interactive ATS Sandbox Widget */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-20 blur-lg pointer-events-none" />
            <div className="relative">
              <AtsSimulator />
            </div>
          </div>
        </div>

        {/* Bento Grid Features Layout */}
        <section className="mb-24">
          <div className="mb-8 text-center max-w-xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-heading">
              The AI Career Suite
            </h2>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Next-gen utilities built to optimize your off-campus placement journey.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Bento Card 1: ATS Scoring */}
            <div className="glass-card p-8 border-white/[0.05] bg-slate-900/10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-200 group">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 shrink-0">
                <Code size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-2">ATS Scanner</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Scan your resume structure against any description. Map structural defects, missing libraries, and layout errors in 5 seconds.
                </p>
              </div>
              <Link href="/tools/ats-resume-checker" className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-widest mt-6 hover:text-cyan-300 transition">
                <span>Start Scanner</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Bento Card 2: Career matches */}
            <div className="glass-card p-8 border-white/[0.05] bg-slate-900/10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-200 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-450 flex items-center justify-center mb-5 shrink-0">
                <Target size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-2">Smart Opportunity Matching</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Connect details extracted from your profile directly to active entries in software development, machine learning, and systems roles.
                </p>
              </div>
              <Link href="/matches" className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-450 uppercase tracking-widest mt-6 hover:text-emerald-400 transition">
                <span>View matches</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Bento Card 3: Resources */}
            <div className="glass-card p-8 border-white/[0.05] bg-slate-900/10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-violet-500/20 transition-all duration-200 group">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-5 shrink-0">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading mb-2">AI Prep Suite</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Generate profession-specific cover letters, custom interview prep question banks, and explore clean resume summaries and objectives.
                </p>
              </div>
              <Link href="/tools" className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-400 uppercase tracking-widest mt-6 hover:text-violet-300 transition">
                <span>Explore Tools</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* Trending Companies */}
        <section className="mb-24">
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-heading">
              Trending Companies
            </h2>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">Tech employers actively hiring Indian graduates.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/jobs?search=${company.name.toLowerCase()}`}
                prefetch={false}
                className="glass-card glass-card-hover flex items-center gap-4 p-5 border-white/[0.05] group"
              >
                {company.logo ? (
                  <div className="h-12 w-12 relative flex items-center justify-center bg-slate-950 rounded-xl p-1.5 border border-white/[0.05] group-hover:border-cyan-500/20 transition duration-300 shrink-0">
                    <img src={company.logo} alt={company.name} className="max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition duration-200" />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-slate-950 border border-white/[0.05] rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition duration-300 shrink-0">
                    {company.name[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white truncate block transition duration-200">
                    {company.name}
                  </span>
                  <span className="text-xs text-slate-600 font-bold group-hover:text-cyan-400 transition duration-200 flex items-center gap-0.5 mt-0.5">
                    Jobs <ArrowUpRight size={10} className="text-slate-600 group-hover:text-cyan-400 transition shrink-0" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* Curated Matches Promo Section */}
        <CuratedMatchesPromo />

        {/* Jobs & Internships Split */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {/* Latest Jobs Column */}
          <section>
            <div className="flex items-end justify-between mb-6 pb-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-heading">
                  Latest Jobs
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Full-time opportunities for fresh graduates.</p>
              </div>
              <Link href="/jobs" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  prefetch={false}
                  className="relative flex gap-5 p-5 md:p-6 rounded-2xl border border-white/[0.05] bg-slate-900/15 backdrop-blur-sm hover:bg-slate-900/40 hover:border-cyan-500/25 transition-all duration-200 group shadow-sm hover:-translate-y-0.5 pl-8 md:pl-10 before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[4px] before:rounded-r before:bg-cyan-500/30 group-hover:before:bg-cyan-400 group-hover:before:shadow-[0_0_8px_rgba(34,211,238,0.5)] before:transition-all"
                >
                  {job.company.logo ? (
                    <div className="h-12 w-12 relative bg-slate-950/80 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-white/[0.04] transition group-hover:border-cyan-500/20">
                      <img src={job.company.logo} alt={job.company.name} className="max-h-full max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-200" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 bg-slate-950/80 border border-white/[0.04] rounded-xl flex items-center justify-center shrink-0 text-slate-400 font-bold text-sm group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition duration-200">
                      {job.company.name[0]}
                    </div>
                  )}
                  <div className="flex-grow min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-1 leading-snug font-heading">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">{job.company.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2.5">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold tracking-wide">
                        <MapPin size={12} className="text-cyan-500 shrink-0" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="text-xs px-2.5 py-1 rounded-lg border border-white/[0.05] bg-slate-950/40 text-slate-300 font-bold">
                          {job.salary}
                        </span>
                      )}
                      {job.experience && (
                        <span className="text-xs text-slate-400 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-white/[0.05] font-bold">
                          {job.experience}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Featured Internships Column */}
          <section>
            <div className="flex items-end justify-between mb-6 pb-3 border-b border-white/[0.06]">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-heading">
                  Featured Internships
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Paid student internships and training programs.</p>
              </div>
              <Link href="/internships" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {internships.map((internship) => (
                <Link
                  key={internship.id}
                  href={`/jobs/${internship.id}`}
                  prefetch={false}
                  className="relative flex gap-5 p-5 md:p-6 rounded-2xl border border-white/[0.05] bg-slate-900/15 backdrop-blur-sm hover:bg-slate-900/40 hover:border-cyan-500/25 transition-all duration-200 group shadow-sm hover:-translate-y-0.5 pl-8 md:pl-10 before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[4px] before:rounded-r before:bg-emerald-500/30 group-hover:before:bg-emerald-400 group-hover:before:shadow-[0_0_8px_rgba(52,211,153,0.5)] before:transition-all"
                >
                  {internship.company.logo ? (
                    <div className="h-12 w-12 relative bg-slate-950 rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-white/[0.04] transition group-hover:border-cyan-500/20">
                      <img src={internship.company.logo} alt={internship.company.name} className="max-h-full max-w-full object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition duration-200" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 bg-slate-950 border border-white/[0.04] rounded-xl flex items-center justify-center shrink-0 text-slate-400 font-bold text-sm group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition duration-200">
                      {internship.company.name[0]}
                    </div>
                  )}
                  <div className="flex-grow min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-1 leading-snug font-heading">
                      {internship.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">{internship.company.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2.5">
                      <span className="flex items-center gap-1.5 text-xs text-slate-400 font-bold tracking-wide">
                        <MapPin size={12} className="text-cyan-500 shrink-0" />
                        {internship.location}
                      </span>
                      {internship.stipend && (
                        <span className="text-xs px-2.5 py-1 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-emerald-450 font-bold">
                          {internship.stipend}
                        </span>
                      )}
                      {internship.duration && (
                        <span className="text-xs text-slate-400 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-white/[0.05] font-bold">
                          {internship.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Latest Hackathons */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-6 pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 font-heading">
                Upcoming Hackathons & Contests
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium font-sans">Build portfolios, compete, and win prize pools.</p>
            </div>
            <Link href="/hackathons" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors">
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="relative flex flex-col p-7 rounded-2xl border border-white/[0.05] bg-slate-900/15 backdrop-blur-sm hover:border-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5 group pl-9 before:absolute before:left-0 before:top-5 before:bottom-5 before:w-[4px] before:rounded-r before:bg-violet-500/30 group-hover:before:bg-violet-400 group-hover:before:shadow-[0_0_8px_rgba(139,92,246,0.5)] before:transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                    {hackathon.mode}
                  </span>
                  <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                    <Calendar size={13} className="text-slate-600" />
                    {new Date(hackathon.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug font-heading group-hover:text-cyan-400 transition duration-200">
                  {hackathon.name}
                </h3>
                <p className="text-xs text-slate-400 mb-6 line-clamp-2 leading-relaxed font-medium">
                  Organized by <strong className="text-slate-300 font-bold">{hackathon.organizer}</strong>. {hackathon.description}
                </p>
                <div className="mt-auto pt-4 border-t border-white/[0.04] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-extrabold tracking-wide">Prize Pool</span>
                    <span className="text-sm font-bold text-emerald-450">{hackathon.prizePool || "Goodies"}</span>
                  </div>
                  <a
                    href={hackathon.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold px-6 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-slate-300 hover:bg-cyan-500 hover:border-cyan-500 hover:text-slate-950 transition duration-205 cursor-pointer"
                  >
                    Register
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="glass-card p-10 sm:p-14 text-center relative overflow-hidden border-white/[0.06] bg-slate-900/10 backdrop-blur-md shadow-xl">
          {/* Subtle inside glow */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3.5 font-heading">Never miss a hiring drive.</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">
              Get a weekly roundup of fresh graduate jobs, internships, off-campus announcements, and hackathons delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-grow bg-slate-950/80 border border-white/10 rounded-xl px-5 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all duration-300 font-medium"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm px-7 py-3 rounded-xl transition-all duration-205 cursor-pointer shadow-lg shadow-cyan-500/15 hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[11px] text-slate-600 mt-4 font-semibold">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
