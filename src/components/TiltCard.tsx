"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { motion } from "framer-motion";

// ponytail: tilt-on-hover via mouse tracking — no external tilt library
interface Props {
  children: ReactNode;
  className?: string;
  glare?: boolean;
}

export default function TiltCard({ children, className = "", glare = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (0.5 - y) * 8,
      y: (x - 0.5) * 8,
    });
    setGlarePos({ x: x * 100, y: y * 100 });
    setHovered(true);
  }, []);

  const handleLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setGlarePos({ x: 50, y: 50 });
    setHovered(false);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.08), transparent 60%)`,
          }}
        />
      )}
    </motion.div>
  );
}
