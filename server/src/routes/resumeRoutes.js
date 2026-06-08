import express from "express";
import { v4 as uuid } from "uuid";
import { upload } from "../middleware/upload.js";
import { requireAuth } from "../middleware/auth.js";
import { analyzeResumeText } from "../services/aiService.js";
import { extractTextFromFile } from "../services/extractText.js";

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
  try {
    const { extractedText, file } = req.body;

    if (!extractedText) {
      res.status(400).json({ message: "Extracted resume text is required." });
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

    res.json(record);
  } catch (error) {
    next(error);
  }
});

export default router;
