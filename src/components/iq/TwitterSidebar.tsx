"use client";

import Link from "next/link";
import {
  TrendingUp,
  Search,
  CheckCircle2,
  ShieldCheck,
  UserPlus,
  ArrowUpLeft,
} from "lucide-react";
import {
  IRAQI_TRENDING,
  SUGGESTED_USERS,
  type IraqiTrendingTopic,
} from "@/lib/data/iq-social-data";

interface TwitterSidebarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onTagClick: (tag: string) => void;
}

export default function TwitterSidebar({
  searchQuery,
  onSearchChange,
  onTagClick,
}: TwitterSidebarProps) {
  return (
    <aside className="space-y-4 font-sans text-[#222f30]" dir="rtl">
      {/* 1. Twitter Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ابحث في الميدان أو التغريدات..."
          className="w-full h-11 pr-10 pl-4 bg-white border border-[#e4e3e3] focus:border-[#a7e26e] rounded-full text-[#222f30] text-xs sm:text-sm outline-none shadow-xs transition-colors placeholder-[#55696a]/60 font-sans"
        />
        <Search className="w-4 h-4 text-[#55696a] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* 2. Trending in Iraq (الترند في العراق) */}
      <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e3e3]">
          <h3 className="font-kufi font-bold text-sm text-[#222f30] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#728825]" />
            <span>الترند في العراق الآن</span>
          </h3>
          <span className="text-[10px] font-mono text-[#55696a]">مباشر</span>
        </div>

        <div className="divide-y divide-[#e4e3e3]/70">
          {IRAQI_TRENDING.map((trend) => (
            <div
              key={trend.id}
              onClick={() => onTagClick(trend.tag)}
              className="py-2.5 hover:bg-[#f7f7f5] px-1.5 rounded-lg transition-colors cursor-pointer group"
            >
              <span className="text-[10px] font-mono text-[#55696a] block">
                {trend.category}
              </span>
              <span className="font-kufi font-bold text-xs sm:text-sm text-[#222f30] group-hover:text-[#162021] block">
                #{trend.tag}
              </span>
              <span className="text-[10px] font-mono text-[#55696a]/80 block">
                {trend.postsCount} مشاركة وتغريدة
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Who to Follow / Recommended Iraqi Contributors */}
      <div className="p-4 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e3e3]">
          <h3 className="font-kufi font-bold text-sm text-[#222f30] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#728825]" />
            <span>أبرز المساهمين الموثقين</span>
          </h3>
          <span className="text-[10px] font-mono text-[#728825] font-bold">موثق 🇮🇶</span>
        </div>

        <div className="space-y-3">
          {SUGGESTED_USERS.map((user) => (
            <div
              key={user.id}
              className="flex items-start justify-between gap-2 p-2 rounded-xl hover:bg-[#f7f7f5] transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#222f30] text-[#cef79e] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {user.name.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 leading-none mb-1">
                    <span className="font-bold text-xs text-[#222f30] truncate">
                      {user.name}
                    </span>
                    {user.isVerified && (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#222f30] text-[#cef79e] inline-flex items-center justify-center text-[9px] font-bold shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-[#55696a] block dir-ltr text-right">
                    @{user.handle}
                  </span>
                  <p className="text-[11px] text-[#55696a] leading-tight mt-0.5 line-clamp-1 font-sans">
                    {user.bio}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSearchChange(user.name)}
                className="px-2.5 py-1 rounded-full bg-[#222f30] hover:bg-[#162021] text-white text-[10px] font-mono font-bold shrink-0 cursor-pointer shadow-2xs transition-all"
              >
                متابعة
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Mini Footer Links */}
      <div className="px-2 text-[11px] font-mono text-[#55696a]/70 flex items-center gap-2 flex-wrap">
        <Link href="/iq" className="hover:underline">نبض هسه</Link>
        <span>·</span>
        <Link href="/iq/map" className="hover:underline">الخريطة</Link>
        <span>·</span>
        <Link href="/" className="hover:underline">JEMO LABS</Link>
        <span>·</span>
        <span>© 2026 هسه</span>
      </div>
    </aside>
  );
}
