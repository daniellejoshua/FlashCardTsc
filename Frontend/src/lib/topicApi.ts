import { fetchWithAuth } from "./fetchWithAuth";

export async function createTopic(topic: {
  title: string;
  description: string;
}) {
  const response = await fetchWithAuth(
    `${process.env.NEXT_PUBLIC_API_URL}/api/topic/topics/generate`,
    {
      method: "POST",
      body: JSON.stringify(topic),
    },
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `createTopic failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
  return response.json();
}
