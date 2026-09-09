"use client";

import Link from "next/link";
import { ArrowUpLeft, BookOpen, FolderGit2, Check } from "lucide-react";
import { RESEARCHERS } from "@/lib/data/research-data";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StaggerReveal from "@/components/StaggerReveal";

// ponytail: static researcher cards, no framer-motion on individual cards — StaggerReveal handles entrance.
export default function ResearchTeamShowcase() {
  const featured = RESEARCHERS.slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader
          eyebrow="فريق الباحثين"
          title="الكادر العلمي في JEMO LABS"
          description="بُحّاث ومهندسو نظم عراقيون يقودون أبحاثاً في النوى الذكية والذكاء الاصطناعي والرؤية الحاسوبية."
        />
        <Link
          href="/researchers"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand)] hover:underline shrink-0"
        >
          <span>كافة الباحثين ({RESEARCHERS.length})</span>
          <ArrowUpLeft className="w-4 h-4" />
        </Link>
      </div>

      <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6" stagger={0.06}>
        {featured.map((r) => (
          <Link key={r.id} href={`/researchers/${r.slug}`}>
            <Card hover className="p-4 sm:p-6 h-full flex flex-col justify-between group">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/20 flex items-center justify-center text-[var(--brand)] font-mono font-bold text-xs sm:text-sm shrink-0 group-hover:bg-[var(--brand)]/20 transition-colors">
                  {r.name.split(" ").pop()?.charAt(0) ?? "?"}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[var(--ink-1)] truncate group-hover:text-[var(--brand)] transition-colors">
                    {r.name}
                  </h3>
                  <p className="text-[11px] text-[var(--brand)] font-mono truncate">{r.role}</p>
                </div>
              </div>

              <p className="text-xs text-[var(--ink-2)] leading-relaxed line-clamp-2 mb-4">
                {r.bio}
              </p>

              <div className="flex items-center gap-4 pt-3 border-t border-[var(--line)] text-[10px] font-mono text-[var(--ink-2)]">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-[var(--brand)]" />
                  {r.papersCount} أوراق
                </span>
                <span className="flex items-center gap-1">
                  <FolderGit2 className="w-3 h-3 text-[var(--brand)]" />
                  {r.projectsCount} مشاريع
                </span>
                {r.orcid && (
                  <span className="text-[var(--brand)] mr-auto flex items-center gap-1">
                    <span>ORCID</span>
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </StaggerReveal>
    </div>
  );
}
