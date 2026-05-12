"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MdArrowBack, MdRefresh } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { getFlashcardsByTopic, type Flashcard } from "@/lib/flashcardApi";

interface CardState {
  id: number;
  isFlipped: boolean;
  isAnswered: boolean;
}

export default function FlashcardStudyPage({
  searchParams,
}: {
  searchParams: Promise<{ topicId?: string }>;
}) {
  const router = useRouter();
  const { topicId } = React.use(searchParams);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cards, setCards] = useState<CardState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeCardIndex = cards.findIndex((c) => !c.isAnswered);
  const activeCardState =
    activeCardIndex !== -1 ? cards[activeCardIndex] : null;
  const activeCard =
    activeCardIndex !== -1
      ? (flashcards.find((c) => c.id === cards[activeCardIndex].id) ?? null)
      : null;

  useEffect(() => {
    if (!topicId) return;
    setLoading(true);

    getFlashcardsByTopic(topicId)
      .then((data) => {
        console.log("Fetched flashcards:", data);
        setFlashcards(data);
        setCards(
          data.map((card) => ({
            id: card.id,
            isFlipped: false,
            isAnswered: false,
          })),
        );
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [topicId]);

  useEffect(() => {
    if (activeCardIndex !== -1 && cards[activeCardIndex]?.isFlipped) {
      const newCards = [...cards];
      newCards[activeCardIndex].isFlipped = false;
      setCards(newCards);
    }
  }, [activeCardIndex]);

  if (!topicId) {
    return <div>No topic selected. Please go back and choose a topic.</div>;
  }

  if (loading) {
    return <div>Loading flashcards…</div>;
  }

  if (error) {
    return <div>Error loading flashcards: {error}</div>;
  }

  const handleFlip = () => {
    if (!activeCard) return;
    const newCards = [...cards];
    newCards[activeCardIndex].isFlipped = !newCards[activeCardIndex].isFlipped;
    setCards(newCards);
  };

  const handleMarkCorrect = () => {
    if (!activeCard) return;
    const newCards = [...cards];
    newCards[activeCardIndex].isFlipped = false;
    setCards(newCards);
    // Wait for flip animation before showing next card
    setTimeout(() => {
      setCards((prevCards) => {
        const updated = [...prevCards];
        updated[activeCardIndex].isAnswered = true;
        return updated;
      });
    }, 300);
  };

  const handleMarkIncorrect = () => {
    if (!activeCard) return;
    const newCards = [...cards];
    newCards[activeCardIndex].isFlipped = false;
    setCards(newCards);
    // Wait for flip animation before showing next card
    setTimeout(() => {
      setCards((prevCards) => {
        const updated = [...prevCards];
        updated[activeCardIndex].isAnswered = true;
        return updated;
      });
    }, 300);
  };

  const handleReset = () => {
    setCards(
      flashcards.map((card) => ({
        id: card.id,
        isFlipped: false,
        isAnswered: false,
      })),
    );
  };

  const completedCount = cards.filter((c) => c.isAnswered).length;
  const progress = Math.round((completedCount / cards.length) * 100);

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <MdArrowBack size={20} />
          Back to Topics
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">
            Biology Fundamentals
          </h1>
          <p className="text-gray-600">Study with flashcards</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-indigo-600">
              {completedCount} / {cards.length}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeCard ? (
            <motion.div
              key={activeCardIndex}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Card Container */}
              <div className="h-80" style={{ perspective: "1000px" }}>
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  onClick={handleFlip}
                  animate={{ rotateY: activeCardState?.isFlipped ? 180 : 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Front of card */}
                  <div
                    className="absolute w-full h-full bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <motion.div
                      animate={{
                        opacity: activeCardState?.isFlipped ? 0 : 1,
                        scale: activeCardState?.isFlipped ? 0.8 : 1,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="flex flex-col items-center justify-center w-full"
                    >
                      <p className="text-gray-500 text-sm font-medium mb-6">
                        Question
                      </p>
                      <p className="text-3xl font-bold text-center text-black mb-8">
                        {activeCard.question}
                      </p>
                      <p className="text-gray-400 text-xs absolute bottom-6">
                        Click to reveal answer
                      </p>
                    </motion.div>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <motion.div
                      animate={{
                        opacity: activeCardState?.isFlipped ? 1 : 0,
                        scale: activeCardState?.isFlipped ? 1 : 0.8,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="flex flex-col items-center justify-center w-full"
                    >
                      <p className="text-indigo-200 text-sm font-medium mb-6">
                        Answer
                      </p>
                      <p className="text-4xl font-bold text-center text-white">
                        {activeCard.answer}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <p className="text-center text-gray-500 text-sm">
                  {!activeCardState?.isFlipped
                    ? "Click the card to reveal the answer"
                    : "Select if you got it right or wrong"}
                </p>

                <AnimatePresence>
                  {activeCardState?.isFlipped && (
                    <motion.div
                      className="grid grid-cols-2 gap-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        onClick={handleMarkIncorrect}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 font-medium"
                      >
                        ✗ Incorrect
                      </Button>
                      <Button
                        onClick={handleMarkCorrect}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg py-3 font-medium"
                      >
                        ✓ Correct
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Card counter */}
              <motion.div
                className="text-center text-gray-600"
                key={`counter-${activeCardIndex}`}
              >
                Card {activeCardIndex + 1} of {cards.length}
              </motion.div>
            </motion.div>
          ) : (
            /* Completion Screen */
            <motion.div
              className="space-y-8 text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  🎉
                </motion.div>
                <h2 className="text-3xl font-bold text-black mb-2">
                  Session Complete!
                </h2>
                <p className="text-gray-600">
                  Great job! You've reviewed all {cards.length} flashcards.
                </p>
              </div>

              <div className="space-y-2 bg-indigo-50 rounded-lg p-6">
                <p className="text-gray-700">Total Cards Reviewed</p>
                <p className="text-5xl font-bold text-indigo-600">
                  {cards.length}
                </p>
              </div>

              <Button
                onClick={handleReset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <MdRefresh size={20} />
                Study Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
