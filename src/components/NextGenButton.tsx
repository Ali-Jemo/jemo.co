"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpLeft, Sparkles } from "lucide-react";

const CHARS = "ابتثجحخدذرزسشصضطظعغفقكلمنهوي١٢٣٤٥٦٧٨٩٠";

export default function NextGenButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState("قدّم الآن");
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);
  const particleIdCounter = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Spawn a particle occasionally on move
    if (Math.random() > 0.7) {
      const id = particleIdCounter.current++;
      setParticles((prev) => [...prev, { id, x, y }]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 600);
    }
  };

  const scrambleText = () => {
    let iteration = 0;
    const target = "قدّم الآن";
    const interval = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((letter, index) => {
            if (index < iteration) return target[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= target.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <motion.a
      href="/apply"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        setIsHovered(true);
        scrambleText();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setDisplayText("قدّم الآن");
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden inline-flex items-center justify-center gap-4 px-12 py-5 rounded-2xl bg-[#020617] border border-[var(--line)] group shadow-2xl"
    >
      {/* The Flashlight Reveal */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
        animate={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(14, 165, 233, 0.4), transparent 100%)`,
        }}
      />

      {/* Hidden Technical Grid (Only visible under flashlight) */}
      <div 
        className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none transition-opacity duration-500"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', 
          backgroundSize: '12px 12px',
          opacity: isHovered ? 0.4 : 0
        }} 
      />

      {/* Interactive Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-2xl">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
              animate={{ opacity: 0, scale: 1.5, y: p.y - 40, x: p.x + (Math.random() * 20 - 10) }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute text-[#0ea5e9]"
            >
              <Sparkles size={14} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="relative z-20 flex items-center gap-3 text-white font-bold text-xl tracking-wide">
        <span className="min-w-[90px] text-center" dir="rtl">{displayText}</span>
      </div>

      <motion.div
        animate={{ 
          x: isHovered ? -5 : 0,
          rotate: isHovered ? 90 : 0,
          color: isHovered ? "#0ea5e9" : "#ffffff"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="relative z-20"
      >
        <ArrowUpLeft size={24} />
      </motion.div>

      {/* Liquid Bottom Border */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#0ea5e9] to-transparent z-20"
        animate={{
            width: isHovered ? "200%" : "0%",
            x: isHovered ? "-50%" : "50%",
            opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />
    </motion.a>
  );
}
