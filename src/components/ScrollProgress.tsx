"use client";

import { useEffect, useRef } from "react";

// ponytail: vanilla scroll listener, no framer-motion overhead
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const h = document.documentElement;
          const pct = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
          el!.style.transform = `scaleX(${pct})`;
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--brand)] origin-left z-[9999]"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
