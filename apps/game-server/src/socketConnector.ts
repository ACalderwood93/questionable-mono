import type { UUID } from "node:crypto";
import type { WebSocket } from "ws";
import type { Game } from "./game";
import type { IncomingMessageHandler } from "./messages/incoming/incomingMessageHandler";
import type { OutgoingMessage, askQuestionMessage } from "./messages/outgoing/messages";

/* 
this class is responsbile for bridging the gap between the game logic and the underlying websocket connection, 
it listens to events from the game and then sends the appropriate messages to the websocket clients.

*/
export class SocketConnector {
  private readonly socketUserMap: Map<string, WebSocket>;
  private readonly game: Game;
  private incomingMessageHandler?: IncomingMessageHandler;
  constructor(game: Game) {
    this.game = game;
    this.socketUserMap = new Map<string, WebSocket>();

    this.bindListeners();
  }

  public bindIncomingMessageHandler(incomingMessageHandler: IncomingMessageHandler) {
    this.incomingMessageHandler = incomingMessageHandler;
    this.incomingMessageHandler.on("error", (error) => {
      this.sendMessageToUser(incomingMessageHandler.userId, { type: "error", error: error });
    });
  }
  private bindListeners() {
    this.game.on("gameStarted", () => {
      console.log("gameStarted");
    });

    this.game.on("playerJoined", (player) => {
      this.sendMessageToUser(player.id, {
        type: "setUserId",
        userId: player.id as UUID,
      });
    });

    this.game.on("gameFinished", () => {
      console.log("gameFinished");
    });

    this.game.on("questionChanged", (question) => {
      this.sendMessageToAllUsers({
        type: "askQuestion",
        question: question,
      } satisfies askQuestionMessage);
    });
  }
  public bindSocket(userId: string, socket: WebSocket): void {
    this.socketUserMap.set(userId, socket);
  }
  public unbindSocket(userId: string): void {
    this.socketUserMap.delete(userId);
  }
  public getSocket(userId: string): WebSocket | undefined {
    return this.socketUserMap.get(userId);
  }

  private sendMessageToUser(userId: string, message: OutgoingMessage): void {
    const socket = this.getSocket(userId);

    socket?.send(JSON.stringify(message));
  }

  private sendMessageToAllUsers(message: OutgoingMessage): void {
    for (const socket of this.socketUserMap.values()) {
      socket.send(JSON.stringify(message));
    }
  }
}
