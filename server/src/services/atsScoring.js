const SECTION_PATTERNS = [
  /summary/i,
  /experience|work experience|professional experience/i,
  /education/i,
  /skills|technical skills|core competencies/i,
  /projects/i,
  /certifications|licenses/i,
];

const ACTION_VERBS = [
  "built",
  "developed",
  "designed",
  "implemented",
  "led",
  "optimized",
  "created",
  "improved",
  "launched",
  "managed",
  "delivered",
  "increased",
  "reduced",
  "automated",
];

const COMMON_KEYWORDS = [
  "javascript",
  "react",
  "node",
  "express",
  "sql",
  "api",
  "git",
  "html",
  "css",
  "mongodb",
  "java",
  "python",
];

function countMatches(text, regex) {
  return (text.match(regex) || []).length;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function calculateAtsScore(resumeText, analysis = {}) {
  const text = resumeText || "";
  const normalized = text.toLowerCase();
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const emailFound = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text);
  const phoneFound = /(\+?\d[\d\s\-()]{8,}\d)/.test(text);
  const linkedinFound = /linkedin\.com|linkedin/i.test(text);
  const githubFound = /github\.com|github/i.test(text);

  const sectionHits = SECTION_PATTERNS.filter((pattern) => pattern.test(text)).length;
  const bulletCount = countMatches(text, /^[\u2022\-*]\s+/gm);
  const quantifiedCount = countMatches(text, /\b\d+%|\b\d+\+|\b\d+\s*(users|projects|years|months|clients|features|teams)\b/gi);
  const dateCount = countMatches(text, /\b(20\d{2}|19\d{2})\b/g);
  const verbHits = ACTION_VERBS.filter((verb) => normalized.includes(verb)).length;
  const keywordHits = COMMON_KEYWORDS.filter((keyword) => normalized.includes(keyword)).length;
  const words = normalized.split(/\s+/).filter(Boolean).length;

  const contactScore =
    (emailFound ? 7 : 0) +
    (phoneFound ? 7 : 0) +
    (linkedinFound ? 3 : 0) +
    (githubFound ? 3 : 0);

  const sectionScore = clamp(sectionHits * 5, 0, 30);
  const formattingScore = clamp((bulletCount >= 4 ? 10 : bulletCount * 2) + (dateCount >= 2 ? 6 : dateCount * 2), 0, 16);
  const impactScore = clamp((quantifiedCount >= 4 ? 14 : quantifiedCount * 3) + verbHits, 0, 24);
  const keywordScore = clamp(keywordHits * 2, 0, 16);
  const lengthScore = words >= 250 && words <= 900 ? 10 : words >= 180 && words <= 1100 ? 7 : 4;

  let penalty = 0;
  if (words < 120) penalty += 8;
  if (sectionHits < 3) penalty += 6;
  if (!emailFound || !phoneFound) penalty += 8;
  if (bulletCount === 0) penalty += 5;

  const rawScore = contactScore + sectionScore + formattingScore + impactScore + keywordScore + lengthScore - penalty;
  const score = clamp(Math.round(rawScore), 35, 96);

  const details = [
    { label: "Contact details", score: contactScore, max: 20 },
    { label: "Resume sections", score: sectionScore, max: 30 },
    { label: "Formatting signals", score: formattingScore, max: 16 },
    { label: "Impact language", score: impactScore, max: 24 },
    { label: "Keyword coverage", score: keywordScore, max: 16 },
    { label: "Length balance", score: lengthScore, max: 10 },
  ];

  const recommendations = [];
  if (!linkedinFound) recommendations.push("Add a LinkedIn profile to improve recruiter trust and searchability.");
  if (!githubFound && /(developer|engineer|software|frontend|backend|full stack)/i.test(analysis.jobRoles?.join(" ") || text)) {
    recommendations.push("Add a GitHub or portfolio link to strengthen technical credibility.");
  }
  if (quantifiedCount < 2) recommendations.push("Add measurable outcomes like percentages, scale, or impact metrics.");
  if (sectionHits < 4) recommendations.push("Use clearer ATS-friendly headings like Summary, Experience, Skills, and Education.");
  if (bulletCount < 4) recommendations.push("Use bullet points consistently so achievements are easier for ATS and recruiters to scan.");

  return {
    score,
    details,
    recommendations,
  };
}

