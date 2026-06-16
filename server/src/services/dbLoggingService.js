import { supabaseAdmin, supabase } from "../lib/supabase.js";

/**
 * Logs a resume analysis attempt (success or failure) to the database.
 */
export async function logAnalysisAttempt({
  userId,
  fileName,
  fileSize,
  status,
  errorMessage = null,
  atsScore = null,
  resumeScore = null,
}) {
  const dbClient = supabaseAdmin || supabase;

  if (!dbClient) {
    console.warn("[DB Logging] No Supabase client configured. Skipping DB log.");
    return;
  }

  const logData = {
    user_id: userId || null,
    file_name: fileName || null,
    file_size: fileSize ? parseInt(fileSize, 10) : null,
    status,
    error_message: errorMessage || null,
    ats_score: atsScore !== null && atsScore !== undefined ? parseInt(atsScore, 10) : null,
    resume_score: resumeScore !== null && resumeScore !== undefined ? parseInt(resumeScore, 10) : null,
    created_at: new Date().toISOString(),
  };

  try {
    const { error } = await dbClient.from("analysis_logs").insert([logData]);

    if (error) {
      if (error.code === "P0001" || error.message?.includes("does not exist")) {
        console.warn(
          `[DB Logging] WARNING: Could not save log. The table 'analysis_logs' might not exist in your Supabase database.\n` +
          `To fix this, please run the following SQL query in your Supabase SQL Editor:\n\n` +
          `CREATE TABLE analysis_logs (\n` +
          `  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n` +
          `  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,\n` +
          `  file_name TEXT,\n` +
          `  file_size BIGINT,\n` +
          `  status TEXT NOT NULL,\n` +
          `  error_message TEXT,\n` +
          `  ats_score INT,\n` +
          `  resume_score INT,\n` +
          `  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n` +
          `);\n`
        );
      } else {
        console.error("[DB Logging] Failed to insert log to Supabase:", error.message);
      }
    } else {
      console.log(`[DB Logging] Successfully logged analysis attempt (${status}) to database.`);
    }
  } catch (err) {
    console.error("[DB Logging] Exception occurred during database logging:", err.message);
  }
}
