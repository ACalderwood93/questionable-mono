import type { Player, UUID } from "@repo/shared";
import Emittery from "emittery";
import { MAX_PLAYERS, MIN_PLAYERS } from "./constants.js";
import { getConfig } from "./config.js";
import { logger } from "./logger.js";
import type { Question } from "./types/question.js";

export type GameStatus = "waiting" | "started" | "finished" | "cancelled" | "awaitingAnswer";

interface GameEvent {
  playerJoined: Player;
  playerLeft: Player;
  gameStarted: undefined;
  questionChanged: Question;
  playersUpdated: Player[];
  answerRevealed: { questionId: UUID; answerId: UUID; players: Player[] };
  actionPerformed: {
    action: "attack" | "shield" | "skip";
    actorId: UUID;
    targetId?: UUID;
    success: boolean;
    message: string;
    players: Player[];
  };
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

  public togglePlayerReady(playerId: string): void {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error("Player not found");
    }
    player.isReady = !player.isReady;
    this.emit("playersUpdated", this.players);

    if (this.isAllPlayersReady() && this.players.length >= MIN_PLAYERS) {
      logger.debug("All players are ready, starting game", {
        lobbyId: this.lobbyId,
        players: this.players,
      });
      this.start();
    }
  }

  private isAllPlayersReady(): boolean {
    return this.players.every((p) => p.isReady);
  }

  public setNextQuestion(): void {
    this.currentQuestionIndex++;
    this.playerAnswerTimes.clear();

    // Clear skip flags and apply skip effects
    for (const player of this.players) {
      if (player.skipNextQuestion) {
        player.skipNextQuestion = false;
        logger.debug("Player skipped question", { playerId: player.id });
      }
    }

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

    const player = this.players.find((p) => p.id === userId);
    if (!player) {
      throw new Error("Player not found");
    }

    // Check if player is skipping this question
    if (player.skipNextQuestion) {
      logger.debug("Player is skipping this question", { userId, lobbyId: this.lobbyId });
      // Mark as answered but don't award points
      const currentQuestion = this.questions[this.currentQuestionIndex];
      if (currentQuestion) {
        currentQuestion.providedAnswers[userId] = "" as UUID; // Mark as answered but invalid
      }
      // Check if all players have answered (including skipped)
      if (Object.keys(currentQuestion?.providedAnswers || {}).length === this.players.length) {
        this.processAnswers();
      }
      return;
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
      this.processAnswers();
    }
  }

  private processAnswers(): void {
    const currentQuestion = this.questions[this.currentQuestionIndex];
    if (!currentQuestion) {
      throw new Error("No question found");
    }

    const correctAnswer = this.answers.get(currentQuestion.id);
    if (!correctAnswer) {
      throw new Error("Correct answer not found");
    }

    if (!this.currentQuestionStartTime) {
      throw new Error("Question start time not set");
    }

    // Update power points and scores based on time taken
    for (const player of this.players) {
      const providedAnswer = currentQuestion.providedAnswers[player.id as UUID];
      // Skip if player skipped (empty string) or didn't answer correctly
      if (!providedAnswer || providedAnswer === "" || providedAnswer !== correctAnswer) {
        continue;
      }

      // Player answered correctly
      const answerTime = this.playerAnswerTimes.get(player.id as UUID);
      if (!answerTime) {
        logger.warn("Answer time not found for player", { playerId: player.id });
        continue;
      }

      const timeTakenSeconds =
        (answerTime.getTime() - this.currentQuestionStartTime.getTime()) / 1000;

      // Calculate power points based on config
      const config = getConfig();
      const { max, min, timeThreshold } = config.powerPoints;
      // Linear from max (at 0s) to min (at timeThreshold)
      // Anything over timeThreshold gets min points
      let powerPoints = max;
      if (timeTakenSeconds > timeThreshold) {
        powerPoints = min;
      } else {
        powerPoints = Math.max(min, max - timeTakenSeconds);
      }

      player.powerPoints += Math.round(powerPoints);
      logger.debug("Player earned power points", {
        playerId: player.id,
        timeTakenSeconds,
        powerPoints: Math.round(powerPoints),
        newPowerPoints: player.powerPoints,
        newScore: player.score,
      });
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

  public addPlayer(userId: UUID, playerName: string): void {
    logger.debug("Adding player to game", { lobbyId: this.lobbyId, userId, playerName });
    if (this.status !== "waiting") {
      throw new Error("User Cannot be added to game that has already started");
    }

    if (this.players.length >= MAX_PLAYERS) {
      throw new Error(`Game cannot have more than ${MAX_PLAYERS} players`);
    }

    if (this.players.some((player) => player.id === userId)) {
      throw new Error("Player already in game");
    }
    // TODO: Move this logic to a factory
    const config = getConfig();
    const player: Player = {
      id: userId,
      name: playerName || "Player",
      score: config.player.startingHealth,
      powerPoints: 0,
      shields: 0,
      skipNextQuestion: false,
      isReady: false,
    };
    this.players.push(player);
    this.emit("playerJoined", player);
  }

  public removePlayer(userId: UUID): void {
    if (!this.players.some((player) => player.id === userId)) {
      throw new Error("Tried to remove player that is not in game");
    }
    logger.debug("Removing player from game", { lobbyId: this.lobbyId, userId });

    this.emit("playerLeft", this.players.find((player) => player.id === userId) as Player);
    this.players = this.players.filter((player) => player.id !== userId);
  }

  public performAction(actorId: UUID, action: "attack" | "shield" | "skip", targetId?: UUID): void {
    const actor = this.players.find((p) => p.id === actorId);
    if (!actor) {
      throw new Error("Actor not found");
    }

    const config = getConfig();
    // Action costs from config
    const ACTION_COSTS = {
      attack: config.powerUps.attack.cost,
      shield: config.powerUps.shield.cost,
      skip: config.powerUps.skip.cost,
    };

    const cost = ACTION_COSTS[action];

    // Check if player has enough power points
    if (actor.powerPoints < cost) {
      this.emit("actionPerformed", {
        action,
        actorId,
        targetId,
        success: false,
        message: `Not enough power points! Need ${cost}, have ${actor.powerPoints}`,
        players: this.players,
      });
      return;
    }

    // Validate target for attack and skip
    if ((action === "attack" || action === "skip") && !targetId) {
      this.emit("actionPerformed", {
        action,
        actorId,
        targetId,
        success: false,
        message: "Target player required for this action",
        players: this.players,
      });
      return;
    }

    if (action === "attack" || action === "skip") {
      const target = this.players.find((p) => p.id === targetId);
      if (!target) {
        this.emit("actionPerformed", {
          action,
          actorId,
          targetId,
          success: false,
          message: "Target player not found",
          players: this.players,
        });
        return;
      }

      if (target.id === actorId) {
        this.emit("actionPerformed", {
          action,
          actorId,
          targetId,
          success: false,
          message: "Cannot target yourself",
          players: this.players,
        });
        return;
      }
    }

    // Deduct power points
    actor.powerPoints -= cost;

    let message = "";
    const success = true;

    switch (action) {
      case "attack": {
        const target = this.players.find((p) => p.id === targetId);
        if (!target) {
          throw new Error("Target not found");
        }
        const config = getConfig();
        const baseDamage = config.powerUps.attack.baseDamage;
        let actualDamage = baseDamage;
        let shieldsUsed = 0;

        // Shields reduce damage based on config
        while (target.shields > 0 && actualDamage > 0) {
          target.shields--;
          shieldsUsed++;
          actualDamage = Math.max(0, actualDamage - config.powerUps.attack.shieldDamageReduction);
        }

        if (shieldsUsed > 0) {
          message = `${shieldsUsed} shield${shieldsUsed > 1 ? "s" : ""} absorbed damage! ${target.name} took ${actualDamage} damage!`;
        } else {
          message = `${target.name} took ${actualDamage} damage!`;
        }

        // Also reduce target's power points as configured
        if (target.powerPoints > 0) {
          const powerPointsLost = Math.min(config.powerUps.attack.powerPointsDrained, target.powerPoints);
          target.powerPoints -= powerPointsLost;
          if (powerPointsLost > 0) {
            message += ` Lost ${powerPointsLost} power points!`;
          }
        }

        target.score = Math.max(0, target.score - actualDamage);
        logger.debug("Attack performed", {
          actorId,
          targetId,
          damage: actualDamage,
          shieldsUsed,
          targetNewScore: target.score,
        });

        // Check if target is eliminated
        if (target.score <= 0) {
          message += ` ${target.name} has been eliminated!`;
        }
        break;
      }

      case "shield": {
        const config = getConfig();
        const shieldsGained = config.powerUps.shield.shieldsGained;
        actor.shields += shieldsGained;
        message = `${actor.name} gained ${shieldsGained} shield${shieldsGained > 1 ? "s" : ""}! (Total: ${actor.shields})`;
        logger.debug("Shield gained", {
          actorId,
          newShields: actor.shields,
        });
        break;
      }

      case "skip": {
        const target = this.players.find((p) => p.id === targetId);
        if (!target) {
          throw new Error("Target not found");
        }
        target.skipNextQuestion = true;
        const config = getConfig();
        // Also reduce their power points as configured
        const powerPointsLost = Math.min(config.powerUps.skip.powerPointsDrained, target.powerPoints);
        target.powerPoints -= powerPointsLost;

        if (powerPointsLost > 0) {
          message = `${target.name} will skip the next question and lost ${powerPointsLost} power points!`;
        } else {
          message = `${target.name} will skip the next question!`;
        }
        logger.debug("Skip applied", {
          actorId,
          targetId,
          powerPointsLost,
        });
        break;
      }
    }

    this.emit("actionPerformed", {
      action,
      actorId,
      targetId: action === "shield" ? undefined : targetId,
      success,
      message,
      players: this.players,
    });
  }
}
