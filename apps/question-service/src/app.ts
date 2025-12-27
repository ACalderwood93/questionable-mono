import express, { type Express, json, urlencoded } from "express";
import { logger } from "./logger.js";
import { corsMiddleware, errorHandler } from "./middleware/index.js";
import questionRouter from "./routes/questions/question.js";
export const createApp = (): Express => {
  const app = express();

  // Trust proxy (useful for reverse proxies)
  app.set("trust proxy", 1);

  // Body parsing middleware
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // CORS middleware
  app.use(corsMiddleware);

  // Question routes
  app.use("/questions", questionRouter);

  // Request logging middleware
  app.use((req, _, next) => {
    logger.info("Incoming request", {
      method: req.method,
      path: req.path,
      ip: req.ip,
    });
    next();
  });

  // Health check endpoint
  app.get("/health", (_, res) => {
    res.json({ status: "ok", service: "question-service" });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
