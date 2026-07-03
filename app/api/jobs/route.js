import { prisma } from "../../../lib/prisma.js";

export const runtime = "nodejs";

// Helper function to expand search terms into variations (e.g., frontend -> front end, front-end, frontend)
function expandSearchQuery(query) {
  const normalized = query.trim().toLowerCase();
  const terms = new Set([normalized]);

  // Frontend variations
  if (normalized.includes("frontend") || normalized.includes("front end") || normalized.includes("front-end")) {
    terms.add("frontend");
    terms.add("front end");
    terms.add("front-end");
  }

  // Backend variations
  if (normalized.includes("backend") || normalized.includes("back end") || normalized.includes("back-end")) {
    terms.add("backend");
    terms.add("back end");
    terms.add("back-end");
  }

  // Fullstack variations
  if (normalized.includes("fullstack") || normalized.includes("full stack") || normalized.includes("full-stack")) {
    terms.add("fullstack");
    terms.add("full stack");
    terms.add("full-stack");
  }

  // React variations
  if (normalized.includes("reactjs") || normalized.includes("react js") || normalized.includes("react.js")) {
    terms.add("reactjs");
    terms.add("react js");
    terms.add("react.js");
    terms.add("react");
  }

  // Node variations
  if (normalized.includes("nodejs") || normalized.includes("node js") || normalized.includes("node.js")) {
    terms.add("nodejs");
    terms.add("node js");
    terms.add("node.js");
    terms.add("node");
  }

  // Add individual keywords if they are descriptive (length > 2)
  const words = normalized.split(/[\s\-]+/);
  words.forEach(word => {
    if (word.length > 2) {
      terms.add(word);
    }
  });

  return Array.from(terms);
}

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

    // 2. Filter by search query with tokenized variations
    if (search) {
      const searchTerms = expandSearchQuery(search);
      const searchConditions = [];

      for (const term of searchTerms) {
        // Build capital variations for exact skills array match checks
        const capitalized = term.charAt(0).toUpperCase() + term.slice(1);
        const upperCase = term.toUpperCase();

        searchConditions.push(
          { title: { contains: term, mode: "insensitive" } },
          { company: { name: { contains: term, mode: "insensitive" } } },
          { description: { contains: term, mode: "insensitive" } },
          { skills: { hasSome: [term, capitalized, upperCase] } }
        );
      }
      
      where.OR = searchConditions;
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
