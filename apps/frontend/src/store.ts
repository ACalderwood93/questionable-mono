import { atom } from "jotai";
import type { Question, UUID, Player } from "@repo/shared";

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
