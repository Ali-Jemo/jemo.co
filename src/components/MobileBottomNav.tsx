"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, HelpCircle, Search } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname() ?? "/";

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  };

  const navItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/research",
      label: "السجلات",
      icon: Compass,
      isActive: pathname.startsWith("/research"),
    },
    {
      href: "/publish",
      label: "انشر",
      icon: Plus,
      isCenterAction: true,
      isActive: pathname === "/publish",
    },
    {
      href: "/questions",
      label: "المعضلات",
      icon: HelpCircle,
      isActive: pathname.startsWith("/questions"),
    },
  ];

  return (
    <nav
      aria-label="التنقل السريع على الهاتف"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c1415]/95 backdrop-blur-2xl border-t border-white/10 text-white shadow-2xl pb-[env(safe-area-inset-bottom,0px)]"
      dir="rtl"
    >
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 ${
                item.isActive ? "text-[#bef264]" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Center Prominent Publish Action */}
        <Link
          href="/publish"
          className="flex flex-col items-center justify-center -mt-4 active:scale-90 transition-transform"
          aria-label="انشر بحثك أو اكتشافك الآن"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#bef264] to-[#a3e635] text-[#162224] flex items-center justify-center shadow-lg shadow-[#bef264]/25 border-2 border-[#0c1415]">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-mono font-bold text-[#bef264] mt-0.5">
            انشر بحثك
          </span>
        </Link>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center h-full min-h-[44px] transition-all active:scale-95 ${
                item.isActive ? "text-[#bef264]" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-mono font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Search Trigger Button */}
        <button
          onClick={triggerSearch}
          className="flex-1 flex flex-col items-center justify-center h-full min-h-[44px] text-white/70 hover:text-white transition-all active:scale-95 cursor-pointer"
          aria-label="البحث السريع في المنصة"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono font-medium tracking-tight">
            بحث
          </span>
        </button>
      </div>
    </nav>
  );
}
