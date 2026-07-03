import { prisma } from "../../../lib/prisma.js";

/**
 * Logs a resume analysis attempt (success or failure) to the database using Prisma.
 */
export async function logAnalysisAttempt({
  userId,
  fileName,
  fileSize,
  status,
  errorMessage = null,
  atsScore = null,
  resumeScore = null,
}) {
  const logData = {
    userId: userId || null,
    fileName: fileName || null,
    fileSize: fileSize ? BigInt(fileSize) : null,
    status,
    errorMessage: errorMessage || null,
    atsScore: atsScore !== null && atsScore !== undefined ? parseInt(atsScore, 10) : null,
    resumeScore: resumeScore !== null && resumeScore !== undefined ? parseInt(resumeScore, 10) : null,
  };

  try {
    await prisma.analysisLog.create({
      data: logData
    });
    console.log(`[DB Logging] Successfully logged analysis attempt (${status}) via Prisma.`);
  } catch (err) {
    console.error("[DB Logging] Exception occurred during database logging using Prisma:", err.message);
  }
}
