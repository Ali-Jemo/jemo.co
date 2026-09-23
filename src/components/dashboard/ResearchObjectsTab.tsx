"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  GitFork,
  ArrowUpLeft,
  Copy,
  Check,
  Sparkles,
  Loader2,
} from "lucide-react";
import type { Paper } from "@/lib/data/research-data";
import {
  cardClass,
  primaryBtnClass,
  outlineBtnClass,
  pillActiveClass,
  pillIdleClass,
  EmptyState,
} from "@/components/dashboard/ui";
interface JevEvaluation {
  status?: "pending" | "completed" | "failed";
  rigorScore: number | null;
  rigorNormalized: number | null;
  reproducibilityProbability: number | null;
  reproducibilityPercent: number | null;
  contribution: string | null;
  confidence: {
    rigor: number;
    contribution: number;
  } | null;
}

interface ResearchObjectsTabProps {
  papers: Paper[];
  publishedPapers: Paper[];
}

export default function ResearchObjectsTab({
  papers,
  publishedPapers,
}: ResearchObjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);
  const [evaluations, setEvaluations] = useState<Record<string, JevEvaluation>>({});
  const [loadingEvaluations, setLoadingEvaluations] = useState<Record<string, boolean>>({});
  const [auditErrors, setAuditErrors] = useState<Record<string, string>>({});
  const handleAudit = async (paper: Paper) => {
    setLoadingEvaluations((prev) => ({ ...prev, [paper.id]: true }));
    setAuditErrors((prev) => ({ ...prev, [paper.id]: "" }));
    try {
      const res = await fetch("/api/jev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paper.title,
          abstract: paper.abstract,
          question: paper.question,
          findings: paper.findings,
          field: paper.field,
        }),
      });
      if (!res.ok) {
        setAuditErrors((prev) => ({ ...prev, [paper.id]: "التقييم غير متاح حالياً" }));
        return;
      }
      const data = await res.json();
      if (data.success && data.evaluation && data.evaluation.status !== "failed" && data.evaluation.rigorScore != null) {
        setEvaluations((prev) => ({ ...prev, [paper.id]: data.evaluation }));
      } else {
        setAuditErrors((prev) => ({ ...prev, [paper.id]: "التقييم غير متاح حالياً" }));
      }
    } catch {
      setAuditErrors((prev) => ({ ...prev, [paper.id]: "التقييم غير متاح حالياً" }));
    } finally {
      setLoadingEvaluations((prev) => ({ ...prev, [paper.id]: false }));
    }
  };

  const filteredPapers = useMemo(() => {
    return papers.filter((p) => {
      // Type filter
      if (selectedType !== "all" && p.researchType !== selectedType) {
        return false;
      }
      // Query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = p.title.toLowerCase().includes(q);
        const inAbstract = (p.abstract || "").toLowerCase().includes(q);
        const inQuestion = (p.question || "").toLowerCase().includes(q);
        const inField = (p.field || "").toLowerCase().includes(q);
        return inTitle || inAbstract || inQuestion || inField;
      }
      return true;
    });
  }, [papers, selectedType, searchQuery]);

  const handleCopyBibtex = (paper: Paper) => {
    const bibtex =
      paper.citation?.bibtex ||
      `@article{${paper.slug},\n  title={${paper.title}},\n  year={2026}\n}`;
    navigator.clipboard.writeText(bibtex);
    setCopiedBibtexId(paper.id);
    setTimeout(() => setCopiedBibtexId(null), 2000);
  };

  const researchTypes: { id: string; label: string }[] = [
    { id: "all", label: "جميع الأنواع" },
    { id: "Experiment", label: "تجربة عملية" },
    { id: "Quick Investigation", label: "استقصاء سريع" },
    { id: "Full Research", label: "بحث متكامل" },
    { id: "Discovery", label: "اكتشاف استدلالي" },
  ];
  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className={`${cardClass} p-4 sm:p-5 space-y-4`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#738284]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في أبحاثك بالعنوان أو المسألة أو المجال..."
              className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs text-[#222f30] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/25 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#738284] bg-[#e4e3e3] px-1.5 py-0.5 rounded cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>

          <Link
            href="/publish"
            className={primaryBtnClass}
          >
            <Plus className="w-4 h-4 text-[#bef264]" />
            <span>توثيق بحث جديد</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-mono text-[#738284] shrink-0 ml-1">التصنيف:</span>
          {researchTypes.map(({ id, label }) => {
            const isActive = selectedType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedType(id)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isActive ? pillActiveClass : pillIdleClass
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Papers List */}
      {filteredPapers.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-7 h-7" />}
          accent="lime"
          title={searchQuery ? "لم نجد أبحاثاً تطابق بحثك" : "لم توثق أي كائن بحث بعد"}
          desc="كل استنتاج تجريبي أو محادثة استدلالية قمت بها يمكن تحويلها لمرجع دائم موثق برقم معرف في الأرشيف العلمي."
          action={
            <Link href="/publish" className={primaryBtnClass}>
              <Plus className="w-4 h-4 text-[#bef264]" />
              <span>توثيق كائن بحثك الأول الآن</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredPapers.map((paper) => {
            const isNew = publishedPapers.some((p) => p.id === paper.id);
            const isCopied = copiedBibtexId === paper.id;
            return (
              <div
                key={paper.id}
                className={`${cardClass} p-5 sm:p-6 space-y-4 hover:border-[#a7e26e] hover:shadow-sm transition-all`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {isNew && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#bef264] text-[#222f30] font-bold text-[11px]">
                        حديث • نُشر مؤخراً
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f0f2f0] text-[#222f30] font-bold text-[11px]">
                      {paper.researchType || "Experiment"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[11px]">
                      {paper.lineage?.replicationsCount || 0}× إعادات محققة
                    </span>
                    <span className="text-[11px] text-[#738284] px-2 py-0.5 rounded-md bg-[#fcfdfc] border border-[#e4e3e3]">
                      {paper.field}
                    </span>
                  </div>
                    {evaluations[paper.id] && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 font-mono">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Jev: {evaluations[paper.id].rigorNormalized}%</span>
                      </span>
                    )}
                  <span className="text-xs text-[#738284] font-mono">
                    {paper.publishDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-kufi text-[#222f30]">
                    <Link href={`/research/${paper.slug}`} className="hover:text-emerald-800 transition-colors">
                      {paper.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-[#55696a] mt-2 line-clamp-2 leading-relaxed">
                    {paper.findings || paper.abstract}
                  </p>
                </div>

                {paper.question && (
                  <div className="p-3.5 rounded-xl bg-[#f5f8f7] text-xs text-[#55696a] flex items-start gap-2 leading-relaxed">
                    <strong className="text-[#222f30] shrink-0">المسألة المستهدفة:</strong>
                    <span>{paper.question}</span>
                  </div>
                )}

                {auditErrors[paper.id] && (
                  <div className="p-3 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-xs text-[#738284] font-mono text-center">
                    {auditErrors[paper.id]}
                  </div>
                )}

                {evaluations[paper.id] && evaluations[paper.id].status !== "failed" && evaluations[paper.id].rigorScore != null && (
                  <div className="p-4 rounded-2xl bg-[#f5f8f7] border border-emerald-200 space-y-3 font-mono text-xs animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-[#222f30] font-sans">تدقيق Jev الاستدلالي (TypeSafe System One)</span>
                        <span className="px-2 py-0.5 rounded-md bg-[#bef264]/50 text-[#162224] text-[10px] font-bold">
                          {evaluations[paper.id].rigorNormalized}% دقة موثقة
                        </span>
                      </div>
                      {evaluations[paper.id].confidence && (
                        <span className="text-[10px] text-[#738284]">
                          معايرة: {(evaluations[paper.id].confidence!.rigor * 100).toFixed(0)}% ثقة
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-xl bg-white border border-[#e4e3e3] space-y-1">
                        <span className="text-[10px] text-[#738284] block">الدقة التجريبية (Rigor)</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-[#222f30]">{evaluations[paper.id].rigorScore}</span>
                          <span className="text-[10px] text-[#738284]">/ 2.0</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#e4e3e3] space-y-1">
                        <span className="text-[10px] text-[#738284] block">جاهزية إعادة الإنتاج</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-purple-700">{evaluations[paper.id].reproducibilityPercent}%</span>
                          <span className="text-[10px] text-purple-600">احتمال معاير</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-[#e4e3e3] space-y-1">
                        <span className="text-[10px] text-[#738284] block">نوع المساهمة</span>
                        <span className="text-xs font-bold text-emerald-800">
                          {evaluations[paper.id].contribution === "empirical"
                            ? "تجربة وتقييم عملي"
                            : evaluations[paper.id].contribution === "theoretical"
                            ? "نموذج ونظرية استدلالية"
                            : "أداة وتطبيق عملي"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#e4e3e3]">
                  <div className="flex items-center gap-3 text-xs font-mono text-[#55696a]">
                    <span>{paper.lineage?.replicationsCount || 0} إعادات</span>
                    <span>•</span>
                    <span>{paper.lineage?.challengesCount || 0} مراجعات</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">موثق بالـ <bdi>PoW</bdi></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAudit(paper)}
                      disabled={loadingEvaluations[paper.id]}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-50/70 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title="تدقيق موثوقية وجودة البحث استدلالياً بنموذج Jev"
                    >
                      {loadingEvaluations[paper.id] ? (
                        <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                      <span>
                        {loadingEvaluations[paper.id]
                          ? "جارٍ التدقيق..."
                          : evaluations[paper.id]
                          ? "إعادة فحص Jev"
                          : "تدقيق Jev"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyBibtex(paper)}
                      className={outlineBtnClass}
                      title="نسخ اقتباس BibTeX"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? "تم النسخ" : "BibTeX"}</span>
                    </button>

                    <Link
                      href={`/publish?fork=${paper.slug}`}
                      className={outlineBtnClass}
                    >
                      <GitFork className="w-3.5 h-3.5" />
                      <span>تفريعة (Fork)</span>
                    </Link>

                    <Link
                      href={`/research/${paper.slug}`}
                      className={primaryBtnClass}
                    >
                      <span>عرض الكائن</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
