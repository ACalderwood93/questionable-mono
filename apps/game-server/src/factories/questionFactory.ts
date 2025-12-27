import type { UUID, Question, QuestionWithCorrectAnswer } from "@repo/shared";
import { logger } from "../logger.js";

/**
 * Converts QuestionWithCorrectAnswer[] from the question service
 * to the format expected by the Game class (Question[] and Map<UUID, UUID>)
 */
export function convertQuestionsFromService(
  questionsWithAnswers: QuestionWithCorrectAnswer[]
): [Question[], Map<UUID, UUID>] {
  const questions: Question[] = [];
  const answers = new Map<UUID, UUID>();

  for (const questionWithAnswer of questionsWithAnswers) {
    const { correctAnswer, ...question } = questionWithAnswer;
    questions.push(question);
    answers.set(question.id, correctAnswer);

    logger.debug("Question converted from service", {
      questionId: question.id,
      answerId: correctAnswer,
    });
  }

  return [questions, answers];
}

// Legacy function kept for backwards compatibility or fallback
function createQuestion(): [Question, UUID] {
  const parisId = crypto.randomUUID();
  return [
    {
      id: crypto.randomUUID(),
      providedAnswers: {},
      text: "What is the capital of France?",
      answers: [
        {
          id: parisId,
          text: "Paris",
        },
        {
          id: crypto.randomUUID(),
          text: "London",
        },
        {
          id: crypto.randomUUID(),
          text: "Berlin",
        },
        {
          id: crypto.randomUUID(),
          text: "Madrid",
        },
      ],
    } satisfies Question,
    parisId,
  ];
}

export function createAllQuestionsAndAnswers(
  questionAmount: number
): [Question[], Map<UUID, UUID>] {
  const answers = new Map<UUID, UUID>();
  const questions = [];
  for (let i = 0; i < questionAmount; i++) {
    const [question, answerId] = createQuestion();

    logger.debug("Question created", { questionId: question.id, answerId });
    answers.set(question.id, answerId);
    questions.push(question);
  }
  return [questions, answers];
}
