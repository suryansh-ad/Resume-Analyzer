import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";
import { prisma } from "../../../lib/prisma.js";
import { OpportunityMatchIsland } from "../../../components/OpportunityMatchIsland.jsx";
import { MapPin, Briefcase, Calendar, ChevronRight, Award, DollarSign, Clock, ExternalLink, AlertCircle, Building2 } from "lucide-react";

// Check if parameter is a valid UUID
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SEO_LOCATIONS = ["bangalore", "hyderabad", "pune", "delhi", "gurgaon", "noida", "mumbai", "chennai", "kolkata"];

export async function generateMetadata({ params }) {
  const { id } = await params;
  const isUuid = UUID_REGEX.test(id);

  if (isUuid) {
    let opportunity = await prisma.job.findUnique({
      where: { id },
      include: { company: true }
    });

    if (!opportunity) {
      opportunity = await prisma.internship.findUnique({
        where: { id },
        include: { company: true }
      });
    }

    if (!opportunity) {
      return {
        title: "Opportunity Not Found | Fresherr.in",
        description: "This career opportunity could not be found."
      };
    }

    return {
      title: `${opportunity.title} at ${opportunity.company.name} | Fresherr.in`,
      description: `Apply for ${opportunity.title} at ${opportunity.company.name} in ${opportunity.location}. Find entry-level jobs and internships for freshers in India.`,
      alternates: {
        canonical: `https://fresherr.in/jobs/${id}`,
      },
    };
  } else {
    // Programmatic SEO Page
    const slug = id.toLowerCase();
    const isLocation = SEO_LOCATIONS.includes(slug);
    
    let title = "";
    let description = "";

    if (isLocation) {
      const city = id.charAt(0).toUpperCase() + id.slice(1);
      title = `Entry-Level & Freshers Jobs in ${city} | Fresherr.in`;
      description = `Find the best software engineering, web development, and tech jobs in ${city} for freshers and college graduates. Verified listings in India.`;
    } else {
      const roleName = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      title = `${roleName} Jobs in India for Freshers | Fresherr.in`;
      description = `Apply to top entry-level ${roleName} jobs, internships, and off-campus drives in India. Verified roles for college students.`;
    }

    return {
      title,
      description,
      alternates: {
        canonical: `https://fresherr.in/jobs/${id}`,
      },
    };
  }
}

export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  const isUuid = UUID_REGEX.test(id);

  if (isUuid) {
    // 1. RENDER INDIVIDUAL OPPORTUNITY PAGE
    let opportunity = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    let isJob = true;

    if (!opportunity) {
      opportunity = await prisma.internship.findUnique({
        where: { id },
        include: { company: true },
      });
      isJob = false;
    }

    if (!opportunity) {
      notFound();
    }

    const jobPostingJsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": opportunity.title,
      "description": opportunity.description,
      "datePosted": opportunity.createdAt.toISOString(),
      "validThrough": opportunity.deadline ? opportunity.deadline.toISOString() : undefined,
      "employmentType": isJob ? "FULL_TIME" : "INTERNSHIP",
      "hiringOrganization": {
        "@type": "Organization",
        "name": opportunity.company.name,
        "sameAs": opportunity.company.website || undefined,
        "logo": opportunity.company.logo || undefined
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": opportunity.location,
          "addressCountry": "IN"
        }
      },
      "baseSalary": (isJob ? opportunity.salary : opportunity.stipend) ? {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": isJob ? opportunity.salary : opportunity.stipend,
          "unitText": isJob ? "YEAR" : "MONTH"
        }
      } : undefined
    };

    return (
      <>
        <Script id="job-json-ld" type="application/ld+json">
          {JSON.stringify(jobPostingJsonLd)}
        </Script>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 border-b border-white/5 pb-4">
            <Link href="/" className="hover:text-slate-300 transition">Home</Link>
            <ChevronRight size={10} />
            <Link href={isJob ? "/jobs" : "/internships"} className="hover:text-slate-300 transition">
              {isJob ? "Jobs" : "Internships"}
            </Link>
            <ChevronRight size={10} />
            <span className="text-slate-300 font-medium truncate max-w-xs">{opportunity.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
            <article className="space-y-8">
              <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-slate-900/10 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="flex gap-4 sm:gap-6">
                    {opportunity.company.logo ? (
                      <div className="h-16 w-16 relative bg-white rounded-2xl p-2.5 flex items-center justify-center shrink-0 border border-white/10 shadow-lg shadow-cyan-500/5">
                        <img src={opportunity.company.logo} alt={opportunity.company.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-16 w-16 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                        <Building2 size={26} className="text-cyan-400" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {isJob ? "Job" : "Internship"}
                      </span>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mt-2 leading-tight">
                        {opportunity.title}
                      </h1>
                      <p className="text-sm font-bold text-slate-300 mt-1 hover:underline">
                        <Link href={`/jobs?search=${opportunity.company.name.toLowerCase()}`}>
                          {opportunity.company.name}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <a
                      href={opportunity.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-sm px-6 py-3 rounded-xl transition shadow-lg shadow-cyan-500/10 hover:-translate-y-0.5"
                    >
                      Apply Now <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Location</span>
                    <span className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                      <MapPin size={12} className="text-cyan-400" />
                      {opportunity.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      {isJob ? "Salary" : "Stipend"}
                    </span>
                    <span className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                      <DollarSign size={12} className="text-emerald-400" />
                      {isJob ? (opportunity.salary || "Not specified") : (opportunity.stipend || "Not specified")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      {isJob ? "Experience" : "Duration"}
                    </span>
                    <span className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" />
                      {isJob ? (opportunity.experience || "Freshers") : (opportunity.duration || "3-6 months")}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Posted</span>
                    <span className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      {opportunity.createdAt.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {opportunity.aiSummary && (
                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/30">
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">AI Summary</h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{opportunity.aiSummary}</p>
                </div>
              )}

              <div className="space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Description</h3>
                <div
                  className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: opportunity.description }}
                />
              </div>

              {opportunity.skills && opportunity.skills.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-slate-900 border border-white/5 text-slate-300 px-3.5 py-1.5 rounded-xl font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            <aside className="space-y-8">
              <OpportunityMatchIsland opportunityId={opportunity.id} />

              <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/10 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                  About {opportunity.company.name}
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  {opportunity.company.description || `${opportunity.company.name} is a leading tech organization hiring candidates in India.`}
                </p>
                {opportunity.company.website && (
                  <a
                    href={opportunity.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Visit Company Website <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </>
    );
  } else {
    // 2. RENDER PROGRAMMATIC SEO LISTING PAGE
    const slug = id.toLowerCase();
    const isLocation = SEO_LOCATIONS.includes(slug);
    
    let seoTitle = "";
    let seoHeader = "";
    let opportunitiesList = [];

    if (isLocation) {
      const city = id.charAt(0).toUpperCase() + id.slice(1);
      seoTitle = `Freshers & Entry-Level Jobs in ${city}, India`;
      seoHeader = `Opportunities located in ${city}`;
      
      opportunitiesList = await prisma.job.findMany({
        where: {
          location: { contains: slug, mode: "insensitive" },
          isApproved: true
        },
        include: { company: true },
        orderBy: { createdAt: "desc" }
      });
    } else {
      const roleName = id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      seoTitle = `Freshers ${roleName} Jobs in India`;
      seoHeader = `Opportunities for "${roleName}" roles`;

      const searchTerms = id.split("-");
      opportunitiesList = await prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: id.replace("-", " "), mode: "insensitive" } },
            { title: { contains: searchTerms[0], mode: "insensitive" } },
            { skills: { hasSome: [roleName, searchTerms[0]] } }
          ],
          isApproved: true
        },
        include: { company: true },
        orderBy: { createdAt: "desc" }
      });
    }

    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {seoTitle}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {seoHeader}. Verified hiring pipelines for students and college graduates.
          </p>
        </div>

        {/* Listings */}
        {opportunitiesList.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-12 text-center text-slate-400">
            <AlertCircle className="mx-auto text-slate-500 mb-3" size={32} />
            <p className="text-sm font-bold text-white mb-1">No active listings currently</p>
            <p className="text-xs text-slate-500">We are crawling new feeds daily. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {opportunitiesList.map((opp) => (
              <Link
                key={opp.id}
                href={`/jobs/${opp.id}`}
                className="block p-6 rounded-2xl border border-white/5 bg-slate-900/10 hover:bg-slate-900/30 hover:border-cyan-500/20 transition group"
              >
                <div className="flex gap-4">
                  {opp.company.logo ? (
                    <div className="h-14 w-14 relative bg-white rounded-xl p-1.5 flex items-center justify-center shrink-0 border border-cyan-500/30 shadow-md shadow-cyan-500/10 transition group-hover:border-cyan-500/50">
                      <img src={opp.company.logo} alt={opp.company.name} className="max-h-full max-w-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-14 w-14 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl flex items-center justify-center shrink-0 text-cyan-400 shadow-md shadow-cyan-500/10">
                      <Building2 size={22} className="text-cyan-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition truncate max-w-md">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{opp.company.name}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                        <MapPin size={11} className="text-cyan-500" />
                        {opp.location}
                      </span>
                      {opp.salary && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                          {opp.salary}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}
