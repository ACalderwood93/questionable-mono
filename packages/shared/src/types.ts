export type UUID = string;

export type Question = {
  id: UUID;
  text: string;
  answers: Answer[];
  // map userId to answerId
  providedAnswers: Record<UUID, UUID>;
};

export type Answer = {
  id: UUID;
  text: string;
};

export type Player = {
  id: string;
  name: string;
  score: number; // Health/score - can be reduced by attacks
  powerPoints: number; // Currency for actions
  shields: number; // Number of active shields
  skipNextQuestion: boolean; // Whether player must skip next question
};

export type PlayerAction = "attack" | "shield" | "skip";
