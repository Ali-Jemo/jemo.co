"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { RESEARCH_PAPERS } from "@/lib/data/research-data";
import { ArrowUpLeft, Database, GitBranch, FileText, Users, Filter, BrainCircuit, Wrench } from "lucide-react";

// IntegratedBio-style editorial research grid: numbered publication cards with
// bio-lime category pills, pine titles, slate metadata, and arrow-slide links.
export default function FeaturedResearch() {
  const [field, setField] = useState("الكل");
  const fields = [
    "الكل",
    "سجلات الاكتشاف بالذكاء الاصطناعي",
    "حلول برمجية بالذكاء الاصطناعي",
    "تجارب الفريق الاستكشافية"
  ];

  const filtered = RESEARCH_PAPERS.filter((p) => {
    if (field === "الكل") return true;
    return p.field.includes(field) || p.keywords.some((k) => k.includes(field));
  });

  const hero = filtered[0] || RESEARCH_PAPERS[0];
  const rest = filtered.slice(1, 3);

  return (
    <div className="space-y-6">
      {/* Category filter pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <span className="text-xs font-mono text-[var(--ink-2)] inline-flex items-center gap-1 ml-2">
          <Filter className="w-3.5 h-3.5 text-[#a7e26e]" /> تصفية المجال:
        </span>
        {fields.map((f) => (
          <button
            key={f}
            onClick={() => setField(f)}
            className={`j-tag cursor-pointer transition-all ${
              field === f
                ? "!bg-[#a7e26e] !text-[#222f30] !border-[#a7e26e] font-bold"
                : "hover:border-[#a7e26e]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={field}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-3 lg:grid-rows-2 gap-px bg-[var(--j-line)] border border-[var(--j-line)]"
        >
          {/* Hero paper — spans 2 cols × 2 rows */}
          <article className="j-card lg:col-span-2 lg:row-span-2 p-4 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wide bg-[#cef79e] text-[#222f30] border border-[#a7e26e] px-2.5 py-0.5 rounded-md">
                    <span>{hero.field}</span>
                  </span>
                  {hero.field.includes("سجلات") || hero.field.includes("برمجية") ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مساهمة مجتمعية بمساعدة AI</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      <Wrench className="w-3.5 h-3.5 text-slate-500" />
                      <span>تجارب الفريق (Sandbox)</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] sm:text-xs font-mono text-[#445e5f]">{hero.publishDate}</span>
              </div>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold leading-snug text-[#222f30] mb-2">
                <Link href={`/research/${hero.slug}`} className="hover:text-[#a7e26e] transition-colors">
                  {hero.title}
                </Link>
              </h3>
              <p className="text-[11px] sm:text-xs font-mono text-[#445e5f] mb-3 sm:mb-5 dir-ltr text-right">{hero.titleEn}</p>
              <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed line-clamp-3 sm:line-clamp-4">{hero.abstract}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#445e5f] mb-5">
                <Users className="w-3.5 h-3.5 text-[#a7e26e]" />
                <span>{hero.authors.map((a) => a.name).join(" ، ")}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-[var(--j-line)]">
                <Link href={`/research/${hero.slug}`} className="j-link text-xs inline-flex items-center gap-1 group font-bold">
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> اقرأ تفاصيل البحث وسجل الاكتشاف
                    <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">←</span>
                  </span>
                </Link>
                {hero.datasetUrl && (
                  <Link href={hero.datasetUrl} className="j-link text-xs">
                    <Database className="w-3.5 h-3.5" /> البيانات
                  </Link>
                )}
                {hero.codeUrl && (
                  <Link href={hero.codeUrl} className="j-link text-xs">
                    <GitBranch className="w-3.5 h-3.5" /> الشيفرة
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* Compact stack */}
          {rest.map((p, idx) => (
            <article key={p.id} className="j-card p-4 sm:p-6 flex flex-col justify-between bg-white">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wide bg-[#f5f8f7] text-[#222f30] border border-[#e4e3e3] px-2 py-0.5 rounded-md">
                    <span>{p.field}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#445e5f]">{p.publishDate}</span>
                </div>
                <h3 className="text-base font-bold text-[#222f30] mb-2 leading-snug">
                  <Link href={`/research/${p.slug}`} className="hover:text-[#a7e26e] transition-colors">
                    {p.title}
                  </Link>
                </h3>
                <p className="text-xs text-[#445e5f] leading-relaxed line-clamp-2">{p.abstract}</p>
              </div>
              <Link href={`/research/${p.slug}`} className="j-link text-xs mt-4 inline-flex items-center gap-1 group font-bold">
                <span className="inline-flex items-center gap-1">
                  عرض سجل الاكتشاف
                  <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1">←</span>
                </span>
              </Link>
            </article>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
