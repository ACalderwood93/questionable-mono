import { beforeEach, describe, expect, it } from "vitest";
import { Game } from "./game.js";
import { MAX_PLAYERS, MIN_PLAYERS } from "../constants.js";
import { createAllQuestionsAndAnswers } from "../factories/questionFactory.js";

describe("Game", () => {
  let game: Game;
  const TEST_LOBBY_ID = "TEST_LOBBY_ID";

  beforeEach(() => {
    const [questions, answers] = createAllQuestionsAndAnswers(10);
    game = new Game(
      crypto.randomUUID(),
      TEST_LOBBY_ID,
      [],
      questions,
      answers
    );
  });

  describe("canStart", () => {
    it("should return false when game has no players", () => {
      expect(game.canStart()).toBe(false);
    });

    it("should return false when game has less than minimum players", () => {
      game.addPlayer(crypto.randomUUID());
      expect(game.canStart()).toBe(false);
    });

    it("should return false when game status is not waiting", () => {
      game.addPlayer(crypto.randomUUID());
      game.addPlayer(crypto.randomUUID());
      game.start();
      expect(game.canStart()).toBe(false);
    });

    it("should return true when minimum players are met and status is waiting", () => {
      game.addPlayer(crypto.randomUUID());
      game.addPlayer(crypto.randomUUID());
      expect(game.canStart()).toBe(true);
    });
  });

  describe("start", () => {
    it("should change status to started when game is waiting", () => {
      game.addPlayer(crypto.randomUUID());
      game.addPlayer(crypto.randomUUID());
      game.start();
      expect(game.status).toBe("started");
      expect(game.updatedAt).toBeInstanceOf(Date);
    });

    it("should throw error when game is not in waiting status", () => {
      game.addPlayer(crypto.randomUUID());
      game.addPlayer(crypto.randomUUID());
      game.start();
      expect(() => game.start()).toThrow("Game cannot be started that has already started");
    });
  });

  describe("addPlayer", () => {
    it("should add a player to the game", () => {
      const userId = crypto.randomUUID();
      game.addPlayer(userId);
      expect(game.players.length).toBe(1);
      expect(game.players[0]?.id).toBe(userId);
    });

    it("should throw error when game is not in waiting status", () => {
      game.addPlayer(crypto.randomUUID());
      game.addPlayer(crypto.randomUUID());
      game.start();
      expect(() => game.addPlayer(crypto.randomUUID())).toThrow(
        "User Cannot be added to game that has already started"
      );
    });

    it("should throw error when game has maximum players", () => {
      // Add MAX_PLAYERS players
      for (let i = 0; i < MAX_PLAYERS; i++) {
        game.addPlayer(crypto.randomUUID());
      }
      expect(() => game.addPlayer(crypto.randomUUID())).toThrow(
        `Game cannot have more than ${MAX_PLAYERS} players`
      );
    });

    it("should throw error when player is already in game", () => {
      const userId = crypto.randomUUID();
      game.addPlayer(userId);
      expect(() => game.addPlayer(userId)).toThrow("Player already in game");
    });
  });

  describe("removePlayer", () => {
    it("should remove a player from the game", () => {
      const userId = crypto.randomUUID();
      game.addPlayer(userId);
      game.addPlayer(crypto.randomUUID());
      expect(game.players.length).toBe(2);
      game.removePlayer(userId);
      expect(game.players.length).toBe(1);
      expect(game.players.some((p) => p.id === userId)).toBe(false);
    });

    it("should throw error when player is not in game", () => {
      expect(() => game.removePlayer(crypto.randomUUID())).toThrow(
        "Tried to remove player that is not in game"
      );
    });
  });
});

