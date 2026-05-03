"use client";
import React, { useState } from "react";
import {
  MdMenu,
  MdSearch,
  MdNotifications,
  MdExpandMore,
  MdMoreVert,
  MdBookmark,
  MdDashboard,
  MdAutoStories,
  MdOutlineAssignmentTurnedIn,
  MdTrendingUp,
  MdAnalytics,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import CreateTopicModal from "./CreateTopicModal";

type Topic = {
  id: string;
  title: string;
  flashcardCount: number;
  createdDate: string;
  status: "active" | "inactive";
};

interface Props {
  userName?: string;
  topics?: Topic[];
}

const sidebarItems = [
  { label: "Overview", icon: MdDashboard },
  { label: "Topics", icon: MdAutoStories, active: true },
  { label: "My Flashcards", icon: MdOutlineAssignmentTurnedIn },
  { label: "Progress", icon: MdTrendingUp },
  { label: "Analytics", icon: MdAnalytics },
  { label: "Settings", icon: MdSettings },
];

export default function HomePage({ userName = "User", topics }: Props) {
  const [activeTab, setActiveTab] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTopic = (topic: { title: string; description: string }) => {
    console.log("Creating topic:", topic);
    // TODO: Integrate with API to create topic
    setIsModalOpen(false);
  };

  const sampleTopics: Topic[] = [
    {
      id: "1",
      title: "Biology",
      flashcardCount: 12,
      createdDate: "07/09/2023",
      status: "active",
    },
    {
      id: "2",
      title: "History",
      flashcardCount: 5,
      createdDate: "03/09/2023",
      status: "active",
    },
    {
      id: "3",
      title: "Math",
      flashcardCount: 8,
      createdDate: "05/09/2023",
      status: "active",
    },
    {
      id: "4",
      title: "Chemistry",
      flashcardCount: 15,
      createdDate: "02/09/2023",
      status: "active",
    },
    {
      id: "5",
      title: "Physics",
      flashcardCount: 10,
      createdDate: "01/09/2023",
      status: "inactive",
    },
  ];

  const displayTopics = topics ?? sampleTopics;
  const filteredTopics =
    activeTab === "active"
      ? displayTopics.filter((t) => t.status === "active")
      : activeTab === "inactive"
        ? displayTopics.filter((t) => t.status === "inactive")
        : displayTopics;

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-black text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className={`font-bold text-lg ${!sidebarOpen && "hidden"}`}>
            StudyHub
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            <MdMenu size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? "bg-white text-black font-semibold"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
                }`}
              >
                <IconComponent size={20} />
                <span className={`text-sm ${!sidebarOpen && "hidden"}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-900 transition-colors">
            <MdLogout size={20} />
            <span className={`text-sm ${!sidebarOpen && "hidden"}`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-semibold text-black">Topics</h1>
            <p className="text-sm text-gray-600 mt-1">
              {filteredTopics.length} topic
              {filteredTopics.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
              <MdNotifications size={22} className="text-gray-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-black">Welcome</p>
                <p className="text-xs text-gray-500 truncate max-w-24">
                  {userName}
                </p>
              </div>
              <MdExpandMore
                size={20}
                className="text-gray-600 cursor-pointer hover:text-black transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-auto p-8 bg-white">
          {/* Title and Action */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-black">Your Topics</h2>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm"
            >
              + Create Topic
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-3 border-b border-gray-200">
            {[
              { label: "All Topics", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.value
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredTopics.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
              <p className="text-gray-700 font-medium">
                No topics available yet.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Create your first topic to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-black">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {topic.createdDate}
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MdMoreVert size={16} className="text-gray-600" />
                    </button>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MdBookmark className="text-gray-700" size={16} />
                      <span className="text-sm font-medium text-gray-900">
                        {topic.flashcardCount}
                      </span>
                      <span className="text-xs text-gray-500">cards</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        topic.status === "active"
                          ? "bg-gray-200 text-gray-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {topic.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-900 transition-colors text-xs font-medium">
                      Study
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50 transition-colors text-xs font-medium">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-gray-600">
            Showing {filteredTopics.length}{" "}
            {filteredTopics.length === 1 ? "topic" : "topics"}
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
