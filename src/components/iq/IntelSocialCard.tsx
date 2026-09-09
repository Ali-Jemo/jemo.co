"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  ThumbsUp,
  MessageSquare,
  Share2,
  MapPin,
  Bot,
  ShieldCheck,
  Send,
  User,
  ExternalLink,
  ChevronDown,
  Check,
} from "lucide-react";
import { type IntelSocialPost, type IntelComment, isIraqiEmail } from "@/lib/data/iq-social-data";

interface IntelSocialCardProps {
  post: IntelSocialPost;
  onUpvote: (id: string) => void;
  onAddComment: (postId: string, comment: IntelComment) => void;
}

export default function IntelSocialCard({
  post,
  onUpvote,
  onAddComment,
}: IntelSocialCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [isCommentAnon, setIsCommentAnon] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: IntelComment = {
      id: `c-${Date.now()}`,
      authorName: isCommentAnon
        ? `مجهول #${Math.floor(Math.random() * 900 + 100)}`
        : commentAuthor.trim() || "مشارك عراقي",
      isAnonymous: isCommentAnon,
      isIraqiEmailVerified: !isCommentAnon && isIraqiEmail(commentAuthor),
      date: "الآن",
      content: commentText.trim(),
      likesCount: 1,
    };

    onAddComment(post.id, newComment);
    setCommentText("");
  };

  const handleShare = () => {
    const text = `📌 ${post.title}
${post.district ? `📍 ${post.governorate} — ${post.district}` : `📍 ${post.governorate}`}
${post.content.slice(0, 160)}...
🔗 اقرأ وعلق على منصة هسه: ${typeof window !== "undefined" ? window.location.href : "https://lab.jemo.dev/iq/intel"}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: post.title, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] hover:border-[#a7e26e] hover:shadow-sm transition-all space-y-3.5 shadow-xs text-[#222f30] font-sans">
      {/* 1. Header: Category Badge + Author Identity + Date */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-md border font-semibold text-[11px] ${post.badgeBg} ${post.badgeText}`}
          >
            {post.categoryLabel}
          </span>

          <span className="text-[#55696a] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#55696a]" />
            <span>{post.governorate}</span>
            {post.district && <span>— {post.district}</span>}
          </span>

          {post.rating && (
            <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{post.rating} من 5</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#55696a]">
          {post.isAnonymous ? (
            <span className="inline-flex items-center gap-1 text-sky-800 font-bold bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
              <span>🎭</span>
              <span>{post.authorName}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[#222f30] font-bold">
              <span>{post.authorName}</span>
              {post.isIraqiEmailVerified && (
                <span className="text-[10px] text-emerald-800 font-semibold px-1.5 py-0.2 rounded bg-emerald-100/60 border border-emerald-300" title="موثق بالبريد العراقي">
                  🇮🇶 موثق
                </span>
              )}
            </span>
          )}
          <span>·</span>
          <span>{post.date}</span>
        </div>
      </div>

      {/* 2. Title */}
      <h3 className="font-kufi font-bold text-base sm:text-lg text-[#222f30] leading-snug">
        {post.title}
      </h3>

      {/* 3. AI Research Extras (Tools + Methodology) */}
      {post.category === "ai_research" && (
        <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-2 text-xs font-mono">
          {post.aiToolsUsed && post.aiToolsUsed.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#55696a] flex items-center gap-1 font-bold">
                <Bot className="w-3.5 h-3.5 text-[#728825]" />
                الأدوات:
              </span>
              {post.aiToolsUsed.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded bg-white border border-[#e4e3e3] text-[#222f30] font-semibold text-[10px]"
                >
                  {tool}
                </span>
              ))}
            </div>
          )}

          {post.methodology && (
            <div className="text-[11px] text-[#55696a] leading-relaxed pt-1 border-t border-[#e4e3e3]">
              <strong className="text-[#222f30]">المنهجية: </strong>
              {post.methodology}
            </div>
          )}
        </div>
      )}

      {/* 4. Body Content */}
      <p className="text-xs sm:text-sm text-[#222f30] leading-relaxed font-sans bg-[#f7f7f5] p-3.5 rounded-xl border border-[#e4e3e3]">
        {post.content}
      </p>

      {/* 5. Place Link if Review */}
      {post.placeName && (
        <div className="text-xs font-mono pt-0.5">
          <Link
            href="/iq/map"
            className="inline-flex items-center gap-1 text-[#728825] font-bold hover:underline"
          >
            <span>عرض بطاقة المحل في الخريطة ({post.placeName})</span>
            <span>←</span>
          </Link>
        </div>
      )}

      {/* 6. Tags row */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[#55696a] hover:text-[#222f30] transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 7. Action Buttons (Upvote, Comments Toggle, WhatsApp Share) */}
      <div className="pt-2 border-t border-[#e4e3e3] flex items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Upvote Button */}
          <button
            onClick={() => onUpvote(post.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer font-bold active:scale-95"
            title="أؤكد هذه التجربة / معلومة مفيدة"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>مفيد وموثوق ({post.upvotesCount})</span>
          </button>

          {/* Comments Toggle Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#f7f7f5] hover:bg-[#e4e3e3] text-[#222f30] border border-[#e4e3e3] transition-colors cursor-pointer font-medium"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#55696a]" />
            <span>التعليقات ({post.comments.length})</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform ${
                showComments ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f7f7f5] hover:bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30] border border-[#e4e3e3] transition-colors cursor-pointer"
          title="مشاركة عبر واتساب"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
          <span>{copied ? "تم النسخ" : "مشاركة"}</span>
        </button>
      </div>

      {/* 8. Collapsible Comments Section */}
      {showComments && (
        <div className="pt-3 border-t border-[#e4e3e3] space-y-3 animate-in fade-in duration-200">
          <h4 className="text-xs font-mono font-bold text-[#222f30]">
            النقاش المجتمعي والتعليقات:
          </h4>

          {/* Existing Comments */}
          {post.comments.length === 0 ? (
            <div className="text-xs text-[#55696a] font-mono p-3 rounded-xl bg-[#f7f7f5] text-center">
              لا توجد تعليقات بعد. كن أول من يشارك رأيه أو يصحح المعلومة!
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-2.5 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#55696a]">
                    <div className="flex items-center gap-1 font-bold text-[#222f30]">
                      {comment.isAnonymous ? (
                        <span>🎭 {comment.authorName}</span>
                      ) : (
                        <span>👤 {comment.authorName}</span>
                      )}
                      {comment.isIraqiEmailVerified && (
                        <span className="text-emerald-700">✓ موثق</span>
                      )}
                    </div>
                    <span>{comment.date}</span>
                  </div>
                  <p className="text-xs text-[#222f30] font-sans leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#55696a]">
              <span>أضف تعليقك أو نصيحتك:</span>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCommentAnon}
                  onChange={(e) => setIsCommentAnon(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#222f30]"
                />
                <span>علق كمجهول (أظهر عقلي لا وجهي)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  isCommentAnon
                    ? "اكتب تعليقك بمجهولية..."
                    : "اكتب تعليقك أو تأكيدك للتجربة..."
                }
                className="flex-1 h-9 px-3 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-xs text-[#222f30] outline-none"
              />
              <button
                type="submit"
                className="px-3.5 h-9 bg-[#222f30] hover:bg-[#162021] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>إرسال</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  );
}
