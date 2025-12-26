import type { OutgoingMessage, PlayerActionMessage, QuestionAnsweredMessage } from "@repo/shared";
import { useAtom } from "jotai";
import { useCallback, useEffect } from "react";
import {
  correctAnswerIdAtom,
  currentQuestionAtom,
  errorAtom,
  gameStatusAtom,
  lobbyIdAtom,
  playersAtom,
  socketAtom,
  userAnswerIdAtom,
  userIdAtom,
} from "./store";

export const useGameSocket = (lobbyId: string | null, playerName: string) => {
  const [, setUserId] = useAtom(userIdAtom);
  const [, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [, setPlayers] = useAtom(playersAtom);
  const [, setGameStatus] = useAtom(gameStatusAtom);
  const [socket, setSocket] = useAtom(socketAtom);
  const [, setError] = useAtom(errorAtom);
  const [, setUserAnswerId] = useAtom(userAnswerIdAtom);
  const [, setCorrectAnswerId] = useAtom(correctAnswerIdAtom);
  const [, setLobbyId] = useAtom(lobbyIdAtom);

  const connect = useCallback(() => {
    if (!lobbyId || !playerName) return;

    // Get WebSocket URL from environment variable, fallback to localhost for development
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080";
    const encodedName = encodeURIComponent(playerName);
    const ws = new WebSocket(`${wsUrl}?lobby=${lobbyId}&name=${encodedName}`);

    ws.onopen = () => {
      console.log("Connected to server");
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      // Check if it's a string message or JSON
      try {
        const data = JSON.parse(event.data);
        const message = data as OutgoingMessage;

        switch (message.type) {
          case "setUserId":
            setUserId(message.userId);
            break;
          case "askQuestion":
            setCurrentQuestion(message.question);
            setGameStatus("asking");
            setUserAnswerId(null);
            setCorrectAnswerId(null);
            break;
          case "playerUpdate":
            setPlayers(message.players);
            break;
          case "answerRevealed":
            setCorrectAnswerId(message.answerId);
            setPlayers(message.players);
            setGameStatus("revealed");
            break;
          case "actionResult":
            setPlayers(message.players);
            // Show action result message
            if (message.success) {
              console.log(`Action ${message.action}: ${message.message}`);
            } else {
              setError(message.message);
            }
            break;
          case "error":
            setError(message.error);
            setLobbyId(null);
            break;
        }
      } catch {
        console.log("Received non-JSON message:", event.data);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket connection failed");
    };

    return () => {
      ws.close();
    };
  }, [
    lobbyId,
    playerName,
    setUserId,
    setCurrentQuestion,
    setGameStatus,
    setSocket,
    setError,
    setPlayers,
    setUserAnswerId,
    setCorrectAnswerId,
    setLobbyId,
  ]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const sendAnswer = (questionId: string, answerId: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message: QuestionAnsweredMessage = {
        type: "questionAnswered",
        questionId,
        answerId,
      };
      socket.send(JSON.stringify(message));
      setUserAnswerId(answerId);
    }
  };

  const sendAction = (action: "attack" | "shield" | "skip", targetPlayerId?: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const message: PlayerActionMessage = {
        type: "playerAction",
        action,
        targetPlayerId: targetPlayerId as string | undefined,
      };
      socket.send(JSON.stringify(message));
    }
  };

  return { sendAnswer, sendAction };
};
