import axios from "axios";

// Expanded list of popular Indian tech employers using Greenhouse
export const GREENHOUSE_BOARDS = [
  { company: "Razorpay", token: "razorpay" },
  { company: "Swiggy", token: "swiggy" },
  { company: "Zepto", token: "zeptocareers" },
  { company: "Juspay", token: "juspay" },
  { company: "Meesho", token: "meesho" },
  { company: "Groww", token: "groww" },
  { company: "BrowserStack", token: "browserstack" },
  { company: "InMobi", token: "inmobi" },
  { company: "Urban Company", token: "urbancompany" },
  { company: "Slice", token: "slice" },
  { company: "Gojek India", token: "gojek" },
  { company: "Sprinklr", token: "sprinklr" },
  { company: "Cult.fit", token: "curefit" },
  { company: "Thoughtworks India", token: "thoughtworks" },
  { company: "Rubrik India", token: "rubrik" },
  { company: "Cohesity", token: "cohesity" },
  { company: "Paytm Money", token: "paytmmoney" },
  { company: "Grab India", token: "grab" }
];

export async function fetchGreenhouseJobs(board) {
  const { company, token } = board;
  console.log(`[Greenhouse Scraper] Fetching jobs for ${company} (${token})...`);
  const url = `https://boards-api.greenhouse.io/v1/boards/${token}/jobs?content=true`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const jobs = response?.data?.jobs || [];
    const formatted = [];

    for (const job of jobs) {
      const locationName = job.location?.name || "";
      const isIndia = checkIsIndia(locationName) || checkIsIndia(job.title);

      if (!isIndia) {
        continue; // Discard non-India jobs immediately at connector level
      }

      formatted.push({
        title: job.title,
        company: company,
        location: locationName || "India",
        description: job.content || "",
        originalUrl: job.absolute_url || "",
        type: detectJobType(job.title, job.content || ""),
      });
    }

    console.log(`[Greenhouse Scraper] Found ${formatted.length} India-eligible jobs for ${company}`);
    return formatted;
  } catch (error) {
    console.error(`[Greenhouse Scraper] Error fetching jobs for ${company}:`, error.message);
    return [];
  }
}

function checkIsIndia(text) {
  const normalized = (text || "").toLowerCase();
  const indianKeywords = [
    "india", "bangalore", "bengaluru", "hyderabad", "pune", "gurgaon", "gurugram", 
    "noida", "delhi", "mumbai", "chennai", "kolkata", "indore", "jaipur", "kochi"
  ];
  return indianKeywords.some(keyword => normalized.includes(keyword));
}

function detectJobType(title, content) {
  const normalizedTitle = title.toLowerCase();
  const normalizedContent = content.toLowerCase();

  if (normalizedTitle.includes("intern") || normalizedContent.includes("internship")) {
    return "INTERNSHIP";
  }
  return "JOB";
}
