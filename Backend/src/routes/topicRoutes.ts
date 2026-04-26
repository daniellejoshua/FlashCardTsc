import express from "express";
import { AuthToken } from "../middleware/authToken.js";
import { addTopic, getUsersTopic } from "../controllers/topicController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTopicSchema } from "../schemas/topicSchema.js";
import { z } from "zod";
import { genereralLimiter, userLimiter } from "../middleware/rateLimit.js";
import type { ParamsDictionary } from "express-serve-static-core";
import type { AuthLocals } from "../types/authToken.js";

const router = express.Router();

const validateWithSchema = (schema: z.ZodSchema) => validateRequest(schema);

interface userIdParams extends ParamsDictionary {
  id: string;
}

router.post(
  "/createTopic",
  validateWithSchema(createTopicSchema),
  AuthToken,
  genereralLimiter,
  addTopic,
);

router.get<userIdParams, any, any, any, AuthLocals>(
  "/user/:id",
  AuthToken,
  userLimiter,
  getUsersTopic,
);

export default router;
