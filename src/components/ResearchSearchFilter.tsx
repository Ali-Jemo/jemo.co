"use client";

import { useState, useMemo } from "react";
import { Paper } from "@/lib/data/research-data";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CitationBox from "@/components/ui/CitationBox";
import Link from "next/link";
import { Search, Filter, Calendar, Users, ArrowUpLeft, BookOpen, Download } from "lucide-react";

interface ResearchSearchFilterProps {
  papers: Paper[];
}

export default function ResearchSearchFilter({ papers }: ResearchSearchFilterProps) {
  const [query, setQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const fields = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.field)));
  }, [papers]);

  const years = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.publishDate.slice(0, 4))));
  }, [papers]);

  const filteredPapers = useMemo(() => {
    return papers.filter((paper) => {
      const matchesQuery =
        query.trim() === "" ||
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.titleEn.toLowerCase().includes(query.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
        paper.keywords.some((kw) => kw.toLowerCase().includes(query.toLowerCase())) ||
        paper.authors.some((a) => a.name.toLowerCase().includes(query.toLowerCase()));

      const matchesField = selectedField === "all" || paper.field === selectedField;
      const matchesYear = selectedYear === "all" || paper.publishDate.startsWith(selectedYear);

      return matchesQuery && matchesField && matchesYear;
    });
  }, [papers, query, selectedField, selectedYear]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <Card className="p-6 space-y-4 border-2 border-[var(--brand)]/20">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--ink-2)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بالعنوان، الكلمات المفتاحية، أو اسم الباحث..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
            />
          </div>

          {/* Field Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-[var(--brand)] hidden sm:block" />
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] focus:border-[var(--brand)] outline-none cursor-pointer w-full md:w-auto"
            >
              <option value="all">كافة المجالات ({papers.length})</option>
              {fields.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] focus:border-[var(--brand)] outline-none cursor-pointer w-full md:w-auto font-mono"
            >
              <option value="all">كل السنوات</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--line)] text-xs text-[var(--ink-2)]">
          <div>
            نتائج البحث: <span className="font-bold text-[var(--brand)] font-mono">{filteredPapers.length}</span> ورقة بحثية
          </div>
          {(query || selectedField !== "all" || selectedYear !== "all") && (
            <button
              onClick={() => {
                setQuery("");
                setSelectedField("all");
                setSelectedYear("all");
              }}
              className="text-xs text-[var(--brand)] hover:underline font-bold"
            >
              إعادة ضبط الفلاتر ✕
            </button>
          )}
        </div>
      </Card>

      {/* Results List */}
      {filteredPapers.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-[var(--ink-2)] mx-auto opacity-40" />
          <h3 className="text-xl font-bold text-[var(--ink-1)]">لم نجد أوراقاً بحثية تطابق خيارات البحث</h3>
          <p className="text-xs text-[var(--ink-2)]">جرب البحث بكلمات مختلفة أو تغيير مجال التصفية.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPapers.map((paper) => (
            <Card key={paper.id} hover className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Badge variant="info">{paper.field}</Badge>
                  <span className="text-xs font-mono text-[var(--ink-2)]">{paper.publishDate}</span>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                  <Link href={`/research/${paper.slug}`}>{paper.title}</Link>
                </h2>

                <p className="text-xs font-mono text-[var(--brand)] mb-4 dir-ltr text-right">{paper.titleEn}</p>

                <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-4 mb-6">
                  {paper.abstract}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[var(--ink-2)]">
                  <Users className="w-4 h-4 text-[var(--brand)]" />
                  <span>{paper.authors.map((a) => a.name).join(" ، ")}</span>
                </div>
                <Link
                  href={`/research/${paper.slug}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[var(--brand)] hover:underline"
                >
                  <span>قراءة الورقة والبيانات</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
