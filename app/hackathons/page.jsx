import { createMetadata, breadcrumbJsonLd } from "../../lib/seo";
import Script from "next/script";
import HackathonsClientPage from "./HackathonsClientPage";

export const metadata = createMetadata({
  title: "Student Hackathons & Coding Contests | Fresherr.in",
  description: "Participate in premier engineering hackathons, design sprints, and coding competitions in India to build your portfolio and win prizes.",
  path: "/hackathons",
});

export default function HackathonsPage() {
  return (
    <>
      <Script id="hackathons-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Hackathons", path: "/hackathons" },
          ])
        )}
      </Script>
      <HackathonsClientPage />
    </>
  );
}
