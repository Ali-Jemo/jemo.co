"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, HelpCircle, Search, ArrowUp } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ponytail: native smooth scroll to main section / page top; no heavy scroll lib needed
  const scrollToTop = () => {
    const main = document.querySelector("main");
    if (main && typeof main.scrollIntoView === "function") {
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  if (pathname === "/explain" || pathname === "/summary") {
    return null;
  }

  const isPublishActive = pathname === "/publish";

  return (
    <>
      {/* Floating Back to Main Section Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="العودة إلى القسم الرئيسي في الأعلى"
        className={`md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+12px)] left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c1415]/95 border border-[#bef264]/30 hover:border-[#bef264] text-[#bef264] shadow-xl shadow-black/50 backdrop-blur-xl active:scale-90 transition-all duration-300 cursor-pointer ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
        <span className="text-[11px] font-mono font-bold tracking-tight">القسم الرئيسي</span>
      </button>

      <nav
        aria-label="التنقل السريع على الهاتف"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0c1415]/95 backdrop-blur-md border-t border-white/10 text-white shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
        dir="rtl"
      >
        <div className="grid grid-cols-5 h-14 items-center px-1">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToTop();
              }
            }}
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
    </>
  );
}
