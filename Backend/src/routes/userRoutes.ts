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
const router = express.Router();
const validateWithSchema = (schema: z.ZodSchema) => validateRequest(schema);
router.post("/createUser", validateWithSchema(registerSchema), registerUser);
router.post("/login", validateWithSchema(loginSchema), authUser);
router.post("/refreshToken", tokenRefresher);
router.post("/logout", logOutUser);

export default router;
