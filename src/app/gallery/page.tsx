"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Book, 
  BarChart2, 
  FlaskConical, 
  Video, 
  Tv, 
  Palette, 
  PenTool, 
  Terminal, 
  Smartphone,
  FolderOpen
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface GalleryItem {
  id: string;
  category: "books" | "research" | "youtube" | "design" | "code";
  title: string;
  meta: string;
  icon: React.ReactNode;
}

const ITEMS: GalleryItem[] = [
  {
    id: "book-1",
    category: "books",
    title: "أساسيات العمل الجماعي",
    meta: "منشور — 2026",
    icon: <BookOpen className="w-6 h-6 text-olive" />
  },
  {
    id: "book-2",
    category: "books",
    title: "دليل المبتدئين في المحتوى",
    meta: "قيد الكتابة — 2026",
    icon: <Book className="w-6 h-6 text-olive" />
  },
  {
    id: "research-1",
    category: "research",
    title: "عوامل الاستعداد للتطور المهني لدى الشباب العراقي",
    meta: "بحث علمي — قيد التحليل",
    icon: <BarChart2 className="w-6 h-6 text-olive" />
  },
  {
    id: "research-2",
    category: "research",
    title: "دراسة مقارنة: العمل الفردي مقابل الجماعي",
    meta: "مشروع مستقبلي",
    icon: <FlaskConical className="w-6 h-6 text-olive" />
  },
  {
    id: "yt-1",
    category: "youtube",
    title: "مراجعة ألعاب 2026",
    meta: "قناة يوتيوب — 12 مقطع",
    icon: <Video className="w-6 h-6 text-olive" />
  },
  {
    id: "yt-2",
    category: "youtube",
    title: "سلسلة \"وراء الكواليس\"",
    meta: "قيد الإنتاج",
    icon: <Tv className="w-6 h-6 text-olive" />
  },
  {
    id: "design-1",
    category: "design",
    title: "هوية jemo البصرية",
    meta: "هوية كاملة — 2026",
    icon: <Palette className="w-6 h-6 text-olive" />
  },
  {
    id: "design-2",
    category: "design",
    title: "تصاميم وسائل التواصل",
    meta: "مجموعة تصاميم",
    icon: <PenTool className="w-6 h-6 text-olive" />
  },
  {
    id: "code-1",
    category: "code",
    title: "نظام إدارة الفرق",
    meta: "مشروع داخلي — قيد التطوير",
    icon: <Terminal className="w-6 h-6 text-olive" />
  },
  {
    id: "code-2",
    category: "code",
    title: "تطبيق إشعارات الفريق",
    meta: "مستقبلي",
    icon: <Smartphone className="w-6 h-6 text-olive" />
  }
];

const CATEGORIES = [
  { id: "all", label: "الكل", icon: <FolderOpen className="w-4 h-4" /> },
  { id: "books", label: "كتب ومنشورات", icon: <BookOpen className="w-4 h-4" /> },
  { id: "research", label: "أبحاث علمية", icon: <FlaskConical className="w-4 h-4" /> },
  { id: "youtube", label: "محتوى يوتيوب", icon: <Video className="w-4 h-4" /> },
  { id: "design", label: "تصميم وهوية", icon: <Palette className="w-4 h-4" /> },
  { id: "code", label: "مشاريع برمجية", icon: <Terminal className="w-4 h-4" /> }
];

export default function GalleryPage() {
  const [selectedCat, setSelectedCat] = useState("all");

  const filteredItems = selectedCat === "all" 
    ? ITEMS 
    : ITEMS.filter(item => item.category === selectedCat);

  return (
    <div className="min-h-screen bg-black text-off flex flex-col font-sans">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-24 px-6 max-w-[1200px] mx-auto w-full">
        {/* Title */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-olive mb-4 font-decoy tracking-wide"
          >
            معرض الأعمال والمنشورات
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-grey text-lg max-w-[600px] mx-auto"
          >
            نستعرض هنا نتاج أقسامنا من دراسات، برمجيات، وتصاميم
          </motion.p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-12 max-w-[900px] mx-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border transition-all duration-300 cursor-pointer ${
                selectedCat === cat.id
                  ? "bg-olive text-black border-olive shadow-[0_0_15px_rgba(107,123,58,0.3)]"
                  : "bg-black/40 text-grey border-white/10 hover:text-off hover:border-white/30"
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
              {selectedCat === cat.id && (
                <motion.span
                  layoutId="activeTabGlow"
                  className="absolute inset-0 rounded-full border border-olive-d pointer-events-none"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid Items */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.article
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                className="bg-black/50 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-olive/40 hover:shadow-[0_4px_30px_rgba(107,123,58,0.05)] transition-all group relative overflow-hidden"
              >
                {/* Spotlight effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-olive/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:border-olive/30 transition-all duration-300">
                    {item.icon}
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 text-grey rounded-md uppercase font-semibold">
                    {CATEGORIES.find(c => c.id === item.category)?.label}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-off mb-2 group-hover:text-olive transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-grey font-light">
                    {item.meta}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
