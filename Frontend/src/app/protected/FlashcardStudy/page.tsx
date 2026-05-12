"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdRefresh,
  MdSmartToy,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
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
  const [showExplain, setShowExplain] = useState(false);
  const [chatboxWidth, setChatboxWidth] = useState(20); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: string; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI study assistant. Ask me anything about this flashcard!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const activeCardIndex = cards.findIndex((c) => !c.isAnswered);
  const activeCardState =
    activeCardIndex !== -1 ? cards[activeCardIndex] : null;
  const activeCard =
    activeCardIndex !== -1
      ? (flashcards.find((c) => c.id === cards[activeCardIndex].id) ?? null)
      : null;

  const currentCard = flashcards[currentCardIndex] ?? null;
  const currentCardState = cards[currentCardIndex] ?? null;

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

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = document.querySelector("[data-study-container]");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth =
        ((containerRect.right - e.clientX) / containerRect.width) * 100;

      // Constrain between 15% and 50%
      if (newWidth >= 15 && newWidth <= 50) {
        setChatboxWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

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
    if (!currentCard) return;
    const newCards = [...cards];
    newCards[currentCardIndex].isFlipped =
      !newCards[currentCardIndex].isFlipped;
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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    // TODO: Call your AI API here
    // For now, just add a mock response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm ready to help! Connect your AI API to get explanations.",
        },
      ]);
      setChatLoading(false);
    }, 1000);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCards((prevCards) => {
        const updated = [...prevCards];
        const targetIndex = currentCardIndex - 1;
        if (updated[targetIndex]) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            isFlipped: false,
          };
        }
        return updated;
      });
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCards((prevCards) => {
        const updated = [...prevCards];
        const targetIndex = currentCardIndex + 1;
        if (updated[targetIndex]) {
          updated[targetIndex] = {
            ...updated[targetIndex],
            isFlipped: false,
          };
        }
        return updated;
      });
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const completedCount = cards.filter((c) => c.isAnswered).length;
  const progress = Math.round((completedCount / cards.length) * 100);

  return (
    <div
      className="w-full h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex overflow-hidden"
      data-study-container
    >
      {/* Left Side - Main Content */}
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          showExplain ? "" : "w-full"
        } p-8`}
        style={{ width: showExplain ? `${100 - chatboxWidth}%` : "100%" }}
      >
        <div className="max-w-2xl mx-auto h-screen flex flex-col justify-center items-center">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-8 left-8 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <MdArrowBack size={20} />
            Back
          </button>

          {/* Title and Description */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <h1 className="text-xl font-bold text-black">
              Biology Fundamentals
            </h1>
            <p className="text-xs text-gray-600 text-center">
              Study with flashcards
            </p>
          </div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {currentCard ? (
              <motion.div
                key={currentCardIndex}
                className="space-y-4 flex flex-col items-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Navigation arrows and counter */}
                <div className="flex items-center justify-between w-full max-w-md mb-4">
                  <button
                    onClick={handlePreviousCard}
                    disabled={currentCardIndex === 0}
                    className="p-2 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <MdNavigateBefore size={24} className="text-indigo-600" />
                  </button>
                  <span className="text-lg font-bold text-indigo-600">
                    {currentCardIndex + 1} / {cards.length}
                  </span>
                  <button
                    onClick={handleNextCard}
                    disabled={currentCardIndex === cards.length - 1}
                    className="p-2 hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <MdNavigateNext size={24} className="text-indigo-600" />
                  </button>
                </div>

                {/* Card Container */}
                <div
                  className="w-full max-w-md h-64"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={handleFlip}
                    animate={{
                      rotateY: currentCardState?.isFlipped ? 180 : 0,
                    }}
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
                      className="absolute w-full h-full bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                      }}
                    >
                      <motion.div
                        animate={{
                          opacity: currentCardState?.isFlipped ? 0 : 1,
                          scale: currentCardState?.isFlipped ? 0.8 : 1,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="flex flex-col items-center justify-center w-full"
                      >
                        <p className="text-gray-500 text-xs font-medium mb-4">
                          Question
                        </p>
                        <p className="text-2xl font-bold text-center text-black">
                          {currentCard.question}
                        </p>
                        <p className="text-gray-400 text-xs absolute bottom-4 opacity-60 group-hover:opacity-100 transition-opacity">
                          Click to reveal
                        </p>
                      </motion.div>
                    </div>

                    {/* Back of card */}
                    <div
                      className="absolute w-full h-full bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <motion.div
                        animate={{
                          opacity: currentCardState?.isFlipped ? 1 : 0,
                          scale: currentCardState?.isFlipped ? 1 : 0.8,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                        className="flex flex-col items-center justify-center w-full"
                      >
                        <p className="text-indigo-200 text-xs font-medium mb-4">
                          Answer
                        </p>
                        <p className="text-xl font-bold text-center text-white">
                          {currentCard.answer}
                        </p>
                        <p className="text-indigo-300 text-xs absolute bottom-4 opacity-60 group-hover:opacity-100 transition-opacity">
                          Click to continue
                        </p>
                      </motion.div>
                    </div>

                    {/* AI Button - Top Right (only when flipped) */}
                    <AnimatePresence>
                      {currentCardState?.isFlipped && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowExplain(!showExplain);
                          }}
                          className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MdSmartToy className="text-xl text-indigo-600" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
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

      {/* Right Side - AI Chatbox */}
      <AnimatePresence>
        {showExplain && (
          <>
            {/* Resize Handle */}
            <div
              onMouseDown={handleResizeStart}
              className={`w-1 bg-gradient-to-b from-indigo-300 to-blue-300 hover:from-indigo-500 hover:to-blue-500 cursor-col-resize transition-colors ${
                isResizing ? "from-indigo-600 to-blue-600" : ""
              }`}
              style={{ userSelect: "none" }}
            />

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-l-2 border-indigo-200 shadow-2xl overflow-hidden flex flex-col"
              style={{ width: `${chatboxWidth}%` }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <MdSmartToy className="text-xl text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white">AI Helper</h3>
                </div>
                <button
                  onClick={() => setShowExplain(false)}
                  className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white border border-indigo-200 text-slate-900 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {chatLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white border border-indigo-200 px-3 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-100" />
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-indigo-200 bg-white p-3 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !chatLoading) {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask..."
                  className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-lg font-medium text-xs transition-all duration-200"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
