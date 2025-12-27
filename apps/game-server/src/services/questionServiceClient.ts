import type {
  QuestionCategory,
  QuestionProvider,
  QuestionWithCorrectAnswer,
} from "@repo/shared";
import { logger } from "../logger.js";

const QUESTION_SERVICE_URL =
  process.env.QUESTION_SERVICE_URL || "http://localhost:3000";

export interface GenerateQuestionsRequest {
  category: QuestionCategory;
  count: number;
  provider: QuestionProvider;
}

export interface GenerateQuestionsResponse {
  questions: QuestionWithCorrectAnswer[];
}

export class QuestionServiceClient {
  public async generateQuestions(
    request: GenerateQuestionsRequest
  ): Promise<QuestionWithCorrectAnswer[]> {
    const url = `${QUESTION_SERVICE_URL}/questions/generate`;

    logger.info("Requesting questions from question service", {
      url,
      category: request.category,
      count: request.count,
      provider: request.provider,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Question service returned ${response.status}: ${errorText}`
        );
      }

      const data = (await response.json()) as GenerateQuestionsResponse;
      logger.info("Successfully received questions from question service", {
        questionCount: data.questions.length,
      });

      return data.questions;
    } catch (error) {
      logger.error("Failed to fetch questions from question service", {
        error: error instanceof Error ? error.message : String(error),
        url,
      });
      throw error;
    }
  }
}

