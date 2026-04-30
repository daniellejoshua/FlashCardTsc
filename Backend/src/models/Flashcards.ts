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
  if (flashCards.length === 0) return [];

  const topicIds = flashCards.map((fc) => fc.topic_id);
  const questions = flashCards.map((fc) => fc.question);
  const answers = flashCards.map((fc) => fc.answer);

  const created = await sql`
    INSERT INTO flashcards (topic_id, question, answer)
    SELECT * FROM UNNEST(
      ${topicIds}::int[],
      ${questions}::text[],
      ${answers}::text[]
    )
    RETURNING *
  `;

  return created as FlashcardRow[];
}

export async function getFlashcardById(topic_id: number) {
  return await sql`SELECT * FROM flashcards 
  WHERE topic_id = ${topic_id}`;
}
