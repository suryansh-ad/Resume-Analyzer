import Script from "next/script";
import { FresherrApp } from "../components/FresherrApp";
import { breadcrumbJsonLd, createMetadata, faqJsonLd, softwareApplicationJsonLd } from "../lib/seo";

export const metadata = createMetadata({
  title: "Fresherr - Free ATS Resume Checker & AI Resume Analyzer",
  description:
    "Check your ATS score, resume score, keywords, and resume improvement suggestions with Fresherr's AI Resume Analyzer.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Script id="software-json-ld" type="application/ld+json">
        {JSON.stringify(softwareApplicationJsonLd())}
      </Script>
      <Script id="home-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }]))}
      </Script>
      <Script id="faq-json-ld" type="application/ld+json">
        {JSON.stringify(faqJsonLd())}
      </Script>
      <FresherrApp />
    </>
  );
}
