"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StaggerRevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  direction?: "up" | "left" | "right";
}

export default function StaggerReveal({
  children,
  className = "",
  stagger = 0.08,
  direction = "up",
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const dirMap = {
    up: { y: 30, x: 0 },
    left: { y: 0, x: -30 },
    right: { y: 0, x: 30 },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, ...dirMap[direction] },
                show: {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                },
              }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
