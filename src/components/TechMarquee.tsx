"use client";

import {
  Code2,
  Database,
  Globe,
  Server,
  Shield,
  Cpu,
  Cloud,
  GitBranch,
  Terminal,
  Layers,
  Zap,
  Box,
} from "lucide-react";

// Mistral-style logo scrolling slider: bordered grid cells with grayscale-to-color transition.
const TECH = [
  { name: "React", icon: Code2 },
  { name: "Next.js", icon: Layers },
  { name: "TypeScript", icon: Terminal },
  { name: "Rust", icon: Shield },
  { name: "Python", icon: Code2 },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Box },
  { name: "Tailwind", icon: Zap },
  { name: "GraphQL", icon: Globe },
  { name: "Linux", icon: Server },
  { name: "Git", icon: GitBranch },
  { name: "Redis", icon: Database },
  { name: "TensorFlow", icon: Cpu },
  { name: "Node.js", icon: Server },
  { name: "Go", icon: Zap },
  { name: "Cloud", icon: Cloud },
];

export default function TechMarquee() {
  const items = [...TECH, ...TECH];

  return (
    <div className="relative py-3 border-y border-[var(--j-line)] bg-[var(--j-cream-2)] overflow-hidden">
      <div className="flex gap-4 whitespace-nowrap animate-marquee transform-gpu will-change-transform">
        {items.map((tech, i) => {
          const Icon = tech.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-2.5 px-4 py-2 bg-white border border-[var(--j-line)] rounded-md shrink-0 select-none grayscale hover:grayscale-0 hover:border-[var(--brand)] transition-all cursor-pointer shadow-2xs"
            >
              <Icon className="w-4 h-4 text-[var(--brand)]" />
              <span className="text-xs font-mono font-bold text-[var(--ink)] tracking-wider uppercase">
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
