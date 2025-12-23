import { UUID } from "crypto";

export type Question = {
  id: UUID;
  text: string;
  answers: Answer[];
};

export type Answer = {
  id: UUID;
  text: string;
};
