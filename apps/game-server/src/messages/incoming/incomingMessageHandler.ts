import type { UUID } from "node:crypto";
import Emittery from "emittery";
import type { Game } from "../../game";
import { questionAnsweredMessageSchema } from "./messages";
export interface IncomingMessageHandlerEvent {
  error: string;
}

export class IncomingMessageHandler extends Emittery<IncomingMessageHandlerEvent> {
  private readonly game: Game;
  public readonly userId: UUID;
  constructor(game: Game, userId: UUID) {
    super();
    this.game = game;
    this.userId = userId;
  }
  public handleMessage(message: string): void {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case "questionAnswered":
        {
          const result = questionAnsweredMessageSchema.safeParse(parsedMessage);
          if (!result.success) {
            console.error(`Invalid question answered message: ${result.error.message}`);
            this.emit("error", result.error.message);
            return;
          }
          console.log(`Question answered: ${result.data.questionId} - ${result.data.answerId}`);
          this.game.answerQuestion(this.userId, result.data.answerId as UUID);
        }
        break;
      default:
        throw new Error(`Unknown message type: ${parsedMessage.type}`);
    }
  }
}
