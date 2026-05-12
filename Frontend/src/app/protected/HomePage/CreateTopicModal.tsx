"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdAdd } from "react-icons/md";

interface CreateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (topic: { title: string; description: string }) => Promise<void>;
}
export default function CreateTopicModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTopicModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">Create Topic</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isLoading}
              >
                <MdClose size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Topic Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Biology Fundamentals"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-none"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  This is the name of your study topic
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional: Add a brief description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors resize-none text-black"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Maximum 200 characters
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Tip:</span> You can add
                  flashcards to this topic after creation.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || isLoading}
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <MdAdd size={18} />
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </div>
            </form>

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl">
                <div className="animate-spin border-4 border-black/20 border-t-black rounded-full h-12 w-12 mb-4" />
                <p className="text-sm font-medium text-black">
                  Creating topic...
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
