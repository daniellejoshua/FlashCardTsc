import { GoogleGenAI } from "@google/genai";

interface FlashcardAIOutput {
  question: string;
  answer: string;
}

function buildPrompt(title: string, description: string, count = 5) {
  return `
Generate exactly ${count} flashcards for the topic below.

OUTPUT REQUIREMENTS:
- Return ONLY a raw JSON array (no backticks, no markdown, no preamble, no trailing commentary)
- First character must be '[' and last character must be ']'

FORMAT:
[{"question": "Q1", "answer": "A1"}, {"question": "Q2", "answer": "A2"}]

EXAMPLE for "Solar System" topic:
[{"question": "What is the largest planet in our solar system?", "answer": "Jupiter"}, {"question": "Which planet is known as the Red Planet?", "answer": "Mars"}]

QUALITY RULES:
- Questions must be specific and unambiguous
- Answers must be factually accurate and complete
- Avoid yes/no questions unless answer provides explanation

TOPIC:
Title: ${title}
Description: ${description}

REMINDER: Output JSON array only. No other text.
`;
}

export function parseFlashcards(payload: unknown): FlashcardAIOutput[] {
  if (!Array.isArray(payload)) {
    throw new Error("Gemini didnt asnwer as a Array");
  }
  return payload.map((item, index) => {
    if (
      typeof item !== "object" ||
      item == null ||
      typeof (item as any).question !== "string" ||
      typeof (item as any).answer !== "string"
    ) {
      throw new Error(`Invalid flashcard format at index ${index}`);
    }

    return {
      question: (item as any).question,
      answer: (item as any).answer,
    };
  });
}
function getAiClient() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing GEMINI KEY");
  }
  return new GoogleGenAI({ apiKey: key });
}
export async function generateFlashcardsFromGemini(
  title: string,
  description: string,
  count = 5,
): Promise<FlashcardAIOutput[]> {
  const ai = getAiClient();
  const prompt = buildPrompt(title, description, count);
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 5000,
    },
  });
  const text = response.text;
  if (typeof text !== "string") {
    throw new Error("Invalid gemini response format");
  }
  let parse: unknown;
  try {
    parse = JSON.parse(text);
  } catch (error) {
    throw new Error("Invalid gemini format");
  }
  return parseFlashcards(parse);
}
