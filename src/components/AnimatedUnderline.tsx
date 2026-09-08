import React from "react";

// ponytail: pure CSS underline hover effect — zero client JS, zero Framer Motion overhead
interface AnimatedUnderlineProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export default function AnimatedUnderline({ children, className = "", href }: AnimatedUnderlineProps) {
  const Tag = href ? "a" : "span";
  const props = href ? { href } : {};

  return (
    <Tag className={`link-underline inline-flex items-center gap-1 ${className}`} {...props}>
      {children}
    </Tag>
  );
}
