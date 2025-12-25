import type { OutgoingMessage, QuestionAnsweredMessage } from "@repo/shared";
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

export const useGameSocket = (lobbyId: string | null) => {
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
    if (!lobbyId) return;

    const ws = new WebSocket(`ws://localhost:8080?lobby=${lobbyId}`);

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

  return { sendAnswer };
};
