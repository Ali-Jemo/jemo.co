"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's motion preferences or touch-device performance limits
    if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return; // Mobile and touch devices use native 120Hz compositor scrolling with zero CPU overhead
    }

    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let rafId: number | null = null;
    let settlingFrames = 0;

    // ponytail: on-demand rAF loop — stops spinning when idle to eliminate background CPU drain
    function raf(time: number) {
      if (!lenisRef.current) return;
      lenisRef.current.raf(time);
      if (lenisRef.current.isScrolling) {
        settlingFrames = 25;
        rafId = requestAnimationFrame(raf);
      } else if (settlingFrames > 0) {
        settlingFrames--;
        rafId = requestAnimationFrame(raf);
      } else {
        rafId = null;
      }
    }

    function wake() {
      if (!rafId && lenisRef.current) {
        settlingFrames = 30;
        rafId = requestAnimationFrame(raf);
      }
    }

    window.addEventListener("wheel", wake, { passive: true });
    window.addEventListener("keydown", wake, { passive: true });
    wake();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        wake();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("wheel", wake);
      window.removeEventListener("keydown", wake);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
