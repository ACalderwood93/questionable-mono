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
