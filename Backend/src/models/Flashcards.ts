import { sql } from "../config/db.js";

export interface FlashcardCreateInput {
  topic_id: number;
  question: string;
  answer: string;
}

export interface FlashcardRow {
  id: number;
  topic_id: number;
  question: string;
  answer: string;
  created_at: string;
}
export async function createFlashcards(
  flashCards: FlashcardCreateInput[],
): Promise<FlashcardRow[]> {
  const created = await Promise.all(
    flashCards.map(
      ({ topic_id, question, answer }) =>
        sql`
        INSERT INTO flashcards (topic_id, question, answer)
        VALUES (${topic_id}, ${question}, ${answer})
        RETURNING *
      `,
    ),
  );

  return created.flat() as FlashcardRow[];
}

export async function getFlashcardById(topic_id: number) {
  return await sql`SELECT * FROM flashcards 
  WHERE topic_id = ${topic_id}`;
}
