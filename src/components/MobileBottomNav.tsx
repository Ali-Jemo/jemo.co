"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, HelpCircle, Search, ArrowUp } from "lucide-react";

const TAB_COUNT = 5;

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";
  const [showScrollTop, setShowScrollTop] = useState(false);
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setShowScrollTop(window.scrollY > 300);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const focusTab = (index: number) => {
    const next = (index + TAB_COUNT) % TAB_COUNT;
    itemRefs.current[next]?.focus();
  };

  const onTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.findIndex((el) => el === document.activeElement);
    if (current < 0) return;
    // DOM order is the RTL reading order: ArrowLeft moves forward.
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusTab(current + 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusTab(current - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(TAB_COUNT - 1);
    }
  };

  const isPublishActive = pathname === "/publish";
  const tabClass = (active: boolean) =>
    `flex flex-col items-center justify-center h-full rounded-lg transition-all active:scale-90 focus-visible:outline-none ${
      active ? "text-[#bef264]" : "text-white/85 hover:text-white"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="العودة إلى القسم الرئيسي في الأعلى"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        inert={!showScrollTop}
        className={`j-on-dark md:hidden fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+12px)] left-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c1415]/95 border border-[#bef264]/30 hover:border-[#bef264] text-[#bef264] shadow-xl shadow-black/50 backdrop-blur-xl active:scale-90 transition-all duration-300 cursor-pointer ${
          showScrollTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp aria-hidden className="w-4 h-4 stroke-[2.5]" />
        <span className="text-[11px] font-mono font-bold tracking-tight">القسم الرئيسي</span>
      </button>

      <nav
        aria-label="التنقل السريع على الهاتف"
        className="j-tabbar md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c1415]/95 backdrop-blur-md border-t border-white/10 text-white shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
        dir="rtl"
      >
        <div className="grid grid-cols-5 h-14 items-center px-1" onKeyDown={onTabKeyDown}>
          <Link
            ref={(node) => { itemRefs.current[0] = node; }}
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToTop();
              }
            }}
            aria-current={pathname === "/" ? "page" : undefined}
            className={tabClass(pathname === "/")}
          >
            <Home aria-hidden className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono tracking-tight font-medium">الرئيسية</span>
          </Link>

          <Link
            ref={(node) => { itemRefs.current[1] = node; }}
            href="/research"
            aria-current={pathname.startsWith("/research") ? "page" : undefined}
            className={tabClass(pathname.startsWith("/research"))}
          >
            <Compass aria-hidden className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono tracking-tight font-medium">السجلات</span>
          </Link>

          <Link
            ref={(node) => { itemRefs.current[2] = node; }}
            href="/publish"
            className="flex flex-col items-center justify-center -mt-4 rounded-full active:scale-90 transition-transform focus-visible:outline-none"
            aria-label="انشر بحثك"
            aria-current={isPublishActive ? "page" : undefined}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-[#0c1415] ${
                isPublishActive
                  ? "bg-[#bef264] text-[#162224] shadow-[#bef264]/40"
                  : "bg-gradient-to-tr from-[#bef264] to-[#a3e635] text-[#162224] shadow-black/40"
              }`}
            >
              <Plus aria-hidden className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[8px] font-mono font-bold text-[#bef264] mt-0.5">انشر</span>
          </Link>

          <Link
            ref={(node) => { itemRefs.current[3] = node; }}
            href="/questions"
            aria-current={pathname.startsWith("/questions") ? "page" : undefined}
            className={tabClass(pathname.startsWith("/questions"))}
          >
            <HelpCircle aria-hidden className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono tracking-tight font-medium">المعضلات</span>
          </Link>

          <button
            ref={(node) => { itemRefs.current[4] = node; }}
            type="button"
            onClick={triggerSearch}
            className={`${tabClass(false)} cursor-pointer`}
            aria-label="البحث"
          >
            <Search aria-hidden className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono tracking-tight font-medium">بحث</span>
          </button>
        </div>
      </nav>
    </>
  );
}
