import OpenAI from "openai";
import { config } from "../config.js";
import { calculateAtsScore } from "./atsScoring.js";

const promptTemplate = `
Analyze the following resume text and return ONLY valid structured JSON.
Do not include markdown, code fences, or commentary.
If a field is unknown, return an empty string or empty array.
Use numeric values for resumeScore and atsScore.

Required JSON schema:
{
  "name": "",
  "skills": [],
  "technicalSkills": [],
  "softSkills": [],
  "experience": "",
  "education": "",
  "projects": [],
  "certifications": [],
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "resumeScore": 0,
  "atsScore": 0,
  "suggestions": [],
  "recommendedLearning": [],
  "jobRoles": [],
  "summary": ""
}

Resume text:
`;

const MIN_AI_TIME_REMAINING_MS = 250;

const analysisResponseFormat = {
  type: "json_schema",
  json_schema: {
    name: "resume_analysis",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        name: { type: "string" },
        skills: { type: "array", items: { type: "string" } },
        technicalSkills: { type: "array", items: { type: "string" } },
        softSkills: { type: "array", items: { type: "string" } },
        experience: { type: "string" },
        education: { type: "string" },
        projects: { type: "array", items: { type: "string" } },
        certifications: { type: "array", items: { type: "string" } },
        strengths: { type: "array", items: { type: "string" } },
        weaknesses: { type: "array", items: { type: "string" } },
        missingSkills: { type: "array", items: { type: "string" } },
        resumeScore: { type: "number" },
        atsScore: { type: "number" },
        suggestions: { type: "array", items: { type: "string" } },
        recommendedLearning: { type: "array", items: { type: "string" } },
        jobRoles: { type: "array", items: { type: "string" } },
        summary: { type: "string" },
      },
      required: [
        "name",
        "skills",
        "technicalSkills",
        "softSkills",
        "experience",
        "education",
        "projects",
        "certifications",
        "strengths",
        "weaknesses",
        "missingSkills",
        "resumeScore",
        "atsScore",
        "suggestions",
        "recommendedLearning",
        "jobRoles",
        "summary",
      ],
    },
  },
};

function sanitizeJsonResponse(rawText) {
  const cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const startIndex = cleaned.indexOf("{");
  const endIndex = cleaned.lastIndexOf("}");

  if (startIndex === -1 || endIndex === -1) {
    throw new Error("AI response did not contain valid JSON.");
  }

  return cleaned.slice(startIndex, endIndex + 1);
}

function getChatCompletionText(completion) {
  const messageText = completion?.choices?.[0]?.message?.content?.trim();

  if (!messageText) {
    throw new Error("AI response did not include text output.");
  }

  return messageText;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRemainingAiTime(deadlineMs) {
  return Math.max(0, deadlineMs - Date.now());
}

function getRequestTimeout(deadlineMs) {
  const remainingMs = getRemainingAiTime(deadlineMs);

  if (remainingMs <= MIN_AI_TIME_REMAINING_MS) {
    throw new Error("AI time budget exhausted");
  }

  return Math.min(config.aiRequestTimeoutMs, remainingMs);
}

async function waitForRetry(attempt, deadlineMs) {
  const remainingMs = getRemainingAiTime(deadlineMs);

  if (remainingMs <= MIN_AI_TIME_REMAINING_MS) {
    return;
  }

  await wait(Math.min(600 * attempt, remainingMs));
}

function describeError(error) {
  if (error?.name === "AbortError") {
    return "request timed out";
  }

  return error?.message || "unknown error";
}

function toArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function toText(value) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join(", ");
  }

  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }

  return "";
}

function extractMatches(text, values) {
  const normalized = text.toLowerCase();
  return values.filter((value) => normalized.includes(value.toLowerCase()));
}

function buildLocalAnalysis(resumeText) {
  const ats = calculateAtsScore(resumeText);
  const technicalSkills = extractMatches(resumeText, [
    "JavaScript",
    "React",
    "Node",
    "Express",
    "MongoDB",
    "SQL",
    "HTML",
    "CSS",
    "Java",
    "Python",
    "Git",
    "API",
  ]);
  const name = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}$/.test(line));

  return {
    name: name || "",
    skills: technicalSkills,
    technicalSkills,
    softSkills: [],
    experience: "",
    education: /education/i.test(resumeText) ? "Education section detected." : "",
    projects: /project/i.test(resumeText) ? ["Projects section detected."] : [],
    certifications: /certification|certificate/i.test(resumeText)
      ? ["Certifications section detected."]
      : [],
    strengths: ["Resume text was extracted successfully."],
    weaknesses: [],
    missingSkills: [],
    resumeScore: ats.score,
    atsScore: ats.score,
    atsDetails: ats.details,
    suggestions: ats.recommendations,
    recommendedLearning: [],
    jobRoles: technicalSkills.some((skill) => /react|javascript|html|css/i.test(skill))
      ? ["Frontend Developer"]
      : [],
    summary:
      "AI model analysis was unavailable, so this report uses local ATS scoring and keyword extraction.",
  };
}

function buildDefaultSummary(analysis, ats) {
  const skills = toArray(analysis.skills || analysis.technicalSkills);

  if (skills.length) {
    return `Resume extracted successfully. Key detected skills include ${skills
      .slice(0, 5)
      .join(", ")}. ATS score is ${ats.score}/100.`;
  }

  return `Resume extracted successfully. ATS score is ${ats.score}/100. Review the suggestions to improve formatting, keywords, and role alignment.`;
}

async function analyzeWithChatCompletions(
  provider,
  resumeText,
  maxAttempts = 2,
  deadlineMs = Date.now() + config.aiTotalBudgetMs
) {
  const client = new OpenAI({
    apiKey: provider.apiKey,
    ...(provider.baseURL ? { baseURL: provider.baseURL } : {}),
  });
  const payload = {
    model: provider.model,
    temperature: 0.2,
    response_format: analysisResponseFormat,
    messages: [
      {
        role: "system",
        content:
          "You analyze resumes and must return only valid JSON matching the requested schema.",
      },
      {
        role: "user",
        content: `${promptTemplate}\n${resumeText}`,
      },
    ],
  };

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const completion = await client.chat.completions.create(payload, {
        maxRetries: 0,
        timeout: getRequestTimeout(deadlineMs),
      });

      return getChatCompletionText(completion);
    } catch (error) {
      lastError = error;
    }

    if (attempt < maxAttempts) {
      await waitForRetry(attempt, deadlineMs);
    }
  }

  throw lastError;
}

function buildAnalysis(rawText, resumeText) {
  const jsonString = sanitizeJsonResponse(rawText);
  const parsed = JSON.parse(jsonString);
  const normalized = {
    ...parsed,
    jobRoles: toArray(parsed.jobRoles),
  };
  const ats = calculateAtsScore(resumeText, normalized);
  const suggestions = [...toArray(parsed.suggestions), ...ats.recommendations];
  const parsedAnalysis = {
    ...parsed,
    skills: toArray(parsed.skills),
    technicalSkills: toArray(parsed.technicalSkills),
  };

  return {
    name: toText(parsed.name),
    skills: parsedAnalysis.skills,
    technicalSkills: parsedAnalysis.technicalSkills,
    softSkills: toArray(parsed.softSkills),
    experience: toText(parsed.experience),
    education: toText(parsed.education),
    projects: toArray(parsed.projects),
    certifications: toArray(parsed.certifications),
    strengths: toArray(parsed.strengths),
    weaknesses: toArray(parsed.weaknesses),
    missingSkills: toArray(parsed.missingSkills),
    resumeScore: Number(parsed.resumeScore) || ats.score,
    atsScore: ats.score,
    atsDetails: ats.details,
    suggestions: suggestions.filter(
      (item, index, array) => array.findIndex((entry) => entry === item) === index
    ),
    recommendedLearning: toArray(parsed.recommendedLearning),
    jobRoles: toArray(parsed.jobRoles),
    summary: toText(parsed.summary) || buildDefaultSummary(parsedAnalysis, ats),
  };
}

function getAnalysisAttempts() {
  const attempts = [];

  if (config.groqApiKey) {
    attempts.push({
      name: `Groq (${config.groqModel})`,
      analyze: (resumeText, deadlineMs) =>
        analyzeWithChatCompletions(
          {
            apiKey: config.groqApiKey,
            baseURL: "https://api.groq.com/openai/v1",
            model: config.groqModel,
          },
          resumeText,
          3,
          deadlineMs
        ),
    });
  }

  if (config.openaiApiKey) {
    attempts.push({
      name: `OpenAI (${config.openaiModel})`,
      analyze: (resumeText, deadlineMs) =>
        analyzeWithChatCompletions(
          {
            apiKey: config.openaiApiKey,
            model: config.openaiModel,
          },
          resumeText,
          2,
          deadlineMs
        ),
    });
  }

  return attempts;
}

export async function analyzeResumeText(resumeText) {
  const attempts = getAnalysisAttempts();
  const deadlineMs = Date.now() + config.aiTotalBudgetMs;

  if (!attempts.length) {
    console.warn("No AI API keys configured. Falling back to local analysis.");
    return buildLocalAnalysis(resumeText);
  }

  const errors = [];

  for (const attempt of attempts) {
    if (getRemainingAiTime(deadlineMs) <= MIN_AI_TIME_REMAINING_MS) {
      errors.push("AI time budget exhausted");
      break;
    }

    try {
      const rawText = await attempt.analyze(resumeText, deadlineMs);
      return buildAnalysis(rawText, resumeText);
    } catch (error) {
      errors.push(`${attempt.name}: ${describeError(error)}`);
    }
  }

  console.warn(`All AI models failed. Falling back to local analysis. ${errors.join(" | ")}`);
  return buildLocalAnalysis(resumeText);
}
