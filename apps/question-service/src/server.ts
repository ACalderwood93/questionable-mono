// Load environment variables from .env file in development
// This must be loaded before any other imports that use process.env
import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  config();
}

import "reflect-metadata";
import { createApp } from "./app.js";
import { logger } from "./logger.js";

const port = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;

const app = createApp();

// Start server - bind to 0.0.0.0 to accept connections from other containers
const server = app.listen(port, "0.0.0.0", () => {
  logger.info(`Question service started on port ${port}`, {
    port,
    nodeEnv: process.env.NODE_ENV || "development",
  });
});

// Graceful shutdown
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error("Forcing shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error });
  shutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", { reason, promise });
  shutdown("unhandledRejection");
});
