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
    throw new Error("OpenAI response did not include text output.");
  }

  return messageText;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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

    if (attempt < 3) {
      await wait(600 * attempt);
    }
  }

  throw lastError;
}

async function analyzeWithGemini(resumeText) {
  const client = new GoogleGenerativeAI(config.geminiApiKey);
  const model = client.getGenerativeModel({ model: config.geminiModel });
  const result = await model.generateContent(`${promptTemplate}\n${resumeText}`);
  const response = await result.response;
  return response.text();
}

export async function analyzeResumeText(resumeText) {
  if (!config.openaiApiKey && !config.geminiApiKey) {
    throw new Error(
      "Missing AI API key. Add OPENAI_API_KEY or GEMINI_API_KEY to your environment."
    );
  }

  let rawText;

  if (config.openaiApiKey) {
    try {
      rawText = await analyzeWithOpenAi(resumeText);
    } catch (error) {
      if (!config.geminiApiKey) {
        throw error;
      }

      rawText = await analyzeWithGemini(resumeText);
    }
  } else {
    rawText = await analyzeWithGemini(resumeText);
  }

  const jsonString = sanitizeJsonResponse(rawText);
  const parsed = JSON.parse(jsonString);
  const ats = calculateAtsScore(resumeText, parsed);

  return {
    name: parsed.name || "",
    skills: parsed.skills || [],
    technicalSkills: parsed.technicalSkills || [],
    softSkills: parsed.softSkills || [],
    experience: parsed.experience || "",
    education: parsed.education || "",
    projects: parsed.projects || [],
    certifications: parsed.certifications || [],
    strengths: parsed.strengths || [],
    weaknesses: parsed.weaknesses || [],
    missingSkills: parsed.missingSkills || [],
    resumeScore: Number(parsed.resumeScore) || ats.score,
    atsScore: ats.score,
    atsDetails: ats.details,
    suggestions: [...(parsed.suggestions || []), ...ats.recommendations].filter(
      (item, index, array) => array.findIndex((entry) => entry === item) === index
    ),
    recommendedLearning: parsed.recommendedLearning || [],
    jobRoles: parsed.jobRoles || [],
    summary: parsed.summary || "",
  };
}
