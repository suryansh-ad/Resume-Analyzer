import cors from "cors";
import express from "express";
import resumeRoutes from "./routes/resumeRoutes.js";
import { config } from "./config.js";

const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/resume", resumeRoutes);

app.use((error, _req, res, _next) => {
  const message = error.message || "Something went wrong.";
  const status = error.status || 500;
  res.status(status).json({ message });
});

app.listen(config.port, () => {
  console.log(`Resume analyzer server running on port ${config.port}`);
});
