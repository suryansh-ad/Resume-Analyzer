import { prisma } from "../../../../../lib/prisma.js";
import { analyzeResumeTextWithJd } from "../../../../../server/src/services/aiService.js";
import { getAuthenticatedUser } from "../../../../../lib/server/auth.js";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { resumeText } = await request.json();

    if (!id) {
      return Response.json({ message: "Opportunity ID is required." }, { status: 400 });
    }

    if (!resumeText) {
      return Response.json({ message: "Resume text is required for matching." }, { status: 400 });
    }

    // 1. Find job or internship
    let description = "";
    let title = "";
    let companyName = "";

    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });

    if (job) {
      title = job.title;
      companyName = job.company.name;
      description = `${job.title} at ${job.company.name}.\nLocation: ${job.location}\nSkills: ${job.skills.join(", ")}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements || ""}\n\nResponsibilities:\n${job.responsibilities || ""}`;
    } else {
      const internship = await prisma.internship.findUnique({
        where: { id },
        include: { company: true },
      });

      if (!internship) {
        return Response.json({ message: "Opportunity not found." }, { status: 404 });
      }

      title = internship.title;
      companyName = internship.company.name;
      description = `${internship.title} internship at ${internship.company.name}.\nLocation: ${internship.location}\nStipend: ${internship.stipend || ""}\nDuration: ${internship.duration || ""}\nSkills: ${internship.skills.join(", ")}\n\nDescription:\n${internship.description}\n\nRequirements:\n${internship.requirements || ""}\n\nResponsibilities:\n${internship.responsibilities || ""}`;
    }

    // 2. Perform AI Matching
    console.log(`[API Job Match] Comparing resume against: "${title}" at ${companyName}`);
    const analysis = await analyzeResumeTextWithJd(resumeText, description);

    // 3. Log the attempt if authenticated
    try {
      const { user } = await getAuthenticatedUser(request);
      if (user) {
        // Create user record in the mapping if missing
        await prisma.users.upsert({
          where: { id: user.id },
          update: { email: user.email },
          create: { id: user.id, email: user.email },
        });

        await prisma.resumeAnalysis.create({
          data: {
            userId: user.id,
            fileName: `Match: ${title}`,
            fileSize: resumeText.length,
            atsScore: analysis.atsCompatibilityScore || 50,
            resumeScore: analysis.overallMatchScore || 50,
            analysisJson: analysis,
          }
        });
      }
    } catch (authError) {
      // Ignore if user is anonymous - matching still works
      console.log("[API Job Match] Anonymous match request, skipping DB log.");
    }

    return Response.json(analysis);
  } catch (error) {
    console.error("[API Job Match] POST Error:", error.message);
    return Response.json({ message: error.message || "Failed to analyze resume compatibility." }, { status: 500 });
  }
}
