import type { Metadata } from "next";
import Link from "next/link";
import IqBottomNav from "@/components/iq/IqBottomNav";
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
    <div className="min-h-screen bg-[#080c0d] text-[#e8f0f0] flex flex-col font-sans selection:bg-[#bef264] selection:text-[#0c1415]" dir="rtl">
      {/* Top Universal Bridge Bar to Jemo Labs */}
      <header className="sticky top-0 z-40 w-full bg-[#0c1415]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          
          {/* Right: App Brand & Slogan */}
          <div className="flex items-center gap-3">
            <Link href="/iq" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#bef264] to-[#a3e635] text-[#111c1e] flex items-center justify-center font-mono font-black text-sm shadow-md group-hover:scale-105 transition-transform">
                هـ
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-kufi font-black text-base text-white tracking-tight leading-none group-hover:text-[#bef264] transition-colors">
                    هسه
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-white/60 leading-none mt-0.5">
                  النبض العراقي اليومي
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-white/15 mx-1" />

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-mono">
              <Link
                href="/iq"
                className="px-3 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                النبض والأدوات
              </Link>
              <Link
                href="/iq/map"
                className="px-3 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                خريطة المحلة
              </Link>
              <Link
                href="/iq/intel"
                className="px-3 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                دليل وتجارب
              </Link>
              <Link
                href="/iq/me"
                className="px-3 py-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                المحافظة والحساب
              </Link>
            </nav>
          </div>

          {/* Left: Bridge back to Jemo Labs Institutional Home */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#bef264] text-[11px] font-mono transition-all group"
              title="العودة إلى الموقع المؤسسي JEMO LABS"
            >
              <Building2 className="w-3.5 h-3.5 text-[#bef264]" />
              <span className="hidden xs:inline">مبادرة من</span>
              <span className="font-bold text-white group-hover:text-[#bef264]">JEMO LABS</span>
              <ArrowUpLeft className="w-3 h-3 text-white/60 group-hover:-translate-x-0.5 transition-transform" />
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
