export * from "./types.js";
export {
  questionAnsweredMessageSchema,
  playerActionMessageSchema,
  type QuestionAnsweredMessage,
  type PlayerActionMessage,
  type IncomingMessage,
  type OutgoingMessage,
  type PlayerUpdateMessage,
  type SetUserIdMessage,
  type AskQuestionMessage,
  type ErrorMessage,
  type AnswerRevealedMessage,
  type ActionResultMessage,
} from "./messages.js";
export type { Player } from "./types.js";

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const VERSION = "1.0.0";
