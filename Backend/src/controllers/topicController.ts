import { createTopic } from "../models/Topic.js";
import type { RequestHandler } from "express";
import type { AuthLocals } from "../types/authToken.js";
import { getTopicWithUser } from "../models/Topic.js";
import { z } from "zod";
import { createTopicSchema } from "../schemas/topicSchema.js";

export type CreateTopicBody = z.infer<typeof createTopicSchema>;

interface userIdParams {
  id: string;
}

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
  userIdParams,
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

export const getUsersTopic: GetUsersTopicHandler = async (req, res, next) => {
  try {
    const paramsId = Number(req.params.id);
    if (Number.isNaN(paramsId)) {
      return res.status(400).json({ message: "Not a valid ID" });
    }

    const authUserId = res.locals.authUser.user_id;
    if (paramsId !== authUserId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const topics = (await getTopicWithUser(
      paramsId,
    )) as GetUsersTopicResponse[];
    if (!topics || topics.length === 0) {
      return res.status(404).json({ message: "No topics found" });
    }

    return res.status(200).json(topics);
  } catch (error) {
    return next(error);
  }
};
