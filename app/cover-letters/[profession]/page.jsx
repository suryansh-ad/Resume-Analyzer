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
    title: `${niche.profession} Cover Letter Template | Fresherr`,
    description: `Copy our ATS-friendly ${niche.profession} cover letter template. Customize with your skills, project experience, and contact info.`,
    path: `/cover-letters/${profession}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(niches).map((key) => ({
    profession: key,
  }));
}

export default async function CoverLetterPage({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Cover Letters", path: "/cover-letters" },
    { name: niche.name, path: `/cover-letters/${profession}` },
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
              {niche.profession} Cover Letter Template
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Write a cover letter that gets noticed. Customize this ATS-compliant template to showcase your specific accomplishments and coding skills.
            </p>
          </div>

          {/* Letter Body */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 md:p-10 shadow-xl">
            <div className="mx-auto max-w-2xl border border-white/5 bg-slate-950/80 p-6 md:p-8 rounded-2xl">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300 leading-relaxed">
                {niche.coverLetter}
              </pre>
            </div>
          </div>

          {/* Strategic Writing Tips */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">How to Optimize Your Cover Letter</h3>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2 leading-relaxed">
              <li><strong>Match layout branding</strong>: Ensure that the fonts and colors on your cover letter headers match your resume format.</li>
              <li><strong>Include key projects</strong>: Use the second paragraph of your cover letter to explicitly link to coding projects or campaigns.</li>
              <li><strong>Address the hiring manager by name</strong>: Avoid general openings like &ldquo;Dear Sir/Madam&rdquo; if you can find the hiring manager's name on LinkedIn.</li>
            </ul>
          </div>

          <SeoCtaCard profession={profession} professionName={niche.name} currentHub="cover-letters" />
        </div>
      </main>
    </div>
    </>
  );
}
