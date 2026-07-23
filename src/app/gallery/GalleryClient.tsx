"use client";

import { useState, useRef, useEffect } from "react";
import {
  BookOpen, BarChart2, FlaskConical, Video, Tv,
  Palette, Terminal, Smartphone, FolderOpen,
  Search, X, ArrowUpRight, ChevronRight, Sparkles, Filter,
  LayoutGrid, List, Share2, Check, Star, SlidersHorizontal
} from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import GlowingBorder from "@/components/GlowingBorder";
import MagneticCard from "@/components/MagneticCard";

gsap.registerPlugin(ScrollTrigger);

interface GalleryItem {
  id: string;
  category: "books" | "research" | "youtube" | "design" | "code";
  title: string;
  meta: string;
  description: string;
  icon: React.ReactNode;
  tags?: string[];
  status?: string;
  featured?: boolean;
}

const ITEMS: GalleryItem[] = [
  {
    id: "research-1",
    category: "research",
    title: "عوامل الاستعداد للتطور المهني لدى الشباب العراقي",
    meta: "بحث علمي — 2026",
    description: "ورقة بحثية ميدانية تهدف لتحليل العوامل الاستباقية في اكتساب المهارات التقنية الحديثة لدى الشباب. نكسر بها نمط التفكير السائد ونقدم بيانات غير مسبوقة.",
    icon: <BarChart2 size={24} />,
    tags: ["تحليل بيانات", "سوق العمل", "الشباب العراقي"],
    status: "قيد التحليل",
    featured: true,
  },
  {
    id: "code-1",
    category: "code",
    title: "نظام إدارة الفرق والقبولات",
    meta: "منصة داخلية — 2026",
    description: "منظومة إلكترونية متكاملة للتقديم والمراجعة التلقائية وتوليد عقود الانضمام وبوتات التليجرام، مبنية بأحدث معايير الأمان والأداء.",
    icon: <Terminal size={24} />,
    tags: ["Next.js", "Supabase", "Telegram API"],
    status: "مكتمل",
    featured: true,
  },
  {
    id: "design-1",
    category: "design",
    title: "هوية jemo البصرية",
    meta: "هوية متكاملة — 2026",
    description: "النظام البصري الكامل للفرع البحثي بما يشمل الخطوط، الألوان، وأنماط الويب الدقيقة التي تعكس هيمنتنا ورؤيتنا للمستقبل.",
    icon: <Palette size={24} />,
    tags: ["نظم التصميم", "هوية بصرية", "UI/UX"],
    status: "نشط",
  },
  {
    id: "yt-1",
    category: "youtube",
    title: "سلسلة وراء الكواليس",
    meta: "وثائقي — 2026",
    description: "وثائقيات قصيرة توثق كواليس الأبحاث والمشاريع والتطوير البرمجي داخل jemo labs، ننقل من خلالها حقيقة العمل الشاق والابتكار.",
    icon: <Tv size={24} />,
    tags: ["محتوى مرئي", "كواليس الأبحاث", "صناعة المحتوى"],
    status: "قيد الإنتاج",
  },
  {
    id: "book-1",
    category: "books",
    title: "أساسيات العمل الجماعي",
    meta: "منشور — 2026",
    description: "دليل إرشادي شامل يغطي مفاهيم توزيع المهام واستقلالية الفرق بروح واحدة داخل المنظومة الرقمية لضمان إنتاجية لا تُقهر.",
    icon: <BookOpen size={24} />,
    tags: ["إدارة الفرق", "دليل إرشادي", "منشورات"],
    status: "منشور",
  },
  {
    id: "code-2",
    category: "code",
    title: "تطبيق إشعارات الفريق",
    meta: "تطبيق خارجي — 2026",
    description: "تطبيق للهواتف المحمولة يتيح متابعة التحديثات البحثية والمهام الموزعة فورياً. نضع من خلاله مركز العمليات في جيب كل فرد.",
    icon: <Smartphone size={24} />,
    tags: ["React Native", "إشعارات فورية", "تطبيقات المحمول"],
    status: "قيد التطوير",
  },
];

const CATEGORIES = [
  { id: "all", label: "الكل", icon: <FolderOpen size={16} /> },
  { id: "research", label: "أبحاث علمية", icon: <FlaskConical size={16} /> },
  { id: "code", label: "مشاريع برمجية", icon: <Terminal size={16} /> },
  { id: "design", label: "تصميم وهوية", icon: <Palette size={16} /> },
  { id: "youtube", label: "محتوى مرئي", icon: <Video size={16} /> },
  { id: "books", label: "منشورات", icon: <BookOpen size={16} /> },
];

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "نشط":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </span>
      );
    case "مكتمل":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          {status}
        </span>
      );
    case "منشور":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-teal-500/10 text-teal-600 border border-teal-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
          {status}
        </span>
      );
    case "قيد التحليل":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          {status}
        </span>
      );
    case "قيد الإنتاج":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          {status}
        </span>
      );
    case "قيد التطوير":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-[var(--surface-2)] text-[var(--ink-2)] border border-[var(--line)]">
          {status}
        </span>
      );
  }
};

export default function GalleryClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "title">("newest");
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" || (e.key === "k" && (e.metaKey || e.ctrlKey))) && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const itemParam = params.get("item");
    const catParam = params.get("cat");
    const qParam = params.get("q");

    if (itemParam) {
      const found = ITEMS.find((it) => it.id === itemParam);
      if (found) setSelectedItem(found);
    }
    if (catParam && CATEGORIES.some((c) => c.id === catParam)) {
      setSelectedCat(catParam);
    }
    if (qParam) {
      setSearch(qParam);
    }
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;

    gsap.from(".gallery-header", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.1,
    });
  }, { scope: containerRef });

  const getItemCount = (catId: string) => {
    if (catId === "all") return ITEMS.length;
    return ITEMS.filter((item) => item.category === catId).length;
  };

  const filteredItems = ITEMS.filter((item) => {
    const matchesCat = selectedCat === "all" || item.category === selectedCat;
    const searchLower = search.trim().toLowerCase();
    const matchesSearch =
      !searchLower ||
      item.title.toLowerCase().includes(searchLower) ||
      item.meta.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(searchLower)));
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "title") return a.title.localeCompare(b.title, "ar");
    return 0;
  });

  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    setSearch(tag);
  };

  const handleShare = (item: GalleryItem) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/gallery?item=${item.id}`);
      setCopied(true);
      setToastMsg(`تم نسخ رابط "${item.title}" إلى الحافظة!`);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative bg-[var(--bg)] min-h-screen pb-32 text-[var(--ink)]"
    >
      {/* Background Decor Ambient Glows */}
      <div className="absolute top-12 right-[12%] w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)" }} />
      <div className="absolute top-48 left-[5%] w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(56, 189, 248, 0.06) 0%, transparent 70%)" }} />

      {/* 1. HERO SECTION */}
      <section className="relative pt-[140px] md:pt-[180px] pb-12 px-6 z-10 max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <div className="gallery-header inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 text-[var(--brand-700)] text-xs font-mono mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            <span className="font-semibold tracking-wider">THE ARSENAL • الأرشيف التفاعلي</span>
          </div>
          <h1 className="gallery-header text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--ink)] mb-6 leading-[1.15]">
            الأعمال <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand)] via-sky-500 to-[var(--brand-700)] italic">والمنشورات</span>
          </h1>
          <p className="gallery-header text-base md:text-xl text-[var(--ink-2)] max-w-2xl leading-relaxed font-normal">
            مستودع الإنجازات والأبحاث. هنا نوثق هيمنتنا التقنية والعلمية بمنتجات وأوراق بحثية تغير قواعد اللعبة.
          </p>
          <div className="gallery-header flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-[var(--line)]/60 text-xs font-mono text-[var(--ink-2)]">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[var(--brand)]" />
              <span><strong>6</strong> أبحاث ومشاريع</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
            <div className="flex items-center gap-2">
              <Check size={14} className="text-[var(--ok)]" />
              <span>100% شفافية ومصدر مفتوح</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[var(--line)]" />
            <div className="flex items-center gap-2">
              <Star size={14} className="text-[var(--brand)]" />
              <span>تحديثات مستمرة 2026</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="gallery-header w-full md:w-80 relative">
          <div className="relative flex items-center w-full h-12 rounded-2xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/20 transition-all shadow-xs">
            <div className="ps-4 pe-2 text-[var(--brand)]">
              <Search size={18} />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="ابحث في الأرشيف... (/)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-full bg-transparent border-none outline-none text-[var(--ink)] placeholder-[var(--ink-2)]/60 text-sm px-2 font-medium"
              dir="rtl"
            />
            {!search && (
              <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono rounded bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ink-2)] me-2 select-none">
                ⌘K
              </kbd>
            )}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="p-1.5 text-[var(--ink-2)] hover:text-[var(--ink)] me-2 rounded-full hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTERS & CONTROLS */}
      <section className="relative px-6 z-10 max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const count = getItemCount(cat.id);
              const isSelected = selectedCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold flex items-center gap-2 transition-colors duration-200 cursor-pointer overflow-hidden border ${
                    isSelected
                      ? "text-white border-[var(--brand)] shadow-md shadow-[var(--brand)]/20"
                      : "bg-[var(--surface)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brand)]/40 hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[var(--brand)] z-0 rounded-xl"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {cat.icon}
                    {cat.label}
                  </span>
                  <span
                    className={`relative z-10 text-[11px] font-mono px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white font-bold"
                        : "bg-[var(--bg)] text-[var(--ink-2)] border border-[var(--line)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode & Sort Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Sort selector */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)] shadow-xs">
              <SlidersHorizontal size={14} className="text-[var(--brand)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "title")}
                className="bg-transparent border-none outline-none text-[var(--ink)] text-xs font-semibold cursor-pointer"
              >
                <option value="newest" className="bg-[var(--surface)] text-[var(--ink)]">الأحدث</option>
                <option value="title" className="bg-[var(--surface)] text-[var(--ink)]">الأبجدي</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-[var(--surface)] border border-[var(--line)] shadow-xs">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-[var(--bg)] text-[var(--brand)] shadow-xs font-bold"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-[var(--bg)] text-[var(--brand)] shadow-xs font-bold"
                    : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Counter Info */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[var(--ink-2)] border-t border-[var(--line)]/80 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 text-[var(--ink)] font-medium">
              <Filter size={14} className="text-[var(--brand)]" />
              عرض <strong className="text-[var(--brand-700)] font-bold text-sm">{filteredItems.length}</strong> من أصل {ITEMS.length} نتاجات
            </span>

            {selectedCat !== "all" && (
              <span className="px-2.5 py-1 rounded-md bg-[var(--brand)]/10 text-[var(--brand-700)] border border-[var(--brand)]/20 font-sans font-semibold text-[11px] flex items-center gap-1">
                القسم: {CATEGORIES.find((c) => c.id === selectedCat)?.label}
                <button onClick={() => setSelectedCat("all")} className="hover:text-[var(--ink)] ms-1 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {search && (
              <span className="px-2.5 py-1 rounded-md bg-[var(--brand)]/10 text-[var(--brand-700)] border border-[var(--brand)]/20 font-sans font-semibold text-[11px] flex items-center gap-1">
                البحث: "{search}"
                <button onClick={() => setSearch("")} className="hover:text-[var(--ink)] ms-1 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>

          {(selectedCat !== "all" || search !== "") && (
            <button
              onClick={() => {
                setSelectedCat("all");
                setSearch("");
              }}
              className="text-xs font-sans text-[var(--brand)] hover:text-[var(--ink)] font-semibold underline underline-offset-2 transition-colors ms-auto sm:ms-0 cursor-pointer"
            >
              إلغاء جميع الفلاتر
            </button>
          )}
        </div>
      </section>

      {/* 3. GRID / LIST DISPLAY */}
      <section className="relative px-6 z-10 max-w-6xl mx-auto min-h-[40vh]">
        {filteredItems.length === 0 ? (
          <div className="w-full py-20 px-6 flex flex-col items-center justify-center text-center border border-[var(--line)] rounded-3xl bg-[var(--surface)] shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-2">لا توجد نتائج تطابق بحثك</h3>
            <p className="text-sm text-[var(--ink-2)] max-w-md mb-6 leading-relaxed">
              لم نعثر على أي عنصر يطابق "{search}". جرب استخدام كلمات مفتاحية أخرى أو تصفح التوصيات أدناه.
            </p>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {["Next.js", "تحليل بيانات", "هوية بصرية", "إدارة الفرق", "وثائقي"].map((suggested, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearch(suggested)}
                  className="px-3 py-1.5 text-xs rounded-xl bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-all font-mono cursor-pointer"
                >
                  #{suggested}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSelectedCat("all");
                setSearch("");
              }}
              className="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-semibold text-xs shadow-md hover:bg-[var(--brand-700)] transition-all cursor-pointer"
            >
              إعادة ضبط جميع الفلاتر
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "flex flex-col gap-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.93, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.93, y: -15 }}
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="h-full"
                >
                  <MagneticCard className="h-full">
                    <GlowingBorder className="h-full">
                      <div
                        className={`group cursor-pointer relative rounded-2xl p-7 flex flex-col justify-between h-full transition-all duration-300 ${
                          viewMode === "list" ? "sm:flex-row sm:items-center" : ""
                        }`}
                      >
                        {/* Header Row */}
                        <div
                          className={
                            viewMode === "grid"
                              ? "flex items-start justify-between mb-6 relative z-10"
                              : "flex items-center gap-4 relative z-10"
                          }
                        >
                          <div className="w-13 h-13 p-3 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] group-hover:scale-105 group-hover:bg-[var(--brand)] group-hover:text-white transition-all duration-300 shrink-0 shadow-xs">
                            {item.icon}
                          </div>

                          {viewMode === "list" && (
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-mono text-[var(--brand)]">{item.meta}</span>
                                {item.featured && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 flex items-center gap-1">
                                    <Star size={10} /> متميز
                                  </span>
                                )}
                              </div>
                              <h3 className="text-lg font-bold text-[var(--ink)] group-hover:text-[var(--brand)] transition-colors truncate">
                                {item.title}
                              </h3>
                            </div>
                          )}

                          {viewMode === "grid" && (
                            <div className="flex items-center gap-2">
                              {item.featured && (
                                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 flex items-center gap-1 font-semibold">
                                  <Star size={10} /> متميز
                                </span>
                              )}
                              {item.status && getStatusBadge(item.status)}
                              <div className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center bg-[var(--surface)] text-[var(--ink-2)] group-hover:text-[var(--brand)] group-hover:border-[var(--brand)]/40 group-hover:bg-[var(--brand)]/5 transition-all shadow-xs">
                                <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Body Content (Grid Mode) */}
                        {viewMode === "grid" && (
                          <div className="relative z-10 mt-auto flex flex-col gap-2">
                            <div className="text-xs font-mono text-[var(--brand-700)] tracking-wider uppercase font-semibold">
                              {item.meta}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--ink)] leading-snug group-hover:text-[var(--brand)] transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-[var(--ink-2)] text-sm leading-relaxed line-clamp-2 mt-1 font-normal">
                              {item.description}
                            </p>

                            {item.tags && (
                              <div className="flex flex-wrap gap-1.5 pt-3">
                                {item.tags.map((tag, i) => (
                                  <button
                                    key={i}
                                    onClick={(e) => handleTagClick(e, tag)}
                                    className="text-[11px] px-2.5 py-1 rounded-lg bg-[var(--surface-2)] text-[var(--ink-2)] border border-[var(--line)] font-mono font-medium hover:border-[var(--brand)] hover:text-[var(--brand)] hover:bg-[var(--brand)]/5 transition-all cursor-pointer"
                                  >
                                    #{tag}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Body Content (List Mode End Section) */}
                        {viewMode === "list" && (
                          <div className="flex items-center gap-4 shrink-0 sm:ms-auto">
                            {item.status && getStatusBadge(item.status)}
                            <div className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center bg-[var(--surface)] text-[var(--ink-2)] group-hover:text-[var(--brand)] group-hover:border-[var(--brand)]/40 group-hover:bg-[var(--brand)]/5 transition-all shadow-xs">
                              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                          </div>
                        )}
                      </div>
                    </GlowingBorder>
                  </MagneticCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* 4. MODAL DETAIL */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-[var(--ink)] z-10"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-5 left-5 w-10 h-10 rounded-full bg-[var(--bg)] border border-[var(--line)] flex items-center justify-center text-[var(--ink-2)] hover:text-[var(--ink)] transition-colors z-20 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="relative z-10 flex flex-col gap-5 pt-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] shadow-sm shrink-0">
                    {selectedItem.icon}
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/10 text-[var(--brand-700)] text-xs font-mono mb-1 font-semibold">
                      {selectedItem.meta}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[var(--ink)] leading-tight">
                      {selectedItem.title}
                    </h2>
                  </div>
                </div>

                <p className="text-[var(--ink-2)] text-base leading-relaxed">
                  {selectedItem.description}
                </p>

                {/* Tags */}
                {selectedItem.tags && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--line)]">
                    {selectedItem.tags.map((tag, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          handleTagClick(e, tag);
                          setSelectedItem(null);
                        }}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--brand)] hover:text-[var(--brand)] flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Sparkles size={12} className="text-[var(--brand)]" />
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* Actions Row */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white bg-[var(--brand)] hover:bg-[var(--brand-700)] rounded-xl transition-all shadow-md text-sm cursor-pointer"
                  >
                    <span>إغلاق التفاصيل</span>
                    <ChevronRight size={18} />
                  </button>

                  <button
                    onClick={() => handleShare(selectedItem)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 font-semibold text-[var(--ink-2)] hover:text-[var(--ink)] bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)]/40 rounded-xl transition-all text-sm cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={16} className="text-[var(--ok)]" />
                        <span>تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Share2 size={16} />
                        <span>مشاركة</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Related Items Preview */}
                {(() => {
                  const related = ITEMS.filter(
                    (it) => it.category === selectedItem.category && it.id !== selectedItem.id
                  ).slice(0, 2);
                  if (related.length === 0) return null;
                  return (
                    <div className="pt-4 border-t border-[var(--line)]">
                      <h4 className="text-xs font-mono text-[var(--brand-700)] uppercase font-semibold mb-3">
                        مشاريع ذات صلة في نفس القسم
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {related.map((rel) => (
                          <div
                            key={rel.id}
                            onClick={() => setSelectedItem(rel)}
                            className="p-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] hover:border-[var(--brand)]/40 transition-all cursor-pointer flex items-center gap-3 group"
                          >
                            <div className="p-2.5 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] group-hover:scale-105 transition-transform shrink-0">
                              {rel.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[var(--ink)] truncate group-hover:text-[var(--brand)] transition-colors">
                                {rel.title}
                              </div>
                              <div className="text-[10px] font-mono text-[var(--ink-2)] truncate mt-0.5">
                                {rel.meta}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-6 z-[200] px-4 py-3 rounded-2xl bg-[var(--ink)] text-[var(--bg)] text-xs font-semibold flex items-center gap-2.5 shadow-2xl border border-white/10"
          >
            <Check size={16} className="text-emerald-400" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
