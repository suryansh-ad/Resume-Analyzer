export const siteConfig = {
  name: "Fresherr",
  domain: "fresherr.in",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://fresherr.in",
  description:
    "Fresherr is an AI-powered resume analyzer for ATS score, resume score, resume feedback, keyword analysis, and resume improvement suggestions.",
  keywords: [
    "ATS Resume Checker",
    "Resume Analyzer",
    "Resume Score Checker",
    "Free ATS Checker",
    "AI Resume Review",
    "Resume Optimization Tool",
    "ATS Score",
    "Resume Feedback",
    "Keyword Analysis",
  ],
  social: {
    instagram: "https://www.instagram.com/fresherr.in?igsh=ejl2cXdsN3Rhc285&utm_source=qr",
    linkedin: "https://www.linkedin.com/company/fresherr/",
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
