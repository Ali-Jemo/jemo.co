"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
}

export default function GlowButton({ children, className = "", href }: GlowButtonProps) {
  const Comp = href ? motion.a : motion.button;

  return (
    <Comp
      href={href}
      className={`relative inline-flex items-center justify-center group cursor-pointer ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Outer Glow */}
      <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--brand)] via-sky-400 to-cyan-500 opacity-30 blur-md transition-all duration-500 group-hover:opacity-80 group-hover:blur-lg" />

      {/* Button Body */}
      <span className="relative flex items-center justify-center gap-3 rounded-xl bg-[var(--brand)] text-[var(--brand-ink)] px-10 py-4 text-lg font-bold shadow-lg shadow-[var(--brand)]/20 overflow-hidden transition-all duration-300">
        {/* Shimmer Overlay */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
        <span className="relative z-10 flex items-center gap-3 font-kufi">{children}</span>
      </span>
    </Comp>
  );
}
