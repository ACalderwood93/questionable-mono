import type { UUID } from "@repo/shared";
import type { WebSocket } from "ws";
import { createAllQuestionsAndAnswers } from "./factories/questionFactory.js";
import { Game } from "./game.js";
import { SocketConnector } from "./socketConnector.js";
import type { Lobby } from "./types/Lobby.js";

export interface ILobbyManager {
  createLobbyOrAddUserToLobby(lobbyId: string, userId: UUID, socket: WebSocket): Lobby;
  getLobby(lobbyId: string): Lobby | undefined;
  deleteLobby(lobbyId: string): void;
}
/*
Class used to control all of the game instances running on the server, 
it is a singleton class and is used to create and get game instances,
it is also used to delete game instances when they are no longer needed.

It doesn't handle the game logic, that is handled by the Game class.
*/
export class LobbyManager implements ILobbyManager {
  private static instance: LobbyManager | undefined;
  private lobbies: Map<string, Lobby>;
  private constructor() {
    this.lobbies = new Map<string, Lobby>();
  }
  public static resetInstance(): void {
    LobbyManager.instance = undefined;
  }
  public static getInstance(): ILobbyManager {
    if (!LobbyManager.instance) {
      LobbyManager.instance = new LobbyManager();
    }
    return LobbyManager.instance;
  }

  public createLobbyOrAddUserToLobby(lobbyId: string, userId: UUID, socket: WebSocket): Lobby {
    const existingLobby = this.getLobby(lobbyId);

    if (existingLobby) {
      existingLobby.socketConnector?.bindSocket(userId, socket);
      existingLobby.game?.addPlayer(userId);
      return existingLobby;
    }

    const [questions, answers] = createAllQuestionsAndAnswers(2);
    const game = new Game(crypto.randomUUID(), lobbyId, questions, answers);
    const socketConnector = new SocketConnector(game);

    socketConnector.bindSocket(userId, socket);
    game.addPlayer(userId);

    const newLobby: Lobby = {
      id: lobbyId,
      createdAt: new Date(),
      updatedAt: new Date(),
      game,
      socketConnector,
    };
    this.lobbies.set(lobbyId, newLobby);
    return newLobby;
  }

  public getLobby(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }

  public deleteLobby(lobbyId: string): void {
    this.lobbies.delete(lobbyId);
  }
}
