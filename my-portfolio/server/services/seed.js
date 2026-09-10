import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { Content } from "../models/Content.js";
import { buildDefaultStore } from "../defaultContent.js";
import { config } from "../config.js";
import { invalidateContentCache } from "./content.js";

export async function ensureSeeded({ resetAdmin = false, resetContent = false } = {}) {
  const email = config.adminEmail;
  const password = config.adminPassword;
  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await Admin.create({ email, passwordHash });
    console.log(`  CMS seeded admin: ${email}`);
    console.log(`  Default password: ${password}  (configured via ADMIN_PASSWORD)`);
  } else if (resetAdmin) {
    existingAdmin.passwordHash = await bcrypt.hash(password, 12);
    await existingAdmin.save();
    console.log(`  Admin password reset for ${email} to ${password}`);
  } else {
    console.log(`  Admin account ready: ${email}`);
  }

  const existing = await Content.findOne({ key: "main" });
  if (!existing || resetContent) {
    const { admin: _a, ...payload } = buildDefaultStore({ email: "", passwordHash: "" });
    if (existing && resetContent) {
      Object.assign(existing, payload);
      await existing.save();
      console.log("  Content reset to defaults");
    } else if (!existing) {
      await Content.create({ key: "main", ...payload });
      console.log("  Portfolio content seeded");
    }
    invalidateContentCache();
  } else {
    console.log("  Portfolio content ready in MongoDB");
  }
}
