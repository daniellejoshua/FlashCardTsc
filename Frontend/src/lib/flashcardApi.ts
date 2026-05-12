import { fetchWithAuth } from "./fetchWithAuth";

export interface Flashcard {
  id: number;
  topic_id: number;
  question: string;
  answer: string;
  created_at: string;
}

export async function getFlashcardsByTopic(topicId: string) {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/topic/topics/${topicId}/flashcards`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Unable to load flashcards: ${response.status} ${response.statusText} ${errorText}`,
    );
  }

  return (await response.json()) as Flashcard[];
}
