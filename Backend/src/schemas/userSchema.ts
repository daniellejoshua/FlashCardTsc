import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must have atleast 3 letters")
    .max(50, "Username must be at most 50 characters"),
  email: z.email(),
  password: z.string().min(8, "Password must atleast be 8 caharacters"),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier (username or emai) is requiured"),
  password: z.string().min(1, "password is required"),
});
