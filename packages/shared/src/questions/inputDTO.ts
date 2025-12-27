import z from "zod";
import { QuestionCategory, QuestionProvider } from "../types.js";

export const getQuestionsInputQuerySchema = z.object({
  limit: z.number().int().positive().default(10),
  category: z.enum(Object.values(QuestionCategory)).optional(),
});

export const generateQuestionInputBodySchema = z.object({
  category: z.enum(Object.values(QuestionCategory)),
  count: z.number().int().positive().default(1),
  provider: z.enum(Object.values(QuestionProvider)),
});

export type GenerateQuestionInputBody = z.infer<typeof generateQuestionInputBodySchema>;
