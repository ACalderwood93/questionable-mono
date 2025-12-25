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
          <table className="w-full border-collapse border-2 border-white">
            <thead>
              <tr className="border-b-2 border-white">
                <th className="border-r-2 border-white p-2 text-left">NAME</th>
                <th className="p-2 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr
                  key={player.id}
                  className={`border-b border-gray-600 ${
                    player.id === currentUserId ? "text-blue-400 animate-pulse" : ""
                  }`}
                >
                  <td className="border-r-2 border-white p-2 text-xs">
                    {player.id === currentUserId && (
                      <span className="mr-1">❤️</span>
                    )}
                    {player.id === currentUserId ? "YOU" : `P-${player.id.slice(0, 3)}`}
                  </td>
                  <td className="p-2 text-right text-sm">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-800 border-4 border-white p-4">
        <p className="text-[0.5rem] m-0">TIP: FASTER ANSWERS EARN GLORY!</p>
      </section>
    </>
  );
}
