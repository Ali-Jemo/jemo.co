"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, BookOpen, Search } from "lucide-react";

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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
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

  const itemClass = (active: boolean) =>
    `flex min-h-11 flex-col items-center justify-center rounded-lg focus-visible:outline-none ${
      active ? "text-[#d6f5a2]" : "text-white/85"
    }`;

  return (
    <>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="العودة إلى أعلى الصفحة"
        aria-hidden={!showScrollTop}
        tabIndex={showScrollTop ? 0 : -1}
        inert={!showScrollTop}
        className={`fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+12px)] left-4 z-40 min-h-11 rounded-full bg-[#0c1415] px-3 text-xs font-bold text-[#d6f5a2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bef264] md:hidden ${
          showScrollTop ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        أعلى
      </button>
      <nav
        aria-label="التنقل السريع على الهاتف"
        className="j-tabbar fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0c1415] pb-[env(safe-area-inset-bottom,0px)] text-white md:hidden"
        dir="rtl"
      >
        <div className="grid h-14 grid-cols-5 items-center px-1" onKeyDown={onTabKeyDown}>
          <Link
            ref={(node) => {
              itemRefs.current[0] = node;
            }}
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={itemClass(pathname === "/")}
          >
            <Home aria-hidden className="mb-0.5 h-5 w-5" />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </Link>
          <Link
            ref={(node) => {
              itemRefs.current[1] = node;
            }}
            href="/research"
            aria-current={pathname.startsWith("/research") ? "page" : undefined}
            className={itemClass(pathname.startsWith("/research"))}
          >
            <Compass aria-hidden className="mb-0.5 h-5 w-5" />
            <span className="text-[10px] font-bold">السجلات</span>
          </Link>
          <Link
            ref={(node) => {
              itemRefs.current[2] = node;
            }}
            href="/publish"
            aria-current={pathname === "/publish" ? "page" : undefined}
            aria-label="انشر سجلاً"
            className="flex flex-col items-center justify-center rounded-full focus-visible:outline-none"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d6f5a2] text-[#162224]">
              <Plus aria-hidden className="h-5 w-5" />
            </span>
            <span className="text-[10px] font-bold text-[#d6f5a2]">انشر</span>
          </Link>
          <Link
            ref={(node) => {
              itemRefs.current[3] = node;
            }}
            href="/explain"
            aria-current={pathname.startsWith("/explain") ? "page" : undefined}
            className={itemClass(pathname.startsWith("/explain"))}
          >
            <BookOpen aria-hidden className="mb-0.5 h-5 w-5" />
            <span className="text-[10px] font-bold">كيف يعمل</span>
          </Link>
          <button
            ref={(node) => {
              itemRefs.current[4] = node;
            }}
            type="button"
            onClick={triggerSearch}
            className={`${itemClass(false)} cursor-pointer`}
            aria-label="بحث"
          >
            <Search aria-hidden className="mb-0.5 h-5 w-5" />
            <span className="text-[10px] font-bold">بحث</span>
          </button>
        </div>
      </nav>
    </>
  );
}
