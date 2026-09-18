"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
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
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "@/components/CommandPalette";
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

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/research", label: "سجلات الاكتشاف" },
  { href: "/questions", label: "الأسئلة المفتوحة" },
  { href: "/projects", label: "المشاريع" },
  { href: "/labs", label: "المختبرات" },
  { href: "/researchers", label: "الباحثون" },
  { href: "/publications", label: "المنشورات" },
  { href: "/infrastructure", label: "البنية التحتية" },
  { href: "/open-source", label: "المصدر المفتوح" },
  { href: "/support", label: "الدعم" },
  { href: "/newsletter", label: "النشرة الإخبارية" },
  { href: "/about", label: "عن المنصة" },
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

export default function Header() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

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

    const onScroll = () => {
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
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <CommandPalette />

      <header
        className={`fixed top-0 z-50 w-full transition-transform duration-200 ease-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "border-b border-[#e4e3e3] bg-[#f7f7f5]/96 backdrop-blur-md shadow-xs text-[#222f30]"
            : isTransparent
            ? "border-b border-white/10 bg-[#0c1415]/85 backdrop-blur-md text-white"
            : "border-b border-[#e4e3e3]/80 bg-[#f7f7f5]/90 backdrop-blur-md text-[#222f30]"
        }`}
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
        <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          
          {/* 1. Right side (in RTL): Brand Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              aria-label="JEMO LABS الرئيسية"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/jemo-logo.svg"
                  alt="JEMO LABS"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-baseline gap-1 font-mono">
                <span className={`text-base font-black tracking-tight transition-colors ${isTransparent ? "text-white" : "text-[#222f30]"} group-hover:underline`}>
                  jemo
                </span>
                <span className={`text-base font-bold tracking-tight transition-colors ${isTransparent ? "text-white/90" : "text-[#445e5f]"}`}>
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
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ${
                    isActive
                      ? isTransparent
                        ? "bg-white/20 text-white font-bold shadow-xs"
                        : "bg-[#222f30] text-white font-bold shadow-xs"
                      : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-[#445e5f] hover:text-[#222f30] hover:bg-black/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Seamless Explore Trigger */}
            <div ref={exploreRef} className="relative ms-1">
              <button
                type="button"
                aria-expanded={exploreOpen}
                aria-controls="header-all-pages"
                onClick={() => setExploreOpen((open) => !open)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer select-none ${
                  exploreOpen
                    ? isTransparent
                      ? "bg-white/25 text-white font-bold shadow-xs"
                      : "bg-[#222f30] text-white font-bold shadow-xs"
                    : isTransparent
                    ? "text-white/85 hover:text-white hover:bg-white/10"
                    : "text-[#445e5f] hover:text-[#222f30] hover:bg-black/[0.04]"
                }`}
              >
                <span>استكشف</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 shrink-0 ${
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
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.12, ease: "easeOut" }}
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
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {cat.items.map((item) => {
                              const Icon = item.icon;
                              const isActive = pathname === item.href;
                              return (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setExploreOpen(false)}
                                  className={`group px-2.5 py-2 rounded-xl transition-colors flex items-center gap-2.5 ${
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
          <div className="flex items-center gap-2.5 shrink-0">
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
              {profile?.isDemo && (
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
                className={`hidden md:inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                  isTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-[#222f30] hover:text-[#728825] hover:bg-black/5"
                }`}
              >
                دخول
              </Link>
            </Show>

            <Show when="signed-in">
              <Link
                href="/dashboard"
                className={`hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                  isTransparent
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-[#222f30] hover:bg-black/5"
                }`}
              >
                لوحة التحكم
              </Link>
              <JemoUserButton />
            </Show>

            {/* Single Unified Primary CTA Button */}
            <Link
              href="/publish"
              className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 h-8.5 text-xs font-bold rounded-full transition-all duration-150 shrink-0 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                isTransparent
                  ? "bg-[#cef79e] text-[#162224] hover:bg-[#a7e26e] border border-[#a7e26e]/40"
                  : "bg-[#222f30] hover:bg-[#162224] text-white shadow-[#222f30]/20"
              }`}
            >
              <span>انشر بحثك</span>
              <ArrowUpLeft size={13} className="transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              className={`lg:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                isTransparent ? "text-white hover:bg-white/10" : "text-[#222f30] hover:bg-black/5"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="lg:hidden border-t border-white/10 bg-[#0c1415]/98 backdrop-blur-xl px-4 sm:px-6 py-5 overflow-hidden text-white"
            >
              <div className="mb-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-white/15 bg-white/5 text-xs text-white/80 font-mono min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Search size={14} className="text-[#a7e26e]" />
                    <span>البحث في الأبحاث والأنظمة...</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">⌘K</kbd>
                </button>
              </div>

              <div className="text-[10px] font-mono text-[#a7e26e] uppercase tracking-widest mb-2 px-1">
                مسارات المنظومة (Ecosystem)
              </div>

              <nav className="grid grid-cols-2 gap-2 mb-5">
                {MOBILE_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xs font-bold py-2.5 px-3 rounded-xl transition-colors min-h-[44px] flex items-center ${
                        isActive
                          ? "bg-[#a7e26e]/15 text-[#a7e26e] font-black border border-[#a7e26e]/30"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User Drawer Section */}
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
                    <div className="flex gap-2">
                      <Link
                        href="/sign-in"
                        prefetch={true}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-white/20 text-white bg-white/5 min-h-[44px] flex items-center justify-center hover:bg-white/10 transition-colors"
                      >
                        تسجيل الدخول
                      </Link>
                      <Link
                        href="/sign-up"
                        prefetch={true}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-[#a7e26e] text-[#162224] font-bold min-h-[44px] flex items-center justify-center hover:bg-[#bef264] transition-colors"
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
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
