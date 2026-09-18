"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  BookOpen,
  Rss,
  Terminal,
  Cpu,
  CheckCircle2,
  Search,
  Check,
  Copy,
  Flame,
  Users,
  Code,
  BarChart3,
  X,
  FileText,
  Quote,
  Home,
  FlaskConical,
  MessageSquare,
  Bookmark,
  TrendingUp,
  Hash,
  Sparkles,
  Send,
  Heart,
  Clock,
  Share2,
  Printer,
  Link2,
} from "lucide-react";
import {
  ISSUES,
  BENCHMARKS,
  CATEGORIES,
  TOPICS_AVAILABLE,
  CONTRIBUTING_LABS,
  TESTIMONIALS,
  getRelatedIssues,
  type Issue,
} from "@/lib/dispatch-data";
import { getInitials, parseIssueNumber } from "@/lib/dispatch-data";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية", icon: Home, active: false },
  { href: "#archive", label: "الأرشيف", icon: BookOpen, active: true },
  { href: "/labs", label: "المختبرات", icon: FlaskConical, active: false },
  { href: "/research", label: "الأبحاث", icon: FileText, active: false },
  { href: "/open-source", label: "مفتوح المصدر", icon: Code, active: false },
  { href: "/contact", label: "تواصل", icon: Send, active: false },
];

const TABS = [
  { id: "relevant", label: "مميز" },
  { id: "latest", label: "الأحدث" },
  { id: "top", label: "الأعلى قراءة" },
] as const;

type SortTab = (typeof TABS)[number]["id"];

const isSortTab = (v: string | null): v is SortTab => TABS.some((t) => t.id === v);
const isCategory = (v: string | null): v is string =>
  !!v && CATEGORIES.some((c) => c.id === v);

export default function NewsletterClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "النوى والأنظمة السيادية",
    "الذكاء الاصطناعي العربي",
  ]);
  const [format, setFormat] = useState<"html" | "markdown">("html");
  const [submitted, setSubmitted] = useState(false);
  // Filters initialised from URL so feed state is shareable (?tab=&cat=&q=&saved=1)
  const [activeCategory, setActiveCategory] = useState(() => {
    const c = searchParams.get("cat");
    return isCategory(c) ? (c as string) : "all";
  });
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [sortTab, setSortTab] = useState<SortTab>(() => {
    const t = searchParams.get("tab");
    return isSortTab(t) ? t : "relevant";
  });
  const [showSavedOnly, setShowSavedOnly] = useState(() => searchParams.get("saved") === "1");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedRss, setCopiedRss] = useState(false);
  const [copiedIssueLink, setCopiedIssueLink] = useState(false);
  const [activeTabCode, setActiveTabCode] = useState<"benchmark" | "config">("benchmark");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [modalProgress, setModalProgress] = useState(0);

  const openerRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Restore submission + bookmarks + likes, and deep-link (#issue-13) on load
  // hydration-safe: localStorage/location only exist on client, so restore must run in effect
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("jemo_newsletter_subscribed");
      if (saved) {
        setEmail(saved);
        setSubmitted(true);
      }
      const bookmarks = localStorage.getItem("jemo_dispatch_saved");
      if (bookmarks) setSavedIds(JSON.parse(bookmarks));
      const likes = localStorage.getItem("jemo_dispatch_liked");
      if (likes) setLikedIds(JSON.parse(likes));
    } catch {}
    const id = window.location.hash.replace("#", "");
    const found = ISSUES.find((i) => i.id === id);
    if (found) {
      openerRef.current = null;
      setSelectedIssue(found);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Follow back/forward navigation + shared #issue links while on page
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace("#", "");
      const found = ISSUES.find((i) => i.id === id);
      if (found) {
        openerRef.current = null;
        setSelectedIssue(found);
      } else if (!id) {
        setSelectedIssue(null);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Modal open: lock scroll, mark body for print CSS, move focus into dialog.
  // Fresh-issue reset (progress/scroll) handled by key={selectedIssue.id} remount below.
  useEffect(() => {
    document.body.style.overflow = selectedIssue ? "hidden" : "";
    document.body.classList.toggle("dispatch-modal-open", !!selectedIssue);
    if (selectedIssue) closeBtnRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("dispatch-modal-open");
    };
  }, [selectedIssue]);

  const pushQuery = (next: { tab: SortTab; cat: string; q: string; saved: boolean }) => {
    const p = new URLSearchParams();
    if (next.tab !== "relevant") p.set("tab", next.tab);
    if (next.cat !== "all") p.set("cat", next.cat);
    if (next.q.trim()) p.set("q", next.q.trim());
    if (next.saved) p.set("saved", "1");
    const qs = p.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const changeTab = (tab: SortTab) => {
    setSortTab(tab);
    pushQuery({ tab, cat: activeCategory, q: searchQuery, saved: showSavedOnly });
  };

  const changeCategory = (cat: string) => {
    setActiveCategory(cat);
    pushQuery({ tab: sortTab, cat, q: searchQuery, saved: showSavedOnly });
  };

  const changeSearch = (q: string) => {
    setSearchQuery(q);
    pushQuery({ tab: sortTab, cat: activeCategory, q, saved: showSavedOnly });
  };

  const toggleSavedOnly = () => {
    const next = !showSavedOnly;
    setShowSavedOnly(next);
    pushQuery({ tab: sortTab, cat: activeCategory, q: searchQuery, saved: next });
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setShowSavedOnly(false);
    pushQuery({ tab: sortTab, cat: "all", q: "", saved: false });
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      try {
        localStorage.setItem("jemo_dispatch_saved", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const toggleLiked = (id: string) => {
    setLikedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id];
      try {
        localStorage.setItem("jemo_dispatch_liked", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const likeCount = (issue: Issue) =>
    issue.reactions + (likedIds.includes(issue.id) ? 1 : 0);

  const handleSubscribe = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubmitted(true);
    try {
      localStorage.setItem("jemo_newsletter_subscribed", email);
    } catch {}
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyRss = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/rss.xml`);
      setCopiedRss(true);
      setTimeout(() => setCopiedRss(false), 2000);
    }
  };

  const issueUrl = (id: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.pathname}${window.location.search}#${id}`;
  };

  const absoluteIssueUrl = (id: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${issueUrl(id)}`;
  };

  const openIssue = (issue: Issue, opener?: HTMLElement | null) => {
    openerRef.current =
      opener ?? (typeof document !== "undefined" ? (document.activeElement as HTMLElement | null) : null);
    setSelectedIssue(issue);
    try {
      window.history.replaceState(null, "", issueUrl(issue.id));
    } catch {}
  };

  const closeIssue = (restoreFocus = true) => {
    setSelectedIssue(null);
    try {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    } catch {}
    if (restoreFocus) openerRef.current?.focus?.();
  };

  const handleCopyIssueLink = (issue: Issue) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(absoluteIssueUrl(issue.id));
      setCopiedIssueLink(true);
      setTimeout(() => setCopiedIssueLink(false), 2000);
    }
  };

  const shareIssue = async (issue: Issue) => {
    const url = absoluteIssueUrl(issue.id);
    const title = `${issue.number}: ${issue.title}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text: issue.summary, url });
        return;
      }
      throw new Error("no-web-share");
    } catch {
      try {
        await navigator.clipboard.writeText(`${title}\n${url}`);
        setCopiedIssueLink(true);
        setTimeout(() => setCopiedIssueLink(false), 2000);
      } catch {}
    }
  };

  const openExternalShare = (net: "x" | "linkedin", issue: Issue) => {
    const url = encodeURIComponent(absoluteIssueUrl(issue.id));
    const text = encodeURIComponent(`${issue.number}: ${issue.title}`);
    const href =
      net === "x"
        ? `https://twitter.com/intent/tweet?text=${text}&url=${url}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(href, "_blank", "noopener,width=600,height=540");
  };

  const handleCopyCitation = (issue: Issue) => {
    if (typeof window !== "undefined") {
      const citation = `@article{jemo_dispatch_${issue.id.replace("-", "_")},
  title = {${issue.title}},
  author = {${issue.leadAuthor}},
  journal = {JEMO LABS Research Dispatch},
  volume = {${issue.number}},
  year = {2026},
  url = {https://jemo.co/transparency#${issue.id}}
}`;
      navigator.clipboard.writeText(citation);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    }
  };

  // Lightweight focus trap: Tab cycles inside the modal, ESC closes it
  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      closeIssue();
      return;
    }
    if (e.key !== "Tab") return;
    const items = e.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleModalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    setModalProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
  };

  const filteredIssues = useMemo(() => {
    const filtered = ISSUES.filter((issue) => {
      const matchesCategory =
        activeCategory === "all" || issue.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        issue.title.includes(searchQuery) ||
        issue.summary.includes(searchQuery) ||
        issue.leadAuthor.includes(searchQuery) ||
        issue.takeaways.some((t) => t.includes(searchQuery));
      const matchesSaved = !showSavedOnly || savedIds.includes(issue.id);
      return matchesCategory && matchesSearch && matchesSaved;
    });
    const sorted = [...filtered];
    if (sortTab === "latest") {
      sorted.sort((a, b) => parseIssueNumber(b.number) - parseIssueNumber(a.number));
    } else if (sortTab === "top") {
      sorted.sort((a, b) => likeCount(a) - likeCount(b));
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, searchQuery, sortTab, showSavedOnly, savedIds, likedIds]);

  const tagCounts = useMemo(() => {
    const map: Record<string, number> = { all: ISSUES.length };
    for (const issue of ISSUES) {
      map[issue.category] = (map[issue.category] ?? 0) + 1;
    }
    return map;
  }, []);

  const trendingIssues = useMemo(
    () => [...ISSUES].sort((a, b) => b.reactions - a.reactions).slice(0, 5),
    []
  );

  const showFeaturedCover =
    sortTab === "relevant" &&
    activeCategory === "all" &&
    !searchQuery.trim() &&
    !showSavedOnly;

  const relatedIssues = selectedIssue ? getRelatedIssues(selectedIssue) : [];

  const renderLikeButton = (issue: Issue, inModal = false) => {
    const liked = likedIds.includes(issue.id);
    return (
      <button
        type="button"
        onClick={() => toggleLiked(issue.id)}
        aria-pressed={liked}
        aria-label={liked ? "إلغاء الإعجاب بالعدد" : "أعجبني العدد"}
        title={liked ? "إلغاء الإعجاب" : "أعجبني"}
        className={`inline-flex items-center gap-1 rounded-lg px-1.5 py-1 transition-colors cursor-pointer ${
          liked
            ? "text-red-600 font-bold"
            : inModal
              ? "hover:text-[var(--ink-1)]"
              : "hover:text-red-600"
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
        <span>{likeCount(issue)}</span>
      </button>
    );
  };

  const renderSaveButton = (issue: Issue) => {
    const isSaved = savedIds.includes(issue.id);
    return (
      <button
        type="button"
        onClick={() => toggleSaved(issue.id)}
        aria-pressed={isSaved}
        aria-label={isSaved ? "إزالة من المحفوظات" : "حفظ العدد"}
        title={isSaved ? "محفوظ" : "حفظ"}
        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
          isSaved
            ? "bg-[var(--accent-tint)] border-[var(--accent)] text-[var(--ink-1)]"
            : "border-[var(--line)] hover:text-[var(--ink-1)]"
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
      </button>
    );
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Print CSS: reader modal prints as a clean article, site chrome hidden */}
      <style>{`@media print {
  body.dispatch-modal-open header, body.dispatch-modal-open footer { display: none !important; }
  body.dispatch-modal-open [data-print-hide] { display: none !important; }
  [data-dispatch-modal] { position: static !important; background: #fff !important; padding: 0 !important; display: block !important; }
  [data-dispatch-modal-card] { box-shadow: none !important; border: none !important; max-height: none !important; overflow: visible !important; border-radius: 0 !important; }
}`}</style>

      {/* 1. Master Subscription Box — dev.to join-card pattern, full width on top */}
      <section
        id="subscribe"
        data-print-hide
        aria-label="الاشتراك في النشرة"
        className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs relative overflow-hidden"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]">
              <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>انضم إلى +4,850 باحثاً ومطوراً في الأكاديميا والمراكز البحثية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink-1)] tracking-tight">
              اشترك في إيداعات الأوراق والشفرات السيادية
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed max-w-xl mx-auto">
              تصلك تحليلات المختبرات مباشرة قبل النشر في المؤتمرات الدولية، بخصوصية تامة وبلا إعلانات.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs sm:text-sm space-y-3 text-center">
              <div className="flex items-center justify-center gap-2 font-bold text-base text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>أنت مشترك نشط في نشرة JEMO DISPATCH!</span>
              </div>
              <p className="text-xs text-emerald-700 font-mono">
                البريد المسجل: <span className="font-bold">{email}</span> • صيغة الاستلام:{" "}
                <span className="font-bold">{format.toUpperCase()}</span>
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    try {
                      localStorage.removeItem("jemo_newsletter_subscribed");
                    } catch {}
                  }}
                  className="text-xs underline text-emerald-800 hover:text-emerald-950 cursor-pointer font-mono"
                >
                  تعديل التفضيلات أو استخدام بريد آخر
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-5">
              {/* Topic Selector Pills */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-mono text-[var(--ink-2)] block">
                  اختر المحاور البحثية التي تهمك (تخصيص المحتوى):
                </span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {TOPICS_AVAILABLE.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        aria-pressed={isSelected}
                        className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? "bg-[var(--accent-tint)] text-[var(--ink-1)] border-[var(--accent)] font-bold shadow-xs"
                            : "bg-[var(--bg)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--accent)]"
                        }`}
                      >
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span>{topic}</span>
                          </span>
                        ) : (
                          <span>+ {topic}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Format Toggle Pill */}
              <div className="flex items-center justify-center gap-3 text-xs font-mono text-[var(--ink-2)]">
                <span>صيغة الاستلام:</span>
                <button
                  type="button"
                  onClick={() => setFormat("html")}
                  aria-pressed={format === "html"}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    format === "html"
                      ? "bg-[var(--ink-1)] text-[var(--surface)] border-[var(--ink-1)] font-bold"
                      : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
                  }`}
                >
                  نسخة HTML منسقة
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("markdown")}
                  aria-pressed={format === "markdown"}
                  className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                    format === "markdown"
                      ? "bg-[var(--ink-1)] text-[var(--surface)] border-[var(--ink-1)] font-bold"
                      : "bg-[var(--bg)] border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
                  }`}
                >
                  نسخة Markdown للمطورين
                </button>
              </div>

              {/* Input & CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-2.5 max-w-lg mx-auto p-1.5 bg-[var(--bg)] border border-[var(--line)] rounded-2xl shadow-xs focus-within:border-[var(--brand)] transition-colors">
                <div className="relative w-full flex items-center">
                  <Mail className="w-4 h-4 text-[var(--ink-2)] absolute right-4 pointer-events-none" />
                  <label htmlFor="newsletter-email" className="sr-only">
                    البريد الإلكتروني للاشتراك
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="أدخل بريدك الأكاديمي أو المؤسسي..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pr-11 pl-4 py-2.5 bg-transparent text-xs sm:text-sm text-[var(--ink-1)] placeholder-[var(--ink-2)] outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-[var(--ink-1)] hover:opacity-90 text-[var(--surface)] font-bold font-mono text-xs uppercase px-6 py-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <span>اشترك مجاناً</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[var(--ink-2)]">
                <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
                <span>خصوصية أكاديمية صارمة • رسالتان شهرياً كحد أقصى • إلغاء بنقرة واحدة</span>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* 2. DEV.to-style 3-column layout: nav rail / feed / right rail */}
      <div data-print-hide className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right rail in RTL = dev.to left sidebar (nav + tags). Placed first in DOM for RTL. */}
        <aside
          aria-label="تنقل النشرة والوسوم"
          className="order-3 lg:order-none lg:col-span-3 space-y-4 lg:sticky lg:top-24"
        >
          {/* Community intro card */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
            <h2 className="text-base font-extrabold text-[var(--ink-1)] leading-snug">
              JEMO DISPATCH مجتمع 4,850 باحثاً سيادياً
            </h2>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              مكان يشارك فيه الباحثون الأوراق المحكمة والشفرات المصدرية، ويبقون على اطلاع دون خوارزميات.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <a
                href="#subscribe"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-bold hover:opacity-90 transition-opacity"
              >
                <span>اشترك في النشرة</span>
              </a>
              <a
                href="/join"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors"
              >
                <span>انضم للمجتمع</span>
              </a>
            </div>
          </div>

          {/* Nav */}
          <nav
            aria-label="أقسام النشرة"
            className="p-2 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs"
          >
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono transition-colors ${
                      item.active
                        ? "bg-[var(--bg)] text-[var(--ink-1)] font-bold border border-[var(--line)]"
                        : "text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink-1)]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-2 pt-2 border-t border-[var(--line)] px-1 pb-1">
              <p className="px-2 py-1 text-[11px] font-mono font-bold text-[var(--ink-1)]">أخرى</p>
              <ul className="space-y-0.5 text-[11px] font-mono text-[var(--ink-2)]">
                <li>
                  <a href="/privacy" className="block px-2 py-1 hover:text-[var(--ink-1)]">
                    سياسة الخصوصية
                  </a>
                </li>
                <li>
                  <a href="/terms" className="block px-2 py-1 hover:text-[var(--ink-1)]">
                    الشروط والأحكام
                  </a>
                </li>
                <li>
                  <a href="/support" className="block px-2 py-1 hover:text-[var(--ink-1)]">
                    ادعم الاستقلال البحثي
                  </a>
                </li>
              </ul>
            </div>
          </nav>

          {/* Popular tags */}
          <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[var(--ink-1)] flex items-center gap-2">
              <Hash className="w-4 h-4 text-[var(--accent)]" />
              <span>الوسوم الشائعة</span>
            </h2>
            <ul className="space-y-1">
              {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => changeCategory(cat.id)}
                    aria-pressed={activeCategory === cat.id}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeCategory === cat.id
                        ? "bg-[var(--bg)] text-[var(--ink-1)] font-bold border border-[var(--line)]"
                        : "text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink-1)]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span className="text-[var(--accent)] font-bold">#</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-[10px] bg-[var(--bg)] border border-[var(--line)] rounded-md px-1.5 py-0.5">
                      {tagCounts[cat.id] ?? 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-[var(--line)] space-y-1">
              <p className="text-[11px] font-mono font-bold text-[var(--ink-1)]">محاور التخصيص</p>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS_AVAILABLE.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-2)]"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center feed — dev.to Posts column */}
        <div className="order-1 lg:order-none lg:col-span-6 space-y-4 min-w-0">
          <section id="archive" aria-label="أرشيف الأعداد" className="space-y-4">
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2.5">
                  <BookOpen className="w-5 h-5 text-[var(--accent)]" />
                  <span>أرشيف الأعداد السابقة (Dispatches Archive)</span>
                </h2>
                <p className="text-xs text-[var(--ink-2)] mt-1 font-mono">
                  {filteredIssues.length} من {ISSUES.length} إصدارات • تصفح الملخصات والأكواد والمنهجيات
                </p>
              </div>

              {/* Tabs + search like dev.to feed header */}
              <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div role="tablist" aria-label="ترتيب المنشورات" className="flex flex-wrap items-center gap-1">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        role="tab"
                        type="button"
                        aria-selected={sortTab === tab.id}
                        onClick={() => changeTab(tab.id)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          sortTab === tab.id
                            ? "bg-[var(--ink-1)] text-[var(--surface)] font-bold"
                            : "text-[var(--ink-2)] hover:bg-[var(--bg)] hover:text-[var(--ink-1)]"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={toggleSavedOnly}
                      aria-pressed={showSavedOnly}
                      title="عرض الأعداد المحفوظة فقط"
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                        showSavedOnly
                          ? "bg-[var(--accent-tint)] text-[var(--ink-1)] border-[var(--accent)] font-bold"
                          : "text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? "fill-current" : ""}`} />
                      <span>المحفوظات ({savedIds.length})</span>
                    </button>
                  </div>
                  <div className="relative w-full sm:w-64 flex items-center">
                    <Search className="w-3.5 h-3.5 text-[var(--ink-2)] absolute right-3 pointer-events-none" />
                    <label htmlFor="dispatch-search" className="sr-only">
                      ابحث في الأعداد
                    </label>
                    <input
                      id="dispatch-search"
                      type="search"
                      placeholder="ابحث بالعنوان، الكاتب، أو الموضوع..."
                      value={searchQuery}
                      onChange={(e) => changeSearch(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs text-[var(--ink-1)] placeholder-[var(--ink-2)] outline-none focus:border-[var(--brand)] transition-colors font-mono"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => changeCategory(cat.id)}
                      aria-pressed={activeCategory === cat.id}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors cursor-pointer border ${
                        activeCategory === cat.id
                          ? "bg-[var(--ink-1)] text-[var(--surface)] border-[var(--ink-1)] font-bold"
                          : "bg-[var(--bg)] text-[var(--ink-2)] border-[var(--line)] hover:border-[var(--brand)]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured cover card — dev.to cover-image post */}
            {showFeaturedCover && (
              <article
                aria-labelledby="featured-issue-title"
                className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs overflow-hidden"
              >
                <div className="h-28 sm:h-36 bg-[#162021] relative overflow-hidden" dir="ltr">
                  <div className="absolute inset-0 p-4 font-mono text-[11px] leading-relaxed text-[#cef79e]/90 overflow-hidden">
                    <p className="text-[#738284]">{"// JEMO DISPATCH #14 — Sovereign Inference Kernel"}</p>
                    <p>
                      <span className="text-[#a7e26e]">throughput</span>
                      <span className="text-white"> = 42.0 tps</span>
                      <span className="text-[#738284]"> {" // M3 Max 36GB"}</span>
                    </p>
                    <p>
                      <span className="text-[#a7e26e]">vram_saved</span>
                      <span className="text-amber-300"> = −38.4%</span>
                      <span className="text-[#738284]"> {" // vs vLLM"}</span>
                    </p>
                    <p>
                      <span className="text-[#a7e26e]">egress</span>
                      <span className="text-red-400"> = false</span>
                      <span className="text-emerald-400"> {" // zero-egress ✓"}</span>
                    </p>
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[#162021]">
                    العدد الحالي #14
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-9 h-9 rounded-full bg-[var(--ink-1)] text-[var(--surface)] grid place-items-center text-xs font-bold font-mono shrink-0"
                    >
                      {getInitials(ISSUES[0].leadAuthor)}
                    </span>
                    <div className="text-xs font-mono">
                      <div className="font-bold text-[var(--ink-1)]">{ISSUES[0].leadAuthor}</div>
                      <div className="text-[var(--ink-2)]">
                        {ISSUES[0].date} • {ISSUES[0].labName}
                      </div>
                    </div>
                  </div>
                  <h3
                    id="featured-issue-title"
                    className="text-lg sm:text-xl font-extrabold text-[var(--ink-1)] leading-snug"
                  >
                    <button
                      type="button"
                      onClick={(e) => openIssue(ISSUES[0], e.currentTarget)}
                      className="text-right hover:text-[var(--brand)] transition-colors cursor-pointer"
                    >
                      {ISSUES[0].title}
                    </button>
                  </h3>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                    <span className="text-[var(--ink-2)]">#{ISSUES[0].categoryLabel}</span>
                    <span className="text-[var(--ink-2)]">#{ISSUES[0].tag}</span>
                    <span className="text-[var(--ink-2)]">#نواة_سيادية</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-[11px] font-mono text-[var(--ink-2)]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      {renderLikeButton(ISSUES[0])}
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{ISSUES[0].comments} تعليقات</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ISSUES[0].readTime}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => openIssue(ISSUES[0], e.currentTarget)}
                      className="font-bold text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span>قراءة الملخص</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Feed cards */}
            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <article
                  key={issue.id}
                  aria-labelledby={`title-${issue.id}`}
                  className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs hover:border-[var(--brand)]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-8 h-8 rounded-full bg-[var(--bg)] border border-[var(--line)] grid place-items-center text-[11px] font-bold font-mono text-[var(--ink-1)] shrink-0"
                    >
                      {getInitials(issue.leadAuthor)}
                    </span>
                    <div className="text-xs font-mono min-w-0">
                      <div className="font-bold text-[var(--ink-1)] truncate">{issue.leadAuthor}</div>
                      <div className="text-[var(--ink-2)] truncate">
                        {issue.date} • {issue.number}
                      </div>
                    </div>
                    <span className="mr-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] shrink-0">
                      {issue.categoryLabel}
                    </span>
                  </div>

                  <h3
                    id={`title-${issue.id}`}
                    className="mt-3 text-base sm:text-lg font-bold text-[var(--ink-1)] leading-snug"
                  >
                    <button
                      type="button"
                      onClick={(e) => openIssue(issue, e.currentTarget)}
                      className="text-right hover:text-[var(--brand)] transition-colors cursor-pointer"
                    >
                      {issue.title}
                    </button>
                  </h3>

                  <p className="mt-1.5 text-xs text-[var(--ink-2)] leading-relaxed">{issue.summary}</p>

                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-mono text-[var(--ink-2)]">
                    <span>#{issue.categoryLabel}</span>
                    <span>#{issue.tag}</span>
                    <span className="hidden sm:inline">#{issue.labName.split(" ").slice(0, 2).join("_")}</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[var(--line)] flex items-center justify-between gap-2 text-[11px] font-mono text-[var(--ink-2)]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      {renderLikeButton(issue)}
                      <span className="inline-flex items-center gap-1" title="التعليقات">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{issue.comments}</span>
                      </span>
                      <span className="inline-flex items-center gap-1" title="زمن القراءة">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{issue.readTime}</span>
                      </span>
                      {issue.githubUrl && (
                        <a
                          href={issue.githubUrl}
                          className="hidden sm:inline-flex items-center gap-1 hover:text-[var(--ink-1)] transition-colors"
                        >
                          <Code className="w-3.5 h-3.5" />
                          <span>الكود</span>
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {renderSaveButton(issue)}
                      <button
                        type="button"
                        onClick={(e) => openIssue(issue, e.currentTarget)}
                        className="font-bold text-[var(--ink-1)] hover:text-[var(--accent)] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>قراءة الملخص</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredIssues.length === 0 && (
              <div
                role="status"
                className="text-center py-12 bg-[var(--surface)] rounded-2xl border border-[var(--line)] text-xs text-[var(--ink-2)] font-mono space-y-2"
              >
                <p>
                  {showSavedOnly && savedIds.length === 0
                    ? "لا توجد أعداد محفوظة بعد — احفظ ما يعجبك بالشارة."
                    : "لا توجد أعداد تطابق معايير البحث المحددة."}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="underline hover:text-[var(--ink-1)] cursor-pointer"
                >
                  إعادة ضبط الفلاتر
                </button>
              </div>
            )}

            {/* Benchmark visualizer — kept, now docked under feed like dev.to poll widget */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[var(--ink-1)] flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>مقارنة سرعة التوليد (Tokens/sec) — العدد #14</span>
                </span>
                <span className="text-[10px] text-[var(--ink-2)]">M3 Max 36GB</span>
              </div>
              <div className="space-y-2 text-xs font-mono">
                {BENCHMARKS.map((b) => (
                  <div key={b.runtime} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={b.isHero ? "font-bold text-[var(--ink-1)]" : "text-[var(--ink-2)]"}>
                        {b.runtime}
                      </span>
                      <span className={b.isHero ? "font-bold text-[var(--accent)]" : "text-[var(--ink-2)]"}>
                        {b.throughput.toFixed(1)} tps
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[var(--bg)] border border-[var(--line)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          b.isHero ? "bg-[var(--accent)]" : "bg-[var(--ink-2)]/40"
                        }`}
                        style={{ width: `${(b.throughput / 45.0) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full rounded-xl bg-[#162021] text-[#f7f7f5] border border-[#222f30] overflow-hidden font-mono text-xs" dir="ltr">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1516] border-b border-[#222f30]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] text-[#738284] ml-2">jemo-kernel-benchmark</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setActiveTabCode("benchmark")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        activeTabCode === "benchmark" ? "bg-[#222f30] text-[#a7e26e]" : "text-[#738284]"
                      }`}
                    >
                      benchmark.rs
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTabCode("config")}
                      className={`px-2 py-0.5 rounded text-[10px] cursor-pointer ${
                        activeTabCode === "config" ? "bg-[#222f30] text-[#a7e26e]" : "text-[#738284]"
                      }`}
                    >
                      kernel.toml
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-1.5 overflow-x-auto text-[11px] leading-relaxed">
                  {activeTabCode === "benchmark" ? (
                    <>
                      <p className="text-[#738284]">{"// JEMO Labs Dispatch #14 — Memory Benchmarks"}</p>
                      <p className="text-[#a7e26e]">
                        pub struct <span className="text-white">InferenceEngine</span> {"{"}
                      </p>
                      <p className="pl-4 text-[#cef79e]">
                        vram_allocated_mb: <span className="text-white">usize</span>,
                      </p>
                      <p className="pl-4 text-[#cef79e]">
                        throughput_tps: <span className="text-white">f32</span>,
                      </p>
                      <p className="pl-4 text-[#cef79e]">
                        zero_egress_enforced: <span className="text-white">bool</span>,
                      </p>
                      <p className="text-[#a7e26e]">{"}"}</p>
                      <p className="text-white">
                        assert!(engine.throughput_tps {">="} <span className="text-amber-300">42.0</span>);
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[#738284]">{"# Sovereign Kernel Runtime Config"}</p>
                      <p>
                        <span className="text-[#a7e26e]">quantization</span> ={" "}
                        <span className="text-amber-300">&quot;q4_k_m&quot;</span>
                      </p>
                      <p>
                        <span className="text-[#a7e26e]">memory_limit_mb</span> ={" "}
                        <span className="text-white">4096</span>
                      </p>
                      <p>
                        <span className="text-[#a7e26e]">telemetry_egress</span> ={" "}
                        <span className="text-red-400">false</span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Left rail in RTL = dev.to right sidebar (billboard / discuss / trending) */}
        <aside
          aria-label="رادار الأعداد والنقاشات"
          className="order-2 lg:order-none lg:col-span-3 space-y-4 lg:sticky lg:top-24"
        >
          {/* Upcoming radar — dev.to challenge billboard */}
          <div className="rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs overflow-hidden">
            <div className="h-20 bg-gradient-to-l from-[#162021] via-[#222f30] to-[#445e5f] relative">
              <div className="absolute inset-0 p-3 flex flex-col justify-end">
                <span className="text-[10px] font-mono text-[#a7e26e]">15 سبتمبر 2026 • العدد #15</span>
                <span className="text-xs font-bold text-white">تجزئة النماذج العصبية عبر الحوسبة المفتوحة</span>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-[11px] font-mono font-bold text-[var(--ink-1)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>رادار العدد القادم • سجّل ليصلك فور الصدور</span>
              </p>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">
                حلول تفادي اختناقات النطاق الترددي عند تقسيم نماذج MoE على عتاد محلي منخفض التكلفة.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="#subscribe"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-bold hover:opacity-90 transition-opacity"
                >
                  <span>اشترك ليصلك فور الصدور</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors"
                >
                  <span>اقترح فكرة للعدد القادم</span>
                </a>
              </div>
            </div>
          </div>

          {/* Discuss threads — dev.to #discuss */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[var(--ink-1)] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <span>#نقاشات_المجتمع</span>
            </h2>
            <ul className="space-y-0">
              {TESTIMONIALS.map((t, idx) => (
                <li key={idx} className="py-2.5 border-b border-[var(--line)] last:border-0 last:pb-0 first:pt-0">
                  <a href="#testimonials" className="block group">
                    <p className="text-xs text-[var(--ink-1)] leading-relaxed group-hover:text-[var(--brand)] transition-colors line-clamp-2">
                      {t.quote}
                    </p>
                    <p className="mt-1 text-[10px] font-mono text-[var(--ink-2)]">
                      {t.author} • {t.affiliation} • {[72, 15, 8][idx]} تعليقاً
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending — dev.to trending guides */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-[var(--ink-1)] flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[var(--accent)]" />
              <span>الأعداد الرائجة</span>
            </h2>
            <ul className="space-y-0">
              {trendingIssues.map((issue) => (
                <li key={issue.id} className="py-2 border-b border-[var(--line)] last:border-0 last:pb-0 first:pt-0">
                  <button
                    type="button"
                    onClick={(e) => openIssue(issue, e.currentTarget)}
                    className="block text-right w-full group cursor-pointer"
                  >
                    <span className="text-xs text-[var(--ink-1)] leading-relaxed group-hover:text-[var(--brand)] transition-colors line-clamp-2">
                      {issue.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-mono text-[var(--ink-2)]">
                      {issue.number} • {likeCount(issue)} إعجاب • {issue.readTime}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* RSS / GitHub — dev.to footer promo */}
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--ink-1)]">
              <Rss className="w-4 h-4 text-[var(--accent)]" />
              <span>خلاصات RSS والمستودعات</span>
            </div>
            <p className="text-xs text-[var(--ink-2)] leading-relaxed">
              تغذية RSS لكل عدد فور صدوره، مع الأكواد المصدرية في مستودعات مفتوحة.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleCopyRss}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono font-medium text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors cursor-pointer"
              >
                {copiedRss ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Rss className="w-3.5 h-3.5 text-[var(--accent)]" />
                )}
                <span>{copiedRss ? "تم نسخ رابط RSS" : "نسخ رابط RSS Feed"}</span>
              </button>
              <a
                href="/open-source"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-medium hover:opacity-90 transition-opacity"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>مستودعات GitHub</span>
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-mono text-[var(--ink-2)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedLink ? "تم نسخ رابط الصفحة" : "مشاركة الصفحة"}</span>
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* 5. Contributing Research Labs Grid */}
      <section data-print-hide aria-label="المختبرات المشاركة في التحرير" className="space-y-6">
        <div className="space-y-1 pb-3 border-b border-[var(--line)]">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)] flex items-center gap-2">
            <Users className="w-5 h-5 text-[var(--accent)]" />
            <span>المختبرات والهيئة العلمية المساهمة</span>
          </h2>
          <p className="text-xs text-[var(--ink-2)]">
            تصدر هذه النشرة دورياً بمساهمة الباحثين والمشرفين في المراكز البحثية التابعة لـ JEMO LABS.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONTRIBUTING_LABS.map((lab) => (
            <div
              key={lab.name}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-[var(--accent)] font-bold tracking-wider">
                  {lab.code}
                </span>
                <h3 className="text-sm font-bold text-[var(--ink-1)] leading-tight">{lab.name}</h3>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed">{lab.desc}</p>
              </div>
              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px] font-mono text-[var(--ink-2)]">
                <span>{lab.papersCount}</span>
                <Link href="/labs" className="hover:text-[var(--ink-1)] transition-colors flex items-center gap-1">
                  <span>زيارة المختبر</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Academic Endorsements & Community Testimonials */}
      <section data-print-hide id="testimonials" aria-label="شهادات الباحثين" className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--ink-1)]">
            ماذا يقول الباحثون والمهندسون عن النشرة؟
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-2)]">
            آراء من المجتمع العلمي والتقني حول دقة المحتوى وعمق الأرقام التجريبية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <Quote className="w-6 h-6 text-[var(--accent)]/60" />
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--line)] text-xs font-mono">
                <div className="font-bold text-[var(--ink-1)]">{t.author}</div>
                <div className="text-[11px] text-[var(--ink-2)]">{t.title}</div>
                <div className="text-[10px] text-[var(--accent)] font-semibold">{t.affiliation}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Open Access strip */}
      <section
        data-print-hide
        aria-label="قنوات الوصول المفتوح والخلاصات"
        className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
            <Sparkles className="w-4 h-4" />
            <span>وصول مفتوح بالكامل • بلا paywall</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--ink-1)]">
            كل الأعداد والأكواد والأوراق متاحة مجاناً للأبد
          </h3>
          <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
            اقرأ عبر الموقع، أو اشترك بالبريد، أو تابع RSS — المعرفة السيادية حق للجميع.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto">
          <a
            href="#subscribe"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink-1)] text-[var(--surface)] text-xs font-mono font-bold hover:opacity-90 transition-opacity"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>اشترك بالبريد</span>
          </a>
          <a
            href="/rss.xml"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-xs font-mono font-medium text-[var(--ink-1)] hover:bg-[var(--line)] transition-colors"
          >
            <Rss className="w-3.5 h-3.5" />
            <span>خلاصة RSS</span>
          </a>
        </div>
      </section>

      {/* 8. Interactive Dispatch Reader Modal */}
      {selectedIssue && (
        <div
          key={selectedIssue.id}
          role="dialog"
          aria-modal="true"
          aria-label={selectedIssue.title}
          data-dispatch-modal
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs"
          onClick={() => closeIssue()}
          onKeyDown={trapFocus}
        >
          <div
            ref={modalScrollRef}
            onScroll={handleModalScroll}
            data-dispatch-modal-card
            className="w-full max-w-2xl max-h-[85vh] bg-[var(--surface)] border border-[var(--line)] rounded-3xl shadow-2xl overflow-y-auto relative text-[var(--ink-1)]"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Reading progress */}
            <div
              className="sticky top-0 z-10 h-1 bg-[var(--bg)] print:hidden"
              role="progressbar"
              aria-label="تقدم القراءة"
              aria-valuenow={Math.round(modalProgress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-[var(--accent)] transition-[width] duration-150"
                style={{ width: `${modalProgress}%` }}
              />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[var(--line)]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-2)]">
                    <span className="font-bold text-[var(--ink-1)] bg-[var(--bg)] px-2 py-0.5 rounded border border-[var(--line)]">
                      {selectedIssue.number}
                    </span>
                    <span>•</span>
                    <span>{selectedIssue.date}</span>
                    <span>•</span>
                    <span className="text-[var(--accent)] font-semibold">{selectedIssue.categoryLabel}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold leading-tight">{selectedIssue.title}</h3>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => closeIssue()}
                  className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)] transition-colors cursor-pointer shrink-0 print:hidden"
                  aria-label="إغلاق النافذة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Author & Lab Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--ink-2)] p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)]">
                <span>
                  الباحث الرئيسي: <strong className="text-[var(--ink-1)]">{selectedIssue.leadAuthor}</strong>
                </span>
                <span>•</span>
                <span>
                  المختبر: <strong className="text-[var(--ink-1)]">{selectedIssue.labName}</strong>
                </span>
                <span>•</span>
                <span>
                  وقت القراءة: <strong className="text-[var(--ink-1)]">{selectedIssue.readTime}</strong>
                </span>
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold font-mono text-[var(--ink-1)] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[var(--accent)]" />
                  <span>الملخص التنفيذي والأهداف</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                  {selectedIssue.fullAbstract}
                </p>
              </div>

              {/* Methodology */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold font-mono text-[var(--ink-1)] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-[var(--accent)]" />
                  <span>المنهجية وبيئة القياس التجريبي</span>
                </h4>
                <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
                  {selectedIssue.methodology}
                </p>
              </div>

              {/* Key Findings */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold font-mono text-[var(--ink-1)]">النتائج والقياسات المستخلصة:</h4>
                <ul className="space-y-2 text-xs sm:text-sm text-[var(--ink-2)]">
                  {selectedIssue.takeaways.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engagement: likes, saves, share */}
              <div className="p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono print:hidden">
                {renderLikeButton(selectedIssue, true)}
                <span className="inline-flex items-center gap-1.5 text-[var(--ink-2)]">
                  {renderSaveButton(selectedIssue)}
                  <span>{savedIds.includes(selectedIssue.id) ? "محفوظ" : "حفظ"}</span>
                </span>
                <span className="mr-auto flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyIssueLink(selectedIssue)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                    title="نسخ رابط العدد المباشر"
                  >
                    {copiedIssueLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Link2 className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedIssueLink ? "تم النسخ" : "رابط العدد"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => shareIssue(selectedIssue)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                    title="مشاركة عبر النظام أو نسخ"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openExternalShare("x", selectedIssue)}
                    className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] font-bold hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                    title="مشاركة على X"
                  >
                    X
                  </button>
                  <button
                    type="button"
                    onClick={() => openExternalShare("linkedin", selectedIssue)}
                    className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] font-bold hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                    title="مشاركة على LinkedIn"
                  >
                    in
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                    title="طباعة العدد"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>طباعة</span>
                  </button>
                </span>
              </div>

              {/* Related issues */}
              {relatedIssues.length > 0 && (
                <div className="space-y-2 print:hidden">
                  <h4 className="text-sm font-bold font-mono text-[var(--ink-1)]">اقرأ أيضاً:</h4>
                  <ul className="space-y-1.5">
                    {relatedIssues.map((rel) => (
                      <li key={rel.id}>
                        <button
                          type="button"
                          onClick={(e) => openIssue(rel, e.currentTarget)}
                          className="w-full text-right p-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)] transition-colors cursor-pointer group"
                        >
                          <span className="block text-xs font-bold text-[var(--ink-1)] group-hover:text-[var(--brand)] leading-relaxed">
                            {rel.title}
                          </span>
                          <span className="mt-0.5 block text-[10px] font-mono text-[var(--ink-2)]">
                            {rel.number} • {rel.categoryLabel} • {rel.readTime}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions & Citation Button */}
              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono print:hidden">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyCitation(selectedIssue)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors cursor-pointer"
                  >
                    {copiedCitation ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Quote className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedCitation ? "تم نسخ توثيق BibTeX" : "نسخ توثيق BibTeX"}</span>
                  </button>
                  {selectedIssue.githubUrl && (
                    <a
                      href={selectedIssue.githubUrl}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] hover:text-[var(--ink-1)] transition-colors"
                    >
                      <Code className="w-3.5 h-3.5" />
                      <span>الكود المصدري</span>
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => closeIssue()}
                  className="px-4 py-2 rounded-lg bg-[var(--ink-1)] text-[var(--surface)] font-bold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
