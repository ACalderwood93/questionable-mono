import type { OutgoingMessage, UUID } from "@repo/shared";
import type { WebSocket } from "ws";
import { getConfig } from "./config.js";
import type { Game } from "./game.js";
import { logger } from "./logger.js";
import type { IncomingMessageHandler } from "./messages/incoming/incomingMessageHandler.js";

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
      logger.info("Game started", { lobbyId: this.game.lobbyId });
    });

    this.game.on("answerRevealed", (answerRevealed) => {
      this.sendMessageToAllUsers({
        type: "answerRevealed",
        questionId: answerRevealed.questionId,
        answerId: answerRevealed.answerId,
        players: answerRevealed.players,
      });
    });

    this.game.on("playersUpdated", (players) => {
      this.sendMessageToAllUsers({
        type: "playerUpdate",
        players: players,
      });
    });

    this.game.on("playerJoined", (player) => {
      this.sendMessageToUser(player.id, {
        type: "setUserId",
        userId: player.id as UUID,
      });

      // Send game config to the newly joined player
      const config = getConfig();
      this.sendMessageToUser(player.id, {
        type: "gameConfig",
        config: {
          player: {
            startingHealth: config.player.startingHealth,
          },
          powerUps: {
            attack: {
              cost: config.powerUps.attack.cost,
              baseDamage: config.powerUps.attack.baseDamage,
              powerPointsDrained: config.powerUps.attack.powerPointsDrained,
              shieldDamageReduction: config.powerUps.attack.shieldDamageReduction,
            },
            shield: {
              cost: config.powerUps.shield.cost,
              shieldsGained: config.powerUps.shield.shieldsGained,
            },
            skip: {
              cost: config.powerUps.skip.cost,
              powerPointsDrained: config.powerUps.skip.powerPointsDrained,
            },
          },
        },
      });

      this.sendMessageToAllUsers({
        type: "playerUpdate",
        players: this.game.players,
      });
    });

    this.game.on("playerLeft", (_player) => {
      this.sendMessageToAllUsers({
        type: "playerUpdate",
        players: this.game.players,
      });
    });

    this.game.on("gameFinished", () => {
      logger.info("Game finished", { lobbyId: this.game.lobbyId });
    });

    this.game.on("questionChanged", (question) => {
      this.sendMessageToAllUsers({
        type: "askQuestion",
        question: question,
      });
    });

    this.game.on("actionPerformed", (actionResult) => {
      this.sendMessageToAllUsers({
        type: "actionResult",
        action: actionResult.action,
        actorId: actionResult.actorId,
        targetId: actionResult.targetId,
        success: actionResult.success,
        message: actionResult.message,
        players: actionResult.players,
      });
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
