import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import type { RequestHandler } from "express";

export const genereralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
});

export const userLimiter: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  keyGenerator: (req) => {
    const userId = req.res?.locals?.authUser?.user_id;
    const ip = req.ip ?? req.socket?.remoteAddress ?? "unknown";
    return userId ? `user_${userId}` : ipKeyGenerator(ip);
  },
  handler: (_req, res) => {
    return res.status(429).json({
      message: "Too many request please try again later",
      success: false,
    });
  },
});

export const strictLimiter: RequestHandler = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  handler: (_req, res) => {
    return res.status(429).json({
      message: "Too many request please try again later",
      success: false,
    });
  },
});
