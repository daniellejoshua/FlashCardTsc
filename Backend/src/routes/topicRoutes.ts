import express from "express";
import { AuthToken } from "../middleware/authToken.js";
import { addTopic, getUsersTopic } from "../controllers/topicController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTopicSchema } from "../schemas/topicSchema.js";
import { z } from "zod";
import { genereralLimiter, userLimiter } from "../middleware/rateLimit.js";
import {
  generateFlashCard,
  getFlashcardByTopicId,
} from "../controllers/flashCardController.js";

const router = express.Router();

const validateWithSchema = (schema: z.ZodSchema) => validateRequest(schema);

router.post(
  "/createTopic",
  validateWithSchema(createTopicSchema),
  AuthToken,
  genereralLimiter,
  addTopic,
);

router.get("/topics", AuthToken, userLimiter, getUsersTopic);

router.post(
  "/topics/generate",
  validateWithSchema(createTopicSchema),
  AuthToken,
  genereralLimiter,
  generateFlashCard,
);

router.get(
  "/topics/:topicId/flashcards",
  AuthToken,
  userLimiter,
  getFlashcardByTopicId,
);

export default router;
