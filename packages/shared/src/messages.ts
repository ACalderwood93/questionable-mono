import { z } from "zod";
import type { Question, UUID } from "./types.js";

export const questionAnsweredMessageSchema = z.object({
  questionId: z.string().uuid(),
  answerId: z.string().uuid(),
  type: z.literal("questionAnswered"),
});
export type QuestionAnsweredMessage = z.infer<typeof questionAnsweredMessageSchema>;

export type IncomingMessage = QuestionAnsweredMessage;

export type OutgoingMessage =
  | SetUserIdMessage
  | AskQuestionMessage
  | ErrorMessage
  | PlayerUpdateMessage
  | AnswerRevealedMessage;

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type PlayerUpdateMessage = {
  type: "playerUpdate";
  players: Player[];
};

export type AnswerRevealedMessage = {
  type: "answerRevealed";
  questionId: UUID;
  answerId: UUID;
  players: Player[];
};

export type SetUserIdMessage = {
  type: "setUserId";
  userId: UUID;
};

export type AskQuestionMessage = {
  type: "askQuestion";
  question: Question;
};

export type ErrorMessage = {
  type: "error";
  error: string;
};
