import type { UUID } from "node:crypto";
import type { Question } from "../../types/question.js";

export type OutgoingMessage = setUserIdMessage | askQuestionMessage | errorMessage;
export type setUserIdMessage = {
  type: "setUserId";
  userId: UUID;
};

export type askQuestionMessage = {
  type: "askQuestion";
  question: Question;
};

export type errorMessage = {
  type: "error";
  error: string;
};
