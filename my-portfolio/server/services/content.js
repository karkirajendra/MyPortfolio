import { Content, CONTENT_KEYS, toPublic } from "../models/Content.js";
import { config } from "../config.js";

let cache = { data: null, at: 0 };

export function invalidateContentCache() {
  cache = { data: null, at: 0 };
}

export async function getPublicContent() {
  const now = Date.now();
  if (cache.data && now - cache.at < config.contentCacheMs) return cache.data;
  const doc = await Content.findOne({ key: "main" }).lean();
  const data = toPublic(doc) || emptyPublic();
  cache = { data, at: now };
  return data;
}

export async function patchContent(body) {
  const $set = {};
  for (const key of CONTENT_KEYS) {
    if (body[key] !== undefined) $set[key] = body[key];
  }
  if (!Object.keys($set).length) {
    return getPublicContent();
  }
  const doc = await Content.findOneAndUpdate(
    { key: "main" },
    { $set },
    { returnDocument: "after", upsert: true }
  ).lean();
  invalidateContentCache();
  return toPublic(doc);
}

function emptyPublic() {
  return {
    site: {},
    skills: [],
    education: [],
    experience: [],
    focusAreas: [],
    processSteps: [],
    projects: [],
    photos: [],
    certificates: [],
  };
}
