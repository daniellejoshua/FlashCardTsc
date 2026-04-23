import { createTopic } from "../models/Topic.js";
import type { RequestHandler } from "express";
import type { AuthLocals } from "../types/authToken.js";
interface CreateTopicBody {
  title: string;
  description: string;
}

type CreateTopicHandler = RequestHandler<
  {},
  any,
  CreateTopicBody,
  any,
  AuthLocals
>;

export const createTopicController: CreateTopicHandler = async (
  req,
  res,
  next,
) => {
  try {
    const user_id = res.locals.authUser.user_id; // from token
    const { title, description } = req.body;

    const topic = await createTopic({ user_id, title, description });
    return res.status(201).json({ message: "Topic created", topic: topic });
  } catch (error) {
    return next(error);
  }
};
