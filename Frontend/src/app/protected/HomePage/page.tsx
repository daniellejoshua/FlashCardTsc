"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdArrowForward } from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CreateTopicModal from "./CreateTopicModal";
import { useFetch } from "@/hooks/useFetch";
import { createTopic } from "@/lib/topicApi";

type Topic = {
  id: number;
  title: string;
  description: string;
  flashcardCount: number;
};
interface TopicWithUser {
  id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  username: string;
  email: string;
}

export default function HomePage({ userName = "User" }: { userName?: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error, refetch } = useFetch<{
    topics: TopicWithUser[];
  }>(`${process.env.NEXT_PUBLIC_API_URL}/api/topic/topics`);
  const topics = data ?? [];

  const handleCreateTopic = async (topic: {
    title: string;
    description: string;
  }) => {
    try {
      await createTopic(topic);
      setIsModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Failed to create topic", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/30 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              StudyHub
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Welcome back, {userName}
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            + New Topic
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Your Topics
          </h2>
          <p className="text-slate-600">Select a topic to start studying</p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white/50 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <motion.div
                      className="h-7 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-3/4"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="mt-4 space-y-3">
                      <motion.div
                        className="h-4 bg-slate-200 rounded w-full"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <motion.div
                        className="h-4 bg-slate-200 rounded w-5/6"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.1,
                        }}
                      />
                    </div>
                  </CardHeader>
                  <Separator className="bg-slate-100" />
                  <div className="px-6 py-4">
                    <motion.div
                      className="h-4 bg-slate-200 rounded w-1/3 mb-4"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="h-10 bg-slate-200 rounded"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3,
                      }}
                    />
                  </div>
                </Card>
              ))
            : topics.map((topic: Topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="border-slate-200/70 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white h-full flex flex-col group cursor-pointer">
                    <CardHeader className="pb-0 pt-6 px-6">
                      <CardTitle className="text-xl font-bold text-slate-900">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="mt-3 text-slate-600 line-clamp-2 text-sm leading-relaxed">
                        {topic.description}
                      </CardDescription>
                    </CardHeader>
                    <Separator className="mt-6 bg-slate-100" />
                    <div className="px-6 py-5 flex-1 flex flex-col justify-between">
                      <div className="text-sm font-semibold text-indigo-600">
                        {topic.flashcardCount} flashcards
                      </div>
                      <button
                        onClick={() =>
                          router.push(
                            `/protected/FlashcardStudy?topicId=${topic.id}`,
                          )
                        }
                        className="mt-4 w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                      >
                        Start Study
                        <MdArrowForward className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
        </div>
      </main>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTopic}
      />
    </div>
  );
}
