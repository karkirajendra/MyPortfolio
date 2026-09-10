import { Router } from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { Admin } from "../models/Admin.js";
import { getPublicContent, patchContent } from "../services/content.js";
import { deleteUpload, isAllowedFile, saveUpload } from "../services/files.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxBytes },
  fileFilter: (_req, file, cb) => {
    const ok = isAllowedFile(file);
    cb(ok ? null : new Error("Only images and PDF files are allowed"), ok);
  },
});

export const adminRouter = Router();
adminRouter.use(requireAuth);

adminRouter.patch("/content", async (req, res) => {
  const next = await patchContent(req.body || {});
  res.json(next);
});

adminRouter.post("/password", async (req, res) => {
  const current = String(req.body?.current || "");
  const nextPass = String(req.body?.next || "");
  if (nextPass.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }
  const admin = await Admin.findOne({ email: req.admin.email });
  if (!admin) return res.status(401).json({ error: "Account not found" });
  const match = await bcrypt.compare(current, admin.passwordHash);
  if (!match) return res.status(401).json({ error: "Current password is wrong" });
  admin.passwordHash = await bcrypt.hash(nextPass, 12);
  await admin.save();
  res.json({ ok: true });
});

adminRouter.post("/upload", (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err) return res.status(400).json({ error: err.message || "Upload failed" });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      const { url, filename } = await saveUpload(req.file);
      const kind = String(req.body?.kind || "file");
      const content = await getPublicContent();

      if (kind === "portrait" || kind === "about" || kind === "resume") {
        const site = { ...content.site };
        if (kind === "portrait") {
          await deleteUpload(site.portraitUrl);
          site.portraitUrl = url;
        }
        if (kind === "about") {
          await deleteUpload(site.aboutPhotoUrl);
          site.aboutPhotoUrl = url;
        }
        if (kind === "resume") {
          await deleteUpload(site.resumeUrl);
          site.resumeUrl = url;
          if (req.file.originalname) site.resumeDownloadName = req.file.originalname;
        }
        await patchContent({ site });
      }

      if (kind === "gallery" || kind === "photo") {
        const photos = [...(content.photos || [])];
        photos.push({
          id: `ph-${Date.now()}`,
          url,
          alt: String(req.body?.alt || req.file.originalname || "Photo"),
          slot: kind === "gallery" ? "gallery" : String(req.body?.slot || "gallery"),
        });
        await patchContent({ photos });
      }

      if (req.body?.oldUrl) {
        await deleteUpload(req.body.oldUrl);
      }

      res.json({ url, filename });
    } catch (ex) {
      console.error(ex);
      res.status(500).json({ error: "Upload failed" });
    }
  });
});

adminRouter.delete("/upload", async (req, res) => {
  const url = String(req.query?.url || req.body?.url || "");
  if (url) await deleteUpload(url);
  res.json({ ok: true });
});

adminRouter.delete("/photos/:id", async (req, res) => {
  const content = await getPublicContent();
  const photos = content.photos || [];
  const gone = photos.find((p) => p.id === req.params.id);
  if (gone) await deleteUpload(gone.url);
  const next = await patchContent({ photos: photos.filter((p) => p.id !== req.params.id) });
  res.json(next);
});

adminRouter.delete("/certificates/:id", async (req, res) => {
  const content = await getPublicContent();
  const certificates = content.certificates || [];
  const gone = certificates.find((c) => c.id === req.params.id);
  if (gone?.imageUrl) await deleteUpload(gone.imageUrl);
  const next = await patchContent({
    certificates: certificates.filter((c) => c.id !== req.params.id),
  });
  res.json(next);
});

