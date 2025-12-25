export * from "./types.js";
export {
  questionAnsweredMessageSchema,
  type QuestionAnsweredMessage,
  type IncomingMessage,
  type OutgoingMessage,
  type Player,
  type PlayerUpdateMessage,
  type SetUserIdMessage,
  type AskQuestionMessage,
  type ErrorMessage,
  type AnswerRevealedMessage,
} from "./messages.js";

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const VERSION = "1.0.0";
