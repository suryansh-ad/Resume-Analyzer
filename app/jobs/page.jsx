import { createMetadata, breadcrumbJsonLd } from "../../lib/seo";
import Script from "next/script";
import JobsClientPage from "./JobsClientPage";

export const metadata = createMetadata({
  title: "Fresherr Jobs - Entry-Level Software & Tech Jobs in India",
  description: "Find the best entry-level jobs, software engineer jobs, and developer roles for freshers and college graduates in India. Filter by location and salary.",
  path: "/jobs",
});

export default function JobsPage() {
  return (
    <>
      <Script id="jobs-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Jobs", path: "/jobs" },
          ])
        )}
      </Script>
      <JobsClientPage />
    </>
  );
}
