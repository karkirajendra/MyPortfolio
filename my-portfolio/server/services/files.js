import crypto from "node:crypto";
import path from "node:path";
import { Readable } from "node:stream";
import mongoose from "mongoose";
import { uploadsBucket } from "../db.js";

const EXT_MIME = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export function resolveMime(file) {
  const ext = path.extname(file?.originalname || "").toLowerCase();
  if (file?.mimetype && file.mimetype !== "application/octet-stream") return file.mimetype;
  return EXT_MIME[ext] || file?.mimetype || "";
}

export function isAllowedFile(file) {
  const mime = resolveMime(file);
  return Boolean(EXT_MIME[path.extname(file?.originalname || "").toLowerCase()] || /^(image\/(jpeg|png|webp|gif|svg\+xml)|application\/pdf)$/.test(mime));
}

export async function saveUpload(file) {
  const ext = path.extname(file.originalname || "").toLowerCase().slice(0, 8);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const contentType = resolveMime(file) || "application/octet-stream";
  const bucket = uploadsBucket();
  const id = await new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { originalname: file.originalname || filename },
    });
    Readable.from(file.buffer).pipe(stream);
    stream.on("error", reject);
    stream.on("finish", () => resolve(stream.id));
  });
  return { id: String(id), filename, url: `/uploads/${id}` };
}

function mimeFromDoc(doc) {
  if (doc.contentType && doc.contentType !== "application/octet-stream") return doc.contentType;
  const ext = path.extname(doc.filename || "").toLowerCase();
  return EXT_MIME[ext] || doc.contentType || "application/octet-stream";
}

export function streamUpload(req, res) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).end();
    return;
  }
  const bucket = uploadsBucket();
  const _id = new mongoose.Types.ObjectId(id);
  bucket
    .find({ _id })
    .limit(1)
    .next()
    .then((doc) => {
      if (!doc) {
        res.status(404).end();
        return;
      }
      res.setHeader("Content-Type", mimeFromDoc(doc));
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      if (doc.filename) {
        res.setHeader("Content-Disposition", `inline; filename="${doc.filename}"`);
      }
      bucket.openDownloadStream(_id).on("error", () => res.status(404).end()).pipe(res);
    })
    .catch(() => res.status(404).end());
}

export async function deleteUpload(url) {
  if (!url) return;
  const match = String(url).match(/\/uploads\/([a-f0-9]{24})$/i);
  if (!match) return;
  try {
    await uploadsBucket().delete(new mongoose.Types.ObjectId(match[1]));
  } catch {
    /* already gone */
  }
}
