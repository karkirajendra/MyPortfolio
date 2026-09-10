import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { config } from "./config.js";

let bucket;

export async function connectDb() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri, {
    maxPoolSize: 20,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 8_000,
  });
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
