"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpLeft, Users, FolderGit2, FileText } from "lucide-react";
import { Lab } from "@/lib/data/research-data";

interface LabBentoCardProps {
  lab: Lab;
  icon: React.ElementType;
  featured?: boolean;
}

export default function LabBentoCard({ lab, icon: Icon, featured = false }: LabBentoCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] transition-all hover:border-[var(--brand)]/50 ${
        featured ? "md:col-span-2 md:row-span-2" : "col-span-1"
      }`}
    >
      {/* Copilot/Mistral Glow Effect on Hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Grid Pattern Background for Mistral vibe */}
      <div className="absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="relative z-10 p-8 md:p-10 flex flex-col h-full">
        <div>
          <div className="flex items-start justify-between mb-8">
            <div className={`flex items-center justify-center rounded-2xl bg-[var(--brand)]/10 text-[var(--brand)] ${featured ? 'w-16 h-16' : 'w-12 h-12'}`}>
              <Icon className={featured ? 'w-8 h-8' : 'w-6 h-6'} />
            </div>
            {featured && (
              <span className="px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono font-bold tracking-widest border border-[var(--brand)]/20 uppercase">
                Flagship Lab
              </span>
            )}
          </div>

          <h2 className={`font-extrabold text-[var(--ink-1)] mb-2 transition-colors group-hover:text-[var(--brand)] ${featured ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
            <Link href={`/labs/${lab.slug}`} className="before:absolute before:inset-0">
              {lab.name}
            </Link>
          </h2>
          <p className="text-sm font-mono text-[var(--brand)] mb-6 dir-ltr text-right">{lab.nameEn}</p>

          <p className={`text-[var(--ink-2)] leading-relaxed mb-8 ${featured ? 'text-base md:text-lg max-w-xl' : 'text-sm'}`}>
            {lab.description}
          </p>
        </div>

        <div className="mt-auto">
          {/* Terminal-like Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {lab.focusAreas.map((area) => (
              <span
                key={area}
                className="px-3 py-1.5 rounded-md bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)] group-hover:border-[var(--brand)]/30 transition-colors"
              >
                &gt; {area}
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4 text-sm">
            <div className="text-[var(--ink-2)] flex flex-wrap items-center gap-4 font-mono">
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[var(--brand)]" /> {lab.researchersCount}</span>
              <span className="flex items-center gap-1.5"><FolderGit2 className="w-4 h-4 text-[var(--brand)]" /> {lab.activeProjectsCount}</span>
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[var(--brand)]" /> {lab.publishedPapersCount}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 font-bold text-[var(--brand)] translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
              <span>استكشف</span>
              <ArrowUpLeft className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
