"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpLeft } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { href: "/", label: "المعرفة" },
  { href: "/research", label: "الأبحاث" },
  { href: "/projects", label: "المشاريع" },
  { href: "/labs", label: "المختبرات" },
  { href: "/researchers", label: "الباحثون" },
  { href: "/initiatives", label: "المبادرات" },
  { href: "/transparency", label: "الشفافية" },
  { href: "/about", label: "من نحن" },
];

export default function Header() {
  const pathname = usePathname() ?? "/";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="sticky top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-sm shadow-xs"
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg group">
          <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
          <span className="text-[var(--brand)] group-hover:underline">jemo</span>
          <span className="text-[var(--ink)]">labs</span>
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-xs font-semibold rounded-full transition-colors duration-200 ${
                  isActive ? "text-[var(--brand)] font-bold" : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderPill"
                    className="absolute inset-0 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/20 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/join"
            className="header-join-btn inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono font-bold rounded-full bg-[var(--brand)] shadow-md hover:opacity-90 transition-all ms-2"
          >
            <span>انضم إلينا</span>
            <ArrowUpLeft size={14} />
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[var(--ink)]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-lg px-6 py-5 overflow-hidden"
          >
            <nav className="flex flex-col gap-3">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-base font-bold py-2 px-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-[var(--brand)]/10 text-[var(--brand)]"
                        : "text-[var(--ink-2)] hover:bg-[var(--surface)]"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/apply"
                className="header-join-btn inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-[var(--brand)] mt-2 shadow-md hover:opacity-90 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <span>Join / التقديم</span>
                <ArrowUpLeft size={16} />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
