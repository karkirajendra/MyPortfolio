import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "main", index: true },
    site: { type: mongoose.Schema.Types.Mixed, default: {} },
    skills: { type: [mongoose.Schema.Types.Mixed], default: [] },
    education: { type: [mongoose.Schema.Types.Mixed], default: [] },
    experience: { type: [mongoose.Schema.Types.Mixed], default: [] },
    focusAreas: { type: [mongoose.Schema.Types.Mixed], default: [] },
    processSteps: { type: [mongoose.Schema.Types.Mixed], default: [] },
    projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
    photos: { type: [mongoose.Schema.Types.Mixed], default: [] },
    certificates: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { timestamps: true },
);

export const CONTENT_KEYS = [
  "site",
  "skills",
  "education",
  "experience",
  "focusAreas",
  "processSteps",
  "projects",
  "photos",
  "certificates",
];

export function toPublic(doc) {
  if (!doc) return null;
  const o = typeof doc.toObject === "function" ? doc.toObject() : doc;
  return {
    site: o.site || {},
    skills: o.skills || [],
    education: o.education || [],
    experience: o.experience || [],
    focusAreas: o.focusAreas || [],
    processSteps: o.processSteps || [],
    projects: o.projects || [],
    photos: o.photos || [],
    certificates: o.certificates || [],
  };
}

export const Content = mongoose.model("Content", contentSchema);
