import type { IncomingMessage } from "node:http";
import { WebSocketServer } from "ws";
import { LobbyManager } from "./lobbyManager.js";
import { logger } from "./logger.js";
import { IncomingMessageHandler } from "./messages/incoming/incomingMessageHandler.js";

const port = 8080;
const wss = new WebSocketServer({ port });

logger.info(`WebSocket server started on ws://localhost:${port}`);

wss.on("connection", (ws, req: IncomingMessage) => {
  logger.info("Client connected");
  try {
    // Parse URL search params
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const searchParams = new URLSearchParams(url.search);
    const lobbyId = searchParams.get("lobby");
    if (!lobbyId) {
      ws.send(JSON.stringify({ type: "error", error: "No lobby provided" }));
      ws.close();
      return;
    }

    const playerName = searchParams.get("name") || "Player";
    const userId = crypto.randomUUID();
    const lobbyManager = LobbyManager.getInstance();
    const lobby = lobbyManager.createLobbyOrAddUserToLobby(lobbyId, userId, playerName, ws);

    if (!lobby.game) {
      logger.error(`No game found for lobby: ${lobbyId}`);
      ws.close();
      lobbyManager.deleteLobby(lobbyId);
      return;
    }
    const incomingMessageHandler = new IncomingMessageHandler(lobby?.game, userId);
    lobby.socketConnector?.bindIncomingMessageHandler(incomingMessageHandler);
    ws.on("message", (message) => {
      try {
        incomingMessageHandler.handleMessage(message.toString());
      } catch (error) {
        if (error instanceof Error) {
          logger.error("Error when processing incoming message", {
            userId,
            errorMessage: error.message,
            errorStack: error.stack,
            inputMessage: message.toString(),
          });
        }
      }
    });

    ws.on("close", () => {
      logger.info("Client disconnected", { userId, lobbyId });
      lobby.game?.removePlayer(userId);
      lobby.socketConnector?.unbindSocket(userId);

      if (lobby.game?.players.length === 0) {
        logger.info("Deleting lobby", { lobbyId });
        lobbyManager.deleteLobby(lobbyId);
      }
    });

    ws.on("error", (error) => {
      logger.error("WebSocket error", { error });
    });

    // Send a welcome message
    ws.send(`Welcome to lobby: ${lobbyId}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Connection error", {
        errorMessage: error.message,
        errorStack: error.stack,
        errorName: error.name,
        errorCause: error.cause,
      });
      ws.send(JSON.stringify({ type: "error", error: error.message }));
    }
    ws.close();
  }
});

wss.on("error", (error) => {
  logger.error("Server error", { error });
});
