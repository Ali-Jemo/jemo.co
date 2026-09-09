"use client";

import Link from "next/link";
import { Activity, Car, MapPin, BookOpen, ChevronLeft } from "lucide-react";

function getGreeting(hour: number): string {
  if (hour >= 5 && hour < 12) return "صباح الخير، بغداد";
  if (hour >= 12 && hour < 17) return "نهارك سعيد";
  if (hour >= 17 && hour < 22) return "مساء الخير";
  return "ليلة هادئة";
}

export default function IqHero() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = getGreeting(hour);

  const dateStr = new Intl.DateTimeFormat("ar-IQ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  const timeStr = new Intl.DateTimeFormat("ar-IQ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Baghdad",
  }).format(now);

  return (
    <section
      aria-label="تحية النبض اليومي"
      className="relative overflow-hidden rounded-2xl bg-[#222f30] text-white shadow-sm"
    >
      {/* subtle geometric glow, light-weight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23cef79e' stroke-width='1'%3E%3Crect x='16' y='16' width='32' height='32'/%3E%3Crect x='16' y='16' width='32' height='32' transform='rotate(45 32 32)'/%3E%3C/g%3E%3C/svg%3E\")",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#a7e26e]/20 blur-3xl"
      />

      <div className="relative flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-mono text-[#cef79e]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#a7e26e] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#a7e26e]" />
              </span>
              <Activity className="h-3 w-3" aria-hidden="true" />
              <span>النبض العراقي اليومي · بغداد {timeStr}</span>
            </p>
            <h1 className="mt-1.5 font-kufi text-xl font-black tracking-tight text-white sm:text-2xl">
              {greeting} — {dateStr}
            </h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-white/70">
              الدولار، الذهب، الأمبير والغاز، plus دليل المحلة والمعاملات — كلشي
              يهم يومك بمكان واحد.
            </p>
          </div>

          <Link
            href="/iq/me"
            className="group inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-mono text-white/80 transition-colors hover:border-[#a7e26e]/50 hover:text-[#cef79e]"
          >
            <span>منطقتي: بغداد</span>
            <ChevronLeft
              className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* quick actions — anchor navigation, keyboard accessible */}
        <nav
          aria-label="وصول سريع"
          className="grid grid-cols-3 gap-2 text-center"
        >
          <a
            href="#traffic"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#cef79e] px-2 py-2.5 text-xs font-bold text-[#222f30] transition-colors hover:bg-[#a7e26e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cef79e]"
          >
            <Car className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">موقف الجسور</span>
            <span className="xs:hidden sm:hidden">الجسور</span>
          </a>
          <Link
            href="/iq/map"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2 py-2.5 text-xs font-bold text-white transition-colors hover:border-[#a7e26e]/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cef79e]"
          >
            <MapPin className="h-3.5 w-3.5 text-[#cef79e]" aria-hidden="true" />
            <span>خريطة المحلة</span>
          </Link>
          <Link
            href="/iq/intel"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2 py-2.5 text-xs font-bold text-white transition-colors hover:border-[#a7e26e]/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cef79e]"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#cef79e]" aria-hidden="true" />
            <span>دليل المعاملات</span>
          </Link>
        </nav>
      </div>
    </section>
  );
}
