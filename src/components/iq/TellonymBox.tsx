"use client";

import { useState } from "react";
import { MessageCircleQuestion, Send, Check, Sparkles, Shield, UserX } from "lucide-react";
import type { IntelSocialPost } from "@/lib/data/iq-social-data";

interface TellonymBoxProps {
  onQuestionAsked: (post: IntelSocialPost) => void;
}

const TOPICS = [
  "بنوك ودفع إلكتروني",
  "وظائف ورواتب",
  "دراسة وجامعات",
  "معاملات ودوائر",
  "استفسار محلي عام",
];

export default function TellonymBox({ onQuestionAsked }: TellonymBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [governorate, setGovernorate] = useState("كل العراق");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const newPost: IntelSocialPost = {
      id: `anon-${Date.now()}`,
      category: "anonymous_ask",
      categoryLabel: "سؤال مجهول · Tellonym",
      badgeBg: "bg-sky-50 border-sky-300",
      badgeText: "text-sky-800",
      title: question.trim(),
      content: `سؤال مجهول حول (${selectedTopic}): ${question.trim()}`,
      governorate,
      authorName: `عراقي مجهول #${Math.floor(Math.random() * 900 + 100)}`,
      authorBadge: "أظهر عقلي لا وجهي 🎭",
      isAnonymous: true,
      date: "الآن",
      upvotesCount: 1,
      commentsCount: 0,
      comments: [],
      tags: ["اسأل_العراقيين", "مجهول", selectedTopic],
    };

    onQuestionAsked(newPost);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setQuestion("");
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-3 font-sans text-[#222f30]" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 flex items-center justify-center font-bold">
            <MessageCircleQuestion className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-kufi font-bold text-sm sm:text-base text-[#222f30]">
                اسأل العراقيين بمجهولية (Tellonym)
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-100/70 border border-sky-300 text-[10px] font-mono text-sky-800 font-bold">
                أظهر عقلي لا وجهي 🎭
              </span>
            </div>
            <p className="text-xs text-[#55696a]">
              اطرح أي استفسار حساس حول الوظائف، البنوك، أو المعاملات دون كشف هويتك ليجيبك أصحاب التجربة.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2 rounded-xl text-xs font-kufi font-bold transition-all cursor-pointer shrink-0 ${
            isOpen
              ? "bg-[#f0f2f0] text-[#222f30]"
              : "bg-[#222f30] hover:bg-[#162021] text-white shadow-xs"
          }`}
        >
          {isOpen ? "إغلاق الصندوق" : "اطرح سؤالاً مجهولاً"}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="pt-3 border-t border-[#e4e3e3] space-y-3 animate-in fade-in duration-200 text-xs font-mono">
          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-bold font-kufi">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>تم طرح سؤالك المجهول في الميدان بنجاح! ستصلك إجابات المجتمع هنا.</span>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[#222f30] font-bold block">ما هو سؤالك أو استفسارك؟</label>
                <textarea
                  required
                  rows={3}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="اكتب سؤالك بوضوح (مثال: شنو أفضل طريقة لدفع إيجار المحل أو فحص بطاقات الدفع بدون عمولة سرية؟)..."
                  className="w-full p-3 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] text-xs sm:text-sm font-sans outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-[#55696a] block mb-1">الموضوع:</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full h-9 px-2.5 bg-[#f7f7f5] border border-[#e4e3e3] rounded-xl text-[#222f30] outline-none cursor-pointer"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#55696a] block mb-1">المحافظة المعنية بالسؤال:</label>
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
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#55696a]">
                  <UserX className="w-3.5 h-3.5 text-sky-700" />
                  <span>اسمك وبياناتك مشفرة 100% ولن تظهر لأحد.</span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#222f30] hover:bg-[#162021] text-white font-kufi font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>إرسال كمجهول</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}
    </div>
  );
}
