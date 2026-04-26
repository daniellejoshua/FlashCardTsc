import express from "express";
import {
  authUser,
  logOutUser,
  registerUser,
  tokenRefresher,
} from "../controllers/userController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { loginSchema, registerSchema } from "../schemas/userSchema.js";
import { z } from "zod";
import {
  strictLimiter,
  genereralLimiter,
  userLimiter,
} from "../middleware/rateLimit.js";
const router = express.Router();
const validateWithSchema = (schema: z.ZodSchema) => validateRequest(schema);
router.post(
  "/createUser",
  validateWithSchema(registerSchema),
  genereralLimiter,
  registerUser,
);
router.post("/login", validateWithSchema(loginSchema), strictLimiter, authUser);
router.post("/refreshToken", genereralLimiter, tokenRefresher);
router.post("/logout", genereralLimiter, logOutUser);

export default router;
