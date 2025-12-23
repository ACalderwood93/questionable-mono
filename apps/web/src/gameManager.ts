import { UUID } from "crypto";
import { Game } from "./types/game";
import { MIN_PLAYERS } from "./constants";
import { QuestionFactory } from "./factories/questionFactory";

export class GameManager {
  private static instance: GameManager;
  private games: Map<string, Game>;

  private constructor() {
    this.games = new Map<string, Game>();
  }

  public static getInstance(): GameManager {
    if (!GameManager.instance) {
      GameManager.instance = new GameManager();
    }
    return GameManager.instance;
  }

  public createGame(lobbyId: string): Game {
    if (this.games.has(lobbyId)) {
      return this.getGame(lobbyId)!;
    }

    console.debug(`Creating game for lobby: ${lobbyId}`);
    // todo this should be updated to use an external questions service
    const [questions, answers] =
      QuestionFactory.createAllQuestionsAndAnswers(10);
    const game: Game = {
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
      game.players.length >= MIN_PLAYERS &&
      game.questions.length > 0 &&
      game.status === "waiting"
    );
  }

  public startGame(lobbyId: string): void {
    const game = this.getGame(lobbyId);
    if (!game) {
      console.error("Game not found for lobby: ${lobbyId}");
      throw new Error("Game not found");
    }
    game.status = "started";
    game.updatedAt = new Date();
  }

  public removePlayerFromGame(lobbyId: string, userId: UUID): void {
    const game = this.getGame(lobbyId);
    if (!game) {
      console.error("Game not found for lobby: ${lobbyId}");
      throw new Error("Game not found");
    }

    if (!game.players.some((player) => player.id === userId)) {
      console.error("Player not found in game: ${lobbyId} - ${userId}");
      throw new Error("Tried to remove player that is not in game");
    }
    console.debug(`Removing player from game: ${lobbyId} - ${userId}`);
    game.players = game.players.filter((player) => player.id !== userId);
  }

  public addPlayerToGame(lobbyId: string, userId: UUID): void {
    console.debug(`Adding player to game: ${lobbyId} - ${userId}`);
    const game = this.getGame(lobbyId);
    if (!game) {
      console.error("Game not found for lobby: ${lobbyId}");
      throw new Error("Game not found");
    }
    if (game.status !== "waiting") {
      console.error(
        `User Cannot be added to game that has already started: ${lobbyId}`
      );
      throw new Error("User Cannot be added to game that has already started");
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
