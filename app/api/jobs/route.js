import { prisma } from "../../../lib/prisma.js";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "job"; // "job" or "internship"
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const remote = searchParams.get("remote") === "true";
    const experience = searchParams.get("experience") || "";
    const hasSalaryOnly = searchParams.get("hasSalaryOnly") !== "false"; // Defaults to true
    
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const skip = (page - 1) * limit;

    const where = {};

    // 1. Filter by location
    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (remote) {
      where.location = { contains: "remote", mode: "insensitive" };
    }

    // 2. Filter by search query (title, company, description, or skills)
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { company: { name: { contains: search, mode: "insensitive" } } },
        { description: { contains: search, mode: "insensitive" } },
        { skills: { hasSome: [search] } }
      ];
    }

    if (type === "job") {
      // 3. Experience filter (Jobs only)
      if (experience) {
        where.experience = { contains: experience, mode: "insensitive" };
      }

      // 4. Salary filter (Active by default)
      if (hasSalaryOnly) {
        where.salary = {
          not: null,
          notIn: ["", "Not specified", "Competitive", "Not Disclosed", "Competitive Salary"]
        };
      }

      const [jobs, total] = await Promise.all([
        prisma.job.findMany({
          where,
          include: { company: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.job.count({ where }),
      ]);

      return Response.json({
        data: jobs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } else {
      // Internships
      
      // 4. Stipend filter (Active by default)
      if (hasSalaryOnly) {
        where.stipend = {
          not: null,
          notIn: ["", "Not specified", "Competitive", "Not Disclosed", "Unpaid", "Competitive Stipend"]
        };
      }

      const [internships, total] = await Promise.all([
        prisma.internship.findMany({
          where,
          include: { company: true },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.internship.count({ where }),
      ]);

      return Response.json({
        data: internships,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }
  } catch (error) {
    console.error("[GET /api/jobs] Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
