import type { Player, UUID } from "@repo/shared";
import { useState } from "react";
import { ActionTargetModal } from "./ActionTargetModal";

interface ActionPanelProps {
  players: Player[];
  currentUserId: UUID | null;
  onAction: (action: "attack" | "shield" | "skip", targetId?: string) => void;
}

export function ActionPanel({ players, currentUserId, onAction }: ActionPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"attack" | "skip" | null>(null);

  const currentPlayer = players.find((p) => p.id === currentUserId);
  const otherPlayers = players.filter((p) => p.id !== currentUserId && p.score > 0);

  const ACTION_COSTS = {
    attack: 15,
    shield: 8,
    skip: 20,
  };

  const handleActionClick = (action: "attack" | "shield" | "skip") => {
    if (action === "shield") {
      // Shield doesn't need a target, execute immediately
      onAction(action);
    } else {
      // Attack and skip need targets, open modal
      setPendingAction(action);
      setModalOpen(true);
    }
  };

  const handleTargetSelect = (playerId: string) => {
    if (pendingAction) {
      onAction(pendingAction, playerId);
      setModalOpen(false);
      setPendingAction(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPendingAction(null);
  };

  if (!currentPlayer) {
    return null;
  }

  return (
    <section className="bg-gray-800 border-4 border-white p-6">
      <h3 className="text-xl mb-4 border-b-2 border-white pb-2">ACTIONS</h3>
      <div className="mb-4">
        <p className="text-xs mb-2">⚡ Power Points: {currentPlayer.powerPoints}</p>
      </div>

      <div className="space-y-3">
        {/* Attack */}
        <div className="border-2 border-white p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">⚔️ ATTACK</span>
            <span className="text-xs">Cost: {ACTION_COSTS.attack} PP</span>
          </div>
          <p className="text-[0.5rem] mb-2 text-gray-400">Deals 30 damage + drains 5 PP</p>
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 px-2 py-1 text-xs transition-all disabled:opacity-50"
            onClick={() => handleActionClick("attack")}
            disabled={currentPlayer.powerPoints < ACTION_COSTS.attack || otherPlayers.length === 0}
          >
            ATTACK
          </button>
        </div>

        {/* Shield */}
        <div className="border-2 border-white p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">🛡️ SHIELD</span>
            <span className="text-xs">Cost: {ACTION_COSTS.shield} PP</span>
          </div>
          <p className="text-[0.5rem] mb-2 text-gray-400">Gain 2 shields (10 dmg each)</p>
          <button
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white border-2 border-yellow-500 px-2 py-1 text-xs transition-all disabled:opacity-50"
            onClick={() => handleActionClick("shield")}
            disabled={currentPlayer.powerPoints < ACTION_COSTS.shield}
          >
            BUY SHIELD
          </button>
        </div>

        {/* Skip */}
        <div className="border-2 border-white p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">⏭️ SKIP</span>
            <span className="text-xs">Cost: {ACTION_COSTS.skip} PP</span>
          </div>
          <p className="text-[0.5rem] mb-2 text-gray-400">Skip next Q + drain 15 PP</p>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 px-2 py-1 text-xs transition-all disabled:opacity-50"
            onClick={() => handleActionClick("skip")}
            disabled={currentPlayer.powerPoints < ACTION_COSTS.skip || otherPlayers.length === 0}
          >
            SKIP TARGET
          </button>
        </div>
      </div>

      <ActionTargetModal
        isOpen={modalOpen}
        action={pendingAction || "attack"}
        players={players}
        currentUserId={currentUserId}
        onSelect={handleTargetSelect}
        onClose={handleModalClose}
      />
    </section>
  );
}

