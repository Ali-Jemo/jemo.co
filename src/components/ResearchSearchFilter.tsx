"use client";

import { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { Paper, OPEN_QUESTIONS, OpenQuestion } from "@/lib/data/research-data";
import Link from "next/link";
import { 
  Filter, 
  Calendar, 
  Users, 
  ArrowUpLeft, 
  BookOpen, 
  GitBranch, 
  Database, 
  FileText, 
  X, 
  ChevronDown, 
  ArrowUpDown,
  Flame,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Cpu,
  GitFork,
  MessageSquare,
  Repeat,
  AlertCircle,
  Check,
  FlaskConical,
  Zap,
  Clock,
  AlertTriangle
} from "lucide-react";

interface ResearchSearchFilterProps {
  papers: Paper[];
}

type SortKey = "newest" | "oldest" | "title" | "relevance" | "reproduced";
type DiscoveryLens = "trending" | "latest" | "evidence" | "reproduced" | "open-problems";

function readInitialParams(): { q: string; field: string; year: string; sort: SortKey; lens: DiscoveryLens } {
  if (typeof window === "undefined") return { q: "", field: "all", year: "all", sort: "newest", lens: "trending" };
  const sp = new URLSearchParams(window.location.search);
  const rawSort = sp.get("sort");
  const sort: SortKey =
    rawSort === "oldest" || rawSort === "title" || rawSort === "relevance" || rawSort === "reproduced" ? rawSort : "newest";
  const rawLens = sp.get("lens");
  const lens: DiscoveryLens =
    rawLens === "latest" || rawLens === "evidence" || rawLens === "reproduced" || rawLens === "open-problems" ? rawLens : "trending";
  return {
    q: sp.get("q") ?? "",
    field: sp.get("field") ?? "all",
    year: sp.get("year") ?? "all",
    sort,
    lens,
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
  const [lens, setLens] = useState<DiscoveryLens>(initialParams.lens);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
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

  // Sync filters to URL for deep-linking
  useEffect(() => {
    const sp = new URLSearchParams();
    if (query.trim()) sp.set("q", query.trim());
    if (selectedField !== "all") sp.set("field", selectedField);
    if (selectedYear !== "all") sp.set("year", selectedYear);
    if (sort !== "newest") sp.set("sort", sort);
    if (lens !== "trending") sp.set("lens", lens);
    const url = sp.toString() ? `${window.location.pathname}?${sp}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [query, selectedField, selectedYear, sort, lens]);

  const fields = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.field))).sort((a, b) => a.localeCompare(b, "ar"));
  }, [papers]);

  const years = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.publishDate.slice(0, 4)))).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [papers]);

  const terms = useMemo(() => query.trim().split(/\s+/).filter(Boolean), [query]);

  // Ranked & Filtered Papers as Research Objects
  const ranked = useMemo(() => {
    const result: { paper: Paper; score: number }[] = [];
    for (const paper of papers) {
      // Type Filter
      if (selectedType !== "all") {
        if (paper.researchType !== selectedType) continue;
      }
      // Status Filter
      if (selectedStatus !== "all") {
        if (paper.evidenceStatus !== selectedStatus) continue;
      }

      // Lens Filters
      if (lens === "evidence" && paper.evidenceStatus !== "Evidence-backed" && paper.evidenceStatus !== "Reproduced") {
        continue;
      }
      if (lens === "reproduced" && (!paper.lineage || paper.lineage.replicationsCount === 0)) {
        continue;
      }

      const titleLower = paper.title.toLowerCase();
      const titleEnLower = paper.titleEn.toLowerCase();
      const abstractLower = paper.abstract.toLowerCase();
      const authorsLower = paper.authors.map((a) => a.name.toLowerCase()).join(" ");
      const keywordsLower = (paper.keywords ?? []).join(" ").toLowerCase();
      const fieldLower = paper.field.toLowerCase();
      const questionLower = (paper.question ?? "").toLowerCase();

      let score = 0;
      let matchesAll = true;
      for (const raw of terms) {
        const t = raw.toLowerCase();
        let termScore = 0;
        if (titleLower.includes(t)) termScore += 5;
        if (questionLower.includes(t)) termScore += 5;
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

    // Lens-specific sorting
    if (lens === "trending") {
      result.sort((a, b) => {
        const aScore = (a.paper.metrics?.reproducedCount || 0) * 3 + (a.paper.metrics?.evidenceBackedCount || 0) * 2;
        const bScore = (b.paper.metrics?.reproducedCount || 0) * 3 + (b.paper.metrics?.evidenceBackedCount || 0) * 2;
        return bScore - aScore || b.paper.publishDate.localeCompare(a.paper.publishDate);
      });
    } else if (lens === "reproduced" || sort === "reproduced") {
      result.sort((a, b) => (b.paper.lineage?.replicationsCount || 0) - (a.paper.lineage?.replicationsCount || 0));
    } else if (sort === "relevance" && terms.length > 0) {
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
  }, [papers, terms, selectedField, selectedYear, sort, lens, selectedType, selectedStatus]);

  const filteredPapers = useMemo(() => ranked.map((r) => r.paper), [ranked]);

  const hasActiveFilters =
    query.trim() !== "" || selectedField !== "all" || selectedYear !== "all" || selectedType !== "all" || selectedStatus !== "all";

  const clearAll = () => {
    setQuery("");
    setSelectedField("all");
    setSelectedYear("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSort("newest");
    setLens("trending");
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
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 font-sans relative" dir="rtl">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setFiltersOpen((o) => !o)}
        aria-expanded={filtersOpen}
        className="lg:hidden flex items-center justify-between border border-[#e4e3e3] bg-white rounded-2xl px-4 py-3 font-mono text-xs font-bold text-[#222f30] shadow-xs active:scale-[0.98] transition-all min-h-[44px]"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#a7e26e]" />
          <span>{filtersOpen ? "إخفاء الفلاتر" : "عرض الفلاتر والتصنيف"}</span>
          {hasActiveFilters && (
            <span className="bg-[#222f30] text-[#bef264] text-[10px] px-2 py-0.5 rounded-full font-bold">
              {[query.trim(), selectedField !== "all" ? selectedField : "", selectedType !== "all" ? selectedType : ""].filter(Boolean).length}
            </span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#738284] transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Sidebar (Search & Filters) */}
      <aside className={`${filtersOpen ? "block" : "hidden"} lg:block lg:w-1/4 shrink-0 space-y-6 lg:space-y-8 lg:sticky lg:top-24 h-fit`}>
        {/* Search Input */}
        <div className="space-y-2 font-mono">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center justify-between">
            <span>البحث والاستكشاف</span>
            <span className="text-[10px] text-[#738284]">/</span>
          </h3>
          <div role="search" className="relative group border border-[#e4e3e3] bg-white rounded-xl flex items-center px-3 py-1 shadow-xs focus-within:border-[#a7e26e]">
            <span aria-hidden="true" className="font-bold text-[#a7e26e] ml-2">{">"}</span>
            <input
              ref={searchRef}
              type="search"
              aria-label="ابحث في كائنات البحث"
              placeholder="ابحث عن مسألة، أداة، أو كود..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-2 bg-transparent text-xs text-[#222f30] placeholder:text-[#848c8e] focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="مسح البحث"
                className="text-[#738284] hover:text-[#222f30]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Research Object Type Filter */}
        <div className="space-y-2 font-mono">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#a7e26e]" />
            <span>نوع كائن البحث (Object Type)</span>
          </h3>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: "all", label: "الكل", icon: null },
              { id: "Experiment", label: "Experiment", icon: FlaskConical },
              { id: "Quick Investigation", label: "Investigation", icon: Zap },
              { id: "Full Research", label: "Full Paper", icon: BookOpen },
              { id: "Discovery", label: "Discovery", icon: Sparkles },
              { id: "Replication", label: "Replication", icon: FlaskConical }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    selectedType === t.id
                      ? "bg-[#222f30] text-white shadow-xs"
                      : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3 text-[#a7e26e]" />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evidence Status Filter */}
        <div className="space-y-2 font-mono">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#a7e26e]" />
            <span>حالة الإثبات (Evidence Status)</span>
          </h3>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              { id: "all", label: "الكل", icon: null },
              { id: "Evidence-backed", label: "مدعوم بالأدلة", icon: CheckCircle2, color: "text-emerald-600" },
              { id: "Reproduced", label: "تمت إعادة التجربة", icon: FlaskConical, color: "text-purple-600" },
              { id: "Under Review", label: "قيد المراجعة", icon: Clock, color: "text-amber-600" },
              { id: "Disputed", label: "محل خلاف", icon: AlertTriangle, color: "text-red-600" }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    selectedStatus === s.id
                      ? "bg-[#222f30] text-white shadow-xs"
                      : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
                  }`}
                >
                  {Icon && <Icon className={`w-3 h-3 ${s.color}`} />}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-2 font-mono">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#a7e26e]" />
            <span>المجال العلمي</span>
          </h3>
          <ul className="space-y-1 text-xs">
            <li>
              <button 
                onClick={() => setSelectedField("all")}
                className={`w-full text-right transition-colors rounded-lg px-2.5 py-1.5 font-bold ${
                  selectedField === "all" ? "bg-[#cef79e] text-[#222f30]" : "text-[#55696a] hover:bg-[#f0f2f0]"
                }`}
              >
                جميع المجالات
              </button>
            </li>
            {fields.map((f) => (
              <li key={f}>
                <button 
                  onClick={() => setSelectedField(f)}
                  className={`w-full text-right transition-colors rounded-lg px-2.5 py-1.5 font-medium ${
                    selectedField === f ? "bg-[#cef79e] text-[#222f30] font-bold" : "text-[#55696a] hover:bg-[#f0f2f0]"
                  }`}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Open Problems Teaser Card */}
        <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#445e5f]">
            <HelpCircle className="w-3.5 h-3.5 text-[#a7e26e]" />
            <span>الأسئلة المفتوحة · Open Problems</span>
          </div>
          <h4 className="text-sm font-bold text-[#222f30] font-kufi">
            معضلات علمية بلا إجابة حاسمة
          </h4>
          <p className="text-xs text-[#55696a] leading-relaxed font-normal">
            استكشف المسائل المفتوحة التي يعمل عليها المجتمع وساهم ببحثك وتجربتك في فحصها.
          </p>
          <Link
            href="/questions"
            className="inline-flex items-center gap-1.5 text-xs font-bold font-mono text-[#222f30] hover:text-[#a7e26e] transition-colors"
          >
            <span>استعراض الأسئلة المفتوحة ←</span>
          </Link>
        </div>

        {/* Quick CTA to Publish */}
        <div className="p-4 rounded-2xl bg-[#222f30] text-white space-y-3 shadow-sm">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#bef264]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Research Object</span>
          </div>
          <h4 className="text-sm font-bold font-kufi">
            أجريت بحثاً وتريد تحويله لأثر معرفي دائم؟
          </h4>
          <p className="text-xs text-white/80 leading-relaxed font-normal">
            لا تنشر بوست عابر؛ وثّق السؤال، الأدوات، النتائج، والتحقق البشري ليكون مرجعاً تقنياً.
          </p>
          <Link
            href="/publish"
            className="block w-full py-2 text-center rounded-xl bg-[#bef264] text-[#222f30] text-xs font-bold hover:bg-[#a7e26e] transition-all shadow-xs"
          >
            وثّق كائن بحثك الآن ←
          </Link>
        </div>
      </aside>

      {/* Main Feed Section */}
      <main className="lg:w-3/4 flex-1">
        {/* Top Discovery Lenses Tabs (Reddit in Discovery) */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#e4e3e3] pb-3 font-mono overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap">
          <button
            onClick={() => setLens("trending")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lens === "trending"
                ? "bg-[#222f30] text-white shadow-xs"
                : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>الرائج معرفياً (Trending)</span>
          </button>

          <button
            onClick={() => setLens("latest")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lens === "latest"
                ? "bg-[#222f30] text-white shadow-xs"
                : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a7e26e]" />
            <span>أحدث الاكتشافات (Latest)</span>
          </button>

          <button
            onClick={() => setLens("evidence")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lens === "evidence"
                ? "bg-[#222f30] text-white shadow-xs"
                : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>الأكثر توثيقاً (Evidence-Backed)</span>
          </button>

          <button
            onClick={() => setLens("reproduced")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lens === "reproduced"
                ? "bg-[#222f30] text-white shadow-xs"
                : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-purple-400" />
            <span>المُعاد تجربته (Reproduced)</span>
          </button>

          <button
            onClick={() => setLens("open-problems")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              lens === "open-problems"
                ? "bg-[#222f30] text-[#bef264] shadow-xs"
                : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#bef264]" />
            <span>المسائل المفتوحة (Open Problems)</span>
          </button>
        </div>

        {/* When Lens is OPEN PROBLEMS, render the Open Questions Collaborative Board */}
        {lens === "open-problems" ? (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 font-mono text-xs text-[#222f30] font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-[#222f30]" />
                <span>OPEN PROBLEMS · أسئلة لم تُحسم بعد</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-kufi text-[#222f30]">
                المسائل المفتوحة والأبحاث المشتركة
              </h2>
              <p className="text-sm sm:text-base text-[#55696a] leading-relaxed max-w-2xl font-normal">
                في JEMO، لا ننشر الإجابات المحسومة فقط؛ بل نضع المسائل العالقة التي لم يصل فيها الذكاء الاصطناعي ولا الباحثون إلى كلمة نهائية، ليعمل المجتمع عليها تجريبياً.
              </p>
            </div>

            <div className="space-y-4">
              {OPEN_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-full bg-[#f0f2f0] text-[#222f30] font-bold">
                        {q.field}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        q.status === "غير محسوم بعد" ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-900"
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-[#738284]">
                      {q.researchCount} أبحاث · {q.experimentsCount} تجارب · {q.replicationsCount} إعادة
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-kufi text-[#222f30] leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs font-mono text-[#738284] mt-1 dir-ltr text-right">
                      {q.titleEn}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed">
                    {q.description}
                  </p>

                  {/* Consensus Box */}
                  <div className="p-4 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1">
                    <span className="text-[11px] font-mono font-bold text-[#222f30] block">
                      الإجماع الحالي (Current Consensus):
                    </span>
                    <p className="text-xs text-[#55696a] leading-relaxed">
                      {q.consensus}
                    </p>
                  </div>

                  {/* Tags and CTA */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#e4e3e3]">
                    <div className="flex flex-wrap items-center gap-2">
                      {q.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f0f2f0] text-[#55696a]">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/publish?question=${encodeURIComponent(q.title)}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs"
                    >
                      <span>سأحاول حل المسألة (Attempt Solution)</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Standard Research Objects Feed */
          <div>
            {/* Toolbar: count + sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 font-mono">
              <p aria-live="polite" className="text-xs font-bold text-[#222f30]">
                {filteredPapers.length} كائنات بحثية (Research Objects)
              </p>
              <label className="flex items-center gap-2 text-[11px] font-bold text-[#55696a]">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>الترتيب:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="border border-[#e4e3e3] rounded-lg bg-white text-[#222f30] text-xs font-bold px-2 py-1 focus:outline-none cursor-pointer"
                >
                  <option value="newest">الأحدث</option>
                  <option value="reproduced">الأكثر إعادة للتجربة</option>
                  <option value="relevance">الأعلى صلة</option>
                  <option value="title">العنوان أ–ي</option>
                </select>
              </label>
            </div>

            {filteredPapers.length === 0 ? (
              <div className="py-20 text-center space-y-4 border border-[#e4e3e3] rounded-3xl bg-white px-6">
                <BookOpen className="w-12 h-12 text-[#738284] mx-auto opacity-30" />
                <h3 className="text-lg font-bold font-kufi text-[#222f30]">لم نجد نتائج مطابقة</h3>
                <p className="text-xs text-[#55696a]">جرب تغيير الكلمات المفتاحية أو إزالة الفلاتر المحددة.</p>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold text-white bg-[#222f30] hover:bg-[#162224] transition-colors px-4 py-2 rounded-xl"
                >
                  <X className="w-3.5 h-3.5" /> إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {filteredPapers.map((paper) => {
                  const rType = paper.researchType || "Full Research";
                  const eStatus = paper.evidenceStatus || "Evidence-backed";
                  const repCount = paper.lineage?.replicationsCount || paper.metrics?.reproducedCount || 0;

                  return (
                    <article
                      key={paper.id}
                      className="group p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-300 space-y-4"
                    >
                      {/* Top Bar: Object Type + Evidence Status Badges */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e3e3] pb-3">
                        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                          {/* Type Pill */}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f2f0] text-[#222f30] font-bold">
                            {rType === "Experiment" && <FlaskConical className="w-3 h-3 text-emerald-600" />}
                            {rType === "Quick Investigation" && <Zap className="w-3 h-3 text-amber-600" />}
                            {rType !== "Experiment" && rType !== "Quick Investigation" && <BookOpen className="w-3 h-3 text-blue-600" />}
                            <span>{rType === "Experiment" ? "Experiment" : rType === "Quick Investigation" ? "Investigation" : "Research Object"}</span>
                          </span>

                          {/* Evidence Status */}
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold ${
                            eStatus === "Reproduced"
                              ? "bg-purple-100 text-purple-900 border border-purple-200"
                              : eStatus === "Evidence-backed"
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                              : "bg-amber-100 text-amber-900 border border-amber-200"
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{eStatus === "Reproduced" ? `تمت إعادة التجربة (${repCount}×)` : eStatus === "Evidence-backed" ? "مدعوم بالأدلة" : "قيد المراجعة"}</span>
                          </span>

                          <span className="text-[11px] text-[#738284]">
                            {paper.field}
                          </span>
                        </div>

                        <div className="text-xs font-mono text-[#738284]">
                          {paper.publishDate}
                        </div>
                      </div>

                      {/* Title & Author */}
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-kufi text-[#222f30] leading-snug group-hover:text-[#222f30]">
                          <Link href={`/research/${paper.slug}`} className="hover:underline">
                            {highlightTerms(paper.title, terms)}
                          </Link>
                        </h2>
                        {paper.titleEn && (
                          <p className="text-xs font-mono text-[#738284] mt-1 dir-ltr text-right">
                            {paper.titleEn}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-[#55696a] font-mono mt-2">
                          <Users className="w-3.5 h-3.5 opacity-60" />
                          <span>{paper.authors.map((a) => a.name).join(" • ")}</span>
                        </div>
                      </div>

                      {/* The Question Box (Atomic to Research Object) */}
                      {paper.question && (
                        <div className="p-3.5 rounded-2xl bg-[#f9faf9] border border-[#e4e3e3] text-xs leading-relaxed space-y-1">
                          <span className="font-mono font-bold text-[#222f30] flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#a7e26e]" />
                            <span>المسألة المراد حلها (The Question):</span>
                          </span>
                          <p className="text-[#55696a]">
                            {paper.question}
                          </p>
                        </div>
                      )}

                      {/* Abstract / Findings */}
                      <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed line-clamp-3">
                        {highlightTerms(paper.findings || paper.abstract, terms)}
                      </p>

                      {/* AI Tools Badges */}
                      {paper.toolsUsed && paper.toolsUsed.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                          <span className="text-[#738284] ml-1">الأدوات:</span>
                          {paper.toolsUsed.map((tool, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-[#f0f2f0] border border-[#e4e3e3] text-[#222f30] font-semibold">
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Lineage Indicator & Forks */}
                      {paper.lineage && (
                        <div className="flex items-center gap-2 font-mono text-[11px] text-[#55696a] pt-1">
                          <GitFork className="w-3.5 h-3.5 text-[#a7e26e]" />
                          <span>شجرة التراكم (Lineage):</span>
                          <span className="font-bold text-[#222f30]">
                            {paper.lineage.replicationsCount} إعادة تجربة · {paper.lineage.challengesCount} تحديات · {paper.lineage.extensionsCount} امتداد
                          </span>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#e4e3e3]">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/research/${paper.slug}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs"
                          >
                            <span>قراءة كائن البحث (Read Object)</span>
                            <ArrowUpLeft className="w-3.5 h-3.5" />
                          </Link>

                          <Link
                            href={`/publish?replicate=${paper.slug}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e4e3e3] bg-[#f5f8f7] text-[#222f30] text-xs font-bold hover:border-[#a7e26e] transition-all"
                            title="إعادة التجربة بنفسك وتوثيق نتيجتك"
                          >
                            <Repeat className="w-3.5 h-3.5 text-purple-600" />
                            <span>Replicate (أعد التجربة)</span>
                          </Link>

                          <Link
                            href={`/publish?challenge=${paper.slug}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e4e3e3] bg-white text-[#55696a] text-xs font-bold hover:text-red-700 hover:border-red-200 transition-all"
                            title="تحدي النتيجة وتقديم أدلة مضادة"
                          >
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Challenge (تحدي)</span>
                          </Link>
                        </div>

                        {paper.doi && (
                          <span className="text-[10px] font-mono text-[#738284]">
                            DOI: {paper.doi}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
