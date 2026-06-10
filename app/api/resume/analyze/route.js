import { v4 as uuid } from "uuid";
import { analyzeResumeText } from "../../../../server/src/services/aiService.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);

    if (response) {
      return response;
    }

    const { extractedText, file } = await request.json();

    if (!extractedText) {
      return Response.json({ message: "Extracted resume text is required." }, { status: 400 });
    }

    const analysis = await analyzeResumeText(extractedText);
    const record = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      userId: user.id,
      file,
      analysis,
    };

    return Response.json(record);
  } catch (error) {
    return Response.json({ message: error.message || "Something went wrong." }, { status: error.status || 500 });
  }
}
