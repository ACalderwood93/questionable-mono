import { beforeEach, describe, expect, it } from "vitest";
import { GameManager } from "./gameManager";

describe("GameManager", () => {
  const TEST_LOBBY_CODE = "TEST_LOBBY_CODE";
  beforeEach(() => {
    GameManager.resetInstance();
  });

  describe("game creation", () => {
    it("should create a game", () => {
      const gameManager = GameManager.getInstance();
      const game = gameManager.createGame(TEST_LOBBY_CODE);
      expect(game).toBeDefined();
      expect(game.id).toBeDefined();
    });

    it("should not create a new game for the same lobby code", () => {
      const gameManager = GameManager.getInstance();
      const game = gameManager.createGame(TEST_LOBBY_CODE);
      const game2 = gameManager.createGame(TEST_LOBBY_CODE);
      expect(game2.id).toBe(game.id);
    });
  });

  describe("start game eligibility", () => {
    it("should not be able to start game with no players", () => {
      const gameManager = GameManager.getInstance();
      expect(() => gameManager.startGame(TEST_LOBBY_CODE)).toThrow();
    });

    it("should not be able to start game with less than the Minimum number of players", () => {
      const gameManager = GameManager.getInstance();
      gameManager.createGame(TEST_LOBBY_CODE);
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, crypto.randomUUID());
      expect(gameManager.canGameStart(TEST_LOBBY_CODE)).toBe(false);
    });

    it("should be able to start the game if the minimum number of players is met", () => {
      const gameManager = GameManager.getInstance();
      gameManager.createGame(TEST_LOBBY_CODE);
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, crypto.randomUUID());
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, crypto.randomUUID());
      expect(gameManager.canGameStart(TEST_LOBBY_CODE)).toBe(true);
    });
  });

  describe("players", () => {
    it("should be able to add a player to a game", () => {
      const gameManager = GameManager.getInstance();
      const game = gameManager.createGame(TEST_LOBBY_CODE);
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, crypto.randomUUID());
      expect(game.players.length).toBe(1);
    });

    it("should be able to add multiple players to a game", () => {
      const gameManager = GameManager.getInstance();
      const game = gameManager.createGame(TEST_LOBBY_CODE);
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, crypto.randomUUID());
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, crypto.randomUUID());
      expect(game.players.length).toBe(2);
    });

    it("should throw if the same user is added to the game twice", () => {
      const gameManager = GameManager.getInstance();
      gameManager.createGame(TEST_LOBBY_CODE);
      const userId = crypto.randomUUID();
      gameManager.addPlayerToGame(TEST_LOBBY_CODE, userId);
      expect(() => gameManager.addPlayerToGame(TEST_LOBBY_CODE, userId)).toThrow();
    });
  });
});
