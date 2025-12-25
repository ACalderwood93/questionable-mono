interface GameHeaderProps {
  lobbyId: string;
  userId: string | null;
  onLeave: () => void;
}

export function GameHeader({ lobbyId, userId, onLeave }: GameHeaderProps) {
  return (
    <header className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 border-b-4 border-white pb-4">
      <div>
        <h1 className="text-xl m-0 flex items-center gap-2">
          <span>⭐</span> Questionable
        </h1>
        <div className="flex flex-wrap gap-2.5 mt-2.5">
          <div className="bg-gray-700 text-white px-2 py-1 text-xs border-2 border-gray-600">
            <span>Lobby: {lobbyId}</span>
          </div>
          {userId && (
            <div className="bg-blue-600 text-white px-2 py-1 text-xs border-2 border-blue-500">
              <span>ID: {userId.slice(0, 5)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-4 items-center">
        <button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-500 px-3 py-1 text-sm transition-all hover:scale-105"
          onClick={onLeave}
        >
          QUIT
        </button>
      </div>
    </header>
  );
}
