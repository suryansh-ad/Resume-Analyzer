import { Buffer } from "node:buffer";
import { config } from "../../../../server/src/config.js";
import { extractTextFromFile } from "../../../../server/src/services/extractText.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth";

export const runtime = "nodejs";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export async function POST(request) {
  try {
    const { response } = await getAuthenticatedUser(request);

    if (response) {
      return response;
    }

    const formData = await request.formData();
    const uploadedFile = formData.get("resume") || formData.get("jd") || formData.get("file");

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

    return Response.json({
      file: {
        originalName: uploadedFile.name,
        mimeType: uploadedFile.type,
        size: uploadedFile.size,
      },
      extractedText,
    });
  } catch (error) {
    return Response.json({ message: error.message || "Something went wrong." }, { status: error.status || 500 });
  }
}
