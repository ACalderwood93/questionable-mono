import type { Player, UUID } from "@repo/shared";

interface WaitingScreenProps {
  players: Player[];
  currentUserId: UUID | null;
  onToggleReady: (playerId: string) => void;
}

export function WaitingScreen({
  players,
  currentUserId,
  onToggleReady,
}: WaitingScreenProps) {
  const currentPlayer = currentUserId
    ? players.find((p) => p.id === currentUserId)
    : null;
  const readyCount = players.filter((p) => p.isReady).length;
  const totalPlayers = players.length;
  const allReady = players.length > 0 && players.every((p) => p.isReady);

  return (
    <section className="bg-gray-800 border-4 border-white rounded-lg p-6">
      <h2 className="text-2xl mb-4 border-b-2 border-white pb-2">LOBBY</h2>
      <p className="mb-4">
        {allReady
          ? "ALL QUESTERS READY! GAME STARTING..."
          : `WAITING FOR QUESTERS TO BE READY... (${readyCount}/${totalPlayers})`}
      </p>
      <div className="w-full bg-gray-700 border-2 border-gray-600 h-4 mb-4">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${totalPlayers > 0 ? (readyCount / totalPlayers) * 100 : 0}%` }}
        ></div>
      </div>

      <div className="space-y-2 mb-6">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-3 border-2 ${
              player.id === currentUserId
                ? "border-blue-500 bg-blue-900"
                : "border-gray-600 bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={player.isReady ? "text-green-400" : "text-gray-400"}>
                {player.isReady ? "✓" : "○"}
              </span>
              <span className={player.id === currentUserId ? "text-blue-400 font-bold" : ""}>
                {player.id === currentUserId ? "YOU" : player.name || `P-${player.id.slice(0, 3)}`}
              </span>
            </div>
            {player.isReady && <span className="text-green-400 text-sm">READY</span>}
          </div>
        ))}
      </div>

      {currentPlayer && (
        <div className="text-center">
          <button
            onClick={() => onToggleReady(currentPlayer.id)}
            className={`px-8 py-4 border-4 font-bold text-lg transition-all ${
              currentPlayer.isReady
                ? "bg-red-600 border-red-500 hover:bg-red-700"
                : "bg-green-600 border-green-500 hover:bg-green-700"
            }`}
          >
            {currentPlayer.isReady ? "NOT READY" : "READY"}
          </button>
        </div>
      )}
    </section>
  );
}
