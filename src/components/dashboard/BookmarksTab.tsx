"use client";

import React from "react";
import Link from "next/link";
import { Bookmark, ArrowUpLeft, Trash2, HelpCircle, Sparkles } from "lucide-react";
import { RESEARCH_PAPERS, OPEN_QUESTIONS } from "@/lib/data/research-data";
import { useBookmarks } from "@/lib/bookmarks";
import {
  cardClass,
  primaryBtnClass,
  SectionHeader,
  EmptyState,
} from "@/components/dashboard/ui";

export default function BookmarksTab() {
  const { bookmarks, remove } = useBookmarks();

  const savedPapers = RESEARCH_PAPERS.filter((p) => bookmarks.includes(p.slug));
  const followedQuestions = OPEN_QUESTIONS.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* 1. Saved Research Papers */}
      <div className="space-y-4">
        <SectionHeader
          icon={<Bookmark className="w-5 h-5" />}
          accent="blue"
          title="الأبحاث والدراسات المحفوظة"
          en="Saved Research"
          desc="الأوراق وكائنات البحث التي قمت بتمييزها للرجوع إليها أو تكرار تجاربها لاحقاً"
          action={
            <span className="text-xs font-mono text-[#738284] px-2.5 py-1 rounded-xl bg-white border border-[#e4e3e3]">
              {savedPapers.length} محفوظات
            </span>
          }
        />

        {savedPapers.length === 0 ? (
          <EmptyState
            icon={<Bookmark className="w-7 h-7" />}
            accent="blue"
            title="لم تقم بحفظ أي بحث بعد"
            desc="يمكنك استكشاف أرشيف كائنات البحث وحفظ أي دراسة بالضغط على زر الحفظ للوصول السريع إليها."
            action={
              <Link href="/research" className={primaryBtnClass}>
                <span>تصفح الأبحاث والمخطوطات</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPapers.map((paper) => (
              <div
                key={paper.id}
                className={`${cardClass} p-5 space-y-3.5 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#f0f2f0] text-[#222f30] font-bold">
                      {paper.field}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(paper.slug)}
                      className="text-[#738284] hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="إزالة من المحفوظات"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold font-kufi text-[#222f30]">
                    <Link href={`/research/${paper.slug}`} className="hover:text-blue-800 transition-colors">
                      {paper.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#55696a] line-clamp-2 leading-relaxed">
                    {paper.findings || paper.abstract}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#e4e3e3] text-xs">
                  <span className="font-mono text-[11px] text-[#738284]">
                    {paper.lineage?.replicationsCount || 0}× إعادات محققة
                  </span>
                  <Link
                    href={`/research/${paper.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#222f30] hover:text-blue-700 transition-colors"
                  >
                    <span>فتح البحث</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Followed Open Problems */}
      <div className="space-y-4">
        <SectionHeader
          icon={<HelpCircle className="w-5 h-5" />}
          accent="emerald"
          title="المسائل المفتوحة المتابعة"
          en="Open Problems"
          desc="تحديات علمية غير محلولة يمكنك المشاركة في صياغة فرضياتها ونشر تجارب لحلها"
        />

        <div className="space-y-3">
          {followedQuestions.map((q) => (
            <div
              key={q.id}
              className={`${cardClass} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#f0f2f0] text-[10px] font-mono text-[#222f30]">
                    {q.field}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    الحالة: {q.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold font-kufi text-[#222f30]">
                  {q.title}
                </h4>
                <p className="text-xs text-[#55696a] line-clamp-1 max-w-xl">
                  {q.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/publish?question=${encodeURIComponent(q.title)}`}
                  className={primaryBtnClass}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#bef264]" />
                  <span>حل المسألة</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
