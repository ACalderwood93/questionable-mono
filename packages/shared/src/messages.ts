import { z } from "zod";
import type { PlayerAction, Question, UUID } from "./types.js";

export const questionAnsweredMessageSchema = z.object({
  questionId: z.string().uuid(),
  answerId: z.string().uuid(),
  type: z.literal("questionAnswered"),
});

export const togglePlayerReadyMessageSchema = z.object({
  type: z.literal("togglePlayerReady"),
  playerId: z.string().uuid(),
});
export type TogglePlayerReadyMessage = z.infer<typeof togglePlayerReadyMessageSchema>;
export type QuestionAnsweredMessage = z.infer<typeof questionAnsweredMessageSchema>;

export const playerActionMessageSchema = z.object({
  type: z.literal("playerAction"),
  action: z.enum(["attack", "shield", "skip"]),
  targetPlayerId: z.string().uuid().optional(), // Required for attack and skip, not for shield
});
export type PlayerActionMessage = z.infer<typeof playerActionMessageSchema>;

export type IncomingMessage =
  | QuestionAnsweredMessage
  | PlayerActionMessage
  | TogglePlayerReadyMessage;

export type OutgoingMessage =
  | SetUserIdMessage
  | AskQuestionMessage
  | ErrorMessage
  | PlayerUpdateMessage
  | AnswerRevealedMessage
  | ActionResultMessage
  | GameConfigMessage
  | GameFinishedMessage;

export type PlayerUpdateMessage = {
  type: "playerUpdate";
  players: import("./types.js").Player[];
};

export type AnswerRevealedMessage = {
  type: "answerRevealed";
  questionId: UUID;
  answerId: UUID;
  players: import("./types.js").Player[];
};

export type ActionResultMessage = {
  type: "actionResult";
  action: PlayerAction;
  actorId: UUID;
  targetId?: UUID; // Not present for shield (self-target)
  success: boolean;
  message: string;
  players: import("./types.js").Player[]; // Updated player list
};

export type SetUserIdMessage = {
  type: "setUserId";
  userId: UUID;
};

export type AskQuestionMessage = {
  type: "askQuestion";
  question: Question;
};

export type ErrorMessage = {
  type: "error";
  error: string;
};

export type GameConfigMessage = {
  type: "gameConfig";
  config: {
    player: {
      startingHealth: number;
    };
    powerUps: {
      attack: {
        cost: number;
        baseDamage: number;
        powerPointsDrained: number;
        shieldDamageReduction: number;
      };
      shield: {
        cost: number;
        shieldsGained: number;
      };
      skip: {
        cost: number;
        powerPointsDrained: number;
      };
    };
  };
};

export type GameFinishedMessage = {
  type: "gameFinished";
  players: import("./types.js").Player[];
};
