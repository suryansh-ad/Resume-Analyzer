import { runCrawler, crawlerStatus } from "../lib/scraper/index.js";

async function execute() {
  console.log("Triggering the Fresherr.in crawler manually to fetch all active opportunities...");
  await runCrawler();
  console.log("Crawler executed. Summary:");
  console.log(`- Jobs Scraped: ${crawlerStatus.jobsScraped}`);
  console.log(`- Internships Scraped: ${crawlerStatus.internshipsScraped}`);
  console.log(`- Failures: ${crawlerStatus.failedUrls.length}`);
}

execute()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Crawler execution failed:", err);
    process.exit(1);
  });
