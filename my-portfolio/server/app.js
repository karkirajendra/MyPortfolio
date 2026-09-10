import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import { config } from "./config.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { authRouter } from "./routes/auth.js";
import { publicRouter, registerUploadStream } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
  );
  app.use(compression());
  app.use(
    cors({
      origin: config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use("/api", (req, res, next) => {
    if (req.path === "/health") return next();
    return apiLimiter(req, res, next);
  });
  app.use("/api", publicRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  registerUploadStream(app);

  if (config.isProd) {
    const dist = path.join(rootDir, "dist");
    if (fs.existsSync(dist)) {
      app.use(express.static(dist));
      app.get(/^(?!\/api\/|\/uploads\/).*/, (_req, res) => {
        res.sendFile(path.join(dist, "index.html"));
      });
    }
  }

  app.use((err, _req, res, _next) => {
    console.error(err);
    const status = Number(err.status || err.statusCode) || 500;
    const message = status === 500 ? "Server error" : err.message || "Request failed";
    res.status(status).json({ error: message });
  });

  return app;
}
