"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, MapPin, BookOpen, User } from "lucide-react";

const NAV_TABS = [
  {
    href: "/iq",
    label: "هسه",
    icon: Activity,
    exact: true,
  },
  {
    href: "/iq/map",
    label: "خريطة",
    icon: MapPin,
    exact: false,
  },
  {
    href: "/iq/intel",
    label: "دليل",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/iq/me",
    label: "أنا",
    icon: User,
    exact: false,
  },
];

export default function IqBottomNav() {
  const pathname = usePathname() ?? "/iq";

  return (
    <nav
      aria-label="التنقل الرئيسي لمنصة هسه العراقية"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e4e3e3] bg-white/95 text-[#55696a] shadow-[0_-8px_24px_rgba(9,9,11,0.06)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom,0px)" }}
      dir="rtl"
    >
      <div className="grid h-16 grid-cols-4 items-stretch px-1">
        {NAV_TABS.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#222f30] active:scale-95 ${
                isActive ? "text-[#222f30]" : "text-[#55696a] hover:text-[#222f30]"
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 h-1 w-8 rounded-full bg-[#a7e26e]"
                />
              )}
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-[#cef79e]/60" : "bg-transparent"
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={isActive ? 2.5 : 1.8}
                  aria-hidden="true"
                />
              </span>
              <span className={`text-[11px] ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
