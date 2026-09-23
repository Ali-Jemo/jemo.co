"use client";

import { useState, useMemo, useRef, useEffect, Fragment } from "react";
import { Paper, OpenQuestion } from "@/lib/data/research-data";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Filter,
  Calendar,
  ArrowUpLeft,
  BookOpen,
  FileText,
  X,
  ChevronDown,
  ArrowUpDown,
  Flame,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Repeat,
  AlertCircle,
  FlaskConical,
  Zap,
  Search,
  Copy,
  Check,
  Users
} from "lucide-react";

interface ResearchSearchFilterProps {
  papers: Paper[];
  questions: OpenQuestion[];
}

type SortKey = "newest" | "oldest" | "title" | "relevance" | "reproduced";
type DiscoveryLens = "trending" | "latest" | "evidence" | "reproduced" | "open-problems";
type ResearchType = NonNullable<Paper["researchType"]>;
type EvidenceStatus = NonNullable<Paper["evidenceStatus"]>;

/** Metadata for Research Object types */
const TYPE_META: Record<
  ResearchType,
  { label: string; labelAr: string; icon: LucideIcon; pill: string }
> = {
  Experiment: {
    label: "Experiment",
    labelAr: "تجربة مخبرية",
    icon: FlaskConical,
    pill: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  },
  "Quick Investigation": {
    label: "Investigation",
    labelAr: "استقصاء سريع",
    icon: Zap,
    pill: "bg-amber-50 text-amber-900 border-amber-200/80",
  },
  "Full Research": {
    label: "Full Paper",
    labelAr: "بحث متكامل",
    icon: BookOpen,
    pill: "bg-blue-50 text-blue-900 border-blue-200/80",
  },
  "Research Note": {
    label: "Research Note",
    labelAr: "مذكرة بحثية",
    icon: FileText,
    pill: "bg-slate-100 text-slate-800 border-slate-200/80",
  },
  Discovery: {
    label: "Discovery",
    labelAr: "سجل اكتشاف",
    icon: Sparkles,
    pill: "bg-lime-50 text-lime-900 border-lime-300/80",
  },
  Replication: {
    label: "Replication",
    labelAr: "إعادة تجربة",
    icon: Repeat,
    pill: "bg-purple-50 text-purple-900 border-purple-200/80",
  },
  Book: {
    label: "Book",
    labelAr: "كتاب تخصصي",
    icon: BookOpen,
    pill: "bg-indigo-50 text-indigo-900 border-indigo-200/80",
  },
  Novel: {
    label: "Novel",
    labelAr: "عمل أصيل",
    icon: BookOpen,
    pill: "bg-teal-50 text-teal-900 border-teal-200/80",
  },
};

/** Metadata for Evidence statuses */
const STATUS_META: Record<
  EvidenceStatus,
  { label: string; dot: string; glow: string; pill: string; accent: string }
> = {
  "Evidence-backed": {
    label: "مدعوم بالأدلة",
    dot: "bg-emerald-500",
    glow: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    pill: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    accent: "border-r-emerald-500",
  },
  Reproduced: {
    label: "تمت إعادة التجربة",
    dot: "bg-purple-500",
    glow: "shadow-[0_0_8px_rgba(168,85,247,0.5)]",
    pill: "bg-purple-50 text-purple-800 border-purple-200/80",
    accent: "border-r-purple-500",
  },
  "Under Review": {
    label: "قيد المراجعة",
    dot: "bg-amber-500",
    glow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]",
    pill: "bg-amber-50 text-amber-800 border-amber-200/80",
    accent: "border-r-amber-500",
  },
  Disputed: {
    label: "محل خلاف",
    dot: "bg-red-500",
    glow: "shadow-[0_0_8px_rgba(239,68,68,0.5)]",
    pill: "bg-red-50 text-red-800 border-red-200/80",
    accent: "border-r-red-500",
  },
  "Expert Reviewed": {
    label: "مراجعة خبراء",
    dot: "bg-sky-500",
    glow: "shadow-[0_0_8px_rgba(14,165,233,0.5)]",
    pill: "bg-sky-50 text-sky-800 border-sky-200/80",
    accent: "border-r-sky-500",
  },
};

const TYPE_ORDER = Object.keys(TYPE_META) as ResearchType[];
const STATUS_ORDER = Object.keys(STATUS_META) as EvidenceStatus[];

const LENSES: {
  id: DiscoveryLens;
  label: string;
  labelEn: string;
  icon: LucideIcon;
  iconClass: string;
}[] = [
  { id: "trending", label: "الرائج معرفياً", labelEn: "Trending", icon: Flame, iconClass: "text-amber-500" },
  { id: "latest", label: "أحدث الاكتشافات", labelEn: "Latest", icon: Sparkles, iconClass: "text-[#a7e26e]" },
  { id: "evidence", label: "الأكثر توثيقاً", labelEn: "Evidence-Backed", icon: ShieldCheck, iconClass: "text-emerald-500" },
  { id: "reproduced", label: "المُعاد تجربته", labelEn: "Reproduced", icon: Repeat, iconClass: "text-purple-500" },
  { id: "open-problems", label: "المسائل المفتوحة", labelEn: "Open Problems", icon: HelpCircle, iconClass: "text-sky-500" },
];

function typeOf(paper: Paper): ResearchType {
  const t = paper.researchType as ResearchType | undefined;
  return t && t in TYPE_META ? t : "Full Research";
}

function statusOf(paper: Paper): EvidenceStatus {
  const s = paper.evidenceStatus as EvidenceStatus | undefined;
  return s && s in STATUS_META ? s : "Evidence-backed";
}

function authorNames(paper: Paper): string {
  return (paper.authors ?? [])
    .map((a: unknown) => {
      if (typeof a === "string") return a;
      if (typeof a === "object" && a !== null && "name" in a && typeof a.name === "string") return a.name;
      return "";
    })
    .filter(Boolean)
    .join("، ");
}

/** Arabic counted-noun forms: 0, 1, 2, 3–10, 11+. */
function objectsLabel(n: number): string {
  if (n === 0) return "لا توجد كائنات بحثية";
  if (n === 1) return "كائن بحثي واحد";
  if (n === 2) return "كائنان بحثيان";
  if (n <= 10) return `${n} كائنات بحثية`;
  return `${n} كائناً بحثياً`;
}

function readInitialParams(): {
  q: string;
  field: string;
  year: string;
  type: string;
  status: string;
  sort: SortKey;
  lens: DiscoveryLens;
} {
  if (typeof window === "undefined") {
    return { q: "", field: "all", year: "all", type: "all", status: "all", sort: "newest", lens: "trending" };
  }
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
    type: sp.get("type") ?? "all",
    status: sp.get("status") ?? "all",
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
      <mark key={i} className="bg-[#bef264] text-[#222f30] px-0.5 rounded-sm font-semibold">
        {p}
      </mark>
    ) : (
      <Fragment key={i}>{p}</Fragment>
    )
  );
}

export default function ResearchSearchFilter({ papers, questions }: ResearchSearchFilterProps) {
  const [initialParams] = useState(readInitialParams);
  const [query, setQuery] = useState(initialParams.q);
  const [selectedField, setSelectedField] = useState<string>(initialParams.field);
  const [selectedYear, setSelectedYear] = useState<string>(initialParams.year);
  const [selectedType, setSelectedType] = useState<string>(initialParams.type);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialParams.status);
  const [sort, setSort] = useState<SortKey>(initialParams.sort);
  const [lens, setLens] = useState<DiscoveryLens>(initialParams.lens);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showAllFields, setShowAllFields] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const terms = useMemo(() => query.trim().split(/\s+/).filter(Boolean), [query]);
  const effectiveSort: SortKey = sort === "relevance" && terms.length === 0 ? "newest" : sort;

  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: "/" focuses search, "Esc" clears
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

  // Sync state to URL params for clean deep-linking
  useEffect(() => {
    const timer = setTimeout(() => {
      const sp = new URLSearchParams();
      if (query.trim()) sp.set("q", query.trim());
      if (selectedField !== "all") sp.set("field", selectedField);
      if (selectedYear !== "all") sp.set("year", selectedYear);
      if (selectedType !== "all") sp.set("type", selectedType);
      if (selectedStatus !== "all") sp.set("status", selectedStatus);
      if (effectiveSort !== "newest") sp.set("sort", effectiveSort);
      if (lens !== "trending") sp.set("lens", lens);
      const url = sp.toString() ? `${window.location.pathname}?${sp}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, selectedField, selectedYear, selectedType, selectedStatus, effectiveSort, lens]);

  const copyToClipboard = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId((curr) => (curr === id ? null : curr));
      }, 2000);
    }
  };

  const fields = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.field))).sort((a, b) => a.localeCompare(b, "ar"));
  }, [papers]);

  const visibleFields = useMemo(() => {
    if (showAllFields || fields.length <= 6) return fields;
    const initial = fields.slice(0, 6);
    if (selectedField !== "all" && !initial.includes(selectedField)) {
      return [...initial, selectedField];
    }
    return initial;
  }, [fields, showAllFields, selectedField]);

  const years = useMemo(() => {
    return Array.from(new Set(papers.map((p) => p.publishDate.slice(0, 4)))).sort((a, b) =>
      b.localeCompare(a)
    );
  }, [papers]);

  const typeOptions = useMemo(() => {
    const present = new Set(papers.map(typeOf));
    return TYPE_ORDER.filter((t) => present.has(t));
  }, [papers]);

  const statusOptions = useMemo(() => {
    const present = new Set(papers.map(statusOf));
    return STATUS_ORDER.filter((s) => present.has(s));
  }, [papers]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) {
      const k = typeOf(p);
      counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts;
  }, [papers]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) {
      const k = statusOf(p);
      counts[k] = (counts[k] ?? 0) + 1;
    }
    return counts;
  }, [papers]);

  const fieldCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) counts[p.field] = (counts[p.field] ?? 0) + 1;
    return counts;
  }, [papers]);

  const yearCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) {
      const y = p.publishDate.slice(0, 4);
      counts[y] = (counts[y] ?? 0) + 1;
    }
    return counts;
  }, [papers]);

  // Ranked & Filtered Papers
  const ranked = useMemo(() => {
    const result: { paper: Paper; score: number }[] = [];
    for (const paper of papers) {
      if (selectedType !== "all" && typeOf(paper) !== selectedType) continue;
      if (selectedStatus !== "all" && statusOf(paper) !== selectedStatus) continue;

      if (lens === "evidence") {
        const s = statusOf(paper);
        if (s !== "Evidence-backed" && s !== "Reproduced" && s !== "Expert Reviewed") continue;
      }
      if (lens === "reproduced" && (paper.lineage?.replicationsCount || 0) === 0) {
        continue;
      }

      const titleLower = (paper.title || "").toLowerCase();
      const titleEnLower = (paper.titleEn || "").toLowerCase();
      const abstractLower = (paper.abstract || "").toLowerCase();
      const authorsLower = (paper.authors ?? [])
        .map((a: unknown) => {
          if (typeof a === "string") return a;
          if (typeof a === "object" && a !== null && "name" in a && typeof a.name === "string") return a.name;
          return "";
        })
        .join(" ")
        .toLowerCase();
      const keywordsLower = (paper.keywords ?? []).join(" ").toLowerCase();
      const fieldLower = (paper.field || "").toLowerCase();
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

    if (effectiveSort === "oldest") {
      result.sort((a, b) => a.paper.publishDate.localeCompare(b.paper.publishDate));
    } else if (effectiveSort === "title") {
      result.sort((a, b) => a.paper.title.localeCompare(b.paper.title, "ar"));
    } else if (effectiveSort === "relevance" && terms.length > 0) {
      result.sort(
        (a, b) => b.score - a.score || b.paper.publishDate.localeCompare(a.paper.publishDate)
      );
    } else if (effectiveSort === "reproduced" || lens === "reproduced") {
      result.sort(
        (a, b) =>
          (b.paper.lineage?.replicationsCount || 0) - (a.paper.lineage?.replicationsCount || 0)
      );
    } else if (lens === "trending") {
      result.sort((a, b) => {
        const aScore =
          (a.paper.metrics?.reproducedCount || 0) * 3 +
          (a.paper.metrics?.evidenceBackedCount || 0) * 2;
        const bScore =
          (b.paper.metrics?.reproducedCount || 0) * 3 +
          (b.paper.metrics?.evidenceBackedCount || 0) * 2;
        return bScore - aScore || b.paper.publishDate.localeCompare(a.paper.publishDate);
      });
    } else {
      result.sort((a, b) => b.paper.publishDate.localeCompare(a.paper.publishDate));
    }
    return result;
  }, [papers, terms, selectedField, selectedYear, effectiveSort, lens, selectedType, selectedStatus]);

  const filteredPapers = useMemo(() => ranked.map((r) => r.paper), [ranked]);

  // Filtered Open Questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedField !== "all" && q.field !== selectedField) return false;
      if (terms.length > 0) {
        const text = `${q.title} ${q.titleEn} ${q.description} ${q.consensus} ${q.tags.join(" ")}`.toLowerCase();
        const matches = terms.every((t) => text.includes(t.toLowerCase()));
        if (!matches) return false;
      }
      return true;
    });
  }, [questions, terms, selectedField]);

  type Chip = { key: string; label: string; clear: () => void };
  const chips: Chip[] = [];
  if (query.trim()) chips.push({ key: "q", label: `بحث: ${query.trim()}`, clear: () => setQuery("") });
  if (selectedField !== "all") chips.push({ key: "field", label: selectedField, clear: () => setSelectedField("all") });
  if (selectedYear !== "all") chips.push({ key: "year", label: `سنة: ${selectedYear}`, clear: () => setSelectedYear("all") });
  if (selectedType !== "all")
    chips.push({
      key: "type",
      label: TYPE_META[selectedType as ResearchType]?.labelAr ?? selectedType,
      clear: () => setSelectedType("all"),
    });
  if (selectedStatus !== "all")
    chips.push({
      key: "status",
      label: STATUS_META[selectedStatus as EvidenceStatus]?.label ?? selectedStatus,
      clear: () => setSelectedStatus("all"),
    });

  const hasActiveFilters = chips.length > 0;

  const clearAll = () => {
    setQuery("");
    setSelectedField("all");
    setSelectedYear("all");
    setSelectedType("all");
    setSelectedStatus("all");
    setSort("newest");
    setLens("trending");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 font-sans relative" dir="rtl">
      {/* Mobile filter toggle */}
      <div className="lg:hidden flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          className="w-full flex items-center justify-between border border-[#e4e3e3] bg-white rounded-2xl px-4 py-3 font-sans text-xs font-bold text-[#222f30] shadow-xs active:scale-[0.99] transition-all min-h-[44px]"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#a7e26e]" />
            <span>{filtersOpen ? "إخفاء لوحة الفلاتر" : "عرض الفلاتر والتصنيفات"}</span>
            {hasActiveFilters && (
              <span className="bg-[#222f30] text-[#bef264] text-[11px] font-mono px-2 py-0.5 rounded-full font-bold">
                {chips.length}
              </span>
            )}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#738284] transition-transform duration-200 ${
              filtersOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Sidebar: Search & Filters */}
      <aside
        className={`${
          filtersOpen ? "block" : "hidden"
        } lg:block lg:w-[280px] xl:w-[300px] shrink-0 space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto no-scrollbar h-fit pb-10 lg:pb-0`}
      >
        {/* Search Input Box */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center justify-between">
            <span className="font-kufi">البحث والاستكشاف</span>
            <span className="text-[11px] font-mono text-[#738284]">QUERY</span>
          </h3>
          <div
            role="search"
            className="relative group bg-[#f0f2f0] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#bef264] border border-transparent focus-within:border-[#222f30] rounded-xl flex items-center px-3 py-2.5 shadow-xs gap-2 transition-all duration-200"
          >
            <Search className="w-4 h-4 text-[#738284] group-focus-within:text-[#222f30] shrink-0 transition-colors" />
            <input
              ref={searchRef}
              type="text"
              inputMode="search"
              aria-label="ابحث في كائنات البحث"
              placeholder="ابحث عن مسألة، أداة، أو كود..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#222f30] placeholder:text-[#738284] focus:outline-none font-sans"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="مسح البحث"
                className="text-[#738284] hover:text-[#222f30] shrink-0 p-0.5 rounded-md hover:bg-black/5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#e4e3e3] text-[#738284] font-mono shrink-0 shadow-2xs">
              /
            </kbd>
          </div>
        </div>

        {/* Research Object Type Filter */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center justify-between">
            <span className="font-kufi">نوع كائن البحث</span>
            <span className="text-[10px] font-mono text-[#738284]">TYPE</span>
          </h3>
          <div className="space-y-1 pt-1">
            <button
              type="button"
              onClick={() => setSelectedType("all")}
              aria-pressed={selectedType === "all"}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedType === "all"
                  ? "bg-[#222f30] text-white shadow-xs font-bold"
                  : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#bef264]" />
                <span className="font-sans">جميع الأنواع</span>
              </div>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                  selectedType === "all" ? "bg-white/20 text-white" : "bg-[#e4e3e3]/50 text-[#738284]"
                }`}
              >
                {papers.length}
              </span>
            </button>

            {typeOptions.map((t) => {
              const meta = TYPE_META[t];
              const Icon = meta.icon;
              const isSelected = selectedType === t;
              const count = typeCounts[t] ?? 0;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? "bg-[#222f30] text-white shadow-xs font-bold"
                      : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected ? "text-[#bef264]" : "text-[#738284]"
                      }`}
                    />
                    <span className="font-sans">{meta.labelAr}</span>
                    <span
                      className={`text-[10px] font-mono hidden sm:inline ${
                        isSelected ? "text-white/60" : "text-[#738284]"
                      }`}
                    >
                      ({meta.label})
                    </span>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#e4e3e3]/50 text-[#738284]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Evidence Status Filter */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center justify-between">
            <span className="font-kufi">حالة الإثبات والتحقق</span>
            <span className="text-[10px] font-mono text-[#738284]">EVIDENCE</span>
          </h3>
          <div className="space-y-1 pt-1">
            <button
              type="button"
              onClick={() => setSelectedStatus("all")}
              aria-pressed={selectedStatus === "all"}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                selectedStatus === "all"
                  ? "bg-[#222f30] text-white shadow-xs font-bold"
                  : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#738284]" />
                <span className="font-sans">جميع الحالات</span>
              </div>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                  selectedStatus === "all" ? "bg-white/20 text-white" : "bg-[#e4e3e3]/50 text-[#738284]"
                }`}
              >
                {papers.length}
              </span>
            </button>

            {statusOptions.map((s) => {
              const meta = STATUS_META[s];
              const isSelected = selectedStatus === s;
              const count = statusCounts[s] ?? 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStatus(s)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                    isSelected
                      ? "bg-[#222f30] text-white shadow-xs font-bold"
                      : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot} ${meta.glow}`} />
                    <span className="font-sans">{meta.label}</span>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#e4e3e3]/50 text-[#738284]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scientific Field Filter */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center justify-between">
            <span className="font-kufi">المجال العلمي</span>
            <span className="text-[10px] font-mono text-[#738284]">DOMAIN</span>
          </h3>
          <ul className="space-y-1 text-xs pt-1">
            <li>
              <button
                type="button"
                onClick={() => setSelectedField("all")}
                aria-pressed={selectedField === "all"}
                className={`w-full flex items-center justify-between text-right rounded-xl px-3 py-2 transition-all ${
                  selectedField === "all"
                    ? "bg-[#222f30] text-white shadow-xs font-bold"
                    : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
                }`}
              >
                <span className="font-sans">جميع المجالات</span>
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                    selectedField === "all" ? "bg-white/20 text-white" : "bg-[#e4e3e3]/50 text-[#738284]"
                  }`}
                >
                  {papers.length}
                </span>
              </button>
            </li>
            {visibleFields.map((f) => {
              const count = fieldCounts[f] ?? 0;
              const isSelected = selectedField === f;
              return (
                <li key={f}>
                  <button
                    type="button"
                    onClick={() => setSelectedField(f)}
                    aria-pressed={isSelected}
                    className={`w-full flex items-center justify-between text-right rounded-xl px-3 py-2 transition-all ${
                      isSelected
                        ? "bg-[#222f30] text-white shadow-xs font-bold"
                        : "text-[#55696a] hover:bg-[#f0f2f0] hover:text-[#222f30]"
                    }`}
                  >
                    <span className="font-sans truncate">{f}</span>
                    <span
                      className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md shrink-0 mr-1 ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#e4e3e3]/50 text-[#738284]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {fields.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAllFields((prev) => !prev)}
              className="w-full text-right text-[11px] font-bold font-sans text-[#738284] hover:text-[#222f30] px-3 py-1 transition-colors flex items-center gap-1"
            >
              <span>{showAllFields ? "عرض أقل ↑" : `عرض باقي المجالات (${fields.length}) ↓`}</span>
            </button>
          )}
        </div>

        {/* Publication Year Filter */}
        {years.length > 1 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f30] border-b border-[#e4e3e3] pb-1.5 flex items-center justify-between">
              <span className="font-kufi">سنة النشر</span>
              <span className="text-[10px] font-mono text-[#738284]">YEAR</span>
            </h3>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setSelectedYear("all")}
                aria-pressed={selectedYear === "all"}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedYear === "all"
                    ? "bg-[#222f30] text-white shadow-xs"
                    : "bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30]"
                }`}
              >
                الكل
              </button>
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setSelectedYear(y)}
                  aria-pressed={selectedYear === y}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    selectedYear === y
                      ? "bg-[#222f30] text-white shadow-xs"
                      : "bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30]"
                  }`}
                >
                  <span className="font-mono">{y}</span>
                  <span
                    className={`text-[10px] font-mono ${
                      selectedYear === y ? "text-white/70" : "text-[#738284]"
                    }`}
                  >
                    ({yearCounts[y] ?? 0})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Open Problems Teaser Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#e4e3e3] space-y-3 shadow-xs hover:border-[#a7e26e] transition-all group">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#445e5f]">
            <HelpCircle className="w-3.5 h-3.5 text-[#a7e26e]" />
            <span>OPEN PROBLEMS</span>
          </div>
          <h4 className="text-sm font-bold text-[#222f30] font-kufi group-hover:text-black">
            معضلات علمية بلا إجابة حاسمة
          </h4>
          <p className="text-xs text-[#55696a] leading-relaxed font-sans">
            استكشف المسائل المفتوحة التي يعمل عليها المجتمع وساهم ببحثك وتجربتك في فحصها.
          </p>
          <button
            type="button"
            onClick={() => setLens("open-problems")}
            className="inline-flex items-center gap-1.5 text-xs font-bold font-sans text-[#222f30] group-hover:text-[#445e5f] transition-colors"
          >
            <span>استعراض المسائل المفتوحة ←</span>
          </button>
        </div>

        {/* Quick CTA to Publish */}
        <div className="p-4 rounded-3xl bg-[#222f30] text-white space-y-3 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#bef264]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#bef264]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESEARCH OBJECT</span>
          </div>
          <h4 className="text-sm font-bold font-kufi">أجريت بحثاً وتريد تحويله لأثر دائم؟</h4>
          <p className="text-xs text-white/80 leading-relaxed font-sans">
            لا تنشر منشوراً عابراً؛ وثّق السؤال، الأدوات، النتائج، والتحقق البشري ليكون مرجعاً تقنياً.
          </p>
          <Link
            href="/publish"
            className="block w-full py-2.5 text-center rounded-xl bg-[#bef264] text-[#222f30] text-xs font-bold hover:bg-[#a7e26e] transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
          >
            وثّق كائن بحثك الآن ←
          </Link>
        </div>
      </aside>

      {/* Main Feed Section */}
      <section className="lg:w-3/4 flex-1 min-w-0" aria-label="مستكشف كائنات البحث">
        {/* Discovery Lenses Navigation Tabs */}
        <div className="relative mb-6 border-b border-[#e4e3e3] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1.5 px-0.5 flex-nowrap sm:flex-wrap">
            {LENSES.map((l) => {
              const Icon = l.icon;
              const isActive = lens === l.id;

              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLens(l.id)}
                  aria-pressed={isActive}
                  className={`relative shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 select-none cursor-pointer ${
                    isActive
                      ? "text-white shadow-xs"
                      : "text-[#55696a] hover:text-[#222f30] bg-white border border-[#e4e3e3] hover:border-[#222f30]/40"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLensIndicator"
                      className="absolute inset-0 bg-[#222f30] rounded-2xl shadow-sm z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#bef264]" : l.iconClass}`} />
                    <span className="font-sans">{l.label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive ? "bg-white/20 text-white" : "bg-[#f0f2f0] text-[#738284]"
                      }`}
                    >
                      {l.labelEn}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lens: OPEN PROBLEMS Collaborative Board */}
        {lens === "open-problems" ? (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 font-mono text-xs text-[#222f30] font-bold">
                <HelpCircle className="w-3.5 h-3.5 text-[#222f30]" />
                <span>OPEN PROBLEMS · أسئلة لم تُحسم بعد</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-kufi text-[#222f30]">
                المسائل المفتوحة والأبحاث المشتركة
              </h2>
              <p className="text-sm sm:text-base text-[#55696a] leading-relaxed max-w-2xl font-sans">
                في JEMO، لا ننشر الإجابات المحسومة فقط؛ بل نضع المسائل العالقة التي لم يصل فيها الذكاء الاصطناعي ولا الباحثون إلى كلمة نهائية، ليعمل المجتمع عليها تجريبياً.
              </p>
            </motion.div>

            {filteredQuestions.length === 0 ? (
              <div className="py-16 text-center space-y-4 border border-[#e4e3e3] rounded-3xl bg-white px-6">
                <HelpCircle className="w-12 h-12 text-[#738284] mx-auto opacity-30" />
                <h3 className="text-lg font-bold font-kufi text-[#222f30]">لم نجد مسائل مطابقة للفلاتر</h3>
                <p className="text-xs text-[#55696a]">جرب إزالة فلتر المجال أو البحث بكلمة مختلفة.</p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 text-xs font-sans font-bold text-white bg-[#222f30] hover:bg-[#162224] transition-colors px-4 py-2 rounded-xl"
                >
                  <X className="w-3.5 h-3.5" /> إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((q) => (
                  <motion.div
                    key={q.id}
                    layout="position"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#f0f2f0] text-[#222f30] font-bold text-xs font-sans">
                          {q.field}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full font-bold text-xs font-sans ${
                            q.status === "غير محسوم بعد"
                              ? "bg-amber-100 text-amber-900 border border-amber-200"
                              : "bg-blue-100 text-blue-900 border border-blue-200"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#738284] font-mono">
                        <span>
                          <strong className="text-[#222f30]">{q.researchCount}</strong> أبحاث
                        </span>
                        <span>·</span>
                        <span>
                          <strong className="text-[#222f30]">{q.experimentsCount}</strong> تجارب
                        </span>
                        <span>·</span>
                        <span>
                          <strong className="text-[#222f30]">{q.replicationsCount}</strong> إعادة
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold font-kufi text-[#222f30] leading-snug">
                        <bdi dir="rtl">{q.title}</bdi>
                      </h3>
                      {q.titleEn && (
                        <p className="text-xs font-mono text-[#738284] mt-1" dir="ltr">
                          {q.titleEn}
                        </p>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed font-sans">
                      {q.description}
                    </p>

                    {/* Consensus Box */}
                    <div className="p-4 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1.5">
                      <span className="text-xs font-bold text-[#222f30] flex items-center gap-1.5 font-sans">
                        <span>الإجماع الحالي</span>
                        <span className="text-[10px] font-mono text-[#738284]">(Current Consensus)</span>
                        <span>:</span>
                      </span>
                      <p className="text-xs text-[#55696a] leading-relaxed font-sans">
                        {q.consensus}
                      </p>
                    </div>

                    {/* Tags and CTA */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#e4e3e3]">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {q.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-[#f0f2f0] text-[#55696a]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/publish?question=${encodeURIComponent(q.title)}`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs hover:scale-105 active:scale-95 font-sans"
                      >
                        <span>سأحاول حل المسألة</span>
                        <span className="font-mono text-[10px] text-white/70">(Attempt Solution)</span>
                        <ArrowUpLeft className="w-3.5 h-3.5 text-[#bef264]" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Standard Research Objects Feed */
          <div>
            {/* Active filter chips */}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-wrap items-center gap-2 mb-4 overflow-hidden"
                >
                  {chips.map((c) => (
                    <motion.button
                      key={c.key}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      type="button"
                      onClick={c.clear}
                      aria-label={`إزالة فلتر ${c.label}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#222f30] text-white text-[11px] font-bold hover:bg-[#162224] transition-all shadow-2xs group"
                    >
                      <span className="font-sans">{c.label}</span>
                      <X className="w-3 h-3 text-[#bef264] group-hover:rotate-90 transition-transform" />
                    </motion.button>
                  ))}
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[11px] font-bold font-sans text-[#738284] hover:text-[#222f30] underline underline-offset-4 px-2 py-1 transition-colors"
                  >
                    مسح الكل
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toolbar: Count + Sort */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-[#e4e3e3]/60">
              <p aria-live="polite" className="text-xs font-bold text-[#222f30] font-sans flex items-center gap-1.5">
                <span>{objectsLabel(filteredPapers.length)}</span>
                <span className="text-[#738284] font-mono text-[11px] font-normal">
                  / {papers.length} TOTAL
                </span>
              </p>

              <div className="flex items-center gap-2 text-xs font-sans">
                <span className="text-[#738284] font-medium flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#222f30]" />
                  <span>الترتيب:</span>
                </span>
                <div className="relative">
                  <select
                    value={effectiveSort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none border border-[#e4e3e3] rounded-xl bg-white text-[#222f30] text-xs font-bold pr-3 pl-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#bef264] cursor-pointer shadow-2xs font-sans hover:border-[#222f30] transition-colors"
                  >
                    <option value="newest">الأحدث نشرًا</option>
                    <option value="oldest">الأقدم نشرًا</option>
                    <option value="reproduced">الأكثر إعادة للتجربة</option>
                    <option value="relevance" disabled={terms.length === 0}>
                      الأعلى صلة بالبحث
                    </option>
                    <option value="title">العنوان أ–ي</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#738284] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredPapers.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20 text-center space-y-4 border border-[#e4e3e3] rounded-3xl bg-white px-6 shadow-xs"
              >
                <div className="w-16 h-16 rounded-3xl bg-[#f0f2f0] flex items-center justify-center mx-auto text-[#738284]">
                  <BookOpen className="w-8 h-8 opacity-40" />
                </div>
                <h3 className="text-lg font-bold font-kufi text-[#222f30]">لم نجد كائنات بحثية مطابقة</h3>
                <p className="text-xs text-[#55696a] max-w-sm mx-auto font-sans leading-relaxed">
                  جرب تغيير كلمات البحث، أو إلغاء فلاتر المجال وحالة الإثبات المحددة للاطلاع على المزيد.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 text-xs font-sans font-bold text-white bg-[#222f30] hover:bg-[#162224] transition-all px-5 py-2.5 rounded-full shadow-xs hover:scale-105 active:scale-95"
                >
                  <X className="w-3.5 h-3.5 text-[#bef264]" />
                  <span>إعادة ضبط جميع الفلاتر</span>
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredPapers.map((paper, idx) => {
                    const tMeta = TYPE_META[typeOf(paper)];
                    const sMeta = STATUS_META[statusOf(paper)];
                    const TypeIcon = tMeta.icon;
                    const repCount =
                      paper.lineage?.replicationsCount || paper.metrics?.reproducedCount || 0;
                    const isCopied = copiedId === paper.id;

                    return (
                      <motion.article
                        key={paper.id}
                        layout="position"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.2) }}
                        whileHover={{ y: -2 }}
                        className={`group p-5 sm:p-7 rounded-3xl bg-white border border-[#e4e3e3] border-r-4 ${sMeta.accent} shadow-xs hover:border-[#a7e26e] hover:shadow-md transition-all duration-300 space-y-3.5 flex flex-col relative`}
                      >
                        {/* Top Line: Badges, Field, Date */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {/* Type Pill */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold border font-sans ${tMeta.pill}`}
                          >
                            <TypeIcon className="w-3 h-3 shrink-0" />
                            <span>{tMeta.labelAr}</span>
                            <span className="font-mono text-[9px] opacity-75">/ {tMeta.label}</span>
                          </span>

                          {/* Evidence Status Pill */}
                          <span
                            className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full font-bold border font-sans ${sMeta.pill}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${sMeta.dot} ${sMeta.glow}`}
                            />
                            <span>{sMeta.label}</span>
                            {statusOf(paper) === "Reproduced" && (
                              <span className="font-mono font-bold text-[10px]">({repCount}×)</span>
                            )}
                          </span>

                          {/* Field Tag */}
                          <span className="text-[11px] text-[#738284] font-sans font-medium px-2 py-0.5 rounded-md bg-[#f0f2f0]">
                            {paper.field}
                          </span>

                          {/* Date */}
                          <span className="mr-auto text-xs font-mono text-[#738284] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#738284]/70" />
                            <span>{paper.publishDate}</span>
                          </span>
                        </div>

                        {/* Title & English Subtitle */}
                        <div>
                          <h2 className="text-lg sm:text-xl font-bold font-kufi text-[#222f30] leading-snug group-hover:text-black transition-colors">
                            <Link href={`/research/${paper.slug}`} className="hover:underline">
                              <bdi dir="rtl">{highlightTerms(paper.title, terms)}</bdi>
                            </Link>
                          </h2>
                          {paper.titleEn && (
                            <p className="text-xs font-mono text-[#738284] mt-1 tracking-tight" dir="ltr">
                              {paper.titleEn}
                            </p>
                          )}
                        </div>

                        {/* Question Callout */}
                        {paper.question && (
                          <div className="relative rounded-2xl bg-[#f8faf8] border-r-3 border-[#a7e26e] border border-[#e4e3e3]/70 p-3 sm:p-3.5 my-1">
                            <div className="flex items-start gap-2.5">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-[#bef264]/40 text-[#222f30] flex items-center justify-center text-xs font-bold font-mono">
                                ؟
                              </span>
                              <div className="text-xs sm:text-sm text-[#222f30] font-medium leading-relaxed font-sans">
                                <bdi dir="rtl">{paper.question}</bdi>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Findings / Abstract Excerpt */}
                        <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed line-clamp-3 font-sans">
                          {highlightTerms(paper.findings || paper.abstract, terms)}
                        </p>

                        {/* Middle Metadata: Authors, Jev Rigor, Tools, Lineage */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 border-t border-[#e4e3e3]/60 mt-auto text-xs text-[#738284]">
                          {/* Authors */}
                          <div className="flex items-center gap-1.5 font-sans font-medium text-[#222f30]">
                            <Users className="w-3.5 h-3.5 text-[#a7e26e] shrink-0" />
                            <span>{authorNames(paper)}</span>
                          </div>

                          {/* Jev AI Evaluation Badge */}
                          {paper.jevEvaluation &&
                            paper.jevEvaluation.status === "completed" &&
                            paper.jevEvaluation.rigorNormalized != null && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-900 text-[11px] font-bold shadow-2xs">
                                <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                                <span className="font-sans">فحص Jev:</span>
                                <span className="font-mono text-emerald-700">
                                  {paper.jevEvaluation.rigorNormalized}%
                                </span>
                                <span className="font-sans text-[10px] text-emerald-700/80 font-normal">
                                  صرامة
                                </span>
                              </span>
                            )}

                          {/* Tools Used Chips */}
                          {paper.toolsUsed && paper.toolsUsed.length > 0 && (
                            <div className="flex items-center gap-1 font-mono text-[11px] text-[#55696a]">
                              <span>الأدوات:</span>
                              <span className="font-bold">
                                {paper.toolsUsed.slice(0, 3).join(" · ")}
                                {paper.toolsUsed.length > 3 && ` +${paper.toolsUsed.length - 3}`}
                              </span>
                            </div>
                          )}

                          {/* Lineage Info */}
                          {paper.lineage && (
                            <div className="flex items-center gap-1 font-sans text-[11px] text-[#738284]">
                              <span className="font-mono font-bold text-[#222f30]">
                                {paper.lineage.replicationsCount}
                              </span>
                              <span>إعادة تجربة</span>
                              <span>·</span>
                              <span className="font-mono font-bold text-[#222f30]">
                                {paper.lineage.extensionsCount}
                              </span>
                              <span>امتداد</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Action Row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Read Paper Primary Button */}
                            <Link
                              href={`/research/${paper.slug}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs hover:scale-105 active:scale-95 font-sans"
                            >
                              <span>قراءة كائن البحث</span>
                              <ArrowUpLeft className="w-3.5 h-3.5 text-[#bef264]" />
                            </Link>

                            {/* Replicate Action */}
                            <Link
                              href={`/publish?replicate=${paper.slug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/70 text-xs font-bold transition-all hover:scale-105 active:scale-95 font-sans"
                              title="إعادة التجربة وفق المنهجية لتوثيق النتيجة"
                            >
                              <Repeat className="w-3.5 h-3.5 text-purple-600" />
                              <span>إعادة التجربة</span>
                            </Link>

                            {/* Challenge Action */}
                            <Link
                              href={`/publish?challenge=${paper.slug}`}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/70 text-xs font-bold transition-all hover:scale-105 active:scale-95 font-sans"
                              title="تقديم تحدي منهجي أو نقض للفرضية"
                            >
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>تحدي النتيجة</span>
                            </Link>
                          </div>

                          {/* JEMO-ID Copyable badge */}
                          {paper.jemoId && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(paper.id, paper.jemoId!)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#738284] hover:text-[#222f30] bg-[#f0f2f0] hover:bg-[#e4e3e3] px-2.5 py-1 rounded-lg transition-colors cursor-pointer group/id"
                              title="انقر لنسخ المعرّف الأكاديمي الموحد"
                            >
                              <span>ID: {paper.jemoId}</span>
                              {isCopied ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-[#738284] group-hover/id:text-[#222f30]" />
                              )}
                              {isCopied && (
                                <span className="text-[10px] font-sans font-bold text-emerald-700">
                                  تم النسخ!
                                </span>
                              )}
                            </button>
                          )}
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
