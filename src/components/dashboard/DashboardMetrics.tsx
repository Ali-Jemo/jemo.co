"use client";

import React from "react";
import { FileText, Repeat, Scale, ShieldCheck } from "lucide-react";
import type { ResearcherProfile } from "@/lib/auth-context";
import { cardClass, IconChip } from "@/components/dashboard/ui";

interface DashboardMetricsProps {
  profile: ResearcherProfile;
  publishedCount: number;
  replicationsCount: number;
  onSelectTab: (tab: "research" | "replications" | "bookmarks" | "api" | "settings") => void;
}

export default function DashboardMetrics({
  profile,
  publishedCount,
  replicationsCount,
  onSelectTab,
}: DashboardMetricsProps) {
  const displayPublished = publishedCount || profile.stats.publishedCount || 0;
  const displayReplications = replicationsCount || profile.stats.replicationsCount || 0;
  const displayContributions = profile.stats.contributionsCount || 0;
  const displayProofScore = profile.stats.evidenceScore || 92;

  const cards = [
    {
      key: "research",
      tab: "research" as const,
      label: "كائنات البحث الموثقة",
      en: "Research Objects",
      value: `${displayPublished}`,
      valueClass: "text-[#222f30]",
      icon: <FileText className="w-4 h-4" />,
      accent: "lime" as const,
      hoverBorder: "hover:border-[#a7e26e]",
    },
    {
      key: "replications",
      tab: "replications" as const,
      label: "إعادات التجارب المحققة",
      en: "Replications Verified",
      value: `${displayReplications}×`,
      valueClass: "text-[#222f30]",
      icon: <Repeat className="w-4 h-4" />,
      accent: "purple" as const,
      hoverBorder: "hover:border-purple-300",
    },
    {
      key: "contributions",
      tab: "replications" as const,
      label: "المراجعات والتحديات",
      en: "Peer Contributions",
      value: `${displayContributions}`,
      valueClass: "text-[#222f30]",
      icon: <Scale className="w-4 h-4" />,
      accent: "amber" as const,
      hoverBorder: "hover:border-amber-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {cards.map((card) => (
        <button
          key={card.key}
          type="button"
          onClick={() => onSelectTab(card.tab)}
          className={`${cardClass} p-5 text-right transition-all ${card.hoverBorder} hover:shadow-sm cursor-pointer group flex flex-col justify-between gap-3`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#738284] group-hover:text-[#222f30] transition-colors">
              {card.label}
            </span>
            <IconChip accent={card.accent} size="md">
              {card.icon}
            </IconChip>
          </div>
          <div>
            <div className={`text-2xl sm:text-3xl font-black font-mono ${card.valueClass}`}>
              {card.value}
            </div>
            <span className="text-[11px] text-[#738284] font-mono mt-1 flex items-center justify-between">
              <span>{card.en}</span>
              <span className="font-bold group-hover:translate-x-[-2px] transition-transform">➔</span>
            </span>
          </div>
        </button>
      ))}

      {/* Proof Score */}
      <div className={`${cardClass} p-5 text-right flex flex-col justify-between gap-3`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-[#738284]">
            درجة الإثبات (Proof Score)
          </span>
          <IconChip accent="emerald" size="md">
            <ShieldCheck className="w-4 h-4" />
          </IconChip>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600">
            {displayProofScore}%
          </div>
          <div className="mt-2 space-y-1">
            <div className="w-full h-1.5 rounded-full bg-[#f0f2f0] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${displayProofScore}%` }}
              />
            </div>
            <span className="text-[10px] text-emerald-700 font-mono block">
              Evidence-Backed Reliability • TypeSafe Jev
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
