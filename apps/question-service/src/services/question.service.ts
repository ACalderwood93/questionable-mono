import {
  type QuestionCategory,
  QuestionProvider,
  type QuestionWithCorrectAnswer,
} from "@repo/shared";
import { QuestionDifficulties, QuestionTypes, Session, getQuestions } from "open-trivia-db";
import { singleton } from "tsyringe";
import { logger } from "../logger.js";
import { mapCategoryToOpenTDBCategory } from "../mappers/categoryMapper.js";
import { mapOpenTDBQuestionToQuestion } from "../mappers/questionMapper.js";

@singleton()
export class QuestionService {
  private readonly session = new Session();

  constructor() {
    this.session.start();
  }
  public async generateQuestions({
    category,
    count,
    provider,
  }: { category: QuestionCategory; count: number; provider: QuestionProvider }): Promise<
    QuestionWithCorrectAnswer[]
  > {
    if (provider === QuestionProvider.OpenTDB) {
      const openTDBCategory = mapCategoryToOpenTDBCategory(category);
      const questions = await getQuestions({
        category: openTDBCategory,
        amount: count,
        type: QuestionTypes.Multiple,
        session: this.session.token,
      });
      logger.info("questions", { questions });
      return questions.map(mapOpenTDBQuestionToQuestion);
    }
    throw new Error(`Provider ${provider} not supported`);
  }
}
