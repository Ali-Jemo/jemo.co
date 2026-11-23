"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Show } from "@clerk/nextjs";
import { useAuth } from "@/lib/auth-context";
import JemoUserButton from "@/components/JemoUserButton";
import { isClerkConfigured } from "@/lib/clerk-config";

const CommandPalette = dynamic(() => import("@/components/CommandPalette"), { ssr: false });

function SignedOut({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) return <>{children}</>;
  return <Show when="signed-out">{children}</Show>;
}

function SignedIn({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured()) return null;
  return <Show when="signed-in">{children}</Show>;
}

const NAV_ITEMS = [
  { href: "/research", label: "السجلات" },
  { href: "/projects", label: "المشاريع" },
  { href: "/explain", label: "كيف يعمل" },
  { href: "/about", label: "عن JEMO" },
  { href: "/contact", label: "تواصل" },
];

function isActive(pathname: string, href: string) {
  if (href === "/research") return pathname.startsWith("/research");
  if (href === "/projects") return pathname.startsWith("/projects");
  if (href === "/explain") return pathname.startsWith("/explain");
  return pathname === href;
}

export default function Header() {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { profile, logout } = useAuth();

  useEffect(() => {
    const behind = (): HTMLElement[] =>
      [document.querySelector("main"), document.querySelector("footer"), document.querySelector('nav[aria-label="التنقل السريع على الهاتف"]')].filter(Boolean) as HTMLElement[];
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      behind().forEach((el) => {
        el.inert = true;
      });
    } else {
      document.body.style.overflow = "";
      behind().forEach((el) => {
        el.inert = false;
      });
    }
    return () => {
      document.body.style.overflow = "";
      behind().forEach((el) => {
        el.inert = false;
      });
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  useEffect(() => {
    let lastY = Math.max(0, window.scrollY);
    let isHidden = false;
    let downAccum = 0;
    let upAccum = 0;
    let ticking = false;
    let rafId: number | null = null;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        const diff = y - lastY;
        lastY = y;
        setScrolled(y > 20);
        if (mobileMenuOpen || y <= 64) {
          if (isHidden) {
            isHidden = false;
            setHidden(false);
          }
          downAccum = 0;
          upAccum = 0;
          ticking = false;
          return;
        }
        if (diff > 0) {
          upAccum = 0;
          if (!isHidden) {
            downAccum += diff;
            if (downAccum >= 30) {
              isHidden = true;
              setHidden(true);
              downAccum = 0;
            }
          }
        } else if (diff < 0) {
          downAccum = 0;
          if (isHidden) {
            upAccum += Math.abs(diff);
            if (upAccum >= 25) {
              isHidden = false;
              setHidden(false);
              upAccum = 0;
            }
          }
        }
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mobileMenuOpen]);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  return (
    <>
      <CommandPalette />
      <header
        className={`fixed top-0 z-50 w-full border-b backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          mobileMenuOpen
            ? "border-white/10 bg-[#0c1415] text-white"
            : scrolled
              ? "border-[#e4e3e3] bg-[#f7f7f5]/96 text-[#1c2829] shadow-sm"
              : "border-[#e4e3e3]/80 bg-[#f7f7f5]/90 text-[#1c2829]"
        }`}
      >
        <div dir="rtl" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="JEMO LABS الرئيسية">
            <Image src="/jemo-logo.svg" alt="" width={32} height={32} className="h-8 w-8" />
            <span className="font-mono text-base font-black">jemo labs</span>
          </Link>

          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3 py-2 text-xs font-bold ${
                    active ? "bg-[#1c2829] text-white" : "text-[#243233] hover:bg-black/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4e3e3] bg-white text-[#1c2829]"
              aria-label="بحث"
            >
              <Search size={16} />
            </button>
            <SignedOut>
              <Link href="/sign-in" className="hidden rounded-full px-3 py-2 text-xs font-bold sm:inline">
                دخول
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="hidden text-xs font-bold sm:inline">
                لوحة التحكم
              </Link>
              <JemoUserButton />
            </SignedIn>
            <Link
              href="/publish"
              className={`inline-flex min-h-10 items-center rounded-full bg-[#1c2829] px-3 text-xs font-bold text-white ${
                mobileMenuOpen ? "hidden" : ""
              }`}
            >
              انشر سجلاً
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">القائمة</span>
              <span aria-hidden="true" className="text-lg leading-none">
                {mobileMenuOpen ? "×" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <nav dir="rtl" aria-label="قائمة الجوال" className="border-t border-white/10 bg-[#0c1415] px-4 py-4 text-white lg:hidden">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="flex min-h-11 items-center rounded-xl px-3 text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                  الرئيسية
                </Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex min-h-11 items-center rounded-xl px-3 text-sm font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/publish" className="flex min-h-11 items-center rounded-xl bg-[#cef79e] px-3 text-sm font-bold text-[#162224]" onClick={() => setMobileMenuOpen(false)}>
                  انشر سجلاً
                </Link>
              </li>
            </ul>
            {profile ? (
              <button
                type="button"
                className="mt-4 min-h-11 w-full rounded-xl border border-white/15 text-sm"
                onClick={() => {
                  void logout().finally(() => {
                    setMobileMenuOpen(false);
                    router.push("/");
                  });
                }}
              >
                خروج
              </button>
            ) : (
              <SignedOut>
                <Link href="/sign-in" className="mt-4 flex min-h-11 items-center justify-center rounded-xl border border-white/20 text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
                  تسجيل الدخول
                </Link>
              </SignedOut>
            )}
          </nav>
        ) : null}
      </header>
    </>
  );
}
