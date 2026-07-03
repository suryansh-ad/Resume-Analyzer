import { crawlerStatus, runCrawler } from "../../../../lib/scraper/index.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth.js";

export const runtime = "nodejs";

const ADMIN_EMAILS = ["admin@fresherr.in", "suryansh@fresherr.in"]; // Allowed administrators list

async function checkAdmin(request) {
  const { user, response } = await getAuthenticatedUser(request);
  if (response) return { error: response };
  
  // Basic check: is the user's email in the admin list?
  const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase());
  if (!isAdmin) {
    return {
      error: Response.json({ message: "Unauthorized. Admin privileges required." }, { status: 403 })
    };
  }
  return { user };
}

export async function GET(request) {
  try {
    const { error } = await checkAdmin(request);
    if (error) return error;

    return Response.json(crawlerStatus);
  } catch (error) {
    return Response.json({ message: error.message || "Failed to fetch crawler status." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { error } = await checkAdmin(request);
    if (error) return error;

    if (crawlerStatus.isCrawling) {
      return Response.json({ message: "Crawler is already active.", status: crawlerStatus });
    }

    // Fire off crawler in background so the request responds immediately and doesn't timeout
    runCrawler();

    return Response.json({ message: "Crawler triggered successfully.", status: crawlerStatus });
  } catch (error) {
    return Response.json({ message: error.message || "Failed to trigger crawler." }, { status: 500 });
  }
}
