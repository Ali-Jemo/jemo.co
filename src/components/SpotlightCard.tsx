"use client";

import { useRef, useCallback } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(14, 165, 233, 0.15)",
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  // ponytail: mutate DOM directly via ref, skip React re-render
  const handleMouse = useCallback((e: React.MouseEvent) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      overlay.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`;
      overlay.style.opacity = "1";
    });
  }, [spotlightColor]);

  const hide = useCallback(() => {
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouse}
      onMouseEnter={() => {}}
      onMouseLeave={hide}
    >
      <div
        ref={overlayRef}
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
