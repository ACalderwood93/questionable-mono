import { useState } from "react";
import { ErrorMessage } from "./ErrorMessage";

interface TitleScreenProps {
  onJoin: (lobbyId: string, playerName: string) => void;
  error: string | null;
}

export function TitleScreen({ onJoin, error }: TitleScreenProps) {
  const [lobbyInput, setLobbyInput] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lobbyInput && playerName.trim()) {
      onJoin(lobbyInput, playerName.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white">
      <div className="text-center animate-fadeIn w-full px-4">
        <h1 className="mb-12 text-2xl md:text-4xl flex flex-col items-center gap-4 animate-float">
          <span className="text-6xl">🏆</span>
          <br />
          Quiz Quest
        </h1>
        <section className="bg-gray-800 border-4 border-white p-6 max-w-lg mx-auto text-center">
          <h3 className="text-xl mb-4 border-b-2 border-white pb-2">Join a Lobby</h3>
          {error && <ErrorMessage message={error} size="small" />}

          <p className="text-sm text-gray-400 hover:text-gray-300 mb-4">
            Answer questions to earn PP. Spend PP to shield yourself, damage your opponents, or
            force your opponents to skip the next question.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="player_name" className="block mb-2 text-sm">
                Your Name
              </label>
              <input
                type="text"
                id="player_name"
                className="w-full bg-gray-700 border-2 border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-blue-500 mb-4"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g. QuizMaster"
                maxLength={20}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lobby_id" className="block mb-2 text-sm">
                Lobby Name
              </label>
              <input
                type="text"
                id="lobby_id"
                className="w-full bg-gray-700 border-2 border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-blue-500"
                value={lobbyInput}
                onChange={(e) => setLobbyInput(e.target.value)}
                placeholder="e.g. MEGA-ROOM"
                required
              />
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-400 hover:text-gray-300">
                Enter the lobby name of a game you want to join. If it doesn't already exist this
                will create it for you.
              </p>
            </div>
            <button
              type="submit"
              className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500 px-4 py-2 transition-all hover:scale-105"
              disabled={!lobbyInput || !playerName.trim()}
            >
              START QUEST
            </button>
          </form>
        </section>
        <div className="mt-8">
          <span className="text-4xl">🎮</span>
        </div>
      </div>
    </div>
  );
}
