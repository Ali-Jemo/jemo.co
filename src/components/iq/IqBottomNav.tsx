"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, MapPin, BookOpen, User } from "lucide-react";

const NAV_TABS = [
  {
    href: "/iq",
    label: "هسه",
    subLabel: "النبض والأدوات",
    icon: Activity,
    exact: true,
  },
  {
    href: "/iq/map",
    label: "خريطة",
    subLabel: "محلات المحلة",
    icon: MapPin,
    exact: false,
  },
  {
    href: "/iq/intel",
    label: "دليل",
    subLabel: "تجارب ومعاملات",
    icon: BookOpen,
    exact: false,
  },
  {
    href: "/iq/me",
    label: "أنا",
    subLabel: "المحافظة والحساب",
    icon: User,
    exact: false,
  },
];

export default function IqBottomNav() {
  const pathname = usePathname() ?? "/iq";

  return (
    <nav
      aria-label="التنقل الرئيسي لمنصة هسه العراقية"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0c1415]/95 backdrop-blur-md border-t border-white/10 text-white shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
      dir="rtl"
    >
      <div className="grid grid-cols-4 h-14 items-center px-1">
        {NAV_TABS.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center h-full transition-all active:scale-90 ${
                isActive ? "text-[#bef264]" : "text-white/60 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#bef264]" />
                )}
              </div>
              <span className={`text-[10px] font-mono tracking-tight ${isActive ? "font-bold" : "font-medium"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
