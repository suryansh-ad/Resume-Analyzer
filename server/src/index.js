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

const allowedOrigins = config.clientUrls;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Request origin is not allowed by CORS."));
    },
  })
);
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

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
