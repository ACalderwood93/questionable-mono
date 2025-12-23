import type { UUID } from "node:crypto";
import type { askQuestionMessage, setUserIdMessage } from "../messages/outgoing/messages.js";
import type { Question } from "../types/question.js";

export function createSetUserIdMessage(userId: UUID): string {
  return JSON.stringify({
    event: "setUserId",
    userId,
  } satisfies setUserIdMessage);
}

export function createAskQuestionMessage(question: Question): string {
  return JSON.stringify({
    event: "askQuestion",
    question,
  } satisfies askQuestionMessage);
}
