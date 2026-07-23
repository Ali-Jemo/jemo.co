"use client";

import { useRef, useCallback } from "react";

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlowingBorder({ children, className = "" }: GlowingBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      overlay.style.background = `radial-gradient(400px circle at ${x}px ${y}px, var(--brand), transparent 40%)`;
      overlay.style.opacity = "1";
    });
  }, []);

  const hide = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={ref}
      className={`relative rounded-2xl p-[1px] ${className}`}
      onMouseMove={handleMouse}
      onMouseLeave={hide}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500"
      />
      <div className="relative rounded-2xl bg-[var(--surface)] border border-[var(--line)] h-full">
        {children}
      </div>
    </div>
  );
}
