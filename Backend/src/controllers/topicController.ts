import { createTopic } from "../models/Topic.js";
import type { RequestHandler } from "express";
import type { AuthLocals } from "../types/authToken.js";
import { getTopicWithUser } from "../models/Topic.js";
interface TopicBody {
  title: string;
  description: string;
}

interface userIdParams {
  id: string;
}

interface GetUsersTopicResponse {
  id: number;
  topic: number;
  description?: string;
  email: string;
  created_at: string;
  username: string;
}

type GetUsersTopicHandler = RequestHandler<
  userIdParams,
  GetUsersTopicResponse[] | { message: string },
  {},
  {},
  AuthLocals
>;

type CreateTopicHandler = RequestHandler<{}, any, TopicBody, any, AuthLocals>;

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
    const { id } = req.params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Not a valid ID" });
    }
    const topics = (await getTopicWithUser(userId)) as GetUsersTopicResponse[];
    if (!topics || topics.length === 0) {
      return res.status(404).json({
        message: "No topics found",
      });
    }
    return res.status(200).json(topics);
  } catch (error) {
    return next(error);
  }
};
