import { prisma } from "../../../../lib/prisma.js";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ message: "ID parameter is required." }, { status: 400 });
    }

    // 1. Check Job table
    let opportunity = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (opportunity) {
      return Response.json({ type: "JOB", ...opportunity });
    }

    // 2. Check Internship table if not found in Job
    opportunity = await prisma.internship.findUnique({
      where: { id },
      include: { company: true },
    });

    if (opportunity) {
      return Response.json({ type: "INTERNSHIP", ...opportunity });
    }

    return Response.json({ message: "Opportunity not found." }, { status: 404 });
  } catch (error) {
    console.error("[API Job Details] GET Error:", error.message);
    return Response.json({ message: error.message || "Failed to fetch details." }, { status: 500 });
  }
}
