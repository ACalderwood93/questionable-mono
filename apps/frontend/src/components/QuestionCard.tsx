import type { Question, UUID } from "@repo/shared";
import { AnswerButton } from "./AnswerButton";

interface QuestionCardProps {
  question: Question;
  userAnswerId: UUID | null;
  correctAnswerId: UUID | null;
  onAnswer: (questionId: UUID, answerId: UUID) => void;
}

export function QuestionCard({
  question,
  userAnswerId,
  correctAnswerId,
  onAnswer,
}: QuestionCardProps) {
  const isRevealed = !!correctAnswerId;

  return (
    <section className="bg-gray-800 border-4 border-white p-6">
      <h3 className="text-xl mb-4 border-b-2 border-white pb-2">CURRENT CHALLENGE</h3>
      <p className="text-lg leading-relaxed my-4">{question.text}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {question.answers.map((answer) => (
          <AnswerButton
            key={answer.id}
            answer={answer}
            isSelected={answer.id === userAnswerId}
            isCorrect={answer.id === correctAnswerId}
            isRevealed={isRevealed}
            onClick={() => !isRevealed && onAnswer(question.id, answer.id)}
          />
        ))}
      </div>

      {isRevealed && (
        <div className="text-2xl mt-6 text-center animate-popIn">
          {userAnswerId === correctAnswerId ? (
            <span className="text-green-500">VICTORY!</span>
          ) : (
            <span className="text-red-500">DEFEAT!</span>
          )}
        </div>
      )}
    </section>
  );
}
