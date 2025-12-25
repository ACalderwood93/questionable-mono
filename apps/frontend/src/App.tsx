import { useAtom } from "jotai";
import { useEffect } from "react";
import {
  ErrorMessage,
  GameHeader,
  PlayerScoreboard,
  QuestionCard,
  TitleScreen,
  WaitingScreen,
} from "./components";
import {
  correctAnswerIdAtom,
  currentQuestionAtom,
  errorAtom,
  lobbyIdAtom,
  playersAtom,
  userAnswerIdAtom,
  userIdAtom,
} from "./store";
import { useGameSocket } from "./useGameSocket";

function App() {
  const [lobbyId, setLobbyId] = useAtom(lobbyIdAtom);
  const [userId] = useAtom(userIdAtom);
  const [currentQuestion] = useAtom(currentQuestionAtom);
  const [players] = useAtom(playersAtom);
  const [error, setError] = useAtom(errorAtom);
  const [userAnswerId] = useAtom(userAnswerIdAtom);
  const [correctAnswerId] = useAtom(correctAnswerIdAtom);

  const { sendAnswer } = useGameSocket(lobbyId);

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

  const handleJoinLobby = (lobbyId: string) => {
    setError(null);
    setLobbyId(lobbyId);
  };

  const handleLeaveLobby = () => {
    setLobbyId(null);
  };

  if (!lobbyId) {
    return <TitleScreen onJoin={handleJoinLobby} error={error} />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 bg-gray-900 text-white min-h-screen py-8">
      <GameHeader lobbyId={lobbyId} userId={userId} onLeave={handleLeaveLobby} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 lg:gap-8 w-full">
        <div>
          {error && <ErrorMessage message={error} />}

          {!currentQuestion && <WaitingScreen />}

          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              userAnswerId={userAnswerId}
              correctAnswerId={correctAnswerId}
              onAnswer={sendAnswer}
            />
          )}
        </div>

        <aside>
          <PlayerScoreboard players={players} currentUserId={userId} />
        </aside>
      </div>
    </div>
  );
}

export default App;
