"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Repeat,
  Heart,
  Share2,
  Bookmark,
  Star,
  MapPin,
  Bot,
  ShieldCheck,
  Check,
  Send,
  BarChart2,
  ExternalLink,
} from "lucide-react";
import type { IntelSocialPost, IntelComment } from "@/lib/data/iq-social-data";

interface TwitterPostItemProps {
  post: IntelSocialPost;
  onUpvote: (id: string) => void;
  onAddComment: (postId: string, comment: IntelComment) => void;
}

export default function TwitterPostItem({
  post,
  onUpvote,
  onAddComment,
}: TwitterPostItemProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.upvotesCount);
  const [reposted, setReposted] = useState(false);
  const [repostsCount, setRepostsCount] = useState(post.repostsCount);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isReplyAnon, setIsReplyAnon] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount((c) => c + 1);
      onUpvote(post.id);
    } else {
      setLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
    }
  };

  const handleRepost = () => {
    if (!reposted) {
      setReposted(true);
      setRepostsCount((c) => c + 1);
    } else {
      setReposted(false);
      setRepostsCount((c) => Math.max(0, c - 1));
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newComment: IntelComment = {
      id: `c-${Date.now()}`,
      authorName: isReplyAnon
        ? `مجهول #${Math.floor(Math.random() * 900 + 100)}`
        : "مواطن عراقي",
      isAnonymous: isReplyAnon,
      isIraqiEmailVerified: !isReplyAnon,
      date: "الآن",
      content: replyText.trim(),
      likesCount: 0,
    };

    onAddComment(post.id, newComment);
    setReplyText("");
  };

  const handleShare = () => {
    const text = `📌 ${post.title}
بواسطة ${post.authorName} (${post.authorHandle ? `@${post.authorHandle}` : ""})
${post.content.slice(0, 160)}...
🔗 تابع على منصة هسه: ${typeof window !== "undefined" ? window.location.href : "https://lab.jemo.dev/iq/intel"}`;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: post.title, text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText?.(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article
      className="p-4 sm:p-5 border-b border-[#e4e3e3] hover:bg-[#f7f7f5]/60 transition-colors text-[#222f30] font-sans"
      dir="rtl"
    >
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-xs select-none ${
            post.isAnonymous
              ? "bg-sky-100 text-sky-800 border border-sky-300"
              : "bg-[#222f30] text-[#cef79e]"
          }`}
        >
          {post.isAnonymous ? "🎭" : post.authorAvatar || post.authorName.slice(0, 1)}
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Row: Name + Badge + Handle + Date */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap text-sm leading-none">
              <span className="font-bold text-[#222f30] hover:underline cursor-pointer">
                {post.authorName}
              </span>

              {/* Verified Iraqi Badge */}
              {post.isIraqiEmailVerified && !post.isAnonymous && (
                <span
                  title="حساب موثق بالبريد العراقي الوطني"
                  className="w-4 h-4 rounded-full bg-[#222f30] text-[#cef79e] inline-flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs"
                >
                  ✓
                </span>
              )}

              {/* Twitter Handle */}
              <span className="text-xs font-mono text-[#55696a] dir-ltr">
                @{post.authorHandle}
              </span>

              <span className="text-xs text-[#55696a]">·</span>

              {/* Timestamp */}
              <span className="text-xs font-mono text-[#55696a]">{post.date}</span>

              {/* Category chip */}
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border mr-1 font-semibold ${post.badgeBg} ${post.badgeText}`}
              >
                {post.categoryLabel}
              </span>
            </div>

            {/* Location Pill if present */}
            {post.district && (
              <span className="text-[11px] font-mono text-[#55696a] hidden sm:flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#728825]" />
                <span>{post.district}</span>
              </span>
            )}
          </div>

          {/* Main Tweet Title & Content */}
          <div className="space-y-1.5">
            <h3 className="font-kufi font-bold text-sm sm:text-base text-[#222f30] leading-snug">
              {post.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#222f30] leading-relaxed font-sans whitespace-pre-line">
              {post.content}
            </p>
          </div>

          {/* Embedded Place Card (Twitter Quote / Attachment style) */}
          {post.placeName && (
            <div className="p-3 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#222f30] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#728825]" />
                  <span>المكان الموثق: {post.placeName}</span>
                </span>
                {post.rating && (
                  <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{post.rating} / 5</span>
                  </span>
                )}
              </div>
              <Link
                href="/iq/map"
                className="text-[11px] text-[#728825] font-bold hover:underline flex items-center gap-1 pt-0.5"
              >
                <span>عرض على خريطة المحلة والتواصل</span>
                <span>←</span>
              </Link>
            </div>
          )}

          {/* Embedded AI Research Card */}
          {post.category === "ai_research" && post.aiToolsUsed && (
            <div className="p-3 rounded-2xl bg-[#cef79e]/15 border border-[#a7e26e]/50 space-y-1.5 text-xs font-mono">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-[#222f30] flex items-center gap-1">
                  <Bot className="w-3.5 h-3.5 text-[#728825]" />
                  <span>أدوات الذكاء الاصطناعي:</span>
                </span>
                {post.aiToolsUsed.map((tool) => (
                  <span
                    key={tool}
                    className="px-2 py-0.5 rounded bg-white border border-[#a7e26e] text-[#222f30] text-[10px] font-bold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
              {post.methodology && (
                <div className="text-[11px] text-[#55696a] pt-1 border-t border-[#a7e26e]/30">
                  <strong className="text-[#222f30]">المنهجية: </strong>
                  {post.methodology}
                </div>
              )}
            </div>
          )}

          {/* Twitter Action Row */}
          <div className="flex items-center justify-between pt-2 text-[#55696a] text-xs font-mono max-w-md">
            {/* 1. Reply */}
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 hover:text-sky-600 transition-colors group cursor-pointer p-1"
              title="الردود والتعليقات"
            >
              <div className="p-1 rounded-full group-hover:bg-sky-50 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span>{post.comments.length}</span>
            </button>

            {/* 2. Repost */}
            <button
              onClick={handleRepost}
              className={`flex items-center gap-1.5 transition-colors group cursor-pointer p-1 ${
                reposted ? "text-emerald-700 font-bold" : "hover:text-emerald-700"
              }`}
              title="إعادة النشر"
            >
              <div className="p-1 rounded-full group-hover:bg-emerald-50 transition-colors">
                <Repeat className="w-4 h-4" />
              </div>
              <span>{repostsCount}</span>
            </button>

            {/* 3. Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 transition-colors group cursor-pointer p-1 ${
                liked ? "text-rose-600 font-bold" : "hover:text-rose-600"
              }`}
              title="إعجاب وتأكيد"
            >
              <div className="p-1 rounded-full group-hover:bg-rose-50 transition-colors">
                <Heart className={`w-4 h-4 ${liked ? "fill-rose-600 text-rose-600" : ""}`} />
              </div>
              <span>{likesCount}</span>
            </button>

            {/* 4. Views */}
            <div className="hidden xs:flex items-center gap-1 text-[#55696a]/70 p-1">
              <BarChart2 className="w-4 h-4" />
              <span>{post.viewsCount}</span>
            </div>

            {/* 5. Share */}
            <button
              onClick={handleShare}
              className="p-1 rounded-full hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer text-[#55696a]"
              title="مشاركة عبر واتساب أو نسخ الرابط"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Twitter-style Replies Thread */}
          {showReplies && (
            <div className="pt-3 space-y-2.5 border-t border-[#e4e3e3] animate-in fade-in duration-200">
              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isReplyAnon
                      ? "اكتب ردك كمجهول (أظهر عقلي لا وجهي)..."
                      : "أضف ردك أو تأكيدك للتجربة..."
                  }
                  className="flex-1 h-9 px-3 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-full text-xs text-[#222f30] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setIsReplyAnon(!isReplyAnon)}
                  className={`text-[10px] px-2 py-1.5 rounded-full font-bold border transition-colors cursor-pointer shrink-0 ${
                    isReplyAnon
                      ? "bg-[#222f30] text-[#cef79e] border-[#222f30]"
                      : "bg-white text-[#55696a] border-[#e4e3e3]"
                  }`}
                  title="الرد كمجهول"
                >
                  {isReplyAnon ? "مجهول 🎭" : "علني"}
                </button>
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-3.5 h-9 bg-[#222f30] hover:bg-[#162021] text-white disabled:opacity-40 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0"
                >
                  رد
                </button>
              </form>

              {/* Existing Replies List */}
              {post.comments.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-[#e4e3e3]/60">
                  {post.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-2.5 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#55696a]">
                        <span className="font-bold text-[#222f30] flex items-center gap-1">
                          {comment.isAnonymous ? "🎭 " : "👤 "}
                          {comment.authorName}
                          {comment.isIraqiEmailVerified && (
                            <span className="text-emerald-700 text-[10px]">✓ موثق</span>
                          )}
                        </span>
                        <span>{comment.date}</span>
                      </div>
                      <p className="text-xs text-[#222f30] font-sans leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
