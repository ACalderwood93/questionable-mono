import type { Player, Question, UUID } from "@repo/shared";
import { atom } from "jotai";

export const userIdAtom = atom<UUID | null>(null);
export const currentQuestionAtom = atom<Question | null>(null);
export const playersAtom = atom<Player[]>([]);
export const gameStatusAtom = atom<string>("waiting");
export const lobbyIdAtom = atom<string | null>(null);
export const playerNameAtom = atom<string>("");
export const socketAtom = atom<WebSocket | null>(null);
export const errorAtom = atom<string | null>(null);
export const userAnswerIdAtom = atom<UUID | null>(null);
export const correctAnswerIdAtom = atom<UUID | null>(null);
export const gameConfigAtom = atom<{
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
} | null>(null);
