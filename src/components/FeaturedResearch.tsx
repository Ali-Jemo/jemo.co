"use client";

import { useState } from "react";
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
      {/* Category Filter Toolbar & Feed Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e4e3e3]">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap py-1">
          <span className="text-xs font-mono text-[#738284] inline-flex items-center gap-1.5 ml-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#a7e26e]" /> تصفية:
          </span>
          {fields.map((f) => {
            const isSelected = field === f;
            return (
              <button
                key={f}
                onClick={() => setField(f)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#222f30] text-white border-[#222f30] font-bold shadow-xs"
                    : "bg-white text-[#55696a] border-[#e4e3e3] hover:border-[#a7e26e] hover:text-[#222f30]"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#738284] shrink-0 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
          <span>{filtered.length} أوراق منشورة ومحققة</span>
        </div>
      </div>
      <div className="w-full">
          {filtered.length === 1 ? (
            /* 1 Single Paper: Majestic Full-Width Featured Card */
            <article className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-[#e4e3e3] bg-white shadow-xs hover:border-[#a7e26e] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wide bg-[#cef79e] text-[#222f30] border border-[#a7e26e] px-3 py-1 rounded-md">
                      <span>{hero.field}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مساهمة مجتمعية بمساعدة AI</span>
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#55696a]">{hero.publishDate}</span>
                </div>

                <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold leading-tight text-[#222f30] mb-3">
                  <Link href={`/research/${hero.slug}`} className="hover:text-[#445e5f] transition-colors">
                    {hero.title}
                  </Link>
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[#738284] mb-4 dir-ltr text-right">{hero.titleEn}</p>
                <p className="text-sm sm:text-base text-[#55696a] leading-relaxed max-w-4xl">{hero.abstract}</p>
              </div>

              <div className="pt-6 mt-8 border-t border-[#e4e3e3] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#55696a]">
                  <Users className="w-4 h-4 text-[#a7e26e]" />
                  <span>{hero.authors.map((a) => a.name).join(" ، ")}</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {(hero.datasetUrl || hero.codeUrl) && (
                    <div className="flex items-center gap-2">
                      {hero.datasetUrl && (
                        <Link
                          href={hero.datasetUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e4e3e3] bg-[#f7f7f5] hover:bg-white hover:border-[#a7e26e] text-xs font-mono text-[#222f30] transition-colors shadow-2xs"
                        >
                          <Database className="w-3.5 h-3.5 text-[#55696a]" />
                          <span>البيانات</span>
                        </Link>
                      )}
                      {hero.codeUrl && (
                        <Link
                          href={hero.codeUrl}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e4e3e3] bg-[#f7f7f5] hover:bg-white hover:border-[#a7e26e] text-xs font-mono text-[#222f30] transition-colors shadow-2xs"
                        >
                          <GitBranch className="w-3.5 h-3.5 text-[#55696a]" />
                          <span>الشيفرة</span>
                        </Link>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/research/${hero.slug}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#222f30] text-[#cef79e] hover:bg-[#162224] hover:text-white text-xs font-mono font-bold transition-all shadow-xs group"
                  >
                    <FileText className="w-4 h-4 text-[#a7e26e]" />
                    <span>اقرأ تفاصيل البحث وسجل الاكتشاف</span>
                    <ArrowUpLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ) : filtered.length === 2 ? (
            /* 2 Papers: 2 Balanced Side-by-Side Cards */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              {[hero, rest[0]].map((p) => (
                <article
                  key={p.id}
                  className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#e4e3e3] bg-white shadow-xs hover:border-[#a7e26e] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wide bg-[#cef79e] text-[#222f30] border border-[#a7e26e] px-2.5 py-0.5 rounded-md">
                        <span>{p.field}</span>
                      </span>
                      <span className="text-xs font-mono text-[#738284]">{p.publishDate}</span>
                    </div>

                    <h3 className="text-lg sm:text-2xl font-bold leading-snug text-[#222f30] mb-2">
                      <Link href={`/research/${p.slug}`} className="hover:text-[#445e5f] transition-colors">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="text-xs font-mono text-[#738284] mb-3 dir-ltr text-right">{p.titleEn}</p>
                    <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed line-clamp-3 sm:line-clamp-4">{p.abstract}</p>
                  </div>

                  <div className="pt-5 mt-6 border-t border-[#e4e3e3] flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-xs text-[#55696a]">
                      <Users className="w-3.5 h-3.5 text-[#a7e26e]" />
                      <span>{p.authors.map((a) => a.name).join(" ، ")}</span>
                    </div>

                    <Link
                      href={`/research/${p.slug}`}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#222f30] text-[#cef79e] hover:bg-[#162224] hover:text-white text-xs font-mono font-bold transition-all shadow-xs group"
                    >
                      <span>عرض سجل الاكتشاف</span>
                      <ArrowUpLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* 3+ Papers: Hero Card (2 cols) + 2 Stacked Cards (1 col) */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
              {/* Hero Paper (Spans 2 columns) */}
              <article className="lg:col-span-2 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#e4e3e3] bg-white shadow-xs hover:border-[#a7e26e] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5 min-h-[28px] flex-wrap">
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
                    <span className="text-[11px] sm:text-xs font-mono text-[#55696a] shrink-0">{hero.publishDate}</span>
                  </div>

                  <h3 className="text-lg sm:text-2xl md:text-3xl font-bold leading-snug text-[#222f30] mb-2">
                    <Link href={`/research/${hero.slug}`} className="hover:text-[#445e5f] transition-colors">
                      {hero.title}
                    </Link>
                  </h3>
                  <p className="text-[11px] sm:text-xs font-mono text-[#738284] mb-3 sm:mb-4 dir-ltr text-right">{hero.titleEn}</p>
                  <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed line-clamp-3 sm:line-clamp-4">{hero.abstract}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs text-[#55696a] mb-4">
                    <Users className="w-3.5 h-3.5 text-[#a7e26e]" />
                    <span>{hero.authors.map((a) => a.name).join(" ، ")}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#e4e3e3]">
                    <Link
                      href={`/research/${hero.slug}`}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#222f30] text-[#cef79e] hover:bg-[#162224] hover:text-white text-xs font-mono font-bold transition-all shadow-xs group"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#a7e26e]" />
                      <span>اقرأ تفاصيل البحث وسجل الاكتشاف</span>
                      <ArrowUpLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>

                    {(hero.datasetUrl || hero.codeUrl) && (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-[#738284] hidden sm:inline">المرفقات:</span>
                        {hero.datasetUrl && (
                          <Link
                            href={hero.datasetUrl}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#e4e3e3] bg-[#f7f7f5] hover:bg-white hover:border-[#a7e26e] text-xs font-mono text-[#222f30] transition-colors shadow-2xs"
                          >
                            <Database className="w-3.5 h-3.5 text-[#55696a]" />
                            <span>البيانات</span>
                          </Link>
                        )}
                        {hero.codeUrl && (
                          <Link
                            href={hero.codeUrl}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#e4e3e3] bg-[#f7f7f5] hover:bg-white hover:border-[#a7e26e] text-xs font-mono text-[#222f30] transition-colors shadow-2xs"
                          >
                            <GitBranch className="w-3.5 h-3.5 text-[#55696a]" />
                            <span>الشيفرة</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {/* Compact Stack Column (Spans 1 column with 2 cards) */}
              <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-5">
                {rest.map((p) => (
                  <article
                    key={p.id}
                    className="flex-1 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#e4e3e3] bg-white shadow-xs hover:border-[#a7e26e] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3 min-h-[26px]">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wide bg-[#f5f8f7] text-[#222f30] border border-[#e4e3e3] px-2.5 py-0.5 rounded-md">
                          <span>{p.field}</span>
                        </span>
                        <span className="text-[11px] sm:text-xs font-mono text-[#738284] shrink-0">{p.publishDate}</span>
                      </div>

                      <h3 className="text-base font-bold text-[#222f30] mb-2 leading-snug">
                        <Link href={`/research/${p.slug}`} className="hover:text-[#445e5f] transition-colors">
                          {p.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-[#55696a] leading-relaxed line-clamp-2">{p.abstract}</p>
                    </div>

                    <div className="pt-3 mt-4 border-t border-[#e4e3e3]">
                      <Link
                        href={`/research/${p.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#222f30] hover:text-[#445e5f] transition-colors group"
                      >
                        <span>عرض سجل الاكتشاف</span>
                        <ArrowUpLeft className="w-3.5 h-3.5 text-[#738284] group-hover:text-[#222f30] transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
