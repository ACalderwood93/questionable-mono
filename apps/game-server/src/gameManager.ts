import type { UUID } from "node:crypto";
import { MAX_PLAYERS, MIN_PLAYERS } from "./constants.js";
import { createAllQuestionsAndAnswers } from "./factories/questionFactory.js";
import type { Game } from "./types/game.js";

export interface IGameManager {
  createGame(lobbyId: string): Game;
  canGameStart(lobbyId: string): boolean;
  startGame(lobbyId: string): void;
  removePlayerFromGame(lobbyId: string, userId: UUID): void;
  addPlayerToGame(lobbyId: string, userId: UUID): void;
  getGame(lobbyId: string): Game | undefined;
  deleteGame(lobbyId: string): void;
}

export class GameManager implements IGameManager {
  private static instance: GameManager | undefined;
  private games: Map<string, Game>;

  private constructor() {
    this.games = new Map<string, Game>();
  }
  public static resetInstance(): void {
    GameManager.instance = undefined;
  }
  public static getInstance(): IGameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public createGame(lobbyId: string): Game {
    const existingGame = this.getGame(lobbyId);
    if (existingGame) {
      return existingGame;
    }

    console.debug(`Creating game for lobby: ${lobbyId}`);
    // todo this should be updated to use an external questions service
    const [questions, answers] = createAllQuestionsAndAnswers(10);
    const game: Game = {
      id: crypto.randomUUID(),
      lobbyId,
      players: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "waiting",
      questions,
      answers,
    };
    this.games.set(lobbyId, game);
    return game;
  }

  public canGameStart(lobbyId: string): boolean {
    const game = this.getGame(lobbyId);
    if (!game) {
      console.error("Game not found for lobby: ${lobbyId}");
      throw new Error("Game not found");
    }
    return (
      game.players.length >= MIN_PLAYERS && game.questions.length > 0 && game.status === "waiting"
    );
  }

  public startGame(lobbyId: string): void {
    const game = this.getGame(lobbyId);
    if (!game) {
      console.error("Game not found for lobby: ${lobbyId}");
      throw new Error("Game not found");
    }
    if (game.status !== "waiting") {
      console.error(`Game cannot be started that has already started: ${lobbyId}`);
      throw new Error("Game cannot be started that has already started");
    }
    game.status = "started";
    game.updatedAt = new Date();
  }

  public removePlayerFromGame(lobbyId: string, userId: UUID): void {
    const game = this.getGame(lobbyId);
    if (!game) {
      throw new Error("Game not found");
    }

    if (!game.players.some((player) => player.id === userId)) {
      throw new Error("Tried to remove player that is not in game");
    }
    console.debug(`Removing player from game: ${lobbyId} - ${userId}`);
    game.players = game.players.filter((player) => player.id !== userId);
  }

  public addPlayerToGame(lobbyId: string, userId: UUID): void {
    console.debug(`Adding player to game: ${lobbyId} - ${userId}`);
    const game = this.getGame(lobbyId);
    if (!game) {
      throw new Error("Game not found");
    }
    if (game.status !== "waiting") {
      throw new Error("User Cannot be added to game that has already started");
    }

    if (game.players.length >= MAX_PLAYERS) {
      throw new Error(`Game cannot have more than ${MAX_PLAYERS} players`);
    }

    if (game.players.some((player) => player.id === userId)) {
      throw new Error("Player already in game");
    }
    game.players.push({ id: userId, name: "Player", score: 0 });
  }

  public getGame(lobbyId: string): Game | undefined {
    console.debug(`Getting game for lobby: ${lobbyId}`);
    return this.games.get(lobbyId);
  }

  public deleteGame(lobbyId: string): void {
    console.debug(`Deleting game for lobby: ${lobbyId}`);
    this.games.delete(lobbyId);
  }
}
