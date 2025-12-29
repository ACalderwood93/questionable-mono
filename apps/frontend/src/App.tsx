import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  ActionPanel,
  ErrorMessage,
  GameHeader,
  Leaderboard,
  PlayerScoreboard,
  QuestionCard,
  TitleScreen,
  WaitingScreen,
} from "./components";
import {
  correctAnswerIdAtom,
  currentQuestionAtom,
  errorAtom,
  gameStatusAtom,
  lobbyIdAtom,
  playerNameAtom,
  playersAtom,
  userAnswerIdAtom,
  userIdAtom,
} from "./store";
import { useGameSocket } from "./useGameSocket";

function App() {
  const [lobbyId, setLobbyId] = useAtom(lobbyIdAtom);
  const [playerName, setPlayerName] = useAtom(playerNameAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [currentQuestion, setCurrentQuestion] = useAtom(currentQuestionAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const [error, setError] = useAtom(errorAtom);
  const [userAnswerId, setUserAnswerId] = useAtom(userAnswerIdAtom);
  const [correctAnswerId, setCorrectAnswerId] = useAtom(correctAnswerIdAtom);
  const [gameStatus, setGameStatus] = useAtom(gameStatusAtom);

  const { sendAnswer, sendAction, sendToggleReady } = useGameSocket(lobbyId, playerName);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lobbyParam = params.get("lobby");
    if (lobbyParam) {
      setLobbyId(lobbyParam);
    }
  }, [setLobbyId]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (lobbyId) {
      url.searchParams.set("lobby", lobbyId);
    } else {
      url.searchParams.delete("lobby");
    }
    window.history.pushState({}, "", url);
  }, [lobbyId]);

  const handleJoinLobby = (lobbyId: string, name: string) => {
    setError(null);
    setPlayerName(name);
    setLobbyId(lobbyId);
  };

  const handleLeaveLobby = () => {
    // Clear all game state when leaving lobby
    setLobbyId(null);
    setCurrentQuestion(null);
    setPlayers([]);
    setUserAnswerId(null);
    setCorrectAnswerId(null);
    setUserId(null);
    setGameStatus("waiting");
    setError(null);
  };

  if (!lobbyId) {
    return <TitleScreen onJoin={handleJoinLobby} error={error} />;
  }

  // Show leaderboard when game is finished
  if (gameStatus === "finished") {
    return (
      <div className="max-w-6xl mx-auto px-4 md:px-8 bg-gray-900 text-white min-h-screen py-8">
        <GameHeader lobbyId={lobbyId} userId={userId} onLeave={handleLeaveLobby} />
        <Leaderboard players={players} currentUserId={userId} onLeave={handleLeaveLobby} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 bg-gray-900 text-white min-h-screen py-8">
      <GameHeader lobbyId={lobbyId} userId={userId} onLeave={handleLeaveLobby} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8 w-full">
        <div className="lg:col-span-2 min-w-0">
          {error && <ErrorMessage message={error} />}

          {!currentQuestion && (
            <WaitingScreen
              players={players}
              currentUserId={userId}
              onToggleReady={sendToggleReady}
            />
          )}

          {currentQuestion && (
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
              <QuestionCard
                question={currentQuestion}
                userAnswerId={userAnswerId}
                correctAnswerId={correctAnswerId}
                onAnswer={sendAnswer}
              />
            </div>
          )}
        </div>

        {currentQuestion && (
          <aside className="space-y-6 lg:col-span-1">
            <div className="sticky top-4">
              <PlayerScoreboard players={players} currentUserId={userId} />
              <ActionPanel players={players} currentUserId={userId} onAction={sendAction} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

export default App;
