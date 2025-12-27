import type { GenerateQuestionInputBody } from "@repo/shared";
import { generateQuestionInputBodySchema } from "@repo/shared";
import { Router } from "express";
import { container } from "tsyringe";
import { bodyValidator } from "../../middleware/RequestValidator.js";
import { QuestionService } from "../../services/question.service.js";
const questionRouter = Router();

// Create a question
questionRouter.post(
  "/generate",
  bodyValidator(generateQuestionInputBodySchema),
  async (req, res) => {
    const questionService = container.resolve(QuestionService);
    const body = req.body as GenerateQuestionInputBody;
    const questions = await questionService.generateQuestions({
      category: body.category,
      count: body.count,
      provider: body.provider,
    });
    res.json({ questions });
  }
);

export default questionRouter;
