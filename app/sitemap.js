import { absoluteUrl } from "../lib/site";
import { niches } from "../lib/seo-data";

export default function sitemap() {
  const lastModified = new Date();

  // Static core routes
  const staticRoutes = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];

  // Dynamic programmatic SEO routes
  const dynamicRoutes = [];
  const hubs = [
    { name: "resume-examples", priority: 0.9, changeFrequency: "weekly" },
    { name: "resume-summary", priority: 0.8, changeFrequency: "weekly" },
    { name: "resume-skills", priority: 0.8, changeFrequency: "weekly" },
    { name: "resume-objectives", priority: 0.8, changeFrequency: "weekly" },
    { name: "cover-letters", priority: 0.8, changeFrequency: "weekly" },
    { name: "interview-prep", priority: 0.8, changeFrequency: "weekly" }
  ];

  Object.keys(niches).forEach((nicheKey) => {
    hubs.forEach((hub) => {
      dynamicRoutes.push({
        url: absoluteUrl(`/${hub.name}/${nicheKey}`),
        lastModified,
        changeFrequency: hub.changeFrequency,
        priority: hub.priority
      });
    });
  });

  return [...staticRoutes, ...dynamicRoutes];
}


