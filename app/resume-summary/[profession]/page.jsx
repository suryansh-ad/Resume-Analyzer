import { notFound } from "next/navigation";
import { Navbar } from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { SeoCtaCard } from "../../../components/SeoCtaCard";
import { niches } from "../../../lib/seo-data";
import { createMetadata } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) return {};

  return createMetadata({
    title: `${niche.profession} Resume Summary Examples | Fresherr`,
    description: `Copy high-impact resume summaries for ${niche.profession} candidates. Options for entry-level, mid-level, and senior positions.`,
    path: `/resume-summary/${profession}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(niches).map((key) => ({
    profession: key,
  }));
}

export default async function ResumeSummaryPage({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resume Summaries", path: "/resume-summary" },
    { name: niche.name, path: `/resume-summary/${profession}` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar authReady={false} />

      <main className="mx-auto flex-1 w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="space-y-6">
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {niche.profession} Resume Summary Examples
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Struggling to write your professional summary? Pick and customize these ATS-friendly summaries matching your experience level.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Entry Level */}
            <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 space-y-4">
              <div className="inline-flex rounded-lg bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                Entry Level / Fresher
              </div>
              <p className="text-sm text-slate-300 leading-relaxed min-h-[120px]">
                &ldquo;{niche.summary.entry}&rdquo;
              </p>
              <div className="text-xs text-slate-400 border-t border-white/5 pt-3">
                <strong>Best for</strong>: Graduating students, internships, and first-time job applicants.
              </div>
            </div>

            {/* Mid Level */}
            <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 space-y-4">
              <div className="inline-flex rounded-lg bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                Mid Level (3-5 Years)
              </div>
              <p className="text-sm text-slate-300 leading-relaxed min-h-[120px]">
                &ldquo;{niche.summary.mid}&rdquo;
              </p>
              <div className="text-xs text-slate-400 border-t border-white/5 pt-3">
                <strong>Best for</strong>: Professionals with continuous project history looking to step up.
              </div>
            </div>

            {/* Senior Level */}
            <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 space-y-4">
              <div className="inline-flex rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                Senior / Lead (5+ Years)
              </div>
              <p className="text-sm text-slate-300 leading-relaxed min-h-[120px]">
                &ldquo;{niche.summary.senior}&rdquo;
              </p>
              <div className="text-xs text-slate-400 border-t border-white/5 pt-3">
                <strong>Best for</strong>: Architects, team managers, and division leads.
              </div>
            </div>
          </div>

          {/* Educational Insight */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Why the Summary Section is Critical for ATS</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Recruiters spend an average of 6 seconds reviewing a resume before deciding to read further. A well-formatted professional summary immediately highlights your target role and technical keywords, signaling value to both hiring managers and automated tracking systems. Keep it under 3-4 sentences.
            </p>
          </div>

          <SeoCtaCard profession={profession} professionName={niche.name} currentHub="resume-summary" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
