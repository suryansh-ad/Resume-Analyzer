import { prisma } from "../prisma.js";

/**
 * Checks if a similar opportunity already exists in the database.
 */
export async function isDuplicateOpportunity(title, companyName, type = "JOB") {
  try {
    const cleanTitle = title.trim();
    const cleanCompany = companyName.trim();

    if (type === "JOB") {
      const existing = await prisma.job.findFirst({
        where: {
          title: { equals: cleanTitle, mode: "insensitive" },
          company: {
            name: { equals: cleanCompany, mode: "insensitive" },
          },
        },
      });
      return !!existing;
    } else if (type === "INTERNSHIP") {
      const existing = await prisma.internship.findFirst({
        where: {
          title: { equals: cleanTitle, mode: "insensitive" },
          company: {
            name: { equals: cleanCompany, mode: "insensitive" },
          },
        },
      });
      return !!existing;
    } else if (type === "HACKATHON") {
      const existing = await prisma.hackathon.findFirst({
        where: {
          name: { equals: cleanTitle, mode: "insensitive" },
        },
      });
      return !!existing;
    }
  } catch (error) {
    console.error("[Deduplicator] Error checking duplicate opportunity:", error.message);
  }
  return false;
}
