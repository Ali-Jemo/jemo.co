"use client";

import { useEffect, useRef } from "react";

// ponytail: plain rAF + ref.textContent — zero React re-renders during count.
// Replaced framer-motion useSpring+useMotionValue that did setState 60x/sec per counter.
export interface CountUpProps {
  value?: number;
  to?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({ value, to, suffix = "", duration = 1.8, className = "" }: CountUpProps) {
  const targetValue = to ?? value ?? 0;
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(targetValue) + suffix;
      return;
    }

    let raf: number;
    let start: number | null = null;

    function tick(ts: number) {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(targetValue * eased);
      el!.textContent = current + suffix;
      if (progress < 1) raf = requestAnimationFrame(tick);
    }

    // Start when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          raf = requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [targetValue, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
