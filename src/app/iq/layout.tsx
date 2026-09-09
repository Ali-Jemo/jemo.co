import type { Metadata } from "next";
import Link from "next/link";
import IqBottomNav from "@/components/iq/IqBottomNav";
import EmergencyHotlines from "@/components/iq/EmergencyHotlines";
import { ArrowUpLeft, Building2 } from "lucide-react";
export const metadata: Metadata = {
  title: "هسه — نبض العراق ودليل الخدمات اليومية",
  description: "المنصة اليومية للمواطن العراقي: سعر صرف الدولار، الذهب، أمبير المولد، الغاز، خريطة المحلات الشعبية، ودليل المعاملات الحي.",
  keywords: [
    "سعر الدولار اليوم في العراق",
    "بورصة الكفاح",
    "بورصة الحارثية",
    "سعر الذهب في بغداد",
    "سعر أمبير المولد",
    "خريطة العراق",
    "دليل المعاملات",
    "هسه العراق",
    "JEMO LABS"
  ],
};

export default function IqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#222f30] flex flex-col font-sans selection:bg-[#cef79e] selection:text-[#222f30]" dir="rtl">
      {/* Top Universal Bridge Bar to Jemo Labs */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#e4e3e3] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          
          {/* Right: App Brand & Slogan */}
          <div className="flex items-center gap-3">
            <Link href="/iq" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#222f30] text-[#cef79e] flex items-center justify-center font-mono font-black text-sm shadow-xs group-hover:scale-105 transition-transform">
                هـ
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-kufi font-black text-base text-[#222f30] tracking-tight leading-none group-hover:text-[#162021] transition-colors">
                    هسه
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e] animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-[#55696a] leading-none mt-0.5">
                  النبض العراقي اليومي
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-[#e4e3e3] mx-1" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
              <Link
                href="/iq"
                className="px-3 py-1.5 rounded-full text-[#55696a] hover:text-[#222f30] hover:bg-black/[0.04] transition-colors"
              >
                النبض والأدوات
              </Link>
              <Link
                href="/iq/map"
                className="px-3 py-1.5 rounded-full text-[#55696a] hover:text-[#222f30] hover:bg-black/[0.04] transition-colors"
              >
                خريطة المحلة
              </Link>
              <Link
                href="/iq/intel"
                className="px-3 py-1.5 rounded-full text-[#55696a] hover:text-[#222f30] hover:bg-black/[0.04] transition-colors"
              >
                دليل وتجارب
              </Link>
              <Link
                href="/iq/me"
                className="px-3 py-1.5 rounded-full text-[#55696a] hover:text-[#222f30] hover:bg-black/[0.04] transition-colors"
              >
                المحافظة والحساب
              </Link>
            </nav>
          </div>

          {/* Left: Emergency Hotlines & Jemo Labs Bridge */}
          <div className="flex items-center gap-2">
            <EmergencyHotlines />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#e4e3e3] bg-white hover:bg-[#f0f2f0] text-[#55696a] hover:text-[#222f30] text-[11px] font-mono transition-all group shadow-xs"
              title="العودة إلى الموقع المؤسسي JEMO LABS"
            >
              <Building2 className="w-3.5 h-3.5 text-[#222f30]" />
              <span className="hidden xs:inline">مبادرة من</span>
              <span className="font-bold text-[#222f30]">JEMO LABS</span>
              <ArrowUpLeft className="w-3 h-3 text-[#55696a] group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main App Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20 md:pb-12">
        {children}
      </main>

      {/* Mobile 4-Tab Navigation */}
      <IqBottomNav />
    </div>
  );
}
