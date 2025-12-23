import { UUID } from "crypto";
import { Question } from "../types/question";

export class QuestionFactory {
  private static createQuestion(): [Question, UUID] {
    return [
      {
        id: crypto.randomUUID(),
        text: "What is the capital of France?",
        answers: [
          {
            id: crypto.randomUUID(),
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
      crypto.randomUUID(),
    ];
  }

  public static createAllQuestionsAndAnswers(
    questionAmount: number
  ): [Question[], Map<UUID, UUID>] {
    const answers = new Map<UUID, UUID>();
    const questions = [];
    for (let i = 0; i < questionAmount; i++) {
      const [question, answerId] = this.createQuestion();
      answers.set(question.id, answerId);
      questions.push(question);
    }
    return [questions, answers];
  }
}
