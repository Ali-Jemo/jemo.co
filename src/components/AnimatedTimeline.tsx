"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

const ITEMS = [
  { year: "2026", event: "التأسيس وبناء الفريق الأساسي" },
  { year: "2027", event: "إطلاق أول منصة مفتوحة المصدر" },
  { year: "2028", event: "توسيع شبكة الباحثين والشركاء" },
  { year: "2030", event: "تحقيق الاستقلالية التقنية الكاملة" },
];

export default function AnimatedTimeline() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ITEMS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isPaused]);

  const item = ITEMS[index];

  const handleNext = () => setIndex((prev) => (prev + 1) % ITEMS.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + ITEMS.length) % ITEMS.length);

  return (
    <div
      className="w-full max-w-lg flex flex-col items-center gap-4 group/timeline"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Year Pill Selector Navigation */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {ITEMS.map((it, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`px-3 py-1 text-xs font-mono font-medium rounded-full transition-all duration-300 ${
              i === index
                ? "bg-[var(--brand)] text-[var(--brand-ink)] shadow-[0_0_12px_rgba(14,165,233,0.3)] scale-105"
                : "bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] hover:border-[var(--brand)]/40"
            }`}
          >
            {it.year}
          </button>
        ))}
      </div>

      {/* Main Animated Card */}
      <div className="relative w-full min-h-[110px] rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-5 sm:p-6 overflow-hidden shadow-lg transition-all duration-500 hover:border-[var(--brand)]/50">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--brand)]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Step Badge */}
        <div className="absolute top-3 left-4 text-[10px] font-mono font-semibold text-[var(--ink-2)]/60 uppercase tracking-widest">
          0{index + 1} / 0{ITEMS.length}
        </div>

        <div className="pt-2 flex items-center justify-between gap-3">
          {/* Previous arrow button */}
          <button
            onClick={handlePrev}
            aria-label="Previous milestone"
            className="p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40 transition-colors shrink-0"
          >
            <ChevronRight size={16} />
          </button>

          {/* Animated Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: -16, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="flex-1 flex flex-row items-center justify-between gap-3 sm:gap-4 px-2"
            >
              <span className="text-3xl sm:text-4xl font-mono font-extrabold text-[var(--brand)] shrink-0 tracking-tight">
                {item.year}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[var(--brand)]/40 via-[var(--line)] to-transparent min-w-[16px]" />
              <span className="text-sm sm:text-base text-[var(--ink-2)] font-semibold text-end leading-snug">
                {item.event}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Next arrow button */}
          <button
            onClick={handleNext}
            aria-label="Next milestone"
            className="p-1.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)]/40 transition-colors shrink-0"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar with pause indication */}
      <div className="w-full flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[var(--line)]/50 rounded-full overflow-hidden p-0.5">
          <motion.div
            key={`${index}-${isPaused}`}
            className="h-full bg-gradient-to-r from-[var(--brand)] to-cyan-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: isPaused ? "100%" : "100%" }}
            transition={{ duration: isPaused ? 0 : 3.2, ease: "linear" }}
          />
        </div>
        {isPaused && (
          <span className="text-[10px] font-mono text-[var(--brand)] animate-pulse">
            paused
          </span>
        )}
      </div>
    </div>
  );
}
