"use client";

import { useState, useEffect, useMemo } from "react";
import ProcedureChecklist from "@/components/iq/ProcedureChecklist";
import CreateIntelPostModal from "@/components/iq/CreateIntelPostModal";
import IntelSocialCard from "@/components/iq/IntelSocialCard";
import TellonymBox from "@/components/iq/TellonymBox";
import {
  SEEDED_INTEL_POSTS,
  type IntelSocialPost,
  type IntelComment,
} from "@/lib/data/iq-social-data";
import { BookOpen, Plus, Search } from "lucide-react";
export default function IqIntelPage() {
  const [posts, setPosts] = useState<IntelSocialPost[]>(SEEDED_INTEL_POSTS);
  const [selectedFilter, setSelectedFilter] = useState<string>("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load posts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hassa-intel-posts");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPosts(parsed);
        }
      }
    } catch {}
  }, []);

  // Save posts to localStorage on change
  const savePosts = (updated: IntelSocialPost[]) => {
    setPosts(updated);
    try {
      localStorage.setItem("hassa-intel-posts", JSON.stringify(updated));
    } catch {}
  };

  const handlePostCreated = (newPost: IntelSocialPost) => {
    const updated = [newPost, ...posts];
    savePosts(updated);
  };

  const handleUpvote = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, upvotesCount: p.upvotesCount + 1 };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleAddComment = (postId: string, comment: IntelComment) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [comment, ...p.comments],
        };
      }
      return p;
    });
    savePosts(updated);
  };

  // Filter and search logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchCategory =
        selectedFilter === "الكل" ||
        (selectedFilter === "تقييمات" && post.category === "place_review") ||
        (selectedFilter === "ذكاء_اصطناعي" && post.category === "ai_research") ||
        (selectedFilter === "مجهول" && post.category === "anonymous_ask") ||
        (selectedFilter === "معاملات" && (post.category === "procedure" || post.category === "local_intel"));

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        (post.placeName && post.placeName.toLowerCase().includes(q)) ||
        (post.district && post.district.toLowerCase().includes(q)) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }, [posts, selectedFilter, searchQuery]);

  return (
    <div className="space-y-6 sm:space-y-8 text-[#222f30] font-sans" dir="rtl">
      {/* 1. Master Header Banner */}
      <section className="p-5 sm:p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#55696a]">
            <BookOpen className="w-4 h-4 text-[#728825]" />
            <span className="font-bold text-[#222f30]">ميدان هسه · شبكة المعرفة والتجارب العراقية</span>
            <span>·</span>
            <span className="text-[#728825] font-bold">أظهر عقلك لا وجهك 🎭</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-kufi font-black text-[#222f30] tracking-tight">
            مساحة للعراقيين لتبادل المعرفة الحقيقية، تقييمات الأماكن، وأبحاث الـ AI.
          </h1>

          <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed font-sans">
            لا صور شخصية ولا منشورات يومية فارغة. هنا تجارب مطاعم حقيقية بلا إعلانات، حلول ذكاء اصطناعي لمشاكلنا، وأسئلة مجهولة تجيب عنها الخبرة الحقيقية.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#222f30] hover:bg-[#162021] text-[#cef79e] font-kufi font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>انشر معرفة أو تقييم</span>
        </button>
      </section>

      {/* 2. Dedicated Tellonym-Style Anonymous Box ("أظهر عقلي لا وجهي") */}
      <TellonymBox onQuestionAsked={handlePostCreated} />

      {/* 3. Search Bar & Category Navigation */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الميدان (مطاعم، سبالت، ذكاء اصطناعي، الكرادة، بنوك، معاملات)..."
            className="w-full h-11 pr-10 pl-4 bg-white border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] font-sans text-xs sm:text-sm outline-none shadow-xs transition-colors placeholder-[#55696a]/50"
          />
          <Search className="w-4 h-4 text-[#55696a] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          {[
            { id: "الكل", label: "كل الميدان", count: posts.length },
            {
              id: "تقييمات",
              label: "تقييمات الأماكن والمطاعم",
              count: posts.filter((p) => p.category === "place_review").length,
            },
            {
              id: "ذكاء_اصطناعي",
              label: "أبحاث الذكاء الاصطناعي",
              count: posts.filter((p) => p.category === "ai_research").length,
            },
            {
              id: "مجهول",
              label: "أسئلة مجهولة (Tellonym)",
              count: posts.filter((p) => p.category === "anonymous_ask").length,
            },
            {
              id: "معاملات",
              label: "أدلة ومعاملات",
              count: posts.filter((p) => p.category === "procedure" || p.category === "local_intel").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === tab.id
                  ? "bg-[#222f30] text-white font-bold shadow-xs"
                  : "bg-white text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30] border border-[#e4e3e3]"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] opacity-70 ${selectedFilter === tab.id ? "text-[#cef79e]" : ""}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Interactive Bureaucracy Checklist Builder (Available when filtering or default) */}
      {(selectedFilter === "الكل" || selectedFilter === "معاملات") && (
        <section className="space-y-3">
          <ProcedureChecklist />
        </section>
      )}

      {/* 5. The Social Intel Stream */}
      <section className="space-y-4">
        <div className="flex items-center justify-between pb-1 border-b border-[#e4e3e3] text-xs font-mono text-[#55696a]">
          <span>
            المشاركات المطابقة: <strong className="text-[#222f30]">{filteredPosts.length}</strong> مشاركة
          </span>
          <span className="text-[11px]">مرتبة حسب الأحدث وتفاعل المجتمع</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
            <BookOpen className="w-12 h-12 text-[#55696a]/30 mx-auto" />
            <h3 className="text-base font-kufi font-bold text-[#222f30]">لا توجد مشاركات مطابقة لهذا البحث</h3>
            <p className="text-xs text-[#55696a] max-w-md mx-auto">
              كن أول من يشارك تجربة أو معلومة أو يطرح سؤالاً مجهولاً في هذا القسم!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#222f30] text-[#cef79e] text-xs font-kufi font-bold cursor-pointer"
            >
              + إضافة مشاركة الآن
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredPosts.map((post) => (
              <IntelSocialCard
                key={post.id}
                post={post}
                onUpvote={handleUpvote}
                onAddComment={handleAddComment}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Create Post Modal */}
      <CreateIntelPostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
