"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function AboutScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 h-[3px] bg-[var(--brand)] origin-left z-50"
      style={{ scaleX }}
    />
  );
}
