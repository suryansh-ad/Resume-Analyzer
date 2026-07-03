import { absoluteUrl } from "../lib/site";
import { niches } from "../lib/seo-data";
import { prisma } from "../lib/prisma.js";

export default async function sitemap() {
  const lastModified = new Date();

  // 1. Static core routes
  const staticRoutes = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "daily", priority: 1.0 },
    { url: absoluteUrl("/jobs"), lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/internships"), lastModified, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/hackathons"), lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/tools"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/tools/ats-resume-checker"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];

  // 2. Programmatic SEO locations & role routes
  const seoLocations = ["bangalore", "hyderabad", "pune", "delhi", "gurgaon", "noida", "mumbai", "chennai", "kolkata"];
  const seoRoles = ["software-engineer", "frontend-developer", "backend-developer", "data-analyst", "product-designer"];
  
  const seoRoutes = [
    ...seoLocations.map(loc => ({
      url: absoluteUrl(`/jobs/${loc}`),
      lastModified,
      changeFrequency: "daily",
      priority: 0.85
    })),
    ...seoRoles.map(role => ({
      url: absoluteUrl(`/jobs/${role}`),
      lastModified,
      changeFrequency: "daily",
      priority: 0.85
    }))
  ];

  // 3. Dynamic jobs and internships from DB
  const dbRoutes = [];
  try {
    const [jobs, internships] = await Promise.all([
      prisma.job.findMany({ where: { isApproved: true }, select: { id: true, createdAt: true } }),
      prisma.internship.findMany({ where: { isApproved: true }, select: { id: true, createdAt: true } })
    ]);

    jobs.forEach(job => {
      dbRoutes.push({
        url: absoluteUrl(`/jobs/${job.id}`),
        lastModified: job.createdAt,
        changeFrequency: "weekly",
        priority: 0.7
      });
    });

    internships.forEach(intern => {
      dbRoutes.push({
        url: absoluteUrl(`/jobs/${intern.id}`),
        lastModified: intern.createdAt,
        changeFrequency: "weekly",
        priority: 0.7
      });
    });
  } catch (error) {
    console.error("[Sitemap] Failed to load db items:", error.message);
  }

  // 4. Legacy hubs (retained for SEO compatibility)
  const legacyRoutes = [];
  const hubs = [
    { name: "resume-examples", priority: 0.5, changeFrequency: "monthly" },
    { name: "resume-summary", priority: 0.5, changeFrequency: "monthly" },
    { name: "resume-skills", priority: 0.5, changeFrequency: "monthly" },
    { name: "resume-objectives", priority: 0.5, changeFrequency: "monthly" },
    { name: "cover-letters", priority: 0.5, changeFrequency: "monthly" },
    { name: "interview-prep", priority: 0.5, changeFrequency: "monthly" }
  ];

  Object.keys(niches).forEach((nicheKey) => {
    hubs.forEach((hub) => {
      legacyRoutes.push({
        url: absoluteUrl(`/${hub.name}/${nicheKey}`),
        lastModified,
        changeFrequency: hub.changeFrequency,
        priority: hub.priority
      });
    });
  });

  return [...staticRoutes, ...seoRoutes, ...dbRoutes, ...legacyRoutes];
}
