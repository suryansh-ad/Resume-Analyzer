import { prisma } from "../../../lib/prisma.js";
import { getAuthenticatedUser } from "../../../lib/server/auth.js";

export const runtime = "nodejs";

// GET /api/profile
export async function GET(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return Response.json({ profileExists: false, profile: null });
    }

    return Response.json({ profileExists: true, profile });
  } catch (error) {
    console.error("[GET /api/profile] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/profile
export async function POST(request) {
  try {
    const { user, response } = await getAuthenticatedUser(request);
    if (response) return response;

    const { skills, interests, hasSkipped } = await request.json();

    const normalizedSkills = Array.isArray(skills)
      ? skills.map(s => s.trim()).filter(Boolean)
      : [];
    const normalizedInterests = Array.isArray(interests)
      ? interests.map(i => i.trim()).filter(Boolean)
      : [];

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      update: {
        skills: normalizedSkills,
        interests: normalizedInterests,
        hasSkipped: Boolean(hasSkipped),
      },
      create: {
        userId: user.id,
        skills: normalizedSkills,
        interests: normalizedInterests,
        hasSkipped: Boolean(hasSkipped),
      },
    });

    return Response.json({ success: true, profile });
  } catch (error) {
    console.error("[POST /api/profile] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
