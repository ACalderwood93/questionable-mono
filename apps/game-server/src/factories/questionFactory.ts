import type { UUID } from "@repo/shared";
import { logger } from "../logger.js";
import type { Question } from "../types/question.js";

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
