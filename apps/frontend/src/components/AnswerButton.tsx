import type { Answer } from "@repo/shared";

interface AnswerButtonProps {
  answer: Answer;
  isSelected: boolean;
  isCorrect: boolean;
  isRevealed: boolean;
  onClick: () => void;
}

export function AnswerButton({
  answer,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
}: AnswerButtonProps) {
  let buttonClasses = "h-full min-h-20 text-xs border-2 px-4 py-2 transition-all";

  if (isRevealed) {
    if (isCorrect) {
      buttonClasses += " bg-green-600 border-green-500 text-white";
    } else if (isSelected) {
      buttonClasses += " bg-red-600 border-red-500 text-white";
    } else {
      buttonClasses += " bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed";
    }
  } else if (isSelected) {
    buttonClasses += " bg-blue-600 border-blue-500 text-white hover:scale-105";
  } else {
    buttonClasses += " bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:scale-105";
  }

  return (
    <button type="button" className={buttonClasses} onClick={onClick} disabled={isRevealed}>
      {answer.text}
      {isSelected && (
        <>
          <br />
          (YOU)
        </>
      )}
    </button>
  );
}
