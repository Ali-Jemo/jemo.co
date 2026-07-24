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

    const lenis = new Lenis({
      duration: isTouchDevice ? 0.4 : 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isTouchDevice,
    });
    lenisRef.current = lenis;

    let rafId: number;
    let isRunning = true;

    function raf(time: number) {
      if (isRunning && lenisRef.current) {
        lenisRef.current.raf(time);
        rafId = requestAnimationFrame(raf);
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        isRunning = true;
        rafId = requestAnimationFrame(raf);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    rafId = requestAnimationFrame(raf);

    return () => {
      isRunning = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
