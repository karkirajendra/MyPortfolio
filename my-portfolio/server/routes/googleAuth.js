import { Router } from "express";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { Admin } from "../models/Admin.js";
import { config } from "../config.js";
import { loginLimiter } from "../middleware/rateLimit.js";
import { setAuthCookie, signToken } from "../middleware/auth.js";

export const googleAuthRouter = Router();

const STATE_MAX_AGE_MS = 10 * 60 * 1000;

function googleConfigured() {
  return Boolean(config.googleClientId && config.googleClientSecret);
}

function callbackUrl() {
  return `${config.publicOrigin}/auth/google/callback`;
}

function signState(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", config.jwtSecret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function readState(raw) {
  const [body, sig] = String(raw || "").split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", config.jwtSecret).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (!payload?.t || Date.now() - Number(payload.t) > STATE_MAX_AGE_MS) return null;
    return payload;
  } catch {
    return null;
  }
}

function frontendRedirect(res, query) {
  const params = new URLSearchParams(query);
  const path = query.token ? "/admin" : "/admin/login";
  const qs = params.toString();
  res.redirect(302, `${config.publicOrigin}${path}${qs ? `?${qs}` : ""}`);
}

async function isAllowedAdmin(email) {
  if (!email) return false;
  if (config.adminEmail && email === config.adminEmail) return true;
  const admin = await Admin.findOne({ email }).select("_id").lean();
  return Boolean(admin);
}

googleAuthRouter.get("/google", loginLimiter, (_req, res) => {
  if (!googleConfigured()) {
    return res.status(503).json({
      error: "Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.",
    });
  }

  const state = signState({ n: randomBytes(16).toString("hex"), t: Date.now() });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", config.googleClientId);
  url.searchParams.set("redirect_uri", callbackUrl());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  res.redirect(302, url.toString());
});

googleAuthRouter.get("/google/callback", loginLimiter, async (req, res) => {
  if (!googleConfigured()) {
    return frontendRedirect(res, { error: "not_configured" });
  }
  if (req.query.error) {
    return frontendRedirect(res, { error: String(req.query.error) });
  }

  const state = readState(req.query.state);
  const code = String(req.query.code || "");
  if (!state || !code) {
    return frontendRedirect(res, { error: "oauth_failed" });
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: config.googleClientId,
        client_secret: config.googleClientSecret,
        redirect_uri: callbackUrl(),
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokenRes.ok || !tokens.access_token) {
      return frontendRedirect(res, { error: "oauth_failed" });
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userRes.json();
    const email = String(profile.email || "").toLowerCase().trim();
    if (!userRes.ok || !email || profile.email_verified === false) {
      return frontendRedirect(res, { error: "oauth_failed" });
    }

    if (!(await isAllowedAdmin(email))) {
      return frontendRedirect(res, { error: "not_admin" });
    }

    const token = signToken(email);
    setAuthCookie(res, token);
    return frontendRedirect(res, { token });
  } catch (err) {
    console.error("Google OAuth callback failed:", err);
    return frontendRedirect(res, { error: "oauth_failed" });
  }
});
