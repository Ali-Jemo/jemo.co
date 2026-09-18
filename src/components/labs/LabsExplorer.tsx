"use client";

import React, { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Sparkles, PlusCircle } from "lucide-react";
import LabBentoCard from "@/components/ui/LabBentoCard";
import type { Lab } from "@/lib/data/research-data";
import Link from "next/link";

interface LabsExplorerProps {
  labs: Lab[];
}

interface CategoryOption {
  id: string;
  label: string;
  enLabel: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "جميع التخصصات وصنوف المعرفة", enLabel: "All Knowledge Domains" },
  { id: "cs-ai", label: "علوم الحاسوب والذكاء الاصطناعي", enLabel: "CS & AI" },
  { id: "hardware-quantum", label: "العتاد والفيزياء الكمية", enLabel: "Hardware & Quantum" },
  { id: "robotics-aerospace", label: "الروبوتات وتكنولوجيا الفضاء", enLabel: "Robotics & Space" },
  { id: "bio-health", label: "العلوم الحيوية والطبية والزراعية", enLabel: "Bio, Medicine & Agri" },
  { id: "physics-chemistry", label: "الفيزياء والكيمياء والفلك والأرض", enLabel: "Physics, Chem & Astronomy" },
  { id: "islamic-philosophy", label: "العلوم الشرعية والفلسفة والمنطق", enLabel: "Islamic & Philosophy" },
  { id: "humanities-social", label: "اللسانيات والعلوم الإنسانية والآثار", enLabel: "Linguistics, Humanities & Archaeology" },
];

export default function LabsExplorer({ labs }: LabsExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: labs.length };
    labs.forEach((lab) => {
      const cat = lab.category || "cs-ai";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [labs]);

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) => {
      // Category filter
      if (selectedCategory !== "all" && lab.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const inName = lab.name.toLowerCase().includes(q);
        const inNameEn = lab.nameEn.toLowerCase().includes(q);
        const inDesc = lab.description.toLowerCase().includes(q);
        const inFocus = lab.focusAreas.some((area) => area.toLowerCase().includes(q));
        const inLead = lab.leadName.toLowerCase().includes(q);
        return inName || inNameEn || inDesc || inFocus || inLead;
      }
      return true;
    });
  }, [labs, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Toolbar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#445e5f]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في جميع صنوف المعرفة (مثل: علوم شرعية، فلك، كيمياء، Quantum, LLMs, جينوم، آثار)..."
              className="w-full pl-4 pr-11 py-3 text-sm rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] text-[#222f30] placeholder-[#859f9f] focus:outline-none focus:border-[#a7e26e] focus:bg-white transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[#445e5f] hover:text-[#222f30] px-2 py-0.5 rounded-md bg-[#e4e3e3]"
              >
                مسح
              </button>
            )}
          </div>

          {/* Matches Counter & Status */}
          <div className="flex items-center gap-2 shrink-0 px-3 py-2 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] text-xs font-mono text-[#445e5f]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#222f30]" />
            <span>عرض {filteredLabs.length} من أصل {labs.length} مختبراً</span>
          </div>
        </div>

        {/* Quick Academic Keyword Tags */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#445e5f]">
          <span className="font-mono text-[11px] text-[#859f9f] shrink-0">أبحاث وتخصصات:</span>
          {[
            "علوم شرعية",
            "فلسفة ومنطق",
            "لسانيات عربية",
            "فلك وكونيات",
            "كيمياء جزيئية",
            "علم الآثار",
            "LLMs",
            "Microkernel",
            "Quantum",
            "RISC-V",
            "Genomics",
            "Robotics",
            "Nanotech",
            "Clean Energy",
          ].map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => setSearchQuery(kw)}
              className="px-2.5 py-1 rounded-lg bg-[#f7f7f5] hover:bg-[#e4e3e3] text-[#222f30] font-mono text-[11px] transition-colors border border-[#e4e3e3] cursor-pointer"
            >
              #{kw}
            </button>
          ))}
        </div>

        {/* Categories Tab Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.id;
            const count = categoryCounts[category.id] || 0;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                type="button"
                className={`whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#222f30] text-white shadow-sm"
                    : "bg-[#f7f7f5] text-[#445e5f] hover:bg-[#ecece9] hover:text-[#222f30] border border-[#e4e3e3]"
                }`}
              >
                <span>{category.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                    isActive ? "bg-[#cef79e] text-[#222f30]" : "bg-[#e4e3e3] text-[#445e5f]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Labs */}
      {filteredLabs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
          {filteredLabs.map((lab, idx) => {
            const isFeatured = selectedCategory === "all" && searchQuery === "" && idx === 0;
            return (
              <LabBentoCard
                key={lab.id}
                lab={lab}
                featured={isFeatured}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#cef79e]/30 border border-[#a7e26e] flex items-center justify-center mx-auto mb-4 text-[#222f30]">
            <Sparkles className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h3 className="text-xl font-bold text-[#222f30] mb-2 font-kufi">
            لم نجد مختبراً يطابق هذا البحث حالياً
          </h3>
          <p className="text-sm text-[#445e5f] max-w-md mx-auto mb-6 leading-relaxed">
            هل تقود بحثاً في هذا التخصص أو ترغب في تدشين برنامج علمي غير متاح بالقائمة؟ نفتح الأبواب لكل العلماء لتأسيس مختبرات جديدة برعاية كاملة.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-full border border-[#e4e3e3] bg-[#f7f7f5] text-xs font-semibold text-[#222f30] hover:bg-[#e4e3e3] transition-colors"
            >
              إعادة ضبط الفلاتر
            </button>
            <Link
              href="/apply"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#222f30] text-white text-xs font-semibold hover:bg-[#cef79e] hover:text-[#222f30] transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>اقترح تأسيس مختبرك الآن</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
