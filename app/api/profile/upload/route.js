import { Buffer } from "node:buffer";
import { config } from "../../../../server/src/config.js";
import { extractTextFromFile } from "../../../../server/src/services/extractText.js";
import { analyzeResumeText } from "../../../../server/src/services/aiService.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth";
import { prisma } from "../../../../lib/prisma.js";

export const runtime = "nodejs";
export const maxDuration = 60;

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;

    const formData = await request.formData();
    const uploadedFile = formData.get("resume") || formData.get("file");

    if (!uploadedFile || typeof uploadedFile === "string") {
      return Response.json({ message: "File is required." }, { status: 400 });
    }

    const ext = uploadedFile.name?.split(".").pop()?.toLowerCase();
    const isAllowedExt = ["pdf", "docx", "doc"].includes(ext);

    if (!allowedMimeTypes.includes(uploadedFile.type) && !isAllowedExt) {
      return Response.json({ message: "Only PDF, DOC, and DOCX files are supported." }, { status: 400 });
    }

    const maxBytes = config.maxFileSizeMb * 1024 * 1024;
    if (uploadedFile.size > maxBytes) {
      return Response.json({ message: `File size exceeds the ${config.maxFileSizeMb}MB limit.` }, { status: 413 });
    }

    const buffer = Buffer.from(await uploadedFile.arrayBuffer());
    const file = {
      originalname: uploadedFile.name,
      mimetype: uploadedFile.type,
      size: uploadedFile.size,
      buffer,
    };
    const extractedText = await extractTextFromFile(file);

    if (!extractedText) {
      return Response.json({ message: "We couldn't extract any readable text from that file." }, { status: 422 });
    }

    // Call the resume analyzer AI service to extract skills and roles (interests)
    const analysis = await analyzeResumeText(extractedText);
    const skills = analysis.skills || analysis.technicalSkills || [];
    const interests = analysis.jobRoles || [];

    const experienceYears = extractExperienceYears(extractedText);
    const cityPreference = extractCityPreference(extractedText);

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        skills,
        interests,
        experienceYears,
        cityPreference,
        resumeText: extractedText,
        resumeName: uploadedFile.name,
        hasSkipped: false,
      },
      create: {
        userId: user.id,
        skills,
        interests,
        experienceYears,
        cityPreference,
        resumeText: extractedText,
        resumeName: uploadedFile.name,
        hasSkipped: false,
      },
    });

    return Response.json({ success: true, profile });
  } catch (error) {
    console.error("[POST /api/profile/upload] Error:", error.message);
    return Response.json({ message: error.message || "Something went wrong." }, { status: error.status || 500 });
  }
}

function extractExperienceYears(text) {
  const normalized = (text || "").toLowerCase();
  
  // Try matching "X+ years of experience" or similar
  const matches = normalized.match(/(\d+)\+?\s*(years?|yrs?)\s*(of\s*)?experience/);
  if (matches) {
    return Math.min(10, parseInt(matches[1]) || 0);
  }
  
  // Alternate check for "experience\s*:\s*X"
  const expMatch = normalized.match(/experience\s*:\s*(\d+)/);
  if (expMatch) {
    return Math.min(10, parseInt(expMatch[1]) || 0);
  }
  
  return 0; // Default to fresh grad
}

function extractCityPreference(text) {
  const normalized = (text || "").toLowerCase();
  
  const cities = [
    { name: "Bangalore", match: ["bangalore", "bengaluru"] },
    { name: "Hyderabad", match: ["hyderabad"] },
    { name: "Pune", match: ["pune"] },
    { name: "Gurgaon", match: ["gurgaon", "gurugram"] },
    { name: "Noida", match: ["noida"] },
    { name: "Mumbai", match: ["mumbai"] },
    { name: "Chennai", match: ["chennai"] },
    { name: "Kolkata", match: ["kolkata"] },
    { name: "Remote", match: ["remote", "work from home", "wfh"] }
  ];

  for (const city of cities) {
    for (const pattern of city.match) {
      if (normalized.includes(pattern)) {
        return city.name;
      }
    }
  }
  
  return null;
}
