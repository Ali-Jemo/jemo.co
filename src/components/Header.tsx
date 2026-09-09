"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpLeft, Search, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "@/components/CommandPalette";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/research", label: "سجلات الاكتشاف" },
  { href: "/questions", label: "الأسئلة المفتوحة" },
  { href: "/projects", label: "المشاريع" },
  { href: "/about", label: "عن المنصة" },
];

const MOBILE_NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/research", label: "سجلات الاكتشاف" },
  { href: "/questions", label: "الأسئلة المفتوحة" },
  { href: "/projects", label: "المشاريع" },
  { href: "/labs", label: "المختبرات" },
  { href: "/researchers", label: "الباحثون" },
  { href: "/about", label: "عن المنصة" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const { profile, logout } = useAuth();
  const lastScroll = useRef(0);
  const lastTime = useRef(0);
  const currentHidden = useRef(false);
  const ticking = useRef(false);

  // Velocity-based hide-on-down / reveal-on-up with hysteresis + top override
  useEffect(() => {
    const THRESHOLD = 400;   // px of deliberate scroll before toggling
    const VELOCITY = 1800;   // px/s minimum scroll speed to count as intentional
    const TOP_MARGIN = 80;   // always reveal near the top

    const onScroll = () => {
      const now = Date.now();
      const y = window.scrollY;
      const deltaY = y - lastScroll.current;
      const deltaTime = (now - lastTime.current) / 1000 || (1 / 60);
      const velocity = Math.abs(deltaY / deltaTime);

      // Always show near the top
      if (y <= TOP_MARGIN) {
        if (currentHidden.current) { currentHidden.current = false; setHidden(false); }
      } else if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          // Reveal on deliberate upward scroll
          if (deltaY < -THRESHOLD && velocity > VELOCITY) {
            if (currentHidden.current) { currentHidden.current = false; setHidden(false); }
          }
          // Hide on deliberate downward scroll
          else if (deltaY > THRESHOLD && velocity > VELOCITY) {
            if (!currentHidden.current) { currentHidden.current = true; setHidden(true); }
          }
          ticking.current = false;
          // Track accumulated distance for hysteresis reset
          lastScroll.current = y;
          lastTime.current = now;
        });
      }

      lastScroll.current = y;
      lastTime.current = now;
      setScrolled(y > 20);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isTransparent = isHome && !scrolled;

  return (
    <>
      <CommandPalette />
      
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: hidden ? -80 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26, opacity: { duration: 0.2 } }}
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-xl shadow-xs text-[var(--ink)]"
            : isTransparent
            ? "border-b border-white/10 bg-black/25 backdrop-blur-md text-white"
            : "border-b border-[var(--line)]/60 bg-[var(--bg)]/90 backdrop-blur-md text-[var(--ink)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          
          {/* Zone 1: Right — Logo only (RTL Start) */}
          <div className="flex items-center shrink-0">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="JEMO LABS الرئيسية"
            >
              <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/jemo-logo.svg"
                  alt="JEMO LABS"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex items-baseline gap-1 font-mono">
                <span className={`text-base font-black tracking-tight transition-colors ${
                  isTransparent ? "text-white" : "text-[#222f30]"
                } group-hover:underline`}>
                  jemo
                </span>
                <span className={`text-base font-bold tracking-tight transition-colors ${
                  isTransparent ? "text-white/90" : "text-[#445e5f]"
                }`}>
                  labs
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] animate-pulse ms-0.5" title="الشبكة السيادية نشطة" />
              </div>
            </Link>
          </div>

          {/* Zone 2: Center — 5 Focused Primary Nav Links */}
          <nav className="hidden lg:flex items-center justify-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                    isActive
                      ? isTransparent
                        ? "text-white font-bold"
                        : "text-[#222f30] font-bold"
                      : isTransparent
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-[#55696a] hover:text-[#222f30] hover:bg-black/[0.04]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeHeaderPill"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isTransparent
                          ? "bg-white/15 border border-white/25 shadow-xs"
                          : "bg-black/[0.06] border border-black/10"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Left — Search & Primary Action CTA (RTL End) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search Bar with proper internal spacing and clear bounds */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className={`group hidden sm:inline-flex items-center justify-between w-44 xl:w-52 h-9 px-3 rounded-full text-xs font-mono transition-all duration-200 border ${
                isTransparent
                  ? "border-white/20 bg-white/10 text-white/80 hover:text-white hover:border-white/40 hover:bg-white/15 backdrop-blur-md shadow-xs"
                  : "border-[#e4e3e3] bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30] hover:border-[#a7e26e] hover:bg-white shadow-xs"
              }`}
              aria-label="البحث السريع"
              title="البحث السريع (⌘K)"
            >
              <span className="inline-flex items-center gap-2 font-sans text-xs text-inherit">
                <Search size={14} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isTransparent ? "text-[#bef264]" : "text-[#445e5f]"}`} />
                <span className="font-medium text-[11px] sm:text-xs">بحث في المنظومة...</span>
              </span>
              <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono border shrink-0 ${
                isTransparent 
                  ? "bg-white/15 text-white/90 border-white/20" 
                  : "bg-white text-[#55696a] border-[#e4e3e3]"
              }`}>⌘K</kbd>
            </button>

            {/* Minimal, clean user avatar when logged in (replaces cluttered pill) */}
            {profile && (
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-[#cef79e] text-[#222f30] font-bold text-xs flex items-center justify-center border border-[#e4e3e3] hover:ring-2 hover:ring-[#a7e26e] transition-all shrink-0"
                title={`لوحة التحكم: ${profile.name}`}
                aria-label="لوحة التحكم"
              >
                {profile.name.slice(0, 1)}
              </Link>
            )}

            {/* Single Unified Primary CTA Button */}
            <Link
              href="/publish"
              className={`group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 shrink-0 shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                isTransparent
                  ? "bg-[#cef79e] text-[#162224] hover:bg-[#bef264] border border-[#bef264]/40"
                  : "bg-[#222f30] hover:bg-[#162224] text-white shadow-[#222f30]/20"
              }`}
            >
              <span>انشر بحثك</span>
              <ArrowUpLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isTransparent ? "text-white hover:bg-white/10" : "text-[var(--ink)] hover:bg-[var(--surface)]"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="xl:hidden border-t border-white/10 bg-[#0c1415]/98 backdrop-blur-2xl px-4 sm:px-6 py-5 sm:py-6 overflow-hidden text-white"
            >
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-white/15 bg-white/5 text-xs text-white/80 font-mono min-h-[44px]"
                >
                  <span className="flex items-center gap-2">
                    <Search size={14} className="text-[#bef264]" />
                    <span>البحث في الأبحاث والأنظمة...</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">⌘K</kbd>
                </button>
              </div>

              <nav className="grid grid-cols-2 gap-2 mb-5">
                {MOBILE_NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition-colors min-h-[44px] flex items-center ${
                        isActive
                          ? "bg-[#bef264]/15 text-[#bef264] font-black border border-[#bef264]/30"
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
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#bef264] text-[#222f30] font-bold text-xs flex items-center justify-center">
                        {profile.name.slice(0, 1)}
                      </span>
                      <span className="text-xs font-bold text-white">{profile.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{profile.handle}</span>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-white/10 text-xs">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-2 text-center rounded-xl bg-[#bef264] text-[#222f30] font-bold"
                    >
                      لوحة التحكم
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 text-zinc-300 text-xs hover:text-white cursor-pointer"
                    >
                      خروج
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Link
                    href={pathname && pathname !== "/" && pathname !== "/dashboard" && pathname !== "/login" && pathname !== "/signup" ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login"}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-white/20 text-white bg-white/5 min-h-[44px] flex items-center justify-center"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href={pathname && pathname !== "/" && pathname !== "/dashboard" && pathname !== "/login" && pathname !== "/signup" ? `/signup?redirect=${encodeURIComponent(pathname)}` : "/signup"}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-[#bef264] text-[#162224] font-bold min-h-[44px] flex items-center justify-center"
                  >
                    تسجيل كباحث
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
