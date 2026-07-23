"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";

export default function GodModeButton() {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.5; // Magnetic pull strength
    const y = (clientY - (top + height / 2)) * 0.5;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div style={{ perspective: "1500px" }} className="relative z-50">
      <motion.a
        href="/apply"
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          x: position.x,
          y: position.y,
          rotateX: isHovered ? position.y * -0.5 : 0,
          rotateY: isHovered ? position.x * 0.5 : 0,
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.5 }}
        className="about-cta-btn inline-flex items-center gap-3 px-10 py-4 font-bold text-lg rounded-xl"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.span
          animate={{
            x: isHovered ? position.x * 0.2 : 0,
            y: isHovered ? position.y * 0.2 : 0,
            z: isHovered ? 40 : 0,
          }}
          className="relative z-10 text-white"
          style={{ textShadow: isHovered ? "0 0 20px #fff, 0 0 40px #0ea5e9" : "none" }}
        >
          قدّم الآن
        </motion.span>
        
        <motion.div
          animate={{
            x: isHovered ? position.x * 0.4 - 15 : 0,
            y: isHovered ? position.y * 0.4 - 15 : 0,
            z: isHovered ? 80 : 0,
            rotate: isHovered ? -45 : 0,
            scale: isHovered ? 1.8 : 1,
          }}
          className="relative z-10 text-white"
        >
          <ArrowUpLeft size={22} />
        </motion.div>
      </motion.a>
    </div>
  );
}
