"use client";

const TECH = [
  "React", "Next.js", "TypeScript", "Rust", "Python", "PostgreSQL",
  "Docker", "Tailwind", "GraphQL", "Figma", "Linux", "Git",
  "Redis", "TensorFlow", "Node.js", "Go",
];

// ponytail: CSS-only marquee, no framer-motion
export default function TechMarquee() {
  const items = [...TECH, ...TECH];
  return (
    <div className="py-6 border-y border-[var(--line)] bg-[var(--surface)] overflow-hidden">
      <div className="flex gap-8 whitespace-nowrap animate-marquee transform-gpu will-change-transform">
        {items.map((tech, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-mono text-[var(--ink-2)]/60 shrink-0 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]/50" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
