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
    title: `${niche.profession} Resume Objective Examples | Fresherr`,
    description: `Browse 10+ resume objectives and career goal statements for ${niche.profession} freshers and students.`,
    path: `/resume-objectives/${profession}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(niches).map((key) => ({
    profession: key,
  }));
}

export default async function ResumeObjectivesPage({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resume Objectives", path: "/resume-objectives" },
    { name: niche.name, path: `/resume-objectives/${profession}` },
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
              {niche.profession} Resume Objectives
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Applying for an entry-level position? Use these career objectives to declare your motivation and showcase academic strengths.
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 md:p-8 space-y-4">
            <h3 className="text-xl font-bold text-white border-b border-white/5 pb-2">Recommended Career Objectives</h3>
            <div className="space-y-4">
              <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-sm text-slate-300 leading-relaxed font-medium italic">
                &ldquo;{niche.objective}&rdquo;
              </div>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-sm text-slate-300 leading-relaxed font-medium italic">
                &ldquo;Detail-oriented candidate seeking to leverage academic projects in {niche.skills.technical.slice(0, 3).join(", ")} to deliver robust software and design assets as a junior {niche.profession}.&rdquo;
              </div>
              <div className="rounded-xl bg-white/5 border border-white/5 p-4 text-sm text-slate-300 leading-relaxed font-medium italic">
                &ldquo;Motivated team player with strong foundation in {niche.skills.soft[0]} and {niche.skills.technical[0]}. Eager to join a fast-growing team to tackle complex challenges and expand technical skills.&rdquo;
              </div>
            </div>
          </div>

          {/* Strategic Writing Tips */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Objective vs Summary: Which is Better?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              If you have 1+ years of experience, always write a <strong>Professional Summary</strong> focused on achievements. If you are a fresher or student with no formal work history, a <strong>Career Objective</strong> is suitable to state what skills you bring to the table and what job you seek. Keep it under 2 sentences.
            </p>
          </div>

          <SeoCtaCard profession={profession} professionName={niche.name} currentHub="resume-objectives" />
        </div>
      </main>
    </div>
    </>
  );
}
