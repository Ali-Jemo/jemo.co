"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowUpLeft,
  Search,
  ChevronDown,
  Cpu,
  Users,
  BookOpen,
  Mail,
  Server,
  GitBranch,
  History,
  Activity,
  HeartHandshake,
  Calendar,
  Building2,
  Sparkles,
  Info,
} from "lucide-react";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, type Variants } from "framer-motion";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });
import { useAuth } from "@/lib/auth-context";
import { Show } from "@clerk/nextjs";
import JemoUserButton from "@/components/JemoUserButton";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/research", label: "سجلات الاكتشاف" },
  { href: "/questions", label: "الأسئلة المفتوحة" },
  { href: "/projects", label: "المشاريع" },
  { href: "/labs", label: "المختبرات" },
];

export const ALL_PAGES = [
  { href: "/labs", label: "المختبرات", desc: "معالجات النواة والذكاء وRISC-V", icon: Cpu, group: "الأبحاث" },
  { href: "/researchers", label: "الباحثون", desc: "شبكة العقول والمساهمين", icon: Users, group: "الأبحاث" },
  { href: "/publications", label: "المنشورات", desc: "الأوراق المحكمة والتقارير", icon: BookOpen, group: "الأبحاث" },
  { href: "/newsletter", label: "النشرة الإخبارية", desc: "مستجدات الأبحاث الشهرية", icon: Mail, group: "الأبحاث" },
  { href: "/about", label: "عن المنصة", desc: "الرؤية، الرسالة، وميثاق السيادة", icon: Info, group: "الأبحاث" },
  { href: "/infrastructure", label: "البنية التحتية", desc: "خوادم H100 ومجموعات الحوسبة", icon: Server, group: "الأنظمة" },
  { href: "/open-source", label: "المصدر المفتوح", desc: "المستودعات والبرمجيات الحرة", icon: GitBranch, group: "الأنظمة" },
  { href: "/timeline", label: "الخط الزمني", desc: "أرشيف التطوير ومراحل النمو", icon: History, group: "الأنظمة" },
  { href: "/benchmarks", label: "المقارنات المرجعية", desc: "قياسات الأداء ونماذج التقييم", icon: Activity, group: "الأنظمة" },
  { href: "/support", label: "الدعم", desc: "تمويل أبحاث السيادة التقنية", icon: HeartHandshake, group: "المؤسسة" },
  { href: "/events", label: "الفعاليات", desc: "الندوات العلمية والهاكاثونات", icon: Calendar, group: "المؤسسة" },
  { href: "/partners", label: "الشركاء", desc: "الجامعات ومراكز الأبحاث", icon: Building2, group: "المؤسسة" },
  { href: "/contact", label: "تواصل معنا", desc: "قنوات الاتصال المباشرة بالمؤسس", icon: Sparkles, group: "المؤسسة" },
];

const ECOSYSTEM_CATEGORIES = [
  {
    name: "الأبحاث والمعرفة",
    items: ALL_PAGES.filter((p) => p.group === "الأبحاث"),
  },
  {
    name: "الأنظمة والعتاد",
    items: ALL_PAGES.filter((p) => p.group === "الأنظمة"),
  },
  {
    name: "المؤسسة والدعم",
    items: ALL_PAGES.filter((p) => p.group === "المؤسسة"),
  },
];

const mobileMenuContainerVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.035,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.16,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const mobileMenuItemVariants: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function Header() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreTimeout = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (exploreTimeout.current) window.clearTimeout(exploreTimeout.current);
    };
  }, []);

  const [mobileCategory, setMobileCategory] = useState<string>("all");

  // Magnetic CTA glow: radial highlight that tracks the pointer (Cohere-style)
  const ctaMx = useMotionValue(50);
  const ctaMy = useMotionValue(50);
  const ctaGlow = useMotionTemplate`radial-gradient(110px circle at ${ctaMx}% ${ctaMy}%, rgba(167, 226, 110, 0.30), transparent 75%)`;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const { profile, logout } = useAuth();

  // Fast outside click and Escape key listeners
  useEffect(() => {
    if (!exploreOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExploreOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [exploreOpen]);

  // Two-state directional scroll accumulator
  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let isHidden = false;
    let downAccum = 0;
    let upAccum = 0;

    let ticking = false;
    let rafId: number | null = null;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const diff = y - lastY;
        lastY = y;

        setScrolled(y > 20);

        if (mobileMenuOpen || y <= 64) {
          if (isHidden) {
            isHidden = false;
            setHidden(false);
          }
          downAccum = 0;
          upAccum = 0;
          ticking = false;
          return;
        }

        if (diff > 0) {
          upAccum = 0;
          if (!isHidden) {
            downAccum += diff;
            if (downAccum >= 30) {
              isHidden = true;
              setHidden(true);
              downAccum = 0;
            }
          }
        } else if (diff < 0) {
          downAccum = 0;
          if (isHidden) {
            upAccum += Math.abs(diff);
            if (upAccum >= 25) {
              isHidden = false;
              setHidden(false);
              upAccum = 0;
            }
          }
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mobileMenuOpen]);

  // Close menus whenever the route changes — computed during render
  // (React's "adjusting state when a variable changes" pattern, no effect needed)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setExploreOpen(false);
  }

  const isTransparent = isHome && !scrolled;
  const isDark = isTransparent || mobileMenuOpen;

  return (
    <>
      <CommandPalette />

      <header
        className={`fixed top-0 z-50 w-full transition-[transform,background-color,color] duration-300 ease-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          mobileMenuOpen
            ? "border-b border-white/10 bg-[#0c1415] text-white shadow-2xl"
            : scrolled
            ? "border-b border-[#e4e3e3] bg-[#f7f7f5]/96 backdrop-blur-md shadow-xs text-[#222f30]"
            : isTransparent
            ? "border-b border-white/10 bg-[#0c1415]/85 backdrop-blur-md text-white"
            : "border-b border-[#e4e3e3]/80 bg-[#f7f7f5]/90 backdrop-blur-md text-[#222f30]"
        }`}
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
        {/* Cohere-style gradual masked backdrop blur curtain */}
        <div
          tabIndex={-1}
          aria-hidden="true"
          className={`fixed inset-x-0 top-0 z-40 pointer-events-none min-h-screen w-full bg-black/20 backdrop-blur-lg transition-[opacity,visibility] duration-300 ease-in-out ${
            exploreOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
            contain: "strict",
            willChange: "opacity",
          }}
        />

        <div dir="rtl" className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          
          {/* 1. Right side (in RTL): Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 group"
              aria-label="JEMO LABS الرئيسية"
            >
              <motion.div
                className="relative w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-105 group-hover:-rotate-1"
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              >
                <Image
                  src="/jemo-logo.svg"
                  alt="JEMO LABS"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className={`text-base font-black tracking-tight transition-colors ${isDark ? "text-white" : "text-[#222f30]"} group-hover:underline`}>
                  jemo
                </span>
                <span className={`text-base font-bold tracking-tight transition-colors ${isDark ? "text-white/90" : "text-[#445e5f]"}`}>
                  labs
                </span>
              </div>
            </Link>
          </div>

          {/* 2. Center: Clean, Non-crowded Navigation Dock with Instant Explore Menu */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group/nav relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 overflow-hidden ${
                    isActive
                      ? isTransparent
                        ? "bg-white/20 text-white font-bold shadow-xs"
                        : "bg-[#222f30] text-white font-bold shadow-xs"
                      : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-[#445e5f] hover:text-[#222f30] hover:bg-black/[0.04]"
                  }`}
                >
                  <span className="relative inline-block overflow-hidden">
                    <span className="block transition-transform duration-300 ease-out group-hover/nav:-translate-y-full group-focus-visible/nav:-translate-y-full motion-reduce:transform-none">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 top-0 block transition-transform duration-300 ease-out translate-y-[115%] group-hover/nav:translate-y-0 group-focus-visible/nav:translate-y-0 motion-reduce:translate-y-0 font-bold"
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}

            {/* Seamless Explore Trigger */}
            <div
              ref={exploreRef}
              className="relative ms-1"
              onMouseEnter={() => {
                if (exploreTimeout.current) {
                  window.clearTimeout(exploreTimeout.current);
                  exploreTimeout.current = null;
                }
                setExploreOpen(true);
              }}
              onMouseLeave={() => {
                if (exploreTimeout.current) window.clearTimeout(exploreTimeout.current);
                exploreTimeout.current = window.setTimeout(() => setExploreOpen(false), 120);
              }}
              onFocus={() => {
                if (exploreTimeout.current) {
                  window.clearTimeout(exploreTimeout.current);
                  exploreTimeout.current = null;
                }
                setExploreOpen(true);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  if (exploreTimeout.current) window.clearTimeout(exploreTimeout.current);
                  exploreTimeout.current = window.setTimeout(() => setExploreOpen(false), 120);
                }
              }}
            >
              <button
                type="button"
                aria-expanded={exploreOpen}
                aria-controls="header-all-pages"
                onClick={() => setExploreOpen((open) => !open)}
                className={`group/nav inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer select-none overflow-hidden ${
                  exploreOpen
                    ? isTransparent
                      ? "bg-white/25 text-white font-bold shadow-xs"
                      : "bg-[#222f30] text-white font-bold shadow-xs"
                    : isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#445e5f] hover:text-[#222f30] hover:bg-black/[0.04]"
                }`}
              >
                <span className="relative inline-block overflow-hidden">
                  <span className="block transition-transform duration-300 ease-out group-hover/nav:-translate-y-full group-focus-visible/nav:-translate-y-full motion-reduce:transform-none">
                    استكشف
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 block transition-transform duration-300 ease-out translate-y-[115%] group-hover/nav:translate-y-0 group-focus-visible/nav:translate-y-0 motion-reduce:translate-y-0 font-bold"
                  >
                    استكشف
                  </span>
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-300 shrink-0 ${
                    exploreOpen ? "rotate-180 text-[#a7e26e]" : "opacity-70"
                  }`}
                />
              </button>

              {/* Zero-Lag Popover with solid background (no heavy nested blur) */}
              <AnimatePresence>
                {exploreOpen && (
                  <motion.nav
                    id="header-all-pages"
                    aria-label="كل صفحات JEMO LABS"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 top-[calc(100%+0.5rem)] z-50 w-[92vw] sm:w-[500px] rounded-2xl border p-4 shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition-all ${
                      isTransparent
                        ? "border-white/15 bg-[#0e1617] text-white"
                        : "border-[#e4e3e3] bg-white text-[#222f30]"
                    }`}
                  >
                    {/* Header Strip */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-black/5 dark:border-white/10 text-right">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#728825] dark:text-[#a7e26e]">
                          خريطة المنظومة والصفحات
                        </span>
                      </div>
                      <span className="text-[10px] font-mono opacity-50">
                        13 مسار بحثي
                      </span>
                    </div>

                    {/* Categorized Layout */}
                    <div className="space-y-3 text-right">
                      {ECOSYSTEM_CATEGORIES.map((cat) => (
                        <div key={cat.name} className="space-y-1">
                          <div className="text-[10px] font-mono font-bold uppercase tracking-widest opacity-50 px-1">
                            {cat.name}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 j-header-dim-group">
                            {cat.items.map((item) => {
                              const Icon = item.icon;
                              const isActive = pathname === item.href;
                              const idx = ALL_PAGES.findIndex((p) => p.href === item.href);
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setExploreOpen(false)}
                                  style={{ "--i": idx } as CSSProperties}
                                  className={`group j-header-dim j-header-drop px-2.5 py-2 rounded-xl transition-colors flex items-center gap-2.5 ${
                                    isActive
                                      ? isTransparent
                                        ? "bg-white/15 text-white font-bold"
                                        : "bg-[#cef79e]/40 text-[#222f30] font-bold"
                                      : isTransparent
                                      ? "hover:bg-white/10 text-white/90"
                                      : "hover:bg-[#f5f8f7] text-[#222f30]"
                                  }`}
                                >
                                  <div
                                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                      isTransparent
                                        ? "bg-white/10 text-white/80 group-hover:text-[#a7e26e]"
                                        : "bg-[#f0f2f0] text-[#445e5f] group-hover:text-[#222f30]"
                                    }`}
                                  >
                                    <Icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-xs font-semibold leading-tight">
                                      {item.label}
                                    </div>
                                    <p className="text-[10px] opacity-60 truncate font-normal">
                                      {item.desc}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Access Footer */}
                    <div className="pt-2.5 mt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
                      <span className="opacity-50">ابحث بسرعة بالضغط على ⌘K</span>
                      <Link
                        href="/support"
                        onClick={() => setExploreOpen(false)}
                        className="text-[#728825] dark:text-[#a7e26e] font-bold hover:underline flex items-center gap-1"
                      >
                        <span>دعم الأبحاث</span>
                        <span>←</span>
                      </Link>
                    </div>
                  </motion.nav>
                    )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Left side (in RTL): Controls, Search & CTA */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 shrink-0">
            {/* Mobile Quick Search Button */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className={`sm:hidden w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full border text-xs font-mono transition-all duration-150 cursor-pointer ${
                mobileMenuOpen ? "hidden" : "inline-flex"
              } ${
                isDark
                  ? "border-white/15 bg-white/5 text-white/90 hover:bg-white/10"
                  : "border-[#e4e3e3] bg-[#f0f2f0] text-[#445e5f] hover:text-[#222f30]"
              }`}
              aria-label="البحث السريع (⌘K)"
              title="البحث السريع (⌘K)"
            >
              <Search size={15} />
            </button>

            {/* Ergonomic Search Button */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className={`group hidden sm:inline-flex items-center justify-between w-36 md:w-44 h-8.5 px-2.5 rounded-full text-xs font-mono transition-all duration-150 border cursor-pointer ${
                isTransparent
                  ? "border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-white/30 hover:bg-white/10 shadow-xs"
                  : "border-[#e4e3e3] bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30] hover:border-[#a7e26e] hover:bg-white shadow-xs"
              }`}
              aria-label="البحث السريع في المنظومة"
              title="البحث السريع (⌘K)"
            >
              <span className="inline-flex items-center gap-1.5 font-sans text-xs text-inherit truncate">
                <Search size={13} className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${isTransparent ? "text-[#a7e26e]" : "text-[#445e5f]"}`} />
                <span className="font-medium text-[11px]">بحث سريع...</span>
              </span>
              <kbd
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${
                  isTransparent
                    ? "bg-white/15 text-white/90 border-white/20"
                    : "bg-white text-[#55696a] border-[#e4e3e3]"
                }`}
              >
                ⌘K
              </kbd>
            </button>

            {/* Session Indicator & Clerk Auth Controls */}
            <Show when="signed-out">
              {profile?.isDemo && !mobileMenuOpen && (
                <Link
                  href="/dashboard"
                  className="w-8 h-8 rounded-full bg-[#cef79e] text-[#222f30] font-bold text-xs flex items-center justify-center border border-[#e4e3e3] hover:ring-2 hover:ring-[#a7e26e] transition-all shrink-0"
                  title={`لوحة التحكم: ${profile.name}`}
                  aria-label="لوحة التحكم"
                >
                  {profile.name.slice(0, 1)}
                </Link>
              )}
              <Link
                href="/sign-in"
                prefetch={true}
                className={`group/signin relative ${
                  mobileMenuOpen ? "hidden" : "hidden sm:inline-flex"
                } flex-col items-center justify-center px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full transition-colors ${
                  isDark
                    ? "text-white/90 hover:text-white hover:bg-white/10 border border-white/15 sm:border-transparent"
                    : "text-[#222f30] hover:text-[#728825] hover:bg-black/5 border border-[#e4e3e3] sm:border-transparent"
                }`}
              >
                <span>دخول</span>
                <div className="relative w-full h-[1.5px] mt-0.5 overflow-hidden">
                  <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-r from-[#bef264] via-[#a7e26e] to-[#728825] transition-transform duration-300 ease-out origin-right scale-x-0 group-hover/signin:scale-x-100" />
                </div>
              </Link>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className={`hidden sm:inline-flex j-header-underline items-center px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                  isTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-[#222f30] hover:bg-black/5"
                }`}
              >
                لوحة التحكم
              </Link>
              <div className={mobileMenuOpen ? "hidden" : "block"}>
                <JemoUserButton />
              </div>
            </Show>

            {/* Single Unified Primary CTA Button */}
            <Link
              href="/publish"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                ctaMx.set(((e.clientX - r.left) / r.width) * 100);
                ctaMy.set(((e.clientY - r.top) / r.height) * 100);
              }}
              className={`group relative ${
                mobileMenuOpen ? "hidden" : "inline-flex"
              } items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 h-8 sm:h-8.5 text-[11px] sm:text-xs font-bold rounded-full transition-[background-color,box-shadow,transform] duration-200 shrink-0 shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${
                isDark
                  ? "bg-[#cef79e] text-[#162224] hover:bg-[#a7e26e]"
                  : "bg-[#222f30] hover:bg-[#162224] text-white shadow-[#222f30]/20"
              }`}
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ backgroundImage: ctaGlow }}
              />
              <span className="relative">انشر بحثك</span>
              <ArrowUpLeft size={13} className="relative transition-transform duration-200 ease-out group-hover:-translate-x-1 group-hover:-translate-y-0.5 shrink-0" />
            </Link>

            {/* Mobile Menu Hamburger — animated icon morph */}
            <button
              className={`lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl transition-colors cursor-pointer ${
                isDark ? "text-white hover:bg-white/10" : "text-[#222f30] hover:bg-black/5"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="relative block w-[22px] h-[18px]" aria-hidden="true">
                <span
                  className={`absolute left-0 right-0 top-[1px] h-[2px] rounded-full bg-current transition-all duration-300 ease-out ${
                    mobileMenuOpen ? "top-[8px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 top-[8px] h-[2px] rounded-full bg-current transition-all duration-200 ease-out ${
                    mobileMenuOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 bottom-[1px] h-[2px] rounded-full bg-current transition-all duration-300 ease-out ${
                    mobileMenuOpen ? "bottom-[8px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuContainerVariants}
              className="lg:hidden border-t border-white/10 bg-[#0c1415] px-4 sm:px-6 py-4 pb-[calc(2.5rem+env(safe-area-inset-bottom,20px))] h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain text-white space-y-4"
            >
              {/* 1. Global Search Trigger */}
              <motion.div variants={mobileMenuItemVariants}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-white/90 font-mono min-h-[48px] shadow-inner transition-colors group cursor-pointer"
                  aria-label="البحث السريع في الأبحاث والأنظمة (⌘K)"
                >
                  <span className="flex items-center gap-2.5">
                    <Search size={15} className="text-[#bef264] group-hover:scale-110 transition-transform" />
                    <span className="font-sans text-xs text-white/80">ابحث في الأبحاث، المختبرات، والأنظمة...</span>
                  </span>
                  <kbd className="px-2 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] text-white/90 font-mono">⌘K</kbd>
                </button>
              </motion.div>

              {/* 2. Primary Navigation Pathways */}
              <motion.div variants={mobileMenuItemVariants} className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono px-1">
                  <span className="font-bold text-[#bef264] uppercase tracking-wider">
                    المسارات الرئيسية
                  </span>
                  <span className="text-zinc-500 text-[10px]">5 بوابات أساسية</span>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = pathname === item.href;
                    const isFirst = idx === 0;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-between border ${
                          isFirst ? "col-span-2 shadow-xs" : ""
                        } ${
                          isActive
                            ? "bg-[#bef264] text-[#162224] border-[#bef264] shadow-xs"
                            : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {isFirst && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                          <span>{item.label}</span>
                        </span>
                        {isActive ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#162224]" />
                        ) : isFirst ? (
                          <span className="text-[11px] opacity-60">←</span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>

              {/* 3. Categorized Ecosystem Map with Filter Chips */}
              <motion.div variants={mobileMenuItemVariants} className="space-y-3 pt-1 border-t border-white/10">
                <div className="flex items-center justify-between text-right font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#bef264]">
                      خريطة المنظومة والصفحات
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400">13 مسار بحثي</span>
                </div>

                {/* Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none font-mono text-[11px] snap-x snap-mandatory">
                  <button
                    type="button"
                    onClick={() => setMobileCategory("all")}
                    className={`min-h-[34px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer border shrink-0 snap-start ${
                      mobileCategory === "all"
                        ? "bg-white/25 text-white border-white/30 font-bold"
                        : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    الكل (13)
                  </button>
                  {ECOSYSTEM_CATEGORIES.map((cat) => {
                    const isCatActive = mobileCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setMobileCategory(cat.name)}
                        className={`min-h-[34px] px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer border shrink-0 snap-start ${
                          isCatActive
                            ? "bg-[#bef264]/20 text-[#bef264] border-[#bef264]/40 font-bold"
                            : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
                {/* Filtered Cards */}
                <div className="space-y-3">
                  {ECOSYSTEM_CATEGORIES.filter(
                    (cat) => mobileCategory === "all" || mobileCategory === cat.name
                  ).map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      {mobileCategory === "all" && (
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#bef264]/80 px-1 pt-1">
                          {cat.name}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {cat.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`p-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                                isActive
                                  ? "bg-white/15 border-[#bef264]/40 text-white font-bold shadow-xs"
                                  : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-white/20"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-lg bg-white/10 text-[#bef264] flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1 text-right">
                                <div className="text-xs font-bold leading-tight flex items-center justify-between">
                                  <span>{item.label}</span>
                                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#bef264]" />}
                                </div>
                                <p className="text-[10px] text-zinc-400 truncate font-normal mt-0.5 font-mono">
                                  {item.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 4. Researcher Dashboard & Jev Evaluation Quick Card */}
              <motion.div variants={mobileMenuItemVariants} className="pt-2 border-t border-white/10">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#0c1415] to-[#0c1415] border border-emerald-500/30 flex items-center justify-between text-xs hover:border-emerald-400/50 transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-[#bef264] flex items-center justify-center shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white block">لوحة تحكم الباحثين (Jev AI)</span>
                      <span className="text-[10px] font-mono text-emerald-300/80 block">تدقيق استدلالي معتمد بنموذج Jev</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#bef264] group-hover:translate-x-[-2px] transition-transform">➔</span>
                </Link>
              </motion.div>
              {/* User Drawer Section */}
              <motion.div variants={mobileMenuItemVariants}>
                {profile ? (
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 space-y-2 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Show when="signed-in">
                        <JemoUserButton />
                      </Show>
                      <Show when="signed-out">
                        <span className="w-7 h-7 rounded-full bg-[#a7e26e] text-[#222f30] font-bold text-xs flex items-center justify-center shrink-0">
                          {profile.name.slice(0, 1)}
                        </span>
                      </Show>
                      <div>
                        <span className="text-xs font-bold text-white block">{profile.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400 block">{profile.handle}</span>
                      </div>
                    </div>
                    {profile.researchId && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-[#a7e26e]">
                        {profile.researchId}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-white/10 text-xs">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 py-2 text-center rounded-xl bg-[#a7e26e] text-[#222f30] font-bold"
                    >
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={() => {
                        void logout().finally(() => {
                          setMobileMenuOpen(false);
                          router.push("/");
                        });
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 text-zinc-300 text-xs hover:text-white cursor-pointer"
                    >
                      خروج
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <Show when="signed-out">
                    <div className="flex gap-2.5">
                      <Link
                        href="/sign-in"
                        prefetch={true}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 h-11 text-center text-xs font-bold rounded-xl border border-white/20 text-white bg-white/5 min-h-[44px] flex items-center justify-center hover:bg-white/10 active:scale-[0.98] transition-all"
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/sign-up"
                        prefetch={true}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 h-11 text-center text-xs font-bold rounded-xl bg-[#a7e26e] text-[#162224] font-bold min-h-[44px] flex items-center justify-center hover:bg-[#bef264] active:scale-[0.98] transition-all"
                      >
                        حساب جديد
                      </Link>
                    </div>
                  </Show>
                  <Show when="signed-in">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-xs font-bold text-white">حساب الباحث</span>
                      <JemoUserButton />
                    </div>
                  </Show>
                </div>
              )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
