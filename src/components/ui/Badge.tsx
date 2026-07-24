import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "success" | "warning" | "info";
  className?: string;
  children?: React.ReactNode;
}

export default function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`badge badge--${variant} inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-[var(--surface-hover)] border border-[var(--line)] text-[var(--ink-1)] ${className}`}
      {...props}
    >
      <span className="dot w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
      {children}
    </span>
  );
}
