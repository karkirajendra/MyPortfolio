import { Router } from "express";
import { dbReady } from "../db.js";
import { getPublicContent } from "../services/content.js";
import { streamUpload } from "../services/files.js";

export const publicRouter = Router();

publicRouter.get("/health", (_req, res) => {
  const db = dbReady();
  res.status(db ? 200 : 503).json({ ok: db, db: db ? "up" : "down" });
});

publicRouter.get("/content", async (_req, res) => {
  const data = await getPublicContent();
  res.setHeader("Cache-Control", "public, max-age=5");
  res.json(data);
});

export function registerUploadStream(app) {
  app.get("/uploads/:id", streamUpload);
}
