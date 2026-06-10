import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: rootEnvPath });

function env(name, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  groqApiKey: env("GROQ_API_KEY"),
  groqModel: env("GROQ_MODEL", "openai/gpt-oss-120b"),
  openaiApiKey: env("OPENAI_API_KEY"),
  openaiModel: env("OPENAI_MODEL", "gpt-4.1-mini"),
  supabaseUrl: env("NEXT_PUBLIC_SUPABASE_URL") || env("SUPABASE_URL"),
  supabasePublishableKey:
    env("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") || env("SUPABASE_PUBLISHABLE_KEY"),
  supabaseServiceRoleKey: env("SUPABASE_SERVICE_ROLE_KEY"),
  clientUrl: env("CLIENT_URL") || env("NEXT_PUBLIC_SITE_URL") || "http://localhost:3000",
  clientUrls: (
    process.env.CLIENT_URLS ||
    process.env.CLIENT_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  )
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 10,
  aiRequestTimeoutMs: Number(process.env.AI_REQUEST_TIMEOUT_MS) || 15000,
  aiTotalBudgetMs: Number(process.env.AI_TOTAL_BUDGET_MS) || 45000,
};
