"use client";

import { useState } from "react";
import {
  X,
  Plus,
  Send,
  Sparkles,
  Star,
  MapPin,
  Bot,
  MessageCircleQuestion,
  BookOpen,
  ShieldCheck,
  UserCheck,
  Check,
} from "lucide-react";
import { type IntelPostCategory, type IntelSocialPost, isIraqiEmail } from "@/lib/data/iq-social-data";

interface CreateIntelPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: IntelSocialPost) => void;
}

const CATEGORY_OPTIONS: {
  type: IntelPostCategory;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    type: "place_review",
    title: "تقييم وتجربة مكان",
    desc: "مطعم، عيادة، مصلح، سوق (بدون إعلانات مدفوعة)",
    icon: Star,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    type: "local_intel",
    title: "معلومة وخبرة محلية",
    desc: "نصيحة، تحذير استهلاكي، طرق، إنترنت، خدمات",
    icon: BookOpen,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    type: "ai_research",
    title: "بحث بالذكاء الاصطناعي",
    desc: "دراسة مصغرة أو فحص مشكلة عراقية بنماذج AI",
    icon: Bot,
    color: "text-[#222f30] bg-[#cef79e]/30 border-[#a7e26e]",
  },
  {
    type: "anonymous_ask",
    title: "سؤال مجهول (Tellonym)",
    desc: "اسأل المجتمع بدون كشف هويتك (أظهر عقلي لا وجهي)",
    icon: MessageCircleQuestion,
    color: "text-sky-700 bg-sky-50 border-sky-200",
  },
];

export default function CreateIntelPostModal({
  isOpen,
  onClose,
  onPostCreated,
}: CreateIntelPostModalProps) {
  const [category, setCategory] = useState<IntelPostCategory>("place_review");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [governorate, setGovernorate] = useState("بغداد");
  const [district, setDistrict] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [iraqiEmail, setIraqiEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [placeName, setPlaceName] = useState("");
  const [aiTools, setAiTools] = useState("");
  const [methodology, setMethodology] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const selectedOption = CATEGORY_OPTIONS.find((c) => c.type === category);
    const tags = tagsInput
      .split(" ")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const isEmailVerified = isIraqiEmail(iraqiEmail);

    const newPost: IntelSocialPost = {
      id: `post-${Date.now()}`,
      category,
      categoryLabel: selectedOption?.title ?? "مشاركة معرفية",
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
      title: title.trim(),
      content: content.trim(),
      governorate,
      district: district.trim() || undefined,
      authorName: isAnonymous
        ? `عراقي مجهول #${Math.floor(Math.random() * 900 + 100)}`
        : authorName.trim() || "مشارك عراقي",
      authorBadge: isEmailVerified && !isAnonymous ? "موثق بالبريد العراقي 🇮🇶" : undefined,
      isAnonymous,
      isIraqiEmailVerified: isEmailVerified && !isAnonymous,
      date: "الآن",
      upvotesCount: 1,
      repostsCount: 0,
      viewsCount: "1",
      authorHandle: isAnonymous ? "anon" : "@" + (authorName.trim().replace(/\s+/g, "_") || "user"),
      commentsCount: 0,
      comments: [],
      rating: category === "place_review" ? rating : undefined,
      placeName: category === "place_review" ? placeName.trim() : undefined,
      aiToolsUsed:
        category === "ai_research" && aiTools
          ? aiTools.split(",").map((s) => s.trim()).filter(Boolean)
          : undefined,
      methodology: category === "ai_research" ? methodology.trim() : undefined,
      tags: tags.length ? tags : ["معرفة_عراقية", governorate],
    };

    onPostCreated(newPost);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#222f30]/40 backdrop-blur-sm overflow-y-auto"
      dir="rtl"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl bg-white border border-[#e4e3e3] rounded-3xl shadow-2xl p-5 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto text-[#222f30] font-sans animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e4e3e3]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#222f30] text-[#cef79e] flex items-center justify-center font-bold">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-kufi font-bold text-base sm:text-lg text-[#222f30]">
                شارك معرفة أو تجربة عراقية
              </h2>
              <p className="text-xs text-[#55696a]">
                معلومات قيّمة وتجارب حقيقية — لا مكان للمنشورات الفارغة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#55696a] hover:text-[#222f30] hover:bg-[#f0f2f0] transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3 font-kufi">
            <div className="w-12 h-12 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-[#222f30]">تم النشر في ميدان هسه!</h3>
            <p className="text-xs text-[#55696a]">مشاركتك متاحة الآن للمجتمع العراقي للتصويت والتعليق.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#55696a] block">نوع المشاركة:</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = category === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setCategory(opt.type)}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#222f30] text-white border-[#222f30] shadow-xs"
                          : "bg-[#f7f7f5] text-[#222f30] border-[#e4e3e3] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="font-kufi font-bold text-xs">{opt.title}</span>
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#cef79e]" : "text-[#728825]"}`} />
                      </div>
                      <span className={`text-[10px] leading-tight ${isSelected ? "text-white/70" : "text-[#55696a]"}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Identity & Anonymity Toggle */}
            <div className="p-3 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#222f30] block">طريقة النشر والهوية:</span>
                  <span className="text-[11px] text-[#55696a]">
                    {isAnonymous ? "🎭 مجهول: أظهر عقلي لا وجهي (آمن وحر)" : "👤 بهويتك أو اسمك المستعار"}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#e4e3e3]">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      !isAnonymous ? "bg-[#222f30] text-white shadow-xs" : "text-[#55696a] hover:text-[#222f30]"
                    }`}
                  >
                    علني
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAnonymous ? "bg-[#222f30] text-[#cef79e] shadow-xs" : "text-[#55696a] hover:text-[#222f30]"
                    }`}
                  >
                    مجهول
                  </button>
                </div>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#e4e3e3]">
                  <div>
                    <label className="text-[10px] text-[#55696a] block mb-0.5">اسمك أو لقبك المستعار:</label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="مثال: علي البغدادي"
                      className="w-full h-8 px-2.5 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none focus:border-[#a7e26e]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#55696a] block mb-0.5">
                      بريدك العراقي (اختياري للشارة 🇮🇶):
                    </label>
                    <input
                      type="email"
                      value={iraqiEmail}
                      onChange={(e) => setIraqiEmail(e.target.value)}
                      placeholder="name@jemo.co أو @iraq.iq"
                      className="w-full h-8 px-2.5 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] text-xs outline-none focus:border-[#a7e26e]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Conditional Inputs based on Type */}
            {category === "place_review" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs font-mono">
                <div>
                  <label className="text-[#222f30] font-bold block mb-1">اسم المطعم أو المكان:</label>
                  <input
                    type="text"
                    required
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="مثال: كباب أبو حيدر، عيادة د. علي"
                    className="w-full h-9 px-3 bg-white border border-amber-300/60 rounded-xl text-[#222f30] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#222f30] font-bold block mb-1">تقييمك الحقيقي (من 5):</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full h-9 px-3 bg-white border border-amber-300/60 rounded-xl text-[#222f30] outline-none cursor-pointer font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 من 5 (ممتاز)</option>
                    <option value={4.5}>⭐⭐⭐⭐ 4.5 من 5 (جيد جداً)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 من 5 (جيد)</option>
                    <option value={3}>⭐⭐⭐ 3 من 5 (متوسط)</option>
                    <option value={2}>⭐⭐ 2 من 5 (سيء)</option>
                    <option value={1}>⭐ 1 من 5 (لا أنصح به إطلاقاً)</option>
                  </select>
                </div>
              </div>
            )}

            {category === "ai_research" && (
              <div className="p-3 rounded-2xl bg-[#cef79e]/15 border border-[#a7e26e]/40 space-y-2 text-xs font-mono">
                <div>
                  <label className="text-[#222f30] font-bold block mb-1">أدوات الذكاء الاصطناعي المستخدمة:</label>
                  <input
                    type="text"
                    value={aiTools}
                    onChange={(e) => setAiTools(e.target.value)}
                    placeholder="مثال: Claude 3.7, ChatGPT o1, DeepSeek, Python"
                    className="w-full h-9 px-3 bg-white border border-[#a7e26e] rounded-xl text-[#222f30] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[#222f30] font-bold block mb-1">المنهجية والتحقق البشري (باختصار):</label>
                  <input
                    type="text"
                    value={methodology}
                    onChange={(e) => setMethodology(e.target.value)}
                    placeholder="كيف فحصت النتائج وتأكدت من عدم وجود هلوسة؟"
                    className="w-full h-9 px-3 bg-white border border-[#a7e26e] rounded-xl text-[#222f30] outline-none"
                  />
                </div>
              </div>
            )}

            {/* 4. Common Inputs: Title & Content */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[#222f30] block">عنوان المشاركة:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: تجربتي مع فلان، دليل كذا، سؤال حول كذا..."
                className="w-full h-10 px-3 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] text-sm font-sans outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-[#222f30] block">التفاصيل والمعلومات الدقيقة:</label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تجربتك أو معلومتك أو استفسارك بوضوح. اذكر الأسعار، الأوقات، أو النصائح التي تهم القارئ..."
                className="w-full p-3 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] text-xs sm:text-sm font-sans outline-none leading-relaxed resize-none"
              />
            </div>

            {/* 5. Location & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <label className="text-[#55696a] block mb-1">المحافظة / المدينة:</label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full h-9 px-2.5 bg-[#f7f7f5] border border-[#e4e3e3] rounded-xl text-[#222f30] outline-none cursor-pointer"
                >
                  <option value="كل العراق">كل العراق</option>
                  <option value="بغداد">بغداد</option>
                  <option value="البصرة">البصرة</option>
                  <option value="أربيل">أربيل</option>
                  <option value="النجف الأشرف">النجف الأشرف</option>
                  <option value="نينوى (الموصل)">نينوى (الموصل)</option>
                  <option value="كربلاء المقدسة">كربلاء المقدسة</option>
                  <option value="كركوك">كركوك</option>
                  <option value="السليمانية">السليمانية</option>
                  <option value="الأنبار">الأنبار</option>
                  <option value="بابل">بابل</option>
                </select>
              </div>

              <div>
                <label className="text-[#55696a] block mb-1">الحي أو المنطقة (اختياري):</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="مثال: الكرادة، المنصور، المعقل"
                  className="w-full h-9 px-2.5 bg-[#f7f7f5] border border-[#e4e3e3] rounded-xl text-[#222f30] outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between border-t border-[#e4e3e3]">
              <span className="text-[11px] text-[#55696a] font-mono">
                محتوى محلي يخضع لتدقيق المجتمع
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-[#55696a] hover:bg-[#f0f2f0] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#222f30] hover:bg-[#162021] text-white font-kufi font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر في الميدان</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
