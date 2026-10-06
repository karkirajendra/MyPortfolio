import dns from "node:dns";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { config } from "./config.js";

dns.setDefaultResultOrder("ipv4first");

let bucket;

function atlasHint(uri) {
  if (!/mongodb\.net|mongodb\+srv/i.test(uri)) return "";
  return [
    "MongoDB Atlas rejected the TLS handshake (SSL alert 80).",
    "In Atlas → Network Access, allow Render: add 0.0.0.0/0 (or every Render outbound IP).",
    "Use the Atlas mongodb+srv:// connection string as MONGODB_URI on Render.",
  ].join(" ");
}

export async function connectDb() {
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 20,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 15_000,
      family: 4,
    });
  } catch (err) {
    const hint = atlasHint(config.mongoUri);
    if (hint) {
      err.message = `${hint} Original error: ${err.message}`;
    }
    throw err;
  }
  bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
}

export function uploadsBucket() {
  if (!bucket) {
    throw new Error("GridFS is not ready");
  }
  return bucket;
}

export function dbReady() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectDb() {
  bucket = undefined;
  await mongoose.disconnect();
}
