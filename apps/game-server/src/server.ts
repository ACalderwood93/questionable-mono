import type { IncomingMessage } from "node:http";
import { WebSocketServer } from "ws";
import { createAskQuestionMessage, createSetUserIdMessage } from "./factories/messageFactory.js";
import { GameManager } from "./gameManager.js";

const port = 8080;
const wss = new WebSocketServer({ port });

console.log(`WebSocket server started on ws://localhost:${port}`);

wss.on("connection", (ws, req: IncomingMessage) => {
  console.log("Client connected");

  try {
    // Parse URL search params
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const searchParams = new URLSearchParams(url.search);
    const lobby = searchParams.get("lobby");

    const userId = crypto.randomUUID();
    console.log(`User ID: ${userId}`);

    if (!lobby) {
      ws.send("No lobby provided");
      ws.close();
      return;
    }

    const gameManager = GameManager.getInstance();
    const game = gameManager.createGame(lobby);

    ws.send(createSetUserIdMessage(userId));

    gameManager.addPlayerToGame(lobby, userId);

    if (gameManager.canGameStart(lobby)) {
      gameManager.startGame(lobby);
      const firstQuestion = game.questions[0];
      if (firstQuestion) {
        ws.send(createAskQuestionMessage(firstQuestion));
      }
    }

    ws.on("message", (message) => {
      console.log(`Received: ${message.toString()}`);
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      gameManager.removePlayerFromGame(lobby, userId);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Send a welcome message
    ws.send(`Welcome to lobby: ${lobby}`);
  } catch (error) {
    console.error("Error:", error);
    ws.send(`Error: ${error}`);
    ws.close();
  }
});

wss.on("error", (error) => {
  console.error("Server error:", error);
});
