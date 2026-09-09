"use client";

import { useState, useEffect, useMemo } from "react";
import TwitterComposer from "@/components/iq/TwitterComposer";
import TwitterPostItem from "@/components/iq/TwitterPostItem";
import TwitterSidebar from "@/components/iq/TwitterSidebar";
import TellonymBox from "@/components/iq/TellonymBox";
import {
  SEEDED_INTEL_POSTS,
  type IntelSocialPost,
  type IntelComment,
} from "@/lib/data/iq-social-data";
import { Sparkles, MessageCircleQuestion, X } from "lucide-react";

export default function IqIntelPage() {
  const [posts, setPosts] = useState<IntelSocialPost[]>(SEEDED_INTEL_POSTS);
  const [activeTab, setActiveTab] = useState<string>("forYou");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTellonymBox, setShowTellonymBox] = useState(false);

  // Load posts from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("hassa-twitter-posts");
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
      localStorage.setItem("hassa-twitter-posts", JSON.stringify(updated));
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

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  // Filter logic based on active Twitter tab and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Tab filter
      let matchTab = true;
      if (activeTab === "latest") {
        matchTab = true; // sorted by latest below
      } else if (activeTab === "reviews") {
        matchTab = post.category === "place_review";
      } else if (activeTab === "ai") {
        matchTab = post.category === "ai_research";
      } else if (activeTab === "anonymous") {
        matchTab = post.category === "anonymous_ask" || post.isAnonymous;
      }

      // Search query filter
      const q = searchQuery.trim().toLowerCase().replace(/^#/, "");
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.authorName.toLowerCase().includes(q) ||
        (post.authorHandle && post.authorHandle.toLowerCase().includes(q)) ||
        (post.placeName && post.placeName.toLowerCase().includes(q)) ||
        (post.district && post.district.toLowerCase().includes(q)) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchTab && matchSearch;
    });
  }, [posts, activeTab, searchQuery]);

  return (
    <div className="text-[#222f30] font-sans pb-16" dir="rtl">
      {/* Twitter 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* =========================================================================
            CENTER TIMELINE COLUMN (Twitter Stream) — 8 cols on desktop
           ========================================================================= */}
        <div className="lg:col-span-8 bg-white border border-[#e4e3e3] rounded-3xl shadow-xs overflow-hidden">
          
          {/* 1. Sticky Timeline Header */}
          <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md border-b border-[#e4e3e3]">
            {/* Top row */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="font-kufi font-black text-base sm:text-lg text-[#222f30]">
                  ميدان هسه
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] animate-pulse" />
                <span className="text-[11px] font-mono text-[#55696a]">
                  شبكة المعرفة العراقية
                </span>
              </div>

              {/* Tellonym Quick Trigger */}
              <button
                onClick={() => setShowTellonymBox(!showTellonymBox)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  showTellonymBox
                    ? "bg-[#222f30] text-[#cef79e]"
                    : "bg-[#f7f7f5] hover:bg-[#e4e3e3] text-[#222f30] border border-[#e4e3e3]"
                }`}
                title="طرح سؤال مجهول (أظهر عقلي لا وجهي)"
              >
                <MessageCircleQuestion className="w-3.5 h-3.5 text-sky-700" />
                <span>سؤال مجهول 🎭</span>
              </button>
            </div>

            {/* Twitter-style Tab Navigation Bar */}
            <div className="flex items-center overflow-x-auto no-scrollbar text-xs font-kufi font-bold border-t border-[#e4e3e3]/60">
              {[
                { id: "forYou", label: "لك (الرئيسية)" },
                { id: "latest", label: "الأحدث" },
                { id: "reviews", label: "تقييمات المطاعم" },
                { id: "ai", label: "أبحاث AI" },
                { id: "anonymous", label: "أسئلة مجهولة" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[90px] py-3 text-center transition-colors cursor-pointer relative ${
                      isActive ? "text-[#222f30]" : "text-[#55696a] hover:text-[#222f30] hover:bg-[#f7f7f5]/60"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-4 h-[3px] bg-[#222f30] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Optional Tellonym Box Accordion */}
          {showTellonymBox && (
            <div className="p-3 border-b border-[#e4e3e3] bg-[#f7f7f5]">
              <TellonymBox
                onQuestionAsked={(post) => {
                  handlePostCreated(post);
                  setShowTellonymBox(false);
                }}
              />
            </div>
          )}

          {/* 3. Inline Twitter Composer (Always open at the top) */}
          <TwitterComposer onPostCreated={handlePostCreated} />

          {/* 4. Filter notice / Search reset if query active */}
          {searchQuery && (
            <div className="px-4 py-2 bg-emerald-50/60 border-b border-emerald-200/60 text-xs font-mono text-emerald-800 flex items-center justify-between">
              <span>
                عرض نتائج البحث عن: <strong>&ldquo;{searchQuery}&rdquo;</strong>
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>إلغاء التصفية</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 5. Timeline Stream of Posts */}
          <div className="divide-y divide-[#e4e3e3]">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center space-y-3 font-sans">
                <Sparkles className="w-10 h-10 text-[#55696a]/40 mx-auto" />
                <h3 className="font-kufi font-bold text-base text-[#222f30]">
                  لا توجد مشاركات مطابقة هنا حالياً
                </h3>
                <p className="text-xs text-[#55696a] max-w-sm mx-auto">
                  كن أول من ينشر معلومة، تجربة مطعم، أو يطرح سؤالاً في هذا القسم!
                </p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <TwitterPostItem
                  key={post.id}
                  post={post}
                  onUpvote={handleUpvote}
                  onAddComment={handleAddComment}
                />
              ))
            )}
          </div>
        </div>

        {/* =========================================================================
            RIGHT SIDEBAR COLUMN (What's happening in Iraq / Who to follow) — 4 cols
           ========================================================================= */}
        <div className="hidden lg:block lg:col-span-4 sticky top-20">
          <TwitterSidebar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTagClick={handleTagClick}
          />
        </div>
      </div>
    </div>
  );
}
