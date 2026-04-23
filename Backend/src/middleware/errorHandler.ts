import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = async (
  err,
  _req,
  res,
  _next,
) => {
  const message = err instanceof Error ? err.message : String(err);
  res.status(500).json({ error: message });
};
