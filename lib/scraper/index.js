import { prisma } from "../prisma.js";
import { fetchGreenhouseJobs, GREENHOUSE_BOARDS } from "./connectors/greenhouse.js";
import { fetchLeverJobs, LEVER_BOARDS } from "./connectors/lever.js";
import { cleanAndValidateOpportunity } from "./aiCleaner.js";
import { isDuplicateOpportunity } from "./deduplicator.js";

// Global in-memory status object for the admin panel
export const crawlerStatus = {
  isCrawling: false,
  lastRun: null,
  jobsScraped: 0,
  internshipsScraped: 0,
  failedUrls: [],
  logs: []
};

function logMessage(msg) {
  const logStr = `[${new Date().toISOString()}] ${msg}`;
  console.log(logStr);
  crawlerStatus.logs.push(logStr);
  if (crawlerStatus.logs.length > 100) {
    crawlerStatus.logs.shift(); // Keep last 100 logs
  }
}

/**
 * Main function to execute the scraper queue.
 */
export async function runCrawler() {
  if (crawlerStatus.isCrawling) {
    logMessage("Crawler is already running. Skipping trigger.");
    return;
  }

  crawlerStatus.isCrawling = true;
  crawlerStatus.failedUrls = [];
  crawlerStatus.jobsScraped = 0;
  crawlerStatus.internshipsScraped = 0;
  logMessage("Starting crawler job...");

  try {
    const opportunities = [];

    // 1. Fetch from Greenhouse
    for (const board of GREENHOUSE_BOARDS) {
      try {
        const jobs = await fetchGreenhouseJobs(board);
        opportunities.push(...jobs);
      } catch (err) {
        logMessage(`Failed to fetch Greenhouse board: ${board.company}. Error: ${err.message}`);
        crawlerStatus.failedUrls.push({ url: `Greenhouse: ${board.token}`, error: err.message });
      }
    }

    // 2. Fetch from Lever
    for (const board of LEVER_BOARDS) {
      try {
        const jobs = await fetchLeverJobs(board);
        opportunities.push(...jobs);
      } catch (err) {
        logMessage(`Failed to fetch Lever board: ${board.company}. Error: ${err.message}`);
        crawlerStatus.failedUrls.push({ url: `Lever: ${board.token}`, error: err.message });
      }
    }

    logMessage(`Fetched a total of ${opportunities.length} candidate opportunities. Processing with AI Cleaner & Deduplicator...`);

    // 3. Process each opportunity sequentially (to avoid API rate limits)
    for (const opp of opportunities) {
      try {
        // Check duplication
        const duplicate = await isDuplicateOpportunity(opp.title, opp.company, opp.type);
        if (duplicate) {
          logMessage(`[Deduplicator] Skipping duplicate: "${opp.title}" at ${opp.company}`);
          continue;
        }

        logMessage(`[AI Cleaner] Parsing: "${opp.title}" at ${opp.company}...`);
        const cleanedData = await cleanAndValidateOpportunity(opp);

        if (!cleanedData.isIndiaEligible) {
          logMessage(`[Filter] Discarding non-India opportunity: "${opp.title}" at ${opp.company} (Location: ${opp.location})`);
          continue;
        }

        // Upsert Company
        const dbCompany = await prisma.company.upsert({
          where: { name: opp.company },
          update: {},
          create: {
            name: opp.company,
            website: opp.originalUrl ? new URL(opp.originalUrl).origin : null,
          }
        });

        // Save Opportunity
        if (opp.type === "JOB") {
          await prisma.job.create({
            data: {
              title: opp.title,
              companyId: dbCompany.id,
              location: cleanedData.location || opp.location,
              salary: cleanedData.salary,
              experience: cleanedData.experience,
              skills: cleanedData.skills,
              description: cleanedData.cleanedDescription || opp.description,
              applyUrl: opp.originalUrl,
              type: opp.type === "INTERNSHIP" ? "Internship" : "Full-time",
              aiSummary: cleanedData.summary,
              aiSkills: cleanedData.skills,
              aiSalary: cleanedData.salary,
              aiExperience: cleanedData.experience,
              aiTechnologies: cleanedData.technologies,
              aiLocation: cleanedData.location,
              aiAtsKeywords: cleanedData.atsKeywords,
              isApproved: true, // Auto-approve scraped jobs for Phase 1
            }
          });
          crawlerStatus.jobsScraped += 1;
        } else {
          await prisma.internship.create({
            data: {
              title: opp.title,
              companyId: dbCompany.id,
              location: cleanedData.location || opp.location,
              stipend: cleanedData.salary,
              duration: "3-6 months", // Default duration estimate
              skills: cleanedData.skills,
              description: cleanedData.cleanedDescription || opp.description,
              applyUrl: opp.originalUrl,
              type: "Paid", // Default
              mode: opp.location.toLowerCase().includes("remote") ? "Remote" : "On-site",
              aiSummary: cleanedData.summary,
              isApproved: true,
            }
          });
          crawlerStatus.internshipsScraped += 1;
        }

        logMessage(`[Saved] Successfully added: "${opp.title}" at ${opp.company}`);
      } catch (err) {
        logMessage(`Error processing opportunity "${opp.title}" at ${opp.company}: ${err.message}`);
        crawlerStatus.failedUrls.push({ url: opp.originalUrl || `${opp.title} (${opp.company})`, error: err.message });
      }
    }

    crawlerStatus.lastRun = new Date();
    logMessage(`Crawler run complete. Jobs: ${crawlerStatus.jobsScraped}, Internships: ${crawlerStatus.internshipsScraped}, Failed: ${crawlerStatus.failedUrls.length}`);
  } catch (globalErr) {
    logMessage(`Crawler encountered a global error: ${globalErr.message}`);
  } finally {
    crawlerStatus.isCrawling = false;
  }
}
