import type { UUID } from "node:crypto";
import type { Question } from "./question.js";

export type Game = {
  id: UUID;
  lobbyId: string;
  players: Player[];
  createdAt: Date;
  updatedAt: Date;
  status: "waiting" | "started" | "finished" | "cancelled" | "awaitingAnswer";
  questions: Question[];
  answers: Map<UUID, UUID>;
};

export type Player = {
  id: string;
  name: string;
  score: number;
};
