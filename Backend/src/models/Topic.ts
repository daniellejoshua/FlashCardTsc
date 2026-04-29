import { sql } from "../config/db.js";
import type { TopicCreateInput } from "../types/topicTypes.js";

export async function createTopic({
  user_id,
  title,
  description = "",
}: TopicCreateInput) {
  return await sql` INSERT INTO topics (user_id, title, description)
    VALUES (${user_id}, ${title}, ${description})
    RETURNING *;`;
}

export async function getTopicWithUser(userId: number) {
  return await sql`SELECT t.*, u.username, u.email
  FROM topics t JOIN users u ON t.user_id = u.id
  WHERE t.user_id = ${userId}`;
}
