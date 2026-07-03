import { runCrawler } from "../../../../lib/scraper/index.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    // 1. Optional security check: Verify Vercel Cron or generic secret header
    const authHeader = request.headers.get("authorization") || "";
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("[Cron Job] Automated crawl triggered.");
    
    // 2. Trigger crawler in background
    runCrawler();

    return Response.json({
      message: "Automated crawl triggered successfully in the background."
    });
  } catch (error) {
    console.error("[Cron Job] Error:", error.message);
    return Response.json({ message: error.message || "Failed to trigger cron crawl." }, { status: 500 });
  }
}
