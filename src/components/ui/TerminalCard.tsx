"use client";

import React from "react";
import Link from "next/link";
import { FolderGit2, ArrowUpLeft, Users } from "lucide-react";
import { Project } from "@/lib/data/research-data";

interface TerminalCardProps {
  project: Project;
  featured?: boolean;
}

export default function TerminalCard({ project, featured = false }: TerminalCardProps) {
  return (
    <div className={`relative group flex flex-col overflow-hidden rounded-xl border border-[var(--line)] bg-[#0d1117] transition-all hover:border-[var(--brand)]/60 shadow-lg hover:shadow-[var(--brand)]/10 ${featured ? 'md:col-span-2' : 'col-span-1'}`}>
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div className="text-[10px] font-mono text-[#8b949e] tracking-wider select-none">
          bash — {project.id}.sh
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
        
        {/* Animated Typing Cursor Effect */}
        <div className="text-[10px] font-mono text-[#8b949e] mb-4 uppercase tracking-widest flex items-center gap-2">
          <span className="text-[#3fb950] font-bold">~</span>
          <span>./execute --lab="{project.status}"</span>
          <span className="w-1.5 h-3 bg-[var(--brand)] animate-pulse" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[var(--brand)] transition-colors font-mono">
            <Link href={`/projects/${project.slug}`} className="before:absolute before:inset-0">
              {project.title}
            </Link>
          </h3>
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[#8b949e] hover:text-white transition-colors relative z-20">
              <FolderGit2 className="w-5 h-5" />
            </a>
          )}
        </div>

        <p className="text-[#8b949e] text-xs font-mono mb-4 dir-ltr text-right">{project.titleEn}</p>
        
        <p className="text-[#c9d1d9] text-sm leading-relaxed line-clamp-3 mb-8">
          {project.description}
        </p>

        <div className="mt-auto">
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 rounded bg-[#21262d] border border-[#30363d] text-[10px] font-mono text-[#58a6ff]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#30363d] flex items-center justify-between text-xs">
            <div className="text-[#8b949e] flex items-center gap-1.5 font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>{project.team.length}</span>
            </div>
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center gap-1.5 font-bold text-[#58a6ff] hover:text-[#79c0ff] transition-colors relative z-20"
            >
              <span className="font-mono text-[10px] uppercase">Initialize</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
