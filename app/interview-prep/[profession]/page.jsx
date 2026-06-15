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
    title: `Top ${niche.profession} Interview Questions & Answers | Fresherr`,
    description: `Prepare for your placement exam. Review top technical interview questions and answers for ${niche.profession} candidates.`,
    path: `/interview-prep/${profession}`,
  });
}

export async function generateStaticParams() {
  return Object.keys(niches).map((key) => ({
    profession: key,
  }));
}

export default async function InterviewPrepPage({ params }) {
  const { profession } = await params;
  const niche = niches[profession];
  if (!niche) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Interview Prep", path: "/interview-prep" },
    { name: niche.name, path: `/interview-prep/${profession}` },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 font-sans">
      <Navbar authReady={false} />

      <main className="mx-auto flex-1 w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="space-y-6">
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl lg:text-5xl">
              {niche.profession} Interview Questions &amp; Answers
            </h1>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl">
              Prepare for your placement drives and technical screenings with these core questions and answers tailored for junior {niche.profession} candidates.
            </p>
          </div>

          {/* QA List */}
          <div className="space-y-4">
            {niche.interviewQuestions.map((qa, index) => (
              <div key={index} className="rounded-2xl border border-white/15 bg-slate-900/40 p-6 space-y-3">
                <h3 className="text-lg font-bold text-white flex gap-3">
                  <span className="text-purple-400">Q{index + 1}:</span>
                  <span>{qa.q}</span>
                </h3>
                <div className="text-sm text-slate-300 leading-relaxed border-l-2 border-purple-500/40 pl-4 py-1">
                  <strong>Answer</strong>: {qa.a}
                </div>
              </div>
            ))}
          </div>

          {/* Behavioral Tips */}
          <div className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">How to Answer Behavioral Interview Questions</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              When answering situational questions (like &ldquo;tell me about a time you resolved a conflict&rdquo;), always use the <strong>STAR method</strong>:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-300 space-y-2 leading-relaxed">
              <li><strong>Situation</strong>: Set the context and describe the background.</li>
              <li><strong>Task</strong>: Explain the core challenge or goal you had to address.</li>
              <li><strong>Action</strong>: Detail the specific steps you took to resolve it.</li>
              <li><strong>Result</strong>: Highlight the positive outcome and what you learned.</li>
            </ul>
          </div>

          <SeoCtaCard profession={profession} professionName={niche.name} currentHub="interview-prep" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
