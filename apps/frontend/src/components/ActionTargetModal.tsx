import type { Player, UUID } from "@repo/shared";

interface ActionTargetModalProps {
  isOpen: boolean;
  action: "attack" | "skip";
  players: Player[];
  currentUserId: UUID | null;
  onSelect: (playerId: string) => void;
  onClose: () => void;
}

export function ActionTargetModal({
  isOpen,
  action,
  players,
  currentUserId,
  onSelect,
  onClose,
}: ActionTargetModalProps) {
  if (!isOpen) return null;

  const targetablePlayers = players.filter((p) => p.id !== currentUserId && p.score > 0);

  const actionInfo = {
    attack: {
      icon: "⚔️",
      title: "SELECT TARGET TO ATTACK",
      description: "Choose a player to attack",
    },
    skip: {
      icon: "⏭️",
      title: "SELECT TARGET TO SKIP",
      description: "Choose a player to force skip next question",
    },
  };

  const info = actionInfo[action];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    >
      <div
        className="bg-gray-800 border-4 border-white p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl">
            {info.icon} {info.title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 px-3 py-1 text-xs transition-all"
          >
            ✕ CLOSE
          </button>
        </div>

        <p className="text-xs mb-4 text-gray-300">{info.description}</p>

        {targetablePlayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No valid targets available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {targetablePlayers.map((player) => (
              <button
                type="button"
                key={player.id}
                onClick={() => onSelect(player.id)}
                className="bg-gray-700 hover:bg-gray-600 border-2 border-gray-600 hover:border-white p-4 text-left transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">
                    {player.name || `P-${player.id.slice(0, 3)}`}
                  </span>
                  {player.score <= 0 && <span className="text-xs">💀</span>}
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>HP:</span>
                    <span className={player.score <= 20 ? "text-red-400" : ""}>{player.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>⚡ PP:</span>
                    <span>{player.powerPoints}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {player.shields > 0 && (
                      <span className="text-yellow-400 text-xs">🛡️×{player.shields}</span>
                    )}
                    {player.skipNextQuestion && <span className="text-red-400 text-xs">⏭️</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
