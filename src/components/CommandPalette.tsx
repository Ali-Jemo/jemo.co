"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  FolderGit2,
  Cpu,
  Users,
  Trophy,
  Sparkles,
  X,
  ArrowRight,
  Command,
  HelpCircle,
} from "lucide-react";
import {
  RESEARCH_PAPERS,
  RESEARCH_PROJECTS,
  RESEARCH_LABS,
  RESEARCHERS,
  BENCHMARKS,
  INITIATIVES,
  OPEN_QUESTIONS,
} from "@/lib/data/research-data";

interface SearchResult {
  id: string;
  type: "paper" | "project" | "lab" | "researcher" | "benchmark" | "initiative" | "question";
  typeLabel: string;
  title: string;
  subtitle: string;
  url: string;
  icon: React.ElementType;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Aggregate searchable items
  const allItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];
    OPEN_QUESTIONS.forEach((q) => {
      items.push({
        id: `question-${q.id}`,
        type: "question",
        typeLabel: "مسألة مفتوحة",
        title: q.title,
        subtitle: q.description,
        url: `/questions`,
        icon: HelpCircle,
      });
    });

    RESEARCH_PAPERS.forEach((p) => {
      items.push({
        id: `paper-${p.id}`,
        type: "paper",
        typeLabel: "ورقة بحثية",
        title: p.title,
        subtitle: p.titleEn || p.field,
        url: `/research/${p.slug}`,
        icon: BookOpen,
      });
    });

    RESEARCH_PROJECTS.forEach((p) => {
      items.push({
        id: `project-${p.id}`,
        type: "project",
        typeLabel: "مشروع تقني",
        title: p.title,
        subtitle: p.description,
        url: `/projects/${p.slug}`,
        icon: FolderGit2,
      });
    });

    RESEARCH_LABS.forEach((l) => {
      items.push({
        id: `lab-${l.id}`,
        type: "lab",
        typeLabel: "مختبر بحثي",
        title: l.name,
        subtitle: l.nameEn || l.description,
        url: `/labs/${l.slug}`,
        icon: Cpu,
      });
    });

    RESEARCHERS.forEach((r) => {
      items.push({
        id: `researcher-${r.id}`,
        type: "researcher",
        typeLabel: "باحث / عالم",
        title: r.name,
        subtitle: r.role,
        url: `/researchers/${r.slug}`,
        icon: Users,
      });
    });

    BENCHMARKS.forEach((b) => {
      items.push({
        id: `benchmark-${b.id}`,
        type: "benchmark",
        typeLabel: "معيار قياس",
        title: b.name,
        subtitle: `${b.metricName}: JEMO (${b.jemoScore}) vs SOTA (${b.sotaScore})`,
        url: "/benchmarks",
        icon: Trophy,
      });
    });

    INITIATIVES.forEach((i) => {
      items.push({
        id: `initiative-${i.id}`,
        type: "initiative",
        typeLabel: "مبادرة وطنية",
        title: i.title,
        subtitle: i.description,
        url: `/initiatives/${i.slug}`,
        icon: Sparkles,
      });
    });

    return items;
  }, []);

  // Filtered results
  const results = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 8);
    const q = query.toLowerCase().trim();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.typeLabel.toLowerCase().includes(q)
      )
      .slice(0, 10);
  }, [allItems, query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keydown shortcuts: Cmd+K / Ctrl+K, Escape, Arrow keys, Enter
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const navigateTo = useCallback(
    (url: string) => {
      setIsOpen(false);
      setQuery("");
      router.push(url);
    },
    [router]
  );

  const handleKeyDownInInput = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      navigateTo(results[selectedIndex].url);
    }
  };

  return (
    <>
      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-3 sm:pt-20 px-2.5 sm:px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-[var(--bg)] border border-[var(--line)] rounded-2xl shadow-2xl overflow-hidden z-10 font-sans max-h-[85vh] flex flex-col">
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)] bg-[var(--surface)]">
              <Search className="w-5 h-5 text-[var(--brand)] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="ابحث عن أوراق، مشاريع، مختبرات، أو معايير قياس..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDownInInput}
                className="w-full bg-transparent text-sm text-[var(--ink-1)] placeholder-[var(--ink-2)] outline-none font-sans"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-[var(--ink-2)] hover:text-[var(--ink-1)] text-xs"
                >
                  مسح
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-[var(--ink-2)] hover:text-[var(--ink-1)] hover:bg-[var(--bg)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Container */}
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {results.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--ink-2)] font-mono">
                  لم يتم العثور على نتائج تطابق &quot;{query}&quot;
                </div>
              ) : (
                results.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigateTo(item.url)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[var(--brand)]/10 border border-[var(--brand)]/30 text-[var(--ink-1)]"
                          : "hover:bg-[var(--surface)] text-[var(--ink-2)]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-[var(--brand)] text-white" : "bg-[var(--surface-2)] text-[var(--brand)]"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--ink-1)] truncate">
                              {item.title}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--surface-2)] border border-[var(--line)] text-[var(--brand)] shrink-0">
                              {item.typeLabel}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--ink-2)] truncate mt-0.5">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--brand)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="px-4 py-2.5 bg-[var(--surface)] border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono text-[var(--ink-2)]">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1 bg-[var(--bg)] border border-[var(--line)] rounded">↑↓</kbd> للتنقل</span>
                <span><kbd className="px-1 bg-[var(--bg)] border border-[var(--line)] rounded">Enter</kbd> للاختيار</span>
                <span><kbd className="px-1 bg-[var(--bg)] border border-[var(--line)] rounded">Esc</kbd> للإغلاق</span>
              </div>
              <div className="flex items-center gap-1 text-[var(--brand)]">
                <Command className="w-3 h-3" />
                <span>JEMO LABS Engine</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
