import { createTopic } from "../models/Topic.js";
import type { RequestHandler } from "express";
import type { AuthLocals } from "../types/authToken.js";
import { getTopicWithUser } from "../models/Topic.js";
import { z } from "zod";
import { createTopicSchema } from "../schemas/topicSchema.js";

export type CreateTopicBody = z.infer<typeof createTopicSchema>;

interface GetUsersTopicResponse {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  username: string;
  email: string;
}

type GetUsersTopicHandler = RequestHandler<
  {}, // no params
  GetUsersTopicResponse[] | { message: string },
  {},
  {},
  AuthLocals
>;
type CreateTopicHandler = RequestHandler<
  {},
  any,
  CreateTopicBody,
  any,
  AuthLocals
>;

export const addTopic: CreateTopicHandler = async (req, res, next) => {
  try {
    const user_id = res.locals.authUser.user_id;
    const { title, description } = req.body;

    const topic = await createTopic({ user_id, title, description });
    return res.status(201).json({ message: "Topic created", topic: topic });
  } catch (error) {
    return next(error);
  }
};

export const getUsersTopic: GetUsersTopicHandler = async (_req, res, next) => {
  try {
    const authUserId = res.locals.authUser.user_id;

    const topics = (await getTopicWithUser(
      authUserId,
    )) as GetUsersTopicResponse[];

    if (!topics || topics.length === 0) {
      return res.status(204).json({ message: "No topics found" });
    }

    return res.status(200).json(topics);
  } catch (error) {
    return next(error);
  }
};
