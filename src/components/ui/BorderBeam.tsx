"use client";


interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

// Ultra-reliable GPU-accelerated Magic UI BorderBeam component
// Uses rotating conic-gradient with inner card mask for 60fps beam tracing
export function BorderBeam({
  className = "",
  duration = 8,
  colorFrom = "#2563eb",
  colorTo = "#d97706",
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-px rounded-2xl overflow-hidden z-0 ${className}`}
    >
      {/* 360-degree rotating light beam */}
      <div
        style={{
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 280deg, ${colorFrom} 320deg, ${colorTo} 360deg)`,
          animation: `spin ${duration}s linear infinite`,
        }}
        className="absolute -inset-[150%] will-change-transform"
      />
      {/* Inner card background cut-out that leaves only the 1.5px border glowing */}
      <div className="absolute inset-[1.5px] rounded-[calc(1rem-1.5px)] bg-[#0d1117]" />
    </div>
  );
}
