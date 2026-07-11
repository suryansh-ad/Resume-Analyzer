import Link from "next/link";
import Image from "next/image";
import { prisma } from "../lib/prisma.js";
import { Search, MapPin, Briefcase, Award, TrendingUp, Calendar, ArrowUpRight, FileText, Building2 } from "lucide-react";
import { CuratedMatchesPromo } from "../components/CuratedMatchesPromo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Fresherr.in - Discover Jobs, Internships & Hackathons in India",
  description: "India's best career platform for students and fresh graduates. Find entry-level software engineering jobs, internships, and hackathons in Bangalore, Pune, Gurgaon, Noida, and Hyderabad.",
  alternates: {
    canonical: "https://fresherr.in",
  },
};

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
    <div className="relative overflow-hidden bg-slate-950">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 mt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            🇮🇳 India's Career Platform for Freshers & Students
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            Discover Jobs, Internships & Hackathons in India.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
            The single launchpad Indian college graduates need to land their dream software engineering, data science, product, and tech roles.
          </p>

          {/* Universal Search Bar */}
          <form action="/jobs" method="GET" className="relative max-w-2xl mx-auto flex items-center bg-slate-900/90 border border-white/10 rounded-2xl p-2 shadow-2xl shadow-cyan-500/5 focus-within:border-cyan-500/50 transition">
            <div className="flex items-center flex-grow pl-3">
              <Search className="text-slate-400 mr-2 shrink-0" size={18} />
              <input
                type="text"
                name="search"
                placeholder="Search by role, skill, technology, or company..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Popular Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <span className="text-xs text-slate-500 self-center mr-2">Popular:</span>
            {["React", "Node.js", "Java", "Python", "Bangalore", "Remote"].map((tag) => (
              <Link
                key={tag}
                href={`/jobs?search=${tag.toLowerCase()}`}
                className="text-xs px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-300 hover:border-cyan-500/30 hover:text-white transition"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Companies */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-cyan-400" />
                Trending Companies Hiring
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Top tech employers actively hiring Indian graduates.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/jobs?search=${company.name.toLowerCase()}`}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-slate-900/30 hover:bg-slate-900/60 hover:border-cyan-500/20 transition text-center group relative overflow-hidden"
              >
                {company.logo ? (
                  <div className="h-12 w-12 relative flex items-center justify-center bg-white/5 rounded-xl p-2 mb-3">
                    <img src={company.logo} alt={company.name} className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-white/5 rounded-xl flex items-center justify-center mb-3 text-cyan-400 font-bold text-lg">
                    {company.name[0]}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition">
                  {company.name}
                </span>
                <span className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  View Jobs <ArrowUpRight size={10} />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Curated Matches Promo Section */}
        <CuratedMatchesPromo />

        {/* Jobs & Internships Split */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 mb-20">
          {/* Latest Jobs Column */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Briefcase size={20} className="text-cyan-400" />
                  Latest Entry-Level Jobs
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">Full-time opportunities with 0-2 years experience.</p>
              </div>
              <Link href="/jobs" className="text-xs font-bold text-cyan-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:bg-slate-900/40 hover:border-cyan-500/20 transition group"
                >
                  {job.company.logo ? (
                    <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                      <img src={job.company.logo} alt={job.company.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                      <Building2 size={22} className="text-cyan-400" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{job.company.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin size={12} className="text-cyan-500" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                          {job.salary}
                        </span>
                      )}
                      {job.experience && (
                        <span className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded font-medium">
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <FileText size={20} className="text-cyan-400" />
                  Featured Internships
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">Paid and remote/on-site student internships.</p>
              </div>
              <Link href="/internships" className="text-xs font-bold text-cyan-400 hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {internships.map((internship) => (
                <Link
                  key={internship.id}
                  href={`/jobs/${internship.id}`}
                  className="flex gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/20 hover:bg-slate-900/40 hover:border-cyan-500/20 transition group"
                >
                  {internship.company.logo ? (
                    <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                      <img src={internship.company.logo} alt={internship.company.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                      <Building2 size={22} className="text-cyan-400" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 flex-1">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition break-words line-clamp-2 leading-snug">
                      {internship.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">{internship.company.name}</p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin size={12} className="text-cyan-500" />
                        {internship.location}
                      </span>
                      {internship.stipend && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                          {internship.stipend}
                        </span>
                      )}
                      {internship.duration && (
                        <span className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded font-medium">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Award size={20} className="text-cyan-400" />
                Upcoming Hackathons & Contests
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Compete, learn, build portfolio, and win prize pools.</p>
            </div>
            <Link href="/hackathons" className="text-xs font-bold text-cyan-400 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="flex flex-col p-6 rounded-2xl border border-white/5 bg-slate-900/20 hover:border-cyan-500/20 transition relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {hackathon.mode}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(hackathon.deadline).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug">
                  {hackathon.name}
                </h3>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                  Organized by <strong className="text-slate-300">{hackathon.organizer}</strong>. {hackathon.description}
                </p>
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Prize Pool</span>
                    <span className="text-sm font-bold text-emerald-400">{hackathon.prizePool || "Goodies"}</span>
                  </div>
                  <a
                    href={hackathon.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-white text-slate-950 hover:bg-slate-200 transition"
                  >
                    Register
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.06),transparent_50%)]" />
          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Never miss an Indian hiring drive.</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Get weekly roundups of fresh graduate jobs, internships, off-campus announcements, and hackathons delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-grow bg-slate-950 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[10px] text-slate-500 mt-3">We respect your privacy. Unsubscribe anytime.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
