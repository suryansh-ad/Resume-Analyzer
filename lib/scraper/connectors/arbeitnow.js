import axios from "axios";

export async function fetchArbeitnowJobs() {
  console.log("[Arbeitnow Scraper] Fetching jobs from Arbeitnow API...");
  const url = "https://www.arbeitnow.com/api/job-board-api";

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const jobs = response?.data?.data || [];
    const formatted = [];

    for (const job of jobs) {
      const location = job.location || "";
      const title = job.title || "";
      const tags = job.tags || [];
      const tagsStr = tags.join(" ");

      const isIndiaEligible = 
        checkIsIndiaEligible(location) || 
        checkIsIndiaEligible(title) || 
        checkIsIndiaEligible(tagsStr);

      if (!isIndiaEligible) {
        continue;
      }

      formatted.push({
        title: job.title,
        company: job.company_name,
        location: location || "India",
        description: job.description || "",
        originalUrl: job.url || "",
        type: detectJobType(job.title, job.description || ""),
      });
    }

    console.log(`[Arbeitnow Scraper] Found ${formatted.length} India-eligible jobs`);
    return formatted;
  } catch (error) {
    console.error("[Arbeitnow Scraper] Error fetching Arbeitnow jobs:", error.message);
    return [];
  }
}

function checkIsIndiaEligible(text) {
  const normalized = (text || "").toLowerCase();
  const keywords = [
    "india", "bangalore", "bengaluru", "hyderabad", "pune", "gurgaon", "gurugram", 
    "noida", "delhi", "mumbai", "chennai", "kolkata", "remote", "worldwide", "anywhere"
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
