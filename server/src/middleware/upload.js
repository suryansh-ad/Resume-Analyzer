import multer from "multer";
import { config } from "../config.js";

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function fileFilter(_req, file, callback) {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(new Error("Only PDF and DOCX files are supported."));
    return;
  }

  callback(null, true);
}

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024,
  },
});
