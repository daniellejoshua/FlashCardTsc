import { sql } from "../config/db.js";

interface Topic {
  user_id: number;
  title: string;
  description?: string;
}

export async function createTopic({ user_id, title, description = "" }: Topic) {
  return await sql` INSERT INTO topics (user_id, title, description, difficulty)
    VALUES (${user_id}, ${title}, ${description})
    RETURNING *;`;
}
