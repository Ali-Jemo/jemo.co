"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, HelpCircle, Search } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const isPublishActive = pathname === "/publish";

  return (
    <nav
      aria-label="التنقل السريع على الهاتف"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0c1415]/95 backdrop-blur-2xl border-t border-white/10 text-white shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
      dir="rtl"
    >
      <div className="grid grid-cols-5 h-14 items-center px-1">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
            pathname === "/" ? "text-[#bef264]" : "text-white/70 hover:text-white"
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-mono tracking-tight font-medium">الرئيسية</span>
        </Link>

        {/* 2. Research / Feed */}
        <Link
          href="/research"
          className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
            pathname.startsWith("/research") ? "text-[#bef264]" : "text-white/70 hover:text-white"
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-mono tracking-tight font-medium">السجلات</span>
        </Link>

        {/* 3. Center Elevated Publish Button */}
        <Link
          href="/publish"
          className="flex flex-col items-center justify-center -mt-4 active:scale-90 transition-transform"
          aria-label="انشر بحثك"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0c1415] ${
              isPublishActive
                ? "bg-[#bef264] text-[#162224] shadow-[#bef264]/40"
                : "bg-gradient-to-tr from-[#bef264] to-[#a3e635] text-[#162224] shadow-black/40"
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[8px] font-mono font-bold text-[#bef264] mt-0.5">انشر</span>
        </Link>

        {/* 4. Open Questions */}
        <Link
          href="/questions"
          className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
            pathname.startsWith("/questions") ? "text-[#bef264]" : "text-white/70 hover:text-white"
          }`}
        >
          <HelpCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-mono tracking-tight font-medium">المعضلات</span>
        </Link>

        {/* 5. Search Trigger */}
        <button
          onClick={triggerSearch}
          className="flex flex-col items-center justify-center h-full text-white/70 hover:text-white transition-all active:scale-90 cursor-pointer"
          aria-label="البحث"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[9px] font-mono tracking-tight font-medium">بحث</span>
        </button>
      </div>
    </nav>
  );
}
