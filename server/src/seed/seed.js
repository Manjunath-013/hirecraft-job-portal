import "dotenv/config";
import { connectDB } from "../config/db.js";
import { seedDemoData } from "./seedDemoData.js";

async function seed() {
  await connectDB();
  const result = await seedDemoData({ force: true });
  console.log(`Seeded ${result.jobCount} jobs.`);
  console.log("Demo recruiter: recruiter@hirecraft.test / password123");
  console.log("Demo candidate: candidate@hirecraft.test / password123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
