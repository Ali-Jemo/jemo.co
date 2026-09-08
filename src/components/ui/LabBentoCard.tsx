"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpLeft, Users, FolderGit2, FileText, Cpu, Terminal, Eye, Bot, Activity, Dna } from "lucide-react";
import { Lab } from "@/lib/data/research-data";

const iconMap: Record<string, React.ElementType> = {
  Cpu,
  Terminal,
  Eye,
  Bot,
  Activity,
  Dna,
};

interface LabBentoCardProps {
  lab: Lab;
  featured?: boolean;
}

export default function LabBentoCard({ lab, featured = false }: LabBentoCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const Icon = iconMap[lab.iconName] ?? Cpu;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e4e3e3] bg-white shadow-xs transition-all duration-500 hover:border-[#a7e26e] hover:shadow-xl ${
        featured ? "md:col-span-2 md:row-span-2 p-8 md:p-10" : "col-span-1 p-8"
      }`}
    >
      {/* Bio-lime Glow Effect on Hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(167, 226, 110, 0.14),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-[#222f30] flex items-center justify-center group-hover:bg-[#cef79e] transition-colors duration-300">
            <Icon className="w-6 h-6 stroke-[1.8]" />
          </div>
          {featured && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--brand)] text-white shadow-sm">
              المختبر المرجعي (Flagship Lab)
            </span>
          )}
        </div>

        <h2 className={`${featured ? "text-3xl md:text-4xl" : "text-2xl"} font-bold mb-1 text-[var(--ink-1)] group-hover:text-[var(--brand)] transition-colors`}>
          <Link href={`/labs/${lab.slug}`}>{lab.name}</Link>
        </h2>
        <p className="text-xs font-mono text-[var(--brand)] mb-4 dir-ltr text-right">{lab.nameEn}</p>

        <p className={`text-sm text-[var(--ink-2)] leading-relaxed mb-6 ${featured ? "line-clamp-4" : "line-clamp-3"}`}>
          {lab.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {lab.focusAreas.map((area) => (
            <span
              key={area}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]"
            >
              {area}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
        <div className="text-[var(--ink-2)] flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1" title="الباحثون"><Users className="w-3.5 h-3.5 text-[var(--brand)]" /> {lab.researchersCount}</span>
          <span className="flex items-center gap-1" title="المشاريع"><FolderGit2 className="w-3.5 h-3.5 text-[var(--brand)]" /> {lab.activeProjectsCount}</span>
          <span className="flex items-center gap-1" title="الأوراق"><FileText className="w-3.5 h-3.5 text-[var(--brand)]" /> {lab.publishedPapersCount}</span>
        </div>
        <Link
          href={`/labs/${lab.slug}`}
          className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
        >
          <span>تفاصيل المختبر</span>
          <ArrowUpLeft className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
