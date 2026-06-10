import Script from "next/script";
import { AboutPage } from "../../components/AboutPage";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { breadcrumbJsonLd, createMetadata } from "../../lib/seo";

export const metadata = createMetadata({
  title: "About Fresherr - AI Resume Review for Freshers",
  description:
    "Fresherr helps students and freshers analyze resumes with AI, ATS score insights, resume feedback, and improvement suggestions.",
  path: "/about",
});

export default function AboutRoute() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_25%),linear-gradient(to_bottom,rgba(2,6,23,0.95),rgba(2,6,23,1))]">
      <Script id="about-breadcrumb-json-ld" type="application/ld+json">
        {JSON.stringify(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ])
        )}
      </Script>
      <Navbar />
      <AboutPage />
      <Footer />
    </div>
  );
}
