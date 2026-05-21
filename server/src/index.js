import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import resumeRoutes from "./routes/resumeRoutes.js";
import { config } from "./config.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", cors({ origin: true }));
app.use("/api/resume", resumeRoutes);

app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    next();
    return;
  }

  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.use((error, _req, res, _next) => {
  const message = error.message || "Something went wrong.";
  const status = error.status || 500;
  res.status(status).json({ message });
});

app.listen(config.port, () => {
  console.log(`Resume analyzer server running on port ${config.port}`);
});
