import { GoogleGenAI } from "@google/genai";

interface FlashcardAIOutput {
  question: string;
  answer: string;
}

function buildPrompt(title: string, description: string, count = 5) {
  return `
Generate exactly ${count} EASY flashcards for beginners learning about: "${title}"

OUTPUT REQUIREMENTS:
- Return ONLY a raw JSON array (no backticks, no markdown, no preamble)
- First character must be '[' and last character must be ']'

FORMAT:
[{"question": "Q1", "answer": "A1"}, {"question": "Q2", "answer": "A2"}]

DIFFICULTY RULES - MAKE THESE VERY EASY:
- Use simple, everyday language
- Focus on basic definitions and key concepts
- Ask "What is...", "Define...", "Name..." style questions
- Avoid trick questions, exceptions, or edge cases
- Keep answers short (1-3 words when possible)
- Assume learner has zero background knowledge

QUALITY RULES:
- Questions must be clear and unambiguous
- Answers must be factually accurate
- No yes/no questions
- No questions requiring multiple steps

TOPIC:
Title: ${title}
Description: ${description}

EXAMPLE for "Photosynthesis":
[{"question": "What is the process plants use to make food from sunlight?", "answer": "Photosynthesis"}, {"question": "What gas do plants take in from the air?", "answer": "Carbon dioxide"}]

REMINDER: Only JSON array. No other text.
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
  const aiModel = process.env.AI_MODEL;
  if (!aiModel) {
    throw new Error("Ai model is missing");
  }

  const ai = getAiClient();
  const prompt = buildPrompt(title, description, count);
  const response = await ai.models.generateContent({
    model: aiModel,
    contents: prompt,
    config: {
      temperature: 1.0,
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
