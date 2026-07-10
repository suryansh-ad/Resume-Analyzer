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

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        skills,
        interests,
        resumeText: extractedText,
        resumeName: uploadedFile.name,
        hasSkipped: false,
      },
      create: {
        userId: user.id,
        skills,
        interests,
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
