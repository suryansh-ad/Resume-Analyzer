import axios from "axios";

// Expanded list of popular Indian tech employers using Lever
export const LEVER_BOARDS = [
  { company: "PhonePe", token: "phonepe" },
  { company: "Jupiter", token: "jupiter" },
  { company: "Atlassian", token: "atlassian" },
  { company: "Postman", token: "postman" },
  { company: "Disney+ Hotstar", token: "hotstar" },
  { company: "FamPay", token: "fampay" },
  { company: "ClearTax", token: "cleartax" },
  { company: "Harness India", token: "harness" },
  { company: "Deliveroo India", token: "deliveroo" },
  { company: "Unacademy", token: "unacademy" },
  { company: "upGrad", token: "upgrad" },
  { company: "Oyo", token: "oyo" },
  { company: "Blinkit", token: "blinkit" },
  { company: "Pocket FM", token: "pocketfm" },
  { company: "Simpl", token: "simpl" },
  { company: "Curefoods", token: "curefoods" },
  { company: "Dunzo", token: "dunzo" },
  { company: "ShareChat", token: "sharechat" },
  { company: "Lead School", token: "lead" },
  { company: "Yellow.ai", token: "yellowai" },
  { company: "Rapido", token: "rapido" },
  { company: "MobiKwik", token: "mobikwik" },
  { company: "Spinny", token: "spinny" },
  { company: "Classplus", token: "classplus" },
  { company: "Figma", token: "figma" },
  { company: "Vercel", token: "vercel" },
  { company: "Snyk", token: "snyk" },
  { company: "Shopify", token: "shopify" }
];

export async function fetchLeverJobs(board) {
  const { company, token } = board;
  console.log(`[Lever Scraper] Fetching jobs for ${company} (${token})...`);
  const url = `https://api.lever.co/v0/postings/${token}?mode=json`;

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const postings = response?.data || [];
    const formatted = [];

    for (const posting of postings) {
      const location = posting.categories?.location || "";
      const isIndia = checkIsIndia(location) || checkIsIndia(posting.text);

      if (!isIndia) {
        continue; // Discard non-India postings immediately at connector level
      }

      const description = `${posting.description || ""}\n\n${posting.lists?.map(list => `<h3>${list.text}</h3><ul>${list.content}</ul>`).join("\n") || ""}`;

      formatted.push({
        title: posting.text,
        company: company,
        location: location || "India",
        description: description,
        originalUrl: posting.hostedUrl || "",
        type: detectJobType(posting.text, description),
      });
    }

    console.log(`[Lever Scraper] Found ${formatted.length} India-eligible jobs for ${company}`);
    return formatted;
  } catch (error) {
    console.error(`[Lever Scraper] Error fetching Lever jobs for ${company}:`, error.message);
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
