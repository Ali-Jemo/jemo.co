"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpLeft, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "@/components/CommandPalette";

const NAV_ITEMS = [
  { href: "/", label: "الرئيسية" },
  { href: "/publish", label: "انشر بحثك" },
  { href: "/research", label: "سجلات الاكتشاف" },
  { href: "/questions", label: "الأسئلة المفتوحة" },
  { href: "/projects", label: "المشاريع" },
  { href: "/labs", label: "المختبرات" },
  { href: "/researchers", label: "الباحثون" },
  { href: "/about", label: "من نحن" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const isHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-xl shadow-xs text-[var(--ink)]"
            : isTransparent
            ? "border-b border-white/10 bg-black/25 backdrop-blur-md text-white"
            : "border-b border-[var(--line)]/60 bg-[var(--bg)]/90 backdrop-blur-md text-[var(--ink)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          
          {/* Right Group: Logo & Institutional Identity (RTL Start) */}
          <div className="flex items-center gap-6">
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
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex items-baseline gap-1 font-mono">
                <span className={`text-base font-black tracking-tight transition-colors ${
                  isTransparent ? "text-white" : "text-[var(--brand)]"
                } group-hover:underline`}>
                  jemo
                </span>
                <span className={`text-base font-bold tracking-tight transition-colors ${
                  isTransparent ? "text-white/90" : "text-[var(--ink)]"
                }`}>
                  labs
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse ms-0.5" title="الشبكة السيادية نشطة" />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? isTransparent
                          ? "text-white font-bold"
                          : "text-[var(--brand)] font-bold"
                        : isTransparent
                        ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-[var(--ink-2)] hover:text-[var(--ink)] hover:bg-black/[0.03]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeHeaderPill"
                        className={`absolute inset-0 rounded-full -z-10 ${
                          isTransparent
                            ? "bg-white/15 border border-white/25 shadow-xs"
                            : "bg-[var(--brand)]/10 border border-[var(--brand)]/20"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Left Group: Search & Action Buttons (RTL End) */}
          <div className="flex items-center gap-2.5">
            {/* Quick CommandPalette Trigger */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className={`group hidden sm:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border ${
                isTransparent
                  ? "border-white/20 bg-white/10 text-white/90 hover:text-white hover:border-white/40 hover:bg-white/15 backdrop-blur-md shadow-xs"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink-2)] hover:text-[var(--ink)] hover:border-[var(--brand)]/40 hover:bg-white shadow-xs"
              }`}
              aria-label="البحث السريع"
              title="البحث السريع (⌘K)"
            >
              <Search size={13} className={`transition-transform duration-200 group-hover:scale-110 ${isTransparent ? "text-[#bef264]" : "text-[var(--brand)]"}`} />
              <span className="text-[11px] font-sans font-medium">بحث في المنظومة...</span>
              <kbd className={`text-[10px] px-1.5 py-0.5 rounded font-mono shadow-xs border ${
                isTransparent 
                  ? "bg-white/15 text-white/80 border-white/20" 
                  : "bg-white text-[var(--ink-2)] border-[var(--line)]"
              }`}>⌘K</kbd>
            </button>

            {/* Secondary CTA: Contact */}
            <Link
              href="/contact"
              className={`hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full border transition-all duration-200 backdrop-blur-md hover:-translate-y-0.5 active:translate-y-0 shadow-xs ${
                isTransparent
                  ? "border-white/25 text-white bg-white/10 hover:bg-white/20 hover:border-white/40"
                  : "border-[var(--line)] hover:border-[var(--brand)]/40 hover:bg-[var(--surface)] text-[var(--ink)]"
              }`}
            >
              <span>تواصل معنا</span>
            </Link>

            {/* Primary CTA: Publish / Share Discovery */}
            <Link
              href="/publish"
              className={`group inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 shrink-0 shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 ${
                isTransparent
                  ? "bg-gradient-to-r from-[#bef264] to-[#a3e635] text-[#162224] hover:from-[#d9f99d] hover:to-[#bef264] shadow-[#bef264]/20 border border-white/30"
                  : "bg-[var(--brand)] hover:bg-[var(--brand-700)] text-white shadow-[var(--brand)]/20"
              }`}
            >
              <span>انشر بحثك</span>
              <ArrowUpLeft size={13} className="transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              className={`xl:hidden p-2 rounded-lg transition-colors ${
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
              className="xl:hidden border-t border-white/10 bg-[#0c1415]/98 backdrop-blur-2xl px-6 py-6 overflow-hidden text-white"
            >
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-white/15 bg-white/5 text-xs text-white/80 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Search size={14} className="text-[#bef264]" />
                    <span>البحث في الأبحاث والأنظمة...</span>
                  </span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">⌘K</kbd>
                </button>
              </div>

              <nav className="grid grid-cols-2 gap-2 mb-6">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-bold py-2.5 px-3.5 rounded-xl transition-colors ${
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

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <Link
                  href="/contact"
                  className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-white/20 text-white bg-white/5"
                >
                  تواصل معنا
                </Link>
                <Link
                  href="/publish"
                  className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-[#bef264] text-[#162224] shadow-sm font-bold"
                >
                  انشر بحثك الآن
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
