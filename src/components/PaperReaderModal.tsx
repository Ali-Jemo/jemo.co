"use client";

import { useState } from "react";
import { Paper } from "@/lib/data/research-data";
import { BookOpen, X, Download, Copy, Check, FileText, CheckCircle2, ShieldCheck } from "lucide-react";

interface PaperReaderModalProps {
  paper: Paper;
}

export default function PaperReaderModal({ paper }: PaperReaderModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(paper.citation.bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-[var(--surface)] border border-[var(--brand)]/40 text-[var(--brand)] font-bold text-sm hover:bg-[var(--brand)] hover:text-white transition-all shadow-xs"
      >
        <BookOpen className="w-4 h-4" />
        <span>المعاينة التفاعلية للورقة (Interactive Reader)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--line)] p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--brand)]" />
                <span className="font-mono text-xs font-bold text-[var(--ink-1)]">
                  المعايِش الرقمي للأوراق الأكاديمية — JEMO LABS
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8 flex-1">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono font-bold mb-3 inline-block">
                  {paper.field}
                </span>
                <h2 className="text-2xl font-extrabold text-[var(--ink-1)] mb-2">{paper.title}</h2>
                <p className="text-xs font-mono text-[var(--brand)] dir-ltr text-right mb-4">{paper.titleEn}</p>
                <div className="text-xs text-[var(--ink-2)] font-mono border-y border-[var(--line)] py-3">
                  المؤلفون: <span className="text-[var(--ink-1)] font-bold">{(paper.authors ?? []).map((a: unknown) => typeof a === "string" ? a : (a as { name?: string })?.name || "").filter(Boolean).join(" ، ")}</span> • تاريخ النشر: {paper.publishDate}
                </div>
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[var(--brand)] font-mono uppercase">1. الملخص الأكاديمي (Abstract)</h3>
                <p className="text-sm text-[var(--ink-2)] leading-relaxed bg-[var(--surface)] p-5 rounded-xl border border-[var(--line)]">
                  {paper.abstract}
                </p>
              </div>

              {/* System Architecture */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[var(--brand)] font-mono uppercase">2. المعمارية والمنهجية (Methodology)</h3>
                <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                  تعتمد الدراسة المبادئ الأولى في التصميم (First Principles Design). تم بناء وتجربة خوارزميات الاستدلال مع مطابقة الأداء ميدانياً بعزل تام للذاكرة وبكفاءة إسناد عالية.
                </p>
              </div>

              {/* Results & Evidence */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[var(--brand)] font-mono uppercase">3. نتائج القياس والأداء (Experimental Results)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
                    <div className="text-[var(--brand)] font-bold">تحسين كفاءة الذاكرة</div>
                    <div className="text-[var(--ink-1)]">35% تقليل في زمن الاستجابة مقارنة بالنوى التقليدية</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
                    <div className="text-[var(--brand)] font-bold">نسبة دقة الاستدلال</div>
                    <div className="text-[var(--ink-1)]">تسجيل نتائج مرجعية في الاختبارات المحكمة</div>
                  </div>
                </div>
              </div>

              {/* Citation Box in Modal */}
              <div className="pt-4 border-t border-[var(--line)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[var(--ink-1)] font-mono">اقتباس الورقة (BibTeX)</h3>
                  <button
                    onClick={handleCopyBibtex}
                    className="flex items-center gap-1 text-xs text-[var(--brand)] font-mono hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "تم النسخ!" : "نسخ BibTeX"}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-2)] dir-ltr text-left overflow-x-auto">
                  {paper.citation.bibtex}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-[var(--surface)] border-t border-[var(--line)] flex items-center justify-between">
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-bold text-xs shadow-sm hover:opacity-90 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>تحميل ملف PDF الأصلي</span>
              </a>

              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-bold text-[var(--ink-2)] hover:text-[var(--ink-1)]"
              >
                إغلاق القارئ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
