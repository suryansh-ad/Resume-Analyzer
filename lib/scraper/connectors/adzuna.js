import axios from "axios";

export async function fetchAdzunaJobs() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    console.log("[Adzuna Scraper] Skipping. ADZUNA_APP_ID or ADZUNA_APP_KEY is not defined in environment variables.");
    return [];
  }

  console.log("[Adzuna Scraper] Fetching developer jobs in India from Adzuna API...");
  // Querying India ('in' country code) for 'developer' postings, page 1, 50 results
  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&what=developer&content-type=application/json`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const results = response?.data?.results || [];
    const formatted = [];

    for (const job of results) {
      formatted.push({
        title: job.title || "Software Developer",
        company: job.company?.display_name || "Unknown Company",
        location: job.location?.display_name || "India",
        description: job.description || "",
        originalUrl: job.redirect_url || "",
        type: detectJobType(job.title || "", job.description || ""),
      });
    }

    console.log(`[Adzuna Scraper] Found ${formatted.length} India developer jobs`);
    return formatted;
  } catch (error) {
    console.error("[Adzuna Scraper] Error fetching Adzuna jobs:", error.message);
    return [];
  }
}

function detectJobType(title, content) {
  const normalizedTitle = title.toLowerCase();
  const normalizedContent = content.toLowerCase();

  if (normalizedTitle.includes("intern") || normalizedContent.includes("internship")) {
    return "INTERNSHIP";
  }
  return "JOB";
}
