import type { Game } from "../../game";
import {
  type IncomingMessage,
  type QuestionAnsweredMessage,
  questionAnsweredMessageSchema,
} from "./messages";

export class IncomingMessageHandler {
  private readonly game: Game;
  constructor(game: Game) {
    this.game = game;
  }
  public handleMessage(message: string): void {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case "questionAnswered":
        {
          const result = questionAnsweredMessageSchema.safeParse(parsedMessage);
          if (!result.success) {
            throw new Error(`Invalid question answered message: ${result.error.message}`);
          }
          console.log(`Question answered: ${result.data.questionId} - ${result.data.answerId}`);
        }
        break;
      default:
        throw new Error(`Unknown message type: ${parsedMessage.type}`);
    }
  }
}
