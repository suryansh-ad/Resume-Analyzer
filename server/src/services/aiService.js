import { GoogleGenerativeAI } from "@google/generative-ai";
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

const AI_REQUEST_TIMEOUT_MS = 12000;

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

function getOpenAiText(payload) {
  const messageText = payload?.choices?.[0]?.message?.content?.trim();

  if (!messageText) {
    throw new Error("AI response did not include text output.");
  }

  return messageText;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options, timeoutMs = AI_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
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

async function analyzeWithOpenAi(resumeText) {
  const payload = {
    model: config.openaiModel,
    response_format: {
      type: "json_object",
    },
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

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openaiApiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return getOpenAiText(data);
      }

      const errorText = await response.text();
      lastError = new Error(`OpenAI request failed (${response.status}): ${errorText}`);

      if (response.status < 500 && response.status !== 429) {
        throw lastError;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < 3) {
      await wait(600 * attempt);
    }
  }

  throw lastError;
}

async function analyzeWithOpenRouter(resumeText, model) {
  const payload = {
    model,
    response_format: {
      type: "json_object",
    },
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

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.openrouterApiKey}`,
          "X-Title": "Resume Analyzer",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        return getOpenAiText(data);
      }

      const errorText = await response.text();
      lastError = new Error(
        `OpenRouter model ${model} failed (${response.status}): ${errorText}`
      );

      if (response.status < 500 && response.status !== 429) {
        throw lastError;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < 2) {
      await wait(600 * attempt);
    }
  }

  throw lastError;
}

async function analyzeWithGemini(resumeText) {
  const client = new GoogleGenerativeAI(config.geminiApiKey);
  const model = client.getGenerativeModel({ model: config.geminiModel });
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const result = await Promise.race([
        model.generateContent(`${promptTemplate}\n${resumeText}`),
        wait(AI_REQUEST_TIMEOUT_MS).then(() => {
          throw new Error("Gemini request timed out");
        }),
      ]);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error;
    }

    if (attempt < 2) {
      await wait(600 * attempt);
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

  if (config.openaiApiKey) {
    attempts.push({
      name: `OpenAI (${config.openaiModel})`,
      analyze: analyzeWithOpenAi,
    });
  }

  if (config.geminiApiKey) {
    attempts.push({
      name: `Gemini (${config.geminiModel})`,
      analyze: analyzeWithGemini,
    });
  }

  if (config.openrouterApiKey) {
    config.openrouterModels.forEach((model) => {
      attempts.push({
        name: `OpenRouter (${model})`,
        analyze: (resumeText) => analyzeWithOpenRouter(resumeText, model),
      });
    });
  }

  return attempts;
}

export async function analyzeResumeText(resumeText) {
  const attempts = getAnalysisAttempts();

  if (!attempts.length) {
    console.warn("No AI API keys configured. Falling back to local analysis.");
    return buildLocalAnalysis(resumeText);
  }

  const errors = [];

  for (const attempt of attempts) {
    try {
      const rawText = await attempt.analyze(resumeText);
      return buildAnalysis(rawText, resumeText);
    } catch (error) {
      errors.push(`${attempt.name}: ${describeError(error)}`);
    }
  }

  console.warn(`All AI models failed. Falling back to local analysis. ${errors.join(" | ")}`);
  return buildLocalAnalysis(resumeText);
}
