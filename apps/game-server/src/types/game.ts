import type { UUID } from "node:crypto";
import { MAX_PLAYERS, MIN_PLAYERS } from "../constants.js";
import type { Question } from "./question.js";

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type GameStatus = "waiting" | "started" | "finished" | "cancelled" | "awaitingAnswer";

export class Game {
  public readonly id: UUID;
  public readonly lobbyId: string;
  public players: Player[];
  public readonly createdAt: Date;
  public updatedAt: Date;
  public status: GameStatus;
  public readonly questions: Question[];
  public readonly answers: Map<UUID, UUID>;

  constructor(
    id: UUID,
    lobbyId: string,
    players: Player[],
    questions: Question[],
    answers: Map<UUID, UUID>,
    createdAt?: Date,
    updatedAt?: Date,
    status?: GameStatus
  ) {
    this.id = id;
    this.lobbyId = lobbyId;
    this.players = players;
    this.questions = questions;
    this.answers = answers;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.status = status ?? "waiting";
  }

  public canStart(): boolean {
    return (
      this.players.length >= MIN_PLAYERS && this.questions.length > 0 && this.status === "waiting"
    );
  }

  public start(): void {
    if (this.status !== "waiting") {
      console.error(`Game cannot be started that has already started: ${this.lobbyId}`);
      throw new Error("Game cannot be started that has already started");
    }
    this.status = "started";
    this.updatedAt = new Date();
  }

  public addPlayer(userId: UUID): void {
    console.debug(`Adding player to game: ${this.lobbyId} - ${userId}`);
    if (this.status !== "waiting") {
      throw new Error("User Cannot be added to game that has already started");
    }

    if (this.players.length >= MAX_PLAYERS) {
      throw new Error(`Game cannot have more than ${MAX_PLAYERS} players`);
    }

    if (this.players.some((player) => player.id === userId)) {
      throw new Error("Player already in game");
    }
    this.players.push({ id: userId, name: "Player", score: 0 });
  }

  public removePlayer(userId: UUID): void {
    if (!this.players.some((player) => player.id === userId)) {
      throw new Error("Tried to remove player that is not in game");
    }
    console.debug(`Removing player from game: ${this.lobbyId} - ${userId}`);
    this.players = this.players.filter((player) => player.id !== userId);
  }
}
