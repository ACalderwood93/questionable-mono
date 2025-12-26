import type { Player, UUID } from "@repo/shared";

interface PlayerScoreboardProps {
  players: Player[];
  currentUserId: UUID | null;
}

export function PlayerScoreboard({ players, currentUserId }: PlayerScoreboardProps) {
  return (
    <>
      <section className="bg-gray-800 border-4 border-white p-6 mb-6">
        <h3 className="text-xl mb-4 border-b-2 border-white pb-2">QUESTERS</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border-2 border-white text-xs">
            <thead>
              <tr className="border-b-2 border-white">
                <th className="border-r-2 border-white p-2 text-left">NAME</th>
                <th className="border-r-2 border-white p-2 text-right">HP</th>
                <th className="border-r-2 border-white p-2 text-right">PP</th>
                <th className="p-2 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr
                  key={player.id}
                  className={`border-b border-gray-600 ${
                    player.id === currentUserId ? "text-blue-400 animate-pulse" : ""
                  } ${player.score <= 0 ? "opacity-50" : ""}`}
                >
                  <td className="border-r-2 border-white p-2">
                    <div className="flex items-center gap-1">
                      {player.id === currentUserId && <span className="mr-1">❤️</span>}
                      {player.id === currentUserId
                        ? "YOU"
                        : player.name || `P-${player.id.slice(0, 3)}`}
                    </div>
                  </td>
                  <td className="border-r-2 border-white p-2 text-right">
                    {player.score <= 0 ? "💀" : player.score}
                  </td>
                  <td className="border-r-2 border-white p-2 text-right">⚡{player.powerPoints}</td>
                  <td className="p-2 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      {player.shields > 0 && (
                        <span className="text-yellow-400">🛡️×{player.shields}</span>
                      )}
                      {player.skipNextQuestion && <span className="text-red-400">⏭️</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-800 border-4 border-white p-4">
        <p className="text-[0.5rem] m-0">TIP: FASTER ANSWERS EARN MORE POWER POINTS!</p>
      </section>
    </>
  );
}
