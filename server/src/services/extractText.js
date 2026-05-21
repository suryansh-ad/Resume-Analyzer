import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function extractTextFromFile(file) {
  const extension = file.originalname.split(".").pop()?.toLowerCase();
  const buffer = file.buffer;

  if (!buffer) {
    throw new Error("Uploaded file buffer is missing.");
  }

  if (extension === "pdf") {
    const parsed = await pdfParse(buffer);
    return parsed.text?.trim() || "";
  }

  if (extension === "docx") {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value?.trim() || "";
  }

  throw new Error("Unsupported file type for text extraction.");
}
