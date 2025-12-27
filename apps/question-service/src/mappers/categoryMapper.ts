import { QuestionCategory } from "@repo/shared";
import { CategoryNames } from "open-trivia-db";

export const mapCategoryToOpenTDBCategory = (category: QuestionCategory): CategoryNames => {
  switch (category) {
    case QuestionCategory.Games:
      return CategoryNames["Entertainment: Video Games"];
    default:
      throw new Error(`Unknown category: ${category}`);
  }
};
