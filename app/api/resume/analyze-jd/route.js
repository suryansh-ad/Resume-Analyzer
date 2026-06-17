import { v4 as uuid } from "uuid";
import { analyzeResumeTextWithJd } from "../../../../server/src/services/aiService.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth";
import { logAnalysisAttempt } from "../../../../server/src/services/dbLoggingService.js";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  let userId = null;
  let fileName = null;
  let fileSize = null;

  try {
    const { user, response } = await getAuthenticatedUser(request);

    if (response) {
      return response;
    }

    userId = user.id;

    const { extractedText, file, jobDescription } = await request.json();

    if (file) {
      fileName = file.originalName || file.name;
      fileSize = file.size;
    }

    if (!extractedText) {
      const errorMsg = "Extracted resume text is required.";
      await logAnalysisAttempt({
        userId,
        fileName,
        fileSize,
        status: "failed",
        errorMessage: errorMsg,
      });
      return Response.json({ message: errorMsg }, { status: 400 });
    }

    if (!jobDescription || !jobDescription.trim()) {
      const errorMsg = "Job Description is required.";
      await logAnalysisAttempt({
        userId,
        fileName,
        fileSize,
        status: "failed",
        errorMessage: errorMsg,
      });
      return Response.json({ message: errorMsg }, { status: 400 });
    }

    const analysis = await analyzeResumeTextWithJd(extractedText, jobDescription);
    const record = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      userId: user.id,
      file,
      jobDescription,
      analysis,
      isJdAnalysis: true
    };

    // Log success to the database
    // We map overallMatchScore to resumeScore, and atsCompatibilityScore to atsScore
    await logAnalysisAttempt({
      userId,
      fileName,
      fileSize,
      status: "success",
      atsScore: analysis.atsCompatibilityScore,
      resumeScore: analysis.overallMatchScore,
    });

    return Response.json(record);
  } catch (error) {
    // Log failure to the database
    await logAnalysisAttempt({
      userId,
      fileName,
      fileSize,
      status: "failed",
      errorMessage: error.message || "Unknown JD analysis error",
    });

    return Response.json({ message: error.message || "Something went wrong." }, { status: error.status || 500 });
  }
}
