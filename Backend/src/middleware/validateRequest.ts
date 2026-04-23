import { z } from "zod";
import type { RequestHandler } from "express";

export const validateRequest = (schema: z.ZodSchema): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid Request",
        error: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    return next();
  };
};
