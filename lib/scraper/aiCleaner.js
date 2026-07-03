import axios from "axios";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

/**
 * AI helper to clean descriptions, extract metadata, and validate India-eligibility.
 */
export async function cleanAndValidateOpportunity({ title, company, location, description, originalUrl }) {
  if (!GEMINI_API_KEY) {
    console.warn("[AI Cleaner] GEMINI_API_KEY is not set. Skipping AI cleaning.");
    // Return a default mock structure so the crawler can run without keys if necessary
    const isLikelyIndia = checkLocationHeuristically(location || "") || checkLocationHeuristically(description || "");
    return {
      isIndiaEligible: isLikelyIndia,
      cleanedDescription: description,
      summary: `${title} opportunity at ${company}.`,
      skills: [],
      technologies: [],
      experience: "0-2 years",
      salary: null,
      location: location || "India",
      atsKeywords: [title, company],
    };
  }

  const prompt = `
  You are an expert AI Career Aggregator and Data Cleanser.
  Analyze the following opportunity details and return a structured JSON response.

  Title: "${title}"
  Company: "${company}"
  Original Location: "${location}"
  Url: "${originalUrl}"
  Description Snippet:
  """
  ${description.slice(0, 4000)}
  """

  Required JSON schema response:
  {
    "isIndiaEligible": true, // MUST be true if the job is located in India, is remote but explicitly open to residents of India, or specifies office locations in priority Indian cities (Bangalore, Pune, Hyderabad, Gurgaon, Delhi, Chennai, Mumbai, Noida, Kolkata, etc.). Return FALSE if the job is strictly located outside of India (US, UK, Europe, etc.) or states it does NOT hire candidates in India.
    "cleanedDescription": "", // Clean up the raw HTML/text into standard readable Markdown/HTML. Keep paragraphs and bullet points, remove script tags, headers, footers, apply buttons, or random web code.
    "summary": "", // A concise, engaging 2-paragraph summary of the opportunity.
    "skills": [], // List of core skills required (e.g. ["React", "SQL", "Communication"])
    "technologies": [], // Specific technologies/frameworks/libraries (e.g. ["TypeScript", "Next.js", "Docker"])
    "experience": "", // Extracted experience requirement (e.g. "0-2 years", "Freshers", "3+ years")
    "salary": "", // Extracted salary or stipend range in LPA or per-month format (e.g. "6-8 LPA", "₹25,000/month"). Return null or empty if not mentioned.
    "location": "", // The clean Indian location (e.g. "Bangalore", "Pune", "Remote - India")
    "atsKeywords": [] // 5-8 ATS keywords related to this job description.
  }

  Return ONLY valid JSON matching this schema. Do not include markdown code blocks or additional text.
  `;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const responseText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error("No response from Gemini API");
    }

    const data = JSON.parse(responseText.trim());
    return data;
  } catch (error) {
    console.error("[AI Cleaner] Error invoking Gemini API:", error.message);
    // Fallback heuristic if API fails
    const isLikelyIndia = checkLocationHeuristically(location || "") || checkLocationHeuristically(description || "");
    return {
      isIndiaEligible: isLikelyIndia,
      cleanedDescription: description,
      summary: `${title} opportunity at ${company}.`,
      skills: [],
      technologies: [],
      experience: "0-2 years",
      salary: null,
      location: location || "India",
      atsKeywords: [title, company],
    };
  }
}

function checkLocationHeuristically(text) {
  const normalized = text.toLowerCase();
  const indianCities = [
    "bangalore", "bengaluru", "hyderabad", "pune", "gurgaon", "gurugram", "noida", 
    "delhi", "ncr", "chennai", "mumbai", "kolkata", "ahmedabad", "kochi", "cochin",
    "indore", "jaipur", "bhubaneswar", "chandigarh", "mohali", "trivandrum", 
    "coimbatore", "visakhapatnam", "nagpur", "india"
  ];
  return indianCities.some(city => normalized.includes(city));
}
