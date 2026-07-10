import axios from "axios";

export async function fetchRemotiveJobs() {
  console.log("[Remotive Scraper] Fetching jobs from Remotive API...");
  const url = "https://remotive.com/api/remote-jobs?category=software-development&limit=50";

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const jobs = response?.data?.jobs || [];
    const formatted = [];

    for (const job of jobs) {
      const title = job.title || "";
      const location = job.candidate_required_location || "";
      
      // Filter for Worldwide, India, Anywhere, APAC, Asia, or blank location
      const isIndiaEligible = 
        !location ||
        checkIsIndiaEligible(location) || 
        checkIsIndiaEligible(title);

      if (!isIndiaEligible) {
        continue;
      }

      formatted.push({
        title: job.title,
        company: job.company_name,
        location: location || "Remote (India Eligible)",
        description: job.description || "",
        originalUrl: job.url || "",
        type: detectJobType(job.title, job.description || ""),
      });
    }

    console.log(`[Remotive Scraper] Found ${formatted.length} India-eligible remote jobs`);
    return formatted;
  } catch (error) {
    console.error("[Remotive Scraper] Error fetching remote jobs:", error.message);
    return [];
  }
}

function checkIsIndiaEligible(text) {
  const normalized = (text || "").toLowerCase();
  const keywords = [
    "india", "worldwide", "anywhere", "remote", "apac", "asia", "global", "everywhere"
  ];
  return keywords.some(keyword => normalized.includes(keyword));
}

function detectJobType(title, content) {
  const normalizedTitle = title.toLowerCase();
  const normalizedContent = content.toLowerCase();

  if (normalizedTitle.includes("intern") || normalizedContent.includes("internship")) {
    return "INTERNSHIP";
  }
  return "JOB";
}
