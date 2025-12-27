export * from "./types.js";
export {
  questionAnsweredMessageSchema,
  playerActionMessageSchema,
  togglePlayerReadyMessageSchema,
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
  type TogglePlayerReadyMessage,
} from "./messages.js";
export type { Player } from "./types.js";
export {
  getQuestionsInputQuerySchema,
  generateQuestionInputBodySchema,
  type GenerateQuestionInputBody,
} from "./questions/inputDTO.js";
export { QuestionCategory, QuestionProvider } from "./types.js";

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export const VERSION = "1.0.0";
