import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

const isProd = process.env.NODE_ENV === "production";

function resolveCorsOrigin(val) {
  if (!val || val === "true" || val === "*") return true;
  if (val.includes(",")) {
    return val.split(",").map((s) => s.trim());
  }
  return val.trim();
}

export const config = {
  isProd,
  port: Number(process.env.PORT) || 3001,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio",
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: "7d",
  cookieName: "admin_token",
  adminEmail: (process.env.ADMIN_EMAIL || "").toLowerCase().trim(),
  adminPassword: process.env.ADMIN_PASSWORD || "",
  corsOrigin: resolveCorsOrigin(process.env.CORS_ORIGIN),
  uploadMaxBytes: 8 * 1024 * 1024,
  contentCacheMs: 5_000,
  workers: Number(process.env.WEB_CONCURRENCY) || 0,
};
