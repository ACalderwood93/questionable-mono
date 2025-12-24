import { z } from "zod";

export const questionAnsweredMessageSchema = z.object({
  questionId: z.uuidv4(),
  answerId: z.uuidv4(),
  type: z.literal("questionAnswered").optional(),
});
export type QuestionAnsweredMessage = z.infer<typeof questionAnsweredMessageSchema>;

export type IncomingMessage = QuestionAnsweredMessage;
