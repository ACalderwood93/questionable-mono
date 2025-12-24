import type { UUID } from "node:crypto";

export type Question = {
  id: UUID;
  text: string;
  answers: Answer[];
  // map userId to answerId
  providedAnswers: Map<UUID, UUID>;
};

export type Answer = {
  id: UUID;
  text: string;
};
