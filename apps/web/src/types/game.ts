import { UUID } from "crypto";
import { Question } from "./question";

export type Game = {
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
