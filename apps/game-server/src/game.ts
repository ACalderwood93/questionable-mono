import type { UUID } from "@repo/shared";
import Emittery from "emittery";
import { MAX_PLAYERS, MIN_PLAYERS } from "./constants.js";
import { logger } from "./logger.js";
import type { Question } from "./types/question.js";

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type GameStatus = "waiting" | "started" | "finished" | "cancelled" | "awaitingAnswer";

interface GameEvent {
  playerJoined: Player;
  playerLeft: Player;
  gameStarted: undefined;
  questionChanged: Question;
  answerRevealed: { questionId: UUID; answerId: UUID; players: Player[] };
  gameFinished: undefined;
}
export class Game extends Emittery<GameEvent> {
  public readonly id: UUID;
  public readonly lobbyId: string;
  public players: Player[];
  public readonly createdAt: Date;
  public updatedAt: Date;
  public status: GameStatus;
  public readonly questions: Question[];
  private currentQuestionIndex: number;
  public readonly answers: Map<UUID, UUID>;
  private currentQuestionStartTime: Date | null = null;
  private playerAnswerTimes: Map<UUID, Date> = new Map();

  constructor(
    id: UUID,
    lobbyId: string,
    questions: Question[],
    answers: Map<UUID, UUID>,
    createdAt?: Date,
    updatedAt?: Date,
    status?: GameStatus
  ) {
    super();
    this.id = id;
    this.lobbyId = lobbyId;
    this.players = [];
    this.questions = questions;
    this.answers = answers;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.status = status ?? "waiting";
    this.currentQuestionIndex = -1;
  }

  public start(): void {
    if (this.status !== "waiting") {
      logger.error(`Game cannot be started that has already started: ${this.lobbyId}`);
      throw new Error("Game cannot be started that has already started");
    }

    if (this.questions.length === 0) {
      throw new Error("No questions provided");
    }
    this.status = "started";
    this.updatedAt = new Date();
    this.emit("gameStarted");

    this.setNextQuestion();
  }

  public setNextQuestion(): void {
    this.currentQuestionIndex++;
    this.playerAnswerTimes.clear();

    const nextQuestion = this.questions[this.currentQuestionIndex];
    if (!nextQuestion) {
      this.status = "finished";
      this.emit("gameFinished");
      return;
    }
    this.currentQuestionStartTime = new Date();
    this.emit("questionChanged", nextQuestion);
    this.status = "awaitingAnswer";
  }

  public answerQuestion(userId: UUID, answerId: UUID): void {
    if (this.status !== "awaitingAnswer") {
      throw new Error("Game is not awaiting answers");
    }

    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (!currentQuestion) {
      throw new Error("No question found");
    }
    if (currentQuestion.providedAnswers[userId]) {
      logger.warn("User has already answered this question", {
        userId,
        answerId,
        lobbyId: this.lobbyId,
      });
      return;
    }
    currentQuestion.providedAnswers[userId] = answerId;
    this.playerAnswerTimes.set(userId, new Date());
    logger.debug("User answered question", { userId, answerId, lobbyId: this.lobbyId });

    if (Object.keys(currentQuestion.providedAnswers).length === this.players.length) {
      const correctAnswer = this.answers.get(currentQuestion.id);

      if (!this.currentQuestionStartTime) {
        throw new Error("Question start time not set");
      }

      // Update scores based on time taken
      for (const player of this.players) {
        if (currentQuestion.providedAnswers[player.id as UUID] === correctAnswer) {
          const answerTime = this.playerAnswerTimes.get(player.id as UUID);
          if (!answerTime) {
            logger.warn("Answer time not found for player", { playerId: player.id });
            continue;
          }

          const timeTakenSeconds =
            (answerTime.getTime() - this.currentQuestionStartTime.getTime()) / 1000;

          // Calculate points: max 20, min 5
          // Linear from 20 (at 0s) to 5 (at 15s)
          // Anything over 15s gets 5 points
          let points = 20;
          if (timeTakenSeconds > 15) {
            points = 5;
          } else {
            points = Math.max(5, 20 - timeTakenSeconds);
          }

          player.score += Math.round(points);
          logger.debug("Player scored points", {
            playerId: player.id,
            timeTakenSeconds,
            points: Math.round(points),
            newScore: player.score,
          });
        }
      }

      // check answers then move to next question
      this.emit("answerRevealed", {
        questionId: currentQuestion.id,
        answerId: correctAnswer as UUID,
        players: this.players,
      });

      // Move to next question after 3 seconds
      setTimeout(() => {
        this.setNextQuestion();
      }, 3000);
    }
  }

  public addPlayer(userId: UUID): void {
    logger.debug("Adding player to game", { lobbyId: this.lobbyId, userId });
    if (this.status !== "waiting") {
      throw new Error("User Cannot be added to game that has already started");
    }

    if (this.players.length >= MAX_PLAYERS) {
      throw new Error(`Game cannot have more than ${MAX_PLAYERS} players`);
    }

    if (this.players.some((player) => player.id === userId)) {
      throw new Error("Player already in game");
    }
    const player = { id: userId, name: "Player", score: 0 };
    this.players.push(player);
    this.emit("playerJoined", player);

    if (this.players.length >= MIN_PLAYERS) {
      this.start();
    }
  }

  public removePlayer(userId: UUID): void {
    if (!this.players.some((player) => player.id === userId)) {
      throw new Error("Tried to remove player that is not in game");
    }
    logger.debug("Removing player from game", { lobbyId: this.lobbyId, userId });

    this.emit("playerLeft", this.players.find((player) => player.id === userId) as Player);
    this.players = this.players.filter((player) => player.id !== userId);
  }
}
