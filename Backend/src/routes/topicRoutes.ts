import express from "express";
import { AuthToken } from "../middleware/authToken.js";
import { addTopic, getUsersTopic } from "../controllers/topicController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createTopicSchema } from "../schemas/topicSchema.js";
import { z } from "zod";
const router = express.Router();

const validateWithSchema = (schema: z.ZodSchema) => validateRequest(schema);

router.post(
  "/createTopic",
  validateWithSchema(createTopicSchema),
  AuthToken,
  addTopic,
);
router.get("/user/:id", AuthToken, getUsersTopic);
export default router;
