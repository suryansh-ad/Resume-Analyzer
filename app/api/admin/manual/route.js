import { prisma } from "../../../../lib/prisma.js";
import { getAuthenticatedUser } from "../../../../lib/server/auth.js";

export const runtime = "nodejs";

const ADMIN_EMAILS = ["admin@fresherr.in", "suryansh@fresherr.in"];

async function checkAdmin(request) {
  const { user, response } = await getAuthenticatedUser(request);
  if (response) return { error: response };
  
  const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase());
  if (!isAdmin) {
    return {
      error: Response.json({ message: "Unauthorized. Admin privileges required." }, { status: 403 })
    };
  }
  return { user };
}

export async function POST(request) {
  try {
    const { error } = await checkAdmin(request);
    if (error) return error;

    const body = await request.json();
    const { type, companyName, title, location, salary, experience, skills, description, applyUrl, organizer, prizePool, deadline, mode, teamSize } = body;

    if (!type) {
      return Response.json({ message: "Type is required (JOB, INTERNSHIP, HACKATHON)." }, { status: 400 });
    }

    // 1. Create Hackathon
    if (type === "HACKATHON") {
      if (!title || !organizer || !deadline || !applyUrl) {
        return Response.json({ message: "Name, organizer, deadline, and registration URL are required." }, { status: 400 });
      }

      const hackathon = await prisma.hackathon.create({
        data: {
          name: title,
          organizer,
          prizePool,
          deadline: new Date(deadline),
          mode: mode || "Online",
          teamSize: teamSize || "1-4 members",
          url: applyUrl,
          description: description || "",
          isApproved: true,
        }
      });
      return Response.json({ message: "Hackathon created successfully.", data: hackathon });
    }

    // 2. Create Job / Internship
    if (!companyName || !title || !location || !applyUrl) {
      return Response.json({ message: "Company, title, location, and apply URL are required." }, { status: 400 });
    }

    // Upsert Company
    const dbCompany = await prisma.company.upsert({
      where: { name: companyName },
      update: {},
      create: { name: companyName },
    });

    if (type === "JOB") {
      const job = await prisma.job.create({
        data: {
          title,
          companyId: dbCompany.id,
          location,
          salary,
          experience,
          skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
          description,
          applyUrl,
          type: "Full-time",
          isApproved: true,
          aiSummary: `${title} position at ${companyName}.`,
        }
      });
      return Response.json({ message: "Job created successfully.", data: job });
    }

    if (type === "INTERNSHIP") {
      const internship = await prisma.internship.create({
        data: {
          title,
          companyId: dbCompany.id,
          location,
          stipend: salary,
          duration: "3-6 months",
          skills: skills ? skills.split(",").map(s => s.trim()).filter(Boolean) : [],
          description,
          applyUrl,
          type: "Paid",
          mode: location.toLowerCase().includes("remote") ? "Remote" : "On-site",
          isApproved: true,
          aiSummary: `${title} internship at ${companyName}.`,
        }
      });
      return Response.json({ message: "Internship created successfully.", data: internship });
    }

    return Response.json({ message: "Invalid opportunity type." }, { status: 400 });
  } catch (error) {
    console.error("[API Admin Manual] POST Error:", error.message);
    return Response.json({ message: error.message || "Failed to create opportunity manually." }, { status: 500 });
  }
}
