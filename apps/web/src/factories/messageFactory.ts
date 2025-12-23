import {
  askQuestionMessage,
  setUserIdMessage,
} from "../messages/outgoing/messages";
import { UUID } from "crypto";
import { Question } from "../types/question";

export class MessageFactory {
  public static createSetUserIdMessage(userId: UUID): string {
    return JSON.stringify({
      event: "setUserId",
      userId,
    } satisfies setUserIdMessage);
  }

  public static createAskQuestionMessage(question: Question): string {
    return JSON.stringify({
      event: "askQuestion",
      question,
    } satisfies askQuestionMessage);
  }
}
