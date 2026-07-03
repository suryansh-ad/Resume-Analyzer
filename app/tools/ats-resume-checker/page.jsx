import Script from "next/script";
import { FresherrApp } from "../../../components/FresherrApp";
import { breadcrumbJsonLd, createMetadata, faqJsonLd, softwareApplicationJsonLd } from "../../../lib/seo";

export const metadata = createMetadata({
  title: "ATS Resume Checker & AI Resume Analyzer | Fresherr Tools",
  description:
    "Check your ATS score, resume score, keywords, and resume improvement suggestions with Fresherr's AI Resume Checker.",
  path: "/tools/ats-resume-checker",
});

export default function AtsResumeCheckerPage() {
  return (
    <>
      <Script id="software-json-ld" type="application/ld+json">
        {JSON.stringify(softwareApplicationJsonLd())}
      </Script>
      <Script id="home-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            { name: "ATS Resume Checker", path: "/tools/ats-resume-checker" },
          ])
        )}
      </Script>
      <Script id="faq-json-ld" type="application/ld+json">
        {JSON.stringify(faqJsonLd())}
      </Script>
      <FresherrApp />
    </>
  );
}
