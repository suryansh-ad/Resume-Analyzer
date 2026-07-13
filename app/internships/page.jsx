import { createMetadata, breadcrumbJsonLd } from "../../lib/seo";
import Script from "next/script";
import InternshipsClientPage from "./InternshipsClientPage";

export const metadata = createMetadata({
  title: "Fresherr Internships - Tech Internships for College Students",
  description: "Explore tech, software engineering, and web development internships in India for freshers and students. Gain experience and earn stipends.",
  path: "/internships",
});

export default function InternshipsPage() {
  return (
    <>
      <Script id="internships-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Internships", path: "/internships" },
          ])
        )}
      </Script>
      <InternshipsClientPage />
    </>
  );
}
