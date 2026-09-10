import { config } from "./config.js";
import { connectDb, disconnectDb } from "./db.js";
import { createApp } from "./app.js";
import { ensureSeeded } from "./services/seed.js";

await connectDb();
await ensureSeeded();

const app = createApp();
const server = app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});

async function handleShutdown(signal) {
  console.log(`\nReceived ${signal}, gracefully shutting down API server...`);
  server.close(async () => {
    try {
      await disconnectDb();
      console.log("Database disconnected. Server stopped cleanly.");
      process.exit(0);
    } catch (err) {
      console.error("Error during DB disconnect:", err);
      process.exit(1);
    }
  });
}

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
