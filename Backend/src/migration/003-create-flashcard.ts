import { sql } from "../config/db.js";
import { getErrorMessage } from "../helpers/errorMessage.js";
export async function flashCardTable() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS flashcards(
            id SERIAL PRIMARY KEY,
            topic_id INTEGER NOT NULL,
            question TEXT,
            answer TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (topic_id) REFERENCES topics(id)
        )`;
    await sql`CREATE INDEX IF NOT EXISTS idx_flashcards_topic_id ON flashcards(topic_id)`;
  } catch (error) {
    const message = getErrorMessage(error);
    console.log("ERROR ON FLASHCARD TABLE MIGRATIONS", message);
  }
}
