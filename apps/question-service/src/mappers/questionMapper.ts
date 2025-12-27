import type { QuestionWithCorrectAnswer, UUID } from "@repo/shared";
import type { Question as OpenTDBQuestion } from "open-trivia-db";

export const mapOpenTDBQuestionToQuestion = (
  openTDBQuestion: OpenTDBQuestion
): QuestionWithCorrectAnswer => {
  const allMappedAnswers = openTDBQuestion.allAnswers.map((answer) => ({
    id: crypto.randomUUID(),
    text: answer,
  }));
  const question: QuestionWithCorrectAnswer = {
    id: crypto.randomUUID(),
    text: openTDBQuestion.value,
    providedAnswers: {},
    answers: allMappedAnswers,
    correctAnswer: allMappedAnswers.find((answer) => answer.text === openTDBQuestion.correctAnswer)
      ?.id as UUID,
  };
  return question;
};
