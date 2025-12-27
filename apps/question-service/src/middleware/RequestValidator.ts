import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const queryValidator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.safeParse(req.query);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  };
};

export const bodyValidator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.safeParse(req.body);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  };
};

export const paramsValidator = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.safeParse(req.params);
    if (error) {
      res.status(400).json({ error: error.message });
      return;
    }
    next();
  };
};
