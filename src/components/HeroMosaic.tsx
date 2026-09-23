"use client";

import { useEffect, useRef } from "react";

const PALETTE = [
  '#1e3a8a', // brand (Deep Blue)
  '#172554', // brand-700
  '#2563eb', // accent
  '#d97706', // gold
  '#09090b', // ink (Obsidian)
  '#ffffff', 
];

const COLS = 12;
const ROWS = 6;

const INITIAL_CELLS = Array.from({ length: ROWS * COLS }, (_, i) => {
  const pseudo = ((i * 9301 + 49297) % 233280) / 233280;
  const filled = pseudo > 0.4;
  const color = filled ? PALETTE[Math.floor((pseudo * 37) % (PALETTE.length - 1))] : 'transparent';
  return { filled, color };
});

export default function HeroMosaic() {
  const gridRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    // Initial stagger animation
    cellsRef.current.forEach((cell, i) => {
      if (!cell) return;
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      const delay = 40 + Math.sqrt(r * r + c * c) * 45;
      
      setTimeout(() => {
        if (cell) {
          cell.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
          cell.style.opacity = '1';
          cell.style.transform = 'scale(1)';
        }
      }, delay);
    });

    // Random color shifting
    const interval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * (ROWS * COLS));
        const cell = cellsRef.current[idx];
        if (cell && cell.dataset.filled === "true") {
          cell.style.background = PALETTE[Math.floor(Math.random() * (PALETTE.length - 1))];
        }
      }
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    cellsRef.current.forEach((cell, i) => {
      if (!cell) return;
      const r = Math.floor(i / COLS) / ROWS;
      const c = (i % COLS) / COLS;
      const lift = Math.max(0, 1 - Math.hypot(px - c, py - r) * 4.5);
      cell.style.transform = `scale(${1 + lift * 0.25})`;
    });
  };

  const handlePointerLeave = () => {
    cellsRef.current.forEach((cell) => {
      if (cell) cell.style.transform = 'scale(1)';
    });
  };

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 z-0 overflow-hidden"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: '2px', // Adding a slight gap for the terminal grid feel
        padding: '2px',
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {INITIAL_CELLS.map((cell, i) => (
        <div
          key={i}
          ref={(el) => {
            cellsRef.current[i] = el;
          }}
          data-filled={cell.filled.toString()}
          style={{
            background: cell.color,
            opacity: 0,
            transform: 'scale(0.2)',
            transition: 'background-color 0.6s ease',
          }}
          className="w-full h-full rounded-sm opacity-20" // Slight rounding and lowered overall opacity so it doesn't distract text
        />
      ))}
    </div>
  );
}
