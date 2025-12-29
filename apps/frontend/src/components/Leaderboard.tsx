import type { Player, UUID } from "@repo/shared";

interface LeaderboardProps {
  players: Player[];
  currentUserId: UUID | null;
  onLeave: () => void;
}

export function Leaderboard({ players, currentUserId, onLeave }: LeaderboardProps) {
  // Sort players by score (highest first), then by powerPoints as tiebreaker
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.powerPoints - a.powerPoints;
  });

  const getRankEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}.`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-gray-800 border-4 border-white p-8 max-w-2xl w-full">
        <h2 className="text-4xl font-bold mb-2 text-center border-b-4 border-white pb-4">
          GAME OVER
        </h2>
        <h3 className="text-2xl mb-6 text-center">FINAL LEADERBOARD</h3>

        <div className="space-y-4">
          {sortedPlayers.map((player, index) => {
            const isCurrentUser = player.id === currentUserId;
            const isEliminated = player.score <= 0;

            return (
              <div
                key={player.id}
                className={`border-2 border-white p-4 ${
                  isCurrentUser ? "bg-blue-900 border-blue-400 border-4" : "bg-gray-700"
                } ${isEliminated ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-2xl font-bold min-w-[3rem]">{getRankEmoji(index)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                          {isCurrentUser ? "YOU" : player.name}
                        </span>
                        {isCurrentUser && <span className="text-lg">❤️</span>}
                        {isEliminated && <span className="text-lg">💀</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="text-sm text-gray-300">HP</div>
                      <div className="text-xl font-bold">{isEliminated ? "0" : player.score}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-300">PP</div>
                      <div className="text-xl font-bold">⚡{player.powerPoints}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={onLeave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 border-2 border-white text-lg transition-colors"
          >
            RETURN TO LOBBY
          </button>
        </div>
      </div>
    </div>
  );
}
