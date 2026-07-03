import { prisma } from "../../../lib/prisma.js";
import { getAuthenticatedUser } from "../../../lib/server/auth.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(bookmarks);
  } catch (error) {
    console.error("[API Bookmarks] GET Error:", error.message);
    return Response.json({ message: error.message || "Failed to fetch bookmarks." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;

    const { opportunityId, opportunityType } = await request.json();

    if (!opportunityId || !opportunityType) {
      return Response.json({ message: "Opportunity ID and Type are required." }, { status: 400 });
    }

    // Ensure the users record exists in the public users schema mapping
    // Since users is a mapped table referencing auth.users, let's upsert the user record 
    // first to avoid relation violations if it doesn't exist yet in the mapped table.
    await prisma.users.upsert({
      where: { id: user.id },
      update: { email: user.email },
      create: { id: user.id, email: user.email },
    });

    // Check if bookmark already exists
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_opportunityType_opportunityId: {
          userId: user.id,
          opportunityType: opportunityType, // "JOB", "INTERNSHIP", "HACKATHON"
          opportunityId: opportunityId,
        },
      },
    });

    if (existing) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return Response.json({ bookmarked: false, message: "Bookmark removed." });
    } else {
      // Add bookmark
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          opportunityType: opportunityType,
          opportunityId: opportunityId,
        },
      });
      return Response.json({ bookmarked: true, message: "Bookmark added successfully." });
    }
  } catch (error) {
    console.error("[API Bookmarks] POST Error:", error.message);
    return Response.json({ message: error.message || "Failed to toggle bookmark." }, { status: 500 });
  }
}
