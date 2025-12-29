import type { Question, QuestionCategory, QuestionProvider, UUID } from "@repo/shared";
import type { WebSocket } from "ws";
import { getConfig } from "./config.js";
import {
  convertQuestionsFromService,
  createAllQuestionsAndAnswers,
} from "./factories/questionFactory.js";
import { Game } from "./game.js";
import { logger } from "./logger.js";
import { QuestionServiceClient } from "./services/questionServiceClient.js";
import { SocketConnector } from "./socketConnector.js";
import type { Lobby } from "./types/Lobby.js";

export interface ILobbyManager {
  createLobbyOrAddUserToLobby(
    lobbyId: string,
    userId: UUID,
    playerName: string,
    socket: WebSocket
  ): Promise<Lobby>;
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
  private questionServiceClient: QuestionServiceClient;
  private constructor() {
    this.lobbies = new Map<string, Lobby>();
    this.questionServiceClient = new QuestionServiceClient();
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

  public async createLobbyOrAddUserToLobby(
    lobbyId: string,
    userId: UUID,
    playerName: string,
    socket: WebSocket
  ): Promise<Lobby> {
    const existingLobby = this.getLobby(lobbyId);

    if (existingLobby) {
      existingLobby.socketConnector?.bindSocket(userId, socket);
      existingLobby.game?.addPlayer(userId, playerName);
      return existingLobby;
    }

    // Get question configuration from config file
    const config = getConfig();
    const questionCount = config.questions.count;
    const questionCategory = config.questions.category as QuestionCategory;
    const questionProvider = config.questions.provider as QuestionProvider;

    let questions: Question[];
    let answers: Map<UUID, UUID>;

    try {
      // Fetch questions from question service
      logger.info("Fetching questions from question service", {
        lobbyId,
        category: questionCategory,
        count: questionCount,
        provider: questionProvider,
      });

      const questionsWithAnswers = await this.questionServiceClient.generateQuestions({
        category: questionCategory,
        count: questionCount,
        provider: questionProvider,
      });

      [questions, answers] = convertQuestionsFromService(questionsWithAnswers);
      logger.info("Successfully created questions from question service", {
        lobbyId,
        questionCount: questions.length,
      });
    } catch (error) {
      // Fallback to hardcoded questions if question service fails
      logger.error("Failed to fetch questions from question service, using fallback", {
        lobbyId,
        error: error instanceof Error ? error.message : String(error),
      });
      [questions, answers] = createAllQuestionsAndAnswers(questionCount);
    }

    const game = new Game(crypto.randomUUID(), lobbyId, questions, answers);
    const socketConnector = new SocketConnector(game);

    socketConnector.bindSocket(userId, socket);
    game.addPlayer(userId, playerName);

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
