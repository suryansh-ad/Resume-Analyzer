import express from "express";
import { v4 as uuid } from "uuid";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { analyzeResumeText } from "../services/aiService.js";
import { extractTextFromFile } from "../services/extractText.js";
import { logAnalysisAttempt } from "../services/dbLoggingService.js";

const router = express.Router();

router.use(requireAuth);

router.post("/upload", upload.single("resume"), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Resume file is required." });
      return;
    }

    const extractedText = await extractTextFromFile(req.file);

    if (!extractedText) {
      res.status(422).json({ message: "We couldn't extract any readable text from that file." });
      return;
    }

    res.json({
      file: {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
      extractedText,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/analyze", async (req, res, next) => {
  let userId = req.user?.id;
  let fileName = req.body.file?.originalName || req.body.file?.name;
  let fileSize = req.body.file?.size;

  try {
    const { extractedText, file } = req.body;

    if (!extractedText) {
      const errorMsg = "Extracted resume text is required.";
      await logAnalysisAttempt({
        userId,
        fileName,
        fileSize,
        status: "failed",
        errorMessage: errorMsg,
      });
      res.status(400).json({ message: errorMsg });
      return;
    }

    const analysis = await analyzeResumeText(extractedText);
    const record = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      userId: req.user.id,
      file,
      analysis,
    };

    // Log success to the database
    await logAnalysisAttempt({
      userId,
      fileName,
      fileSize,
      status: "success",
      atsScore: analysis.atsScore || analysis.ats_score,
      resumeScore: analysis.resumeScore || analysis.resume_score,
    });

    res.json(record);
  } catch (error) {
    // Log failure to the database
    await logAnalysisAttempt({
      userId,
      fileName,
      fileSize,
      status: "failed",
      errorMessage: error.message || "Unknown analysis error",
    });
    next(error);
  }
});

export default router;
