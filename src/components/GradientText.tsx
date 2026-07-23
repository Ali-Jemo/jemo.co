"use client";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export default function GradientText({ children, className = "" }: GradientTextProps) {
  return (
    <span
      className={`bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--ink) 0%, var(--brand) 25%, var(--brand-700) 50%, var(--brand) 75%, var(--ink) 100%)",
      }}
    >
      {children}
    </span>
  );
}
