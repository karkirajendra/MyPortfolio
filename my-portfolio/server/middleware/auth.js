import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signToken(email) {
  return jwt.sign({ email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function setAuthCookie(res, token) {
  res.cookie(config.cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(config.cookieName, { path: "/" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  const token =
    req.cookies[config.cookieName] || (header?.startsWith("Bearer ") ? header.slice(7) : null);
  if (!token) return res.status(401).json({ error: "Sign in required" });
  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    return res.status(401).json({ error: "Session expired" });
  }
}
