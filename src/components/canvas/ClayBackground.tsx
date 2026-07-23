"use client";

export default function ClayBackground() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-40"
      style={{
        background: "radial-gradient(ellipse at center, rgba(14, 165, 233, 0.05) 0%, transparent 70%)",
      }}
    />
  );
}
