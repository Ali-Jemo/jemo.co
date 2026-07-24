"use client";

import { useState, useMemo } from "react";
import { Project } from "@/lib/data/research-data";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { FolderGit2, Search, Filter, Users, ArrowUpLeft } from "lucide-react";

interface ProjectSearchFilterProps {
  projects: Project[];
}

export default function ProjectSearchFilter({ projects }: ProjectSearchFilterProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const statuses = ["Research", "Prototype", "Active", "Completed"];

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesQuery =
        query.trim() === "" ||
        proj.title.toLowerCase().includes(query.toLowerCase()) ||
        proj.titleEn.toLowerCase().includes(query.toLowerCase()) ||
        proj.description.toLowerCase().includes(query.toLowerCase()) ||
        proj.techStack.some((t) => t.toLowerCase().includes(query.toLowerCase()));

      const matchesStatus = statusFilter === "all" || proj.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [projects, query, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Search & Filter controls */}
      <Card className="p-6 space-y-4 border-2 border-[var(--brand)]/20">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[var(--ink-2)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="ابحث بعنوان المشروع، وصفه، أو التقنيات المستخدمة..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pr-11 pl-4 py-3 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
            />
          </div>

          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                statusFilter === "all"
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
              }`}
            >
              الكل ({projects.length})
            </button>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-colors ${
                  statusFilter === st
                    ? "bg-[var(--brand)] text-white"
                    : "bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((proj) => (
          <Card key={proj.id} hover className="p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--line)] text-[var(--brand)]">
                  {proj.status}
                </span>
                {proj.githubUrl && (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors text-xs font-mono flex items-center gap-1"
                  >
                    <FolderGit2 className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2 text-[var(--ink-1)] hover:text-[var(--brand)] transition-colors">
                <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
              </h2>

              <p className="text-xs font-mono text-[var(--brand)] mb-3 dir-ltr text-right">{proj.titleEn}</p>

              <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-3 mb-6">
                {proj.description}
              </p>
            </div>

            <div>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-xs font-mono text-[var(--ink-2)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between text-xs">
                <div className="text-[var(--ink-2)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span>{proj.team.length} أعضاء</span>
                </div>
                <Link
                  href={`/projects/${proj.slug}`}
                  className="inline-flex items-center gap-1 font-bold text-[var(--brand)] hover:underline"
                >
                  <span>عرض تفاصيل المشروع</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
