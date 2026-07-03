import { notFound } from "next/navigation";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { SeoCtaCard } from "../../../components/SeoCtaCard";
import { niches } from "../../../lib/seo-data";
import { createMetadata } from "../../../lib/seo";

export async function generateMetadata({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) return {};

  return createMetadata({
    title: `${niche.profession} Resume Examples & Template Guide | Fresherr`,
    description: `Download ATS-friendly ${niche.profession} resume templates. Review bullet points, framework examples, and placement tips.`,
    path: `/resume-examples/${profession}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(niches).map((key) => ({
    profession: key,
  }));
}

export default async function ResumeExamplePage({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Resume Examples", path: "/resume-examples" },
    { name: niche.name, path: `/resume-examples/${profession}` },
  ];

  return (
    <div className="flex flex-col text-slate-100 font-sans">
      <main className="mx-auto flex-1 w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="space-y-6">
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              ATS-Optimized {niche.profession} Resume Example
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              A recruiter-approved, parser-tested resume format designed for {niche.profession} positions. Learn how to highlight technical credentials and projects.
            </p>
          </div>

          {/* Resume Blueprint Mockup */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 md:p-10 shadow-xl backdrop-blur-sm">
            <div className="mx-auto max-w-3xl space-y-6 border border-white/5 bg-slate-950/80 p-6 md:p-8 rounded-2xl">
              {/* Header */}
              <div className="text-center border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold tracking-tight text-white">[Your Full Name]</h2>
                <p className="text-sm text-purple-400 font-medium mt-1">{niche.profession}</p>
                <p className="text-xs text-slate-400 mt-2">
                  Email: candidate@fresherr.in | Location: New Delhi, India | LinkedIn: linkedin.com/in/fresherr
                </p>
              </div>

              {/* Career Summary */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2">Professional Summary</h3>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  &ldquo;{niche.summary.entry}&rdquo;
                </p>
              </div>

              {/* Technical Skills */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2">Technical Core Competencies</h3>
                <div className="flex flex-wrap gap-2">
                  {niche.skills.technical.map((skill) => (
                    <span key={skill} className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-300 border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-3">Key Projects</h3>
                <div className="space-y-4">
                  {niche.resumeExample.projects.map((proj) => (
                    <div key={proj.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm font-semibold text-white">
                        <span>{proj.name}</span>
                        <span className="text-xs text-purple-400 font-normal">{proj.role}</span>
                      </div>
                      <p className="text-xs text-slate-400">{proj.desc}</p>
                      <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1 mt-1">
                        {proj.bullets.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-2">Education & Certifications</h3>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span className="font-semibold text-white">Bachelor of Technology / Science</span>
                  <span className="text-xs text-slate-400">Class of 2026</span>
                </div>
                <p className="text-xs text-slate-400">CGPA: 8.5/10.0</p>
              </div>
            </div>
          </div>

          {/* Strategic Writing Tips */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">How to write a {niche.profession} Resume</h3>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2 leading-relaxed">
              <li><strong>Prioritize single-column formatting</strong>: ATS software often scans multi-column layouts incorrectly. Keep your layout clean and linear.</li>
              <li><strong>Start bullets with Action Verbs</strong>: Instead of saying &ldquo;Responsible for...&rdquo; use powerful words like &ldquo;Designed,&rdquo; &ldquo;Developed,&rdquo; or &ldquo;Optimized.&rdquo;</li>
              <li><strong>Quantify achievements</strong>: Whenever possible, state metrics (e.g., &ldquo;reduced API lookup latency by 35%&rdquo; or &ldquo;grew registration signups by 20%&rdquo;).</li>
            </ul>
          </div>

          <SeoCtaCard profession={profession} professionName={niche.name} currentHub="resume-examples" />
        </div>
      </main>
    </div>
  );
}
