import { notFound } from "next/navigation";
import Script from "next/script";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { SeoCtaCard } from "../../../components/SeoCtaCard";
import { niches } from "../../../lib/seo-data";
import { createMetadata, breadcrumbJsonLd } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) return {};

  return createMetadata({
    title: `Key ${niche.profession} Skills for Resume Builder | Fresherr`,
    description: `Find technical and soft skills to list on your ${niche.profession} resume. Match keyword requirements for ATS filters.`,
    path: `/resume-skills/${profession}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(niches).map((key) => ({
    profession: key,
  }));
}

export default async function ResumeSkillsPage({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resume Skills", path: "/resume-skills" },
    { name: niche.name, path: `/resume-skills/${profession}` },
  ];

  return (
    <>
      <Script id="breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd(breadcrumbItems))}
      </Script>
      <div className="flex flex-col text-slate-100 font-sans">
      <main className="mx-auto flex-1 w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="space-y-6">
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {niche.profession} Resume Skills Checklist
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Optimize your resume's search keywords. Here are the top hard and soft skills requested by recruiters for {niche.profession} positions.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Hard / Tech Skills */}
            <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Technical / Hard Skills</h3>
              <p className="text-xs text-slate-400">These core tools and languages show your capacity to execute tasks.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {niche.skills.technical.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Soft / Behavioral Skills */}
            <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Soft / Workplace Skills</h3>
              <p className="text-xs text-slate-400">These behavioral traits show how you work in teams and manage workflows.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {niche.skills.soft.map((skill) => (
                  <div key={skill} className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-sm text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Strategic Insight */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">How to Group Skills on Your Resume</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Don't just write a single long bullet list of skills. Group them into categories (e.g., Languages, Frameworks, Databases) to make your resume easier to scan for hiring managers. This structure also ensures ATS parsers map your skills columns correctly.
            </p>
          </div>

          <SeoCtaCard profession={profession} professionName={niche.name} currentHub="resume-skills" />
        </div>
      </main>
    </div>
    </>
  );
}
