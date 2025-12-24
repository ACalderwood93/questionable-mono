import type { Game } from "../game";
import type { SocketConnector } from "../socketConnector";

export type Lobby = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  game?: Game;
  socketConnector?: SocketConnector;
};
