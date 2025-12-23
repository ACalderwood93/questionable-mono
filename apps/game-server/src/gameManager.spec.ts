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

  describe("getGame", () => {
    it("should return undefined for non-existent game", () => {
      const gameManager = GameManager.getInstance();
      expect(gameManager.getGame("NON_EXISTENT")).toBeUndefined();
    });

    it("should return the game for existing lobby code", () => {
      const gameManager = GameManager.getInstance();
      const createdGame = gameManager.createGame(TEST_LOBBY_CODE);
      const retrievedGame = gameManager.getGame(TEST_LOBBY_CODE);
      expect(retrievedGame).toBeDefined();
      expect(retrievedGame?.id).toBe(createdGame.id);
    });
  });

  describe("deleteGame", () => {
    it("should delete a game", () => {
      const gameManager = GameManager.getInstance();
      gameManager.createGame(TEST_LOBBY_CODE);
      gameManager.deleteGame(TEST_LOBBY_CODE);
      expect(gameManager.getGame(TEST_LOBBY_CODE)).toBeUndefined();
    });
  });
});
