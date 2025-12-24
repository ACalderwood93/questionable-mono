import type { IncomingMessage } from "node:http";
import { WebSocketServer } from "ws";
import { LobbyManager } from "./lobbyManager.js";
import { IncomingMessageHandler } from "./messages/incoming/messageParser.js";

const port = 8080;
const wss = new WebSocketServer({ port });

console.log(`WebSocket server started on ws://localhost:${port}`);

wss.on("connection", (ws, req: IncomingMessage) => {
  console.log("Client connected");
  try {
    // Parse URL search params
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const searchParams = new URLSearchParams(url.search);
    const lobbyId = searchParams.get("lobby");
    if (!lobbyId) {
      ws.send("No lobby provided");
      ws.close();
      return;
    }

    const userId = crypto.randomUUID();
    const lobbyManager = LobbyManager.getInstance();
    const lobby = lobbyManager.createLobbyOrAddUserToLobby(lobbyId, userId, ws);

    if (!lobby.game) {
      console.error("No game found for lobby: ${lobbyId}");
      ws.close();
      lobbyManager.deleteLobby(lobbyId);
      return;
    }
    const incomingMessageHandler = new IncomingMessageHandler(lobby?.game);
    ws.on("message", (message) => {
      try {
        incomingMessageHandler.handleMessage(message.toString());
      } catch (error) {
        console.error("Error handling message:", error);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      lobby.game?.removePlayer(userId);
      lobby.socketConnector?.unbindSocket(userId);

      if (lobby.game?.players.length === 0) {
        lobbyManager.deleteLobby(lobbyId);
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    // Send a welcome message
    ws.send(`Welcome to lobby: ${lobbyId}`);
  } catch (error) {
    console.error("Error:", error);
    //ws.send(`Error: ${error}`);
    //ws.close();
  }
});

wss.on("error", (error) => {
  console.error("Server error:", error);
});
