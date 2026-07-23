"use client";

import { useRef, useState } from "react";

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedBorder({ children, className = "" }: AnimatedBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  return (
    <div
      ref={ref}
      className={`relative rounded-xl p-px ${className}`}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {/* Animated gradient border */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, var(--brand), transparent 40%)`,
        }}
      />
      {/* Inner content with gap */}
      <div className="relative rounded-xl bg-[var(--bg)] h-full">
        {children}
      </div>
    </div>
  );
}
