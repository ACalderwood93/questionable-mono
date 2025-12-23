import { createAllQuestionsAndAnswers } from "./factories/questionFactory.js";
import { Game } from "./types/game.js";

export interface IGameManager {
  createGame(lobbyId: string): Game;
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
    const game = new Game(crypto.randomUUID(), lobbyId, [], questions, answers);
    this.games.set(lobbyId, game);
    return game;
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
