import cors from "cors";
import express, { type Express, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import "./features/auth/auth.docs";
import { authRouter } from "./features/auth/auth.routes";
import "./shared/auth/passport";
import { env } from "./shared/config/env";
import { createDocsRouter } from "./shared/docs/docs.routes";
import { errorHandler } from "./shared/http/error-handler";
import { notFound } from "./shared/http/not-found";

function rateLimitHandler(_req: Request, res: Response): void {
  res.status(429).json({
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests, please try again later",
    },
  });
}

const rateLimitOptions = {
  windowMs: 15 * 60 * 1000,
  standardHeaders: "draft-7" as const,
  legacyHeaders: false,
  handler: rateLimitHandler,
};

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));

  app.use(rateLimit({ ...rateLimitOptions, limit: 100 }));

  const authLimiter = rateLimit({ ...rateLimitOptions, limit: 10 });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/auth", authLimiter, authRouter);

  if (env.NODE_ENV !== "production") {
    app.use("/docs", createDocsRouter());
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
