"use client";

import Link from "next/link";
import { ArrowUpLeft, BookOpen, FolderGit2 } from "lucide-react";
import { RESEARCHERS } from "@/lib/data/research-data";
import { motion } from "framer-motion";

export default function BioLeadershipGrid() {
  const leaders = RESEARCHERS.slice(0, 4);

  return (
    <section
      className="c-team-grid py-8 sm:py-16 bg-[#f7f7f5] text-[#222f30] border-b border-[#e4e3e3] relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16">
        
        {/* Split Sidebar + Team Grid Layout (IntegratedBio Company Page) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
          
          {/* Left Sidebar (Col 1 to 4): Leadership Statement */}
          {/* Left Sidebar (Col 1 to 4): Academic Folio & Leadership Statement */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
              <span className="font-bold text-[#222f30] text-sm tracking-normal">07</span>
              <span className="w-5 h-px bg-[#c9cbbe]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
              <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
                فريق التنسيق والمبادرة · CORE STEWARDS
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight leading-[1.22] text-[#222f30] font-kufi">
              فريق المبادرة وبناء المنصة،{" "}
              <span className="text-[#738284] font-normal block sm:inline mt-1 sm:mt-0">
                بينما المعرفة يصنعها الباحثون.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#55696a] leading-relaxed">
              فريقٌ تقني ومعرفي مستقل ييسّر المنصة، يطوّر أدوات النشر المفتوح، ويدير البنية التجريبية — بينما المعرفة الحقيقية يصنعها آلاف الباحثين والمساهمين المستقلين عبر أبحاثهم اليومية.
            </p>
            <div className="pt-2">
              <Link
                href="/researchers"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold font-mono tracking-wider uppercase border-b border-[#222f30] pb-1 hover:gap-3 transition-all"
              >
                <span>فريق العمل والمساهمون ({RESEARCHERS.length})</span>
                <ArrowUpLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Grid (Col 5 to 12): Team Photo / Card Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {leaders.map((person, idx) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Avatar / Monogram Tile */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-center font-mono font-bold text-lg text-[#222f30] group-hover:bg-[#cef79e] transition-colors duration-300">
                      {person.name.split(" ").pop()?.charAt(0) ?? "J"}
                    </div>
                    {person.orcid && (
                      <span className="px-2.5 py-1 rounded-full bg-[#f5f8f7] border border-[#e4e3e3] text-[10px] font-mono text-[#445e5f]">
                        ORCID VERIFIED
                      </span>
                    )}
                  </div>

                  {/* Name and Role */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#222f30] mb-1 group-hover:text-[#162021] transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-xs font-mono text-[#728825] font-semibold mb-3">
                    {person.role}
                  </p>

                  <p className="text-xs sm:text-sm text-[#445e5f] leading-relaxed line-clamp-3 mb-5">
                    {person.bio}
                  </p>
                </div>

                {/* Footer Meta */}
                <div className="pt-4 border-t border-[#e4e3e3] flex items-center justify-between text-xs font-mono text-[#445e5f]">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#222f30]" />
                      {person.papersCount} أوراق
                    </span>
                    <span className="flex items-center gap-1">
                      <FolderGit2 className="w-3.5 h-3.5 text-[#222f30]" />
                      {person.projectsCount} مشاريع
                    </span>
                  </div>
                  <Link
                    href={`/researchers/${person.slug}`}
                    className="text-[#222f30] font-bold hover:text-[#728825] transition-colors"
                  >
                    الملف ←
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
