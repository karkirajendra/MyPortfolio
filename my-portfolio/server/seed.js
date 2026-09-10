import { connectDb, disconnectDb } from "./db.js";
import { ensureSeeded } from "./services/seed.js";

const resetAdmin = process.argv.includes("--reset-admin");
const resetContent = process.argv.includes("--reset-content");

try {
  await connectDb();
  await ensureSeeded({ resetAdmin, resetContent });
  console.log("Seed complete.");
  await disconnectDb();
  process.exit(0);
} catch (err) {
  console.error("Seed failed. Is MongoDB running and MONGODB_URI correct?");
  console.error(err.message);
  process.exit(1);
}
