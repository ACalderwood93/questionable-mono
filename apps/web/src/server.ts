import { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { GameManager } from "./gameManager";
import { MessageFactory } from "./factories/messageFactory";

const port = 8080;
const wss = new WebSocketServer({ port });

console.log(`WebSocket server started on ws://localhost:${port}`);

wss.on("connection", (ws, req: IncomingMessage) => {
  console.log("Client connected");

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

  ws.send(MessageFactory.createSetUserIdMessage(userId));

  gameManager.addPlayerToGame(lobby, userId);

  if (gameManager.canGameStart(lobby)) {
    gameManager.startGame(lobby);
    ws.send(MessageFactory.createAskQuestionMessage(game.questions[0]!));
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
  ws.send("Welcome to lobby: " + lobby);
});

wss.on("error", (error) => {
  console.error("Server error:", error);
});
