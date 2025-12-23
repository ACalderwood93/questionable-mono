import { UUID } from "crypto";
import { Question } from "../../types/question";

export type setUserIdMessage = {
  event: "setUserId";
  userId: UUID;
};

export type askQuestionMessage = {
  event: "askQuestion";
  question: Question;
};
