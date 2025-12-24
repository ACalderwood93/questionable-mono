import { beforeEach, describe, expect, it } from "vitest";
import { LobbyManager } from "./lobbyManager";

describe("LobbyManager", () => {
  const TEST_LOBBY_CODE = "TEST_LOBBY_CODE";
  beforeEach(() => {
    LobbyManager.resetInstance();
  });

  describe("lobby creation", () => {
    it("should create a lobby", () => {
      const lobbyManager = LobbyManager.getInstance();
      const game = lobbyManager.createLobby(TEST_LOBBY_CODE);
      expect(game).toBeDefined();
      expect(game.id).toBeDefined();
    });

    it("should not create a new lobby for the same lobby code", () => {
      const lobbyManager = LobbyManager.getInstance();
      const game = lobbyManager.createLobby(TEST_LOBBY_CODE);
      const game2 = lobbyManager.createLobby(TEST_LOBBY_CODE);
      expect(game2.id).toBe(game.id);
    });
  });

  describe("getLobby", () => {
    it("should return undefined for non-existent lobby", () => {
      const lobbyManager = LobbyManager.getInstance();
      expect(lobbyManager.getLobby("NON_EXISTENT")).toBeUndefined();
    });

    it("should return the lobby for existing lobby code", () => {
      const lobbyManager = LobbyManager.getInstance();
      const createdGame = lobbyManager.createLobby(TEST_LOBBY_CODE);
      const retrievedGame = lobbyManager.getLobby(TEST_LOBBY_CODE);
      expect(retrievedGame).toBeDefined();
      expect(retrievedGame?.id).toBe(createdGame.id);
    });
  });

  describe("deleteLobby", () => {
    it("should delete a lobby", () => {
      const lobbyManager = LobbyManager.getInstance();
      lobbyManager.createLobby(TEST_LOBBY_CODE);
      lobbyManager.deleteLobby(TEST_LOBBY_CODE);
      expect(lobbyManager.getLobby(TEST_LOBBY_CODE)).toBeUndefined();
    });
  });
});

