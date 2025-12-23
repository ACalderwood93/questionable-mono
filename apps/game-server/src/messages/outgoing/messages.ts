import type { UUID } from "node:crypto";
import type { Question } from "../../types/question.js";

export type setUserIdMessage = {
  event: "setUserId";
  userId: UUID;
};

export type askQuestionMessage = {
  event: "askQuestion";
  question: Question;
};
