"use client";
import { useState } from "react";
import {
  MdMenu,
  MdExpandMore,
  MdDashboard,
  MdAutoStories,
  MdOutlineAssignmentTurnedIn,
  MdTrendingUp,
  MdAnalytics,
  MdSettings,
  MdLogout,
} from "react-icons/md";
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
const sidebarItems = [
  { label: "Overview", icon: MdDashboard },
  { label: "Topics", icon: MdAutoStories, active: true },
  { label: "My Flashcards", icon: MdOutlineAssignmentTurnedIn },
  { label: "Progress", icon: MdTrendingUp },
  { label: "Analytics", icon: MdAnalytics },
  { label: "Settings", icon: MdSettings },
];
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, loading, error, refetch } = useFetch<{
    topics: TopicWithUser[];
  }>(`${process.env.NEXT_PUBLIC_API_URL}/api/topic/topics`);
  const topics = data ?? [];
  const handleCreateTopic = (topic: { title: string; description: string }) => {
    console.log("Creating topic:", topic);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-blue-50 border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <div
            className={`font-bold text-lg text-blue-900 ${!sidebarOpen && "hidden"}`}
          >
            StudyHub
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-blue-700 hover:bg-blue-100"
          >
            <MdMenu size={20} />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <Button
                key={idx}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start gap-3 text-blue-700 hover:bg-blue-100 hover:text-blue-900 ${
                  item.active && "bg-blue-100 text-blue-900"
                } ${!sidebarOpen && "px-2"}`}
              >
                <IconComponent size={20} />
                <span className={`text-sm ${!sidebarOpen && "hidden"}`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </nav>

        <div className="p-4">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-blue-700 hover:bg-blue-100 hover:text-blue-900 ${
              !sidebarOpen && "px-2"
            }`}
          >
            <MdLogout size={20} />
            <span className={`text-sm ${!sidebarOpen && "hidden"}`}>
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-background px-6 py-4 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">Welcome</p>
              <p className="text-xs text-muted-foreground">{userName}</p>
            </div>
            <MdExpandMore size={18} className="text-muted-foreground" />
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Title and Action */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Your Topics</h2>
              <p className="text-muted-foreground">
                Manage and study your flashcard topics
              </p>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>+ Create Topic</Button>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1">
            {[
              { label: "All Topics", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ].map((tab) => (
              <Button
                key={tab.value}
                variant="ghost"
                className="rounded-none border-b-2 border-transparent data-[active=true]:border-primary"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic: Topic) => (
              <Card
                key={topic.id}
                className="hover:shadow-md transition-shadow h-64 flex flex-col"
              >
                <CardHeader className="flex-1 flex flex-col">
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                  <CardDescription className="mt-2 flex-1 line-clamp-3">
                    {topic.description}
                  </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6 mt-auto">
                  <div className="text-sm text-muted-foreground mb-4">
                    {topic.flashcardCount} flashcards
                  </div>
                  <Separator className="mb-4" />
                  <Button variant="outline" className="w-full">
                    Study
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Create Topic Modal */}
      <CreateTopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTopic}
      />
    </div>
  );
}
