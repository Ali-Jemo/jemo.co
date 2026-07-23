"use client";

import { motion } from "framer-motion";

interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export default function AnimatedUnderline({ children, className = "", href }: AnimatedUnderlineProps) {
  const Tag = href ? "a" : "span";
  const props = href ? { href } : {};

  return (
    <Tag
      className={`relative inline-block group ${className}`}
      {...props}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-[2px] bg-[var(--brand)] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ width: "100%" }}
      />
    </Tag>
  );
}
