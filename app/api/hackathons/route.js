import { prisma } from "../../../lib/prisma.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const mode = searchParams.get("mode") || ""; // "Online", "Offline", "Hybrid"

    const where = {};

    if (mode) {
      where.mode = { equals: mode, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { organizer: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const hackathons = await prisma.hackathon.findMany({
      where,
      orderBy: { deadline: "asc" }, // Show soonest deadlines first
    });

    return Response.json(hackathons);
  } catch (error) {
    console.error("[API Hackathons] GET Error:", error.message);
    return Response.json({ message: error.message || "Failed to fetch hackathons." }, { status: 500 });
  }
}
