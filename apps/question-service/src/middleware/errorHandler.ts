import type { NextFunction, Request, Response } from "express";
import { logger } from "../logger.js";

export interface HttpError extends Error {
  statusCode?: number;
  status?: number;
}

export class AppError extends Error implements HttpError {
  statusCode: number;
  status: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  logger.error("Request error", {
    method: req.method,
    path: req.path,
    statusCode,
    message: err.message,
    stack: err.stack,
    body: req.body,
    query: req.query,
  });

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};
