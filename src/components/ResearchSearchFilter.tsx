"use client";

import { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { Paper } from "@/lib/data/research-data";
import Link from "next/link";
import { Filter, Calendar, Users, ArrowUpLeft, BookOpen, GitBranch, Database, FileText, X, ChevronDown, ArrowUpDown } from "lucide-react";

interface ResearchSearchFilterProps {
  papers: Paper[];
}

type SortKey = "newest" | "oldest" | "title" | "relevance";

function readInitialParams(): { q: string; field: string; year: string; sort: SortKey } {
  if (typeof window === "undefined") return { q: "", field: "all", year: "all", sort: "newest" };
  const sp = new URLSearchParams(window.location.search);
  const rawSort = sp.get("sort");
  const sort: SortKey =
    rawSort === "oldest" || rawSort === "title" || rawSort === "relevance" ? rawSort : "newest";
  return {
    q: sp.get("q") ?? "",
    field: sp.get("field") ?? "all",
    year: sp.get("year") ?? "all",
    sort,
  };
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTerms(text: string, terms: string[]): React.ReactNode {
  const clean = terms.map((t) => t.trim()).filter(Boolean).sort((a, b) => b.length - a.length);
  if (!clean.length) return text;
  const parts = text.split(new RegExp(`(${clean.map(escapeRegExp).join("|")})`, "gi"));
  if (parts.length <= 1) return text;
  const lower = new Set(clean.map((c) => c.toLowerCase()));
  return parts.map((p, i) =>
    p && lower.has(p.toLowerCase()) ? (
      <mark key={i} className="bg-[var(--brand)]/30 text-inherit px-0.5">
        {p}
      </mark>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    )
  );
}

export default function ResearchSearchFilter({ papers }: ResearchSearchFilterProps) {
  const [initialParams] = useState(readInitialParams);
  const [query, setQuery] = useState(initialParams.q);
  const [selectedField, setSelectedField] = useState<string>(initialParams.field);
  const [selectedYear, setSelectedYear] = useState<string>(initialParams.year);
  const [sort, setSort] = useState<SortKey>(initialParams.sort);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, Esc clears it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Sync filters to URL for deep-linking (q, field, year, sort)
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query.trim()) sp.set("q", query.trim());
    if (selectedField !== "all") sp.set("field", selectedField);
    if (selectedYear !== "all") sp.set("year", selectedYear);
    if (sort !== "newest") sp.set("sort", sort);
    const url = sp.toString() ? `${window.location.pathname}?${sp}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [query, selectedField, selectedYear, sort]);

  const fields = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.field))).sort((a, b) => a.localeCompare(b, "ar"));
  }, [papers]);

  const years = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.publishDate.slice(0, 4)))).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [papers]);

  const terms = useMemo(() => query.trim().split(/\s+/).filter(Boolean), [query]);

  const ranked = useMemo(() => {
    const result: { paper: Paper; score: number }[] = [];
    for (const paper of papers) {
      const titleLower = paper.title.toLowerCase();
      const titleEnLower = paper.titleEn.toLowerCase();
      const abstractLower = paper.abstract.toLowerCase();
      const authorsLower = paper.authors.map((a) => a.name.toLowerCase()).join(" ");
      const keywordsLower = (paper.keywords ?? []).join(" ").toLowerCase();
      const fieldLower = paper.field.toLowerCase();

      let score = 0;
      let matchesAll = true;
      for (const raw of terms) {
        const t = raw.toLowerCase();
        let termScore = 0;
        if (titleLower.includes(t)) termScore += 5;
        if (titleEnLower.includes(t)) termScore += 4;
        if (authorsLower.includes(t)) termScore += 3;
        if (keywordsLower.includes(t)) termScore += 3;
        if (fieldLower.includes(t)) termScore += 2;
        if (abstractLower.includes(t)) termScore += 1;
        if (termScore === 0) {
          matchesAll = false;
          break;
        }
        score += termScore;
      }
      if (!matchesAll) continue;
      if (selectedField !== "all" && paper.field !== selectedField) continue;
      if (selectedYear !== "all" && !paper.publishDate.startsWith(selectedYear)) continue;
      result.push({ paper, score });
    }
    if (sort === "relevance" && terms.length > 0) {
      result.sort(
        (a, b) => b.score - a.score || b.paper.publishDate.localeCompare(a.paper.publishDate)
      );
    } else if (sort === "oldest") {
      result.sort((a, b) => a.paper.publishDate.localeCompare(b.paper.publishDate));
    } else if (sort === "title") {
      result.sort((a, b) => a.paper.title.localeCompare(b.paper.title, "ar"));
    } else {
      result.sort((a, b) => b.paper.publishDate.localeCompare(a.paper.publishDate));
    }
    return result;
  }, [papers, terms, selectedField, selectedYear, sort]);

  const filteredPapers = useMemo(() => ranked.map((r) => r.paper), [ranked]);

  const hasActiveFilters =
    query.trim() !== "" || selectedField !== "all" || selectedYear !== "all" || sort !== "newest";

  const clearAll = () => {
    setQuery("");
    setSelectedField("all");
    setSelectedYear("all");
    setSort("newest");
  };

  const handleSubscribe = () => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setSubscribed(true);
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 font-sans relative">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setFiltersOpen((o) => !o)}
        aria-expanded={filtersOpen}
        className="lg:hidden flex items-center justify-between border-2 border-[var(--ink)] bg-white px-3 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-[var(--ink-1)]"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          {filtersOpen ? "HIDE_FILTERS" : "SHOW_FILTERS"}
          {hasActiveFilters && (
            <span className="bg-[var(--brand)] text-white text-[10px] px-1.5 py-0.5">
              {[query.trim(), selectedField !== "all" ? selectedField : "", selectedYear !== "all" ? selectedYear : ""].filter(Boolean).length}
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Sidebar (Search & Filters) */}
      <aside className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-1/4 shrink-0 space-y-6 lg:space-y-10 lg:sticky lg:top-24 h-fit`}>
        {/* Search */}
        <div className="space-y-3 font-mono">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-1)] border-b-2 border-[var(--ink)] pb-1">SEARCH_</h3>
          <div role="search" className="relative group border-2 border-[var(--ink)] bg-white flex items-center">
            <span aria-hidden="true" className="pl-3 font-bold text-[var(--brand)]">{">"}</span>
            <input
              ref={searchRef}
              type="search"
              aria-label="ابحث في الأوراق البحثية"
              placeholder="query... ( / )"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-2 py-2 bg-transparent text-sm text-[var(--ink-1)] placeholder:text-[var(--ink-2)] focus:outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="مسح البحث"
                className="pr-2 text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Fields / Categories */}
        <div className="space-y-4 font-mono">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-1)] flex items-center gap-2 border-b-2 border-[var(--ink)] pb-1">
            <Filter className="w-3 h-3" />
            <span>FIELDS_</span>
          </h3>
          <ul className="space-y-1 text-xs font-bold uppercase">
            <li>
              <button 
                onClick={() => setSelectedField("all")}
                aria-pressed={selectedField === "all"}
                className={`w-full text-right transition-colors hover:bg-[var(--ink-1)] hover:text-white px-2 py-1 ${selectedField === "all" ? "bg-[var(--brand)] text-white" : "text-[var(--ink-2)]"}`}
              >
                ALL FIELDS
              </button>
            </li>
            {fields.map((f) => (
              <li key={f}>
                <button 
                  onClick={() => setSelectedField(f)}
                  aria-pressed={selectedField === f}
                  className={`w-full text-right transition-colors hover:bg-[var(--ink-1)] hover:text-white px-2 py-1 ${selectedField === f ? "bg-[var(--brand)] text-white" : "text-[var(--ink-2)]"}`}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Archive / Years */}
        <div className="space-y-4 font-mono">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-1)] flex items-center gap-2 border-b-2 border-[var(--ink)] pb-1">
            <Calendar className="w-3 h-3" />
            <span>ARCHIVE_</span>
          </h3>
          <ul className="space-y-1 text-xs font-bold">
            <li>
              <button 
                onClick={() => setSelectedYear("all")}
                aria-pressed={selectedYear === "all"}
                className={`w-full text-right transition-colors hover:bg-[var(--ink-1)] hover:text-white px-2 py-1 ${selectedYear === "all" ? "bg-[var(--brand)] text-white" : "text-[var(--ink-2)]"}`}
              >
                ALL YEARS
              </button>
            </li>
            {years.map((y) => (
              <li key={y}>
                <button 
                  onClick={() => setSelectedYear(y)}
                  aria-pressed={selectedYear === y}
                  className={`w-full text-right transition-colors hover:bg-[var(--ink-1)] hover:text-white px-2 py-1 ${selectedYear === y ? "bg-[var(--brand)] text-white" : "text-[var(--ink-2)]"}`}
                >
                  {y}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter / RSS Subscribe */}
        <div className="pt-8 mt-8 border-t-2 border-[var(--ink)] space-y-4 font-mono">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-1)] border-b-2 border-[var(--ink)] pb-1">SUBSCRIBE_</h3>
          {subscribed ? (
            <p className="text-[11px] font-bold text-[var(--brand)] leading-relaxed">
              ✓ SUBSCRIBED — WELCOME TO OPEN RESEARCH.
            </p>
          ) : (
            <>
              <p className="text-[10px] text-[var(--ink-2)] leading-relaxed">
                RECEIVE LATEST OPEN RESEARCH & MODELS DIRECTLY.
              </p>
              <div className="relative border-2 border-[var(--ink)] flex bg-white">
                <input 
                  type="email" 
                  aria-label="البريد الإلكتروني للاشتراك"
                  placeholder="email@domain.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="w-full px-2 py-2 bg-transparent text-xs text-[var(--ink-1)] focus:outline-none"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-[var(--ink-1)] text-white text-[10px] font-bold px-4 py-2 hover:bg-[var(--brand)] transition-colors uppercase border-l-2 border-[var(--ink)]"
                >
                  JOIN
                </button>
              </div>
              {emailError && (
                <p className="text-[10px] font-bold text-red-600">INVALID_EMAIL — TRY AGAIN.</p>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Main Feed */}
      <main className="lg:w-3/4 flex-1">
        {/* Results toolbar: count + sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 font-mono">
          <p aria-live="polite" className="text-xs font-bold uppercase tracking-widest text-[var(--ink-1)] tabular-nums">
            {filteredPapers.length} / {papers.length} PAPERS
          </p>
          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--ink-2)]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>SORT_</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border-2 border-[var(--ink)] bg-white text-[var(--ink-1)] text-[11px] font-bold uppercase px-2 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="newest">NEWEST</option>
              <option value="oldest">OLDEST</option>
              <option value="title">TITLE A–Z</option>
              <option value="relevance">RELEVANCE</option>
            </select>
          </label>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 font-mono">
            {query.trim() && (
              <button
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase bg-[var(--ink-1)] text-white px-2 py-1 hover:bg-[var(--brand)] transition-colors"
              >
                “{query.trim().slice(0, 24)}” <X className="w-3 h-3" />
              </button>
            )}
            {selectedField !== "all" && (
              <button
                onClick={() => setSelectedField("all")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase bg-[var(--ink-1)] text-white px-2 py-1 hover:bg-[var(--brand)] transition-colors"
              >
                {selectedField} <X className="w-3 h-3" />
              </button>
            )}
            {selectedYear !== "all" && (
              <button
                onClick={() => setSelectedYear("all")}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase bg-[var(--ink-1)] text-white px-2 py-1 hover:bg-[var(--brand)] transition-colors"
              >
                {selectedYear} <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={clearAll}
              className="text-[10px] font-bold uppercase underline underline-offset-2 text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors px-1"
            >
              CLEAR_ALL
            </button>
          </div>
        )}

        {filteredPapers.length === 0 ? (
          <div className="py-20 text-center space-y-4 border-2 border-[var(--ink)] bg-[var(--surface)] px-6">
            <BookOpen className="w-12 h-12 text-[var(--ink-2)] mx-auto opacity-20" />
            <h3 className="text-xl font-bold font-mono uppercase text-[var(--ink-1)]">NO_RESULTS_FOUND</h3>
            <p className="text-sm font-mono text-[var(--ink-2)]">UPDATE QUERY OR CLEAR FILTERS.</p>
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-[var(--brand)] hover:bg-[var(--ink-1)] transition-colors px-5 py-2.5 uppercase border-2 border-[var(--ink)]"
            >
              <X className="w-4 h-4" /> CLEAR_ALL_FILTERS
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:gap-12">
            {filteredPapers.map((paper) => (
              <article
                key={paper.id}
                className={`flex flex-col md:flex-row gap-6 md:gap-10 group p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-500 ${paper.featured ? 'border-2 border-[#a7e26e]/60 bg-gradient-to-br from-white to-[#f5f8f7]' : ''}`}
              >
                {/* Meta Sidebar */}
                <aside className="md:w-36 shrink-0 flex flex-col gap-3 pt-1 font-mono">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#cef79e] text-[#222f30] mb-2">
                      {paper.field}
                    </span>
                    <div className="text-xs font-bold text-[#445e5f] mt-1">
                      {paper.publishDate}
                    </div>
                  </div>
                  
                  {paper.doi && (
                    <div className="hidden md:block">
                      <span className="block text-[10px] text-[var(--ink-2)] font-bold uppercase tracking-wider mb-0.5">DOI</span>
                      <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-[var(--ink-1)] hover:bg-[var(--ink-1)] hover:text-white transition-colors break-all leading-tight px-1 -mx-1">
                        {paper.doi}
                      </a>
                    </div>
                  )}
                  
                  <div className="hidden md:flex flex-col gap-1 pt-4 border-t-2 border-[var(--ink)] mt-2">
                    <span className="text-[10px] text-[var(--ink-2)] uppercase tracking-wider font-bold">READ_TIME</span>
                    <span className="text-xs font-bold font-mono text-[var(--ink-1)]">~{Math.max(5, Math.floor(paper.abstract.length / 50))} MIN</span>
                  </div>
                </aside>

                {/* Content */}
                <div className="flex-1">
                  {/* Featured Graphic Cover */}
                  {paper.featured && (
                    <div className="relative mb-8 w-full h-32 border-2 border-[var(--ink)] bg-[var(--ink-1)] overflow-hidden flex items-center justify-center group-hover:bg-[var(--brand)] transition-colors duration-500">
                      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(var(--bg) 2px, transparent 2px), linear-gradient(90deg, var(--bg) 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
                      <div className="relative z-10 border-2 border-white bg-black/50 px-4 py-2 font-mono text-xs font-bold text-white uppercase tracking-widest backdrop-blur-sm">
                        {">"} FEATURED_RESEARCH
                      </div>
                    </div>
                  )}
                  
                  <h2 className={`${paper.featured ? 'text-3xl md:text-5xl font-black' : 'text-2xl md:text-3xl font-extrabold'} text-[var(--ink-1)] leading-[1.1] mb-2 tracking-tight`}>
                    <Link href={`/research/${paper.slug}`} className="hover:bg-[var(--ink-1)] hover:text-white transition-colors px-1 -mx-1">
                      {highlightTerms(paper.title, terms)}
                    </Link>
                  </h2>
                  
                  {paper.titleEn && (
                    <p className="text-sm font-mono text-[var(--ink-2)] dir-ltr text-right mb-6">
                      {paper.titleEn}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-[var(--ink-2)] font-mono font-bold uppercase mb-6">
                    <Users className="w-4 h-4 opacity-50" />
                    <span>{paper.authors.map((a) => a.name).join(" • ")}</span>
                  </div>

                  <div className="pr-4 border-r-4 border-[var(--ink)] mb-8 rtl">
                    <p className="text-[var(--ink-1)] leading-relaxed font-medium line-clamp-4">
                      {highlightTerms(paper.abstract, terms)}
                    </p>
                  </div>

                  {/* Footer: Tags and Action Links */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {paper.keywords && paper.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} className="text-[11px] font-mono rounded-full border border-[#e4e3e3] bg-[#f5f8f7] text-[#445e5f] px-3 py-1">
                          {keyword}
                        </span>
                      ))}
                      {paper.keywords && paper.keywords.length > 3 && (
                        <span className="text-[11px] font-mono rounded-full border border-[#e4e3e3] bg-white text-[#445e5f] px-2.5 py-1">
                          +{paper.keywords.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Link 
                        href={`/research/${paper.slug}`} 
                        className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#222f30] border-b border-[#222f30] pb-1 hover:gap-3 transition-all"
                      >
                        <span>READ_PAPER</span>
                        <ArrowUpLeft className="w-4 h-4" />
                      </Link>
                      
                      <div className="flex gap-2 border-r border-[#e4e3e3] pr-3 mr-1">
                        {paper.pdfUrl && (
                          <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#222f30] hover:bg-[#cef79e] transition-colors px-3 py-1.5 rounded-xl border border-[#e4e3e3] bg-[#f5f8f7]" title="تحميل PDF">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">PDF</span>
                          </a>
                        )}
                        {paper.codeUrl && (
                          <a href={paper.codeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#222f30] hover:bg-[#cef79e] transition-colors px-3 py-1.5 rounded-xl border border-[#e4e3e3] bg-[#f5f8f7]" title="مستودع الشيفرة">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">CODE</span>
                          </a>
                        )}
                        {paper.datasetUrl && (
                          <a href={paper.datasetUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#222f30] hover:bg-[#cef79e] transition-colors px-3 py-1.5 rounded-xl border border-[#e4e3e3] bg-[#f5f8f7]" title="البيانات المفتوحة">
                            <Database className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">DATA</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
