import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: rootEnvPath });

export const config = {
  port: Number(process.env.PORT) || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  openrouterApiKey: process.env.OPENROUTER_API_KEY || process.env.ROUTER || "",
  openrouterModels: (
    process.env.OPENROUTER_MODELS ||
    "deepseek/deepseek-v4-flash:free,poolside/laguna-m.1:free,openai/gpt-oss-120b:free"
  )
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  clientUrls: (
    process.env.CLIENT_URLS ||
     "https://resume-analyzer-server-production.up.railway.app/" ||
     "https://resume-analyzer-server-production.up.railway.app" ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10,
};
