"use client";

import { useState } from "react";
import {
  Star,
  Bot,
  MapPin,
  Send,
  Sparkles,
  UserX,
  Plus,
  Check,
  Building2,
} from "lucide-react";
import type { IntelPostCategory, IntelSocialPost } from "@/lib/data/iq-social-data";

interface TwitterComposerProps {
  onPostCreated: (post: IntelSocialPost) => void;
}

export default function TwitterComposer({ onPostCreated }: TwitterComposerProps) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<IntelPostCategory>("local_intel");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("علي البغدادي");
  const [authorHandle, setAuthorHandle] = useState("ali_baghdad");
  const [governorate, setGovernorate] = useState("بغداد");
  const [district, setDistrict] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [rating, setRating] = useState(5);
  const [aiTools, setAiTools] = useState("");
  const [showExtras, setShowExtras] = useState(false);
  const [postedSuccess, setPostedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Extract first sentence as title if not explicit
    const firstLine = content.split("\n")[0].slice(0, 70);
    const title =
      category === "place_review" && placeName
        ? `تقييم ${placeName}: ${firstLine}`
        : firstLine;

    const newPost: IntelSocialPost = {
      id: `post-${Date.now()}`,
      category,
      categoryLabel:
        category === "place_review"
          ? "تقييم وتجربة مكان"
          : category === "ai_research"
          ? "بحث بالذكاء الاصطناعي"
          : category === "anonymous_ask"
          ? "سؤال مجهول · Tellonym"
          : "معلومة وخبرة محلية",
      badgeBg:
        category === "place_review"
          ? "bg-amber-50 border-amber-300"
          : category === "ai_research"
          ? "bg-emerald-50 border-emerald-300"
          : category === "anonymous_ask"
          ? "bg-sky-50 border-sky-300"
          : "bg-purple-50 border-purple-300",
      badgeText:
        category === "place_review"
          ? "text-amber-800"
          : category === "ai_research"
          ? "text-emerald-800"
          : category === "anonymous_ask"
          ? "text-sky-800"
          : "text-purple-800",
      title,
      content: content.trim(),
      governorate,
      district: district.trim() || undefined,
      authorName: isAnonymous
        ? `عراقي مجهول #${Math.floor(Math.random() * 900 + 100)}`
        : authorName.trim() || "مواطن عراقي",
      authorHandle: isAnonymous
        ? `anon_${Math.floor(Math.random() * 900 + 100)}`
        : authorHandle.trim() || "iraqi_user",
      authorAvatar: isAnonymous ? "🎭" : "ع",
      authorBadge: !isAnonymous ? "بريد عراقي موثق 🇮🇶" : "أظهر عقلي لا وجهي 🎭",
      isAnonymous,
      isIraqiEmailVerified: !isAnonymous,
      date: "الآن",
      upvotesCount: 1,
      repostsCount: 0,
      commentsCount: 0,
      viewsCount: "١",
      comments: [],
      rating: category === "place_review" ? rating : undefined,
      placeName: category === "place_review" ? placeName.trim() : undefined,
      aiToolsUsed:
        category === "ai_research" && aiTools
          ? aiTools.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      tags: [governorate, category === "ai_research" ? "ذكاء_اصطناعي" : "معرفة_عراقية"],
    };

    onPostCreated(newPost);
    setContent("");
    setPlaceName("");
    setAiTools("");
    setShowExtras(false);
    setPostedSuccess(true);
    setTimeout(() => setPostedSuccess(false), 2000);
  };

  return (
    <div className="bg-white border-b border-[#e4e3e3] p-4 text-[#222f30] font-sans" dir="rtl">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Top: Avatar + Textarea */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#222f30] text-[#cef79e] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            {isAnonymous ? "🎭" : "ع"}
          </div>

          {/* Text input area */}
          <div className="flex-1 space-y-2">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isAnonymous
                  ? "اطرح سؤالاً مجهولاً أو فكرة حرة للعراقيين (أظهر عقلي لا وجهي)..."
                  : "شارك معلومة حقيقية، تجربة مطعم، خطوات معاملة، أو بحث AI..."
              }
              className="w-full bg-transparent text-[#222f30] placeholder-[#55696a]/60 text-sm sm:text-base outline-none resize-none leading-relaxed font-sans"
            />

            {/* Extras row if toggled */}
            {showExtras && (
              <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-2 text-xs font-mono animate-in fade-in duration-200">
                {/* Category Type Pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#55696a] font-bold">النوع:</span>
                  {[
                    { id: "local_intel", label: "معلومة محلية" },
                    { id: "place_review", label: "تقييم مطعم / مكان" },
                    { id: "ai_research", label: "بحث AI" },
                    { id: "anonymous_ask", label: "سؤال مجهول" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setCategory(t.id as IntelPostCategory);
                        if (t.id === "anonymous_ask") setIsAnonymous(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        category === t.id
                          ? "bg-[#222f30] text-white font-bold"
                          : "bg-white text-[#55696a] border border-[#e4e3e3] hover:text-[#222f30]"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Conditional place fields */}
                {category === "place_review" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      placeholder="اسم المطعم أو المحل (مثلاً: كباب أبو حيدر)"
                      className="h-8 px-2.5 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none"
                    />
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="h-8 px-2 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none cursor-pointer font-bold"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 من 5 (ممتاز)</option>
                      <option value={4.5}>⭐⭐⭐⭐ 4.5 من 5 (جيد جداً)</option>
                      <option value={4}>⭐⭐⭐⭐ 4 من 5 (جيد)</option>
                      <option value={3}>⭐⭐⭐ 3 من 5 (متوسط)</option>
                    </select>
                  </div>
                )}

                {/* Conditional AI Research fields */}
                {category === "ai_research" && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={aiTools}
                      onChange={(e) => setAiTools(e.target.value)}
                      placeholder="أدوات الـ AI المستخدمة (مثال: Claude 3.7, ChatGPT o1, Python)"
                      className="w-full h-8 px-2.5 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none"
                    />
                  </div>
                )}

                {/* Location Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="h-8 px-2 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none cursor-pointer"
                  >
                    <option value="كل العراق">كل العراق</option>
                    <option value="بغداد">بغداد</option>
                    <option value="البصرة">البصرة</option>
                    <option value="أربيل">أربيل</option>
                    <option value="النجف الأشرف">النجف الأشرف</option>
                    <option value="الموصل">الموصل</option>
                    <option value="كربلاء المقدسة">كربلاء المقدسة</option>
                    <option value="الأنبار">الأنبار</option>
                  </select>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="الحي أو الشارع (اختياري: الكرادة، المنصور)"
                    className="h-8 px-2.5 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Toolbar Row: Twitter-style icons + Tweet button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#e4e3e3] mr-12 text-xs font-mono">
          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setShowExtras(!showExtras);
                setCategory("place_review");
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showExtras && category === "place_review"
                  ? "bg-amber-100 text-amber-800"
                  : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
              }`}
              title="إضافة تقييم مطعم أو مكان"
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowExtras(!showExtras);
                setCategory("ai_research");
              }}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showExtras && category === "ai_research"
                  ? "bg-emerald-100 text-emerald-800"
                  : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
              }`}
              title="نشر بحث أو تجربة ذكاء اصطناعي"
            >
              <Bot className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsAnonymous(!isAnonymous);
                if (!isAnonymous) setCategory("anonymous_ask");
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                isAnonymous
                  ? "bg-[#222f30] text-[#cef79e]"
                  : "bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30]"
              }`}
              title="التبديل للنشر المجهول (أظهر عقلي لا وجهي)"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>{isAnonymous ? "مجهول 🎭" : "علني"}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExtras(!showExtras)}
              className="p-2 rounded-full text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30] transition-colors cursor-pointer"
              title="تحديد المحافظة والتفاصيل"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-2">
            {postedSuccess && (
              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> تم النشر!
              </span>
            )}
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-full bg-[#222f30] hover:bg-[#162021] text-white disabled:opacity-40 disabled:hover:bg-[#222f30] font-kufi font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>انشر</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
