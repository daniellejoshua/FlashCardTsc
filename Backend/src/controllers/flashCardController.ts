import type { RequestHandler } from "express";
import type { AuthLocals } from "../types/authToken.js";
import {
  createFlashcards,
  type FlashcardCreateInput,
} from "../models/Flashcards.js";
import { createTopic } from "../models/Topic.js";
import { generateFlashcardsFromGemini } from "../helpers/gemini.js";

interface FlashcardRow {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

type GenerateFlashcardSuccess = {
  topic: unknown;
  flashcards: FlashcardRow[];
};

type GenerateFlashcardError = {
  message: string;
};

export const generateFlashCard: RequestHandler<
  {},
  GenerateFlashcardSuccess | GenerateFlashcardError,
  { title: string; description?: string },
  {},
  AuthLocals
> = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const user_id = res.locals?.authUser?.user_id;
    if (!user_id) return res.status(400).json({ message: "No user ID" });
    const [topic] = await createTopic({ user_id, title, description });
    if (!topic) return res.status(400).json({ message: "Topic not created" });
    const aiOutput = await generateFlashcardsFromGemini(
      title,
      description ?? "",
    );
    const flashcardTosave: FlashcardCreateInput[] = aiOutput.map((card) => ({
      topic_id: topic.id,
      question: card.question,
      answer: card.answer,
    }));
    const savedFlashcards = await createFlashcards(flashcardTosave);
    return res.status(201).json({
      topic,
      flashcards: savedFlashcards,
    });
  } catch (error) {
    return next(error);
  }
};
