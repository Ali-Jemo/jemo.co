import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BioButton from "@/components/BioButton";
import { Compass, Search, Home } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها غير موجودة في سجل JEMO.",
};

const SUGGESTED_LINKS = [
  { label: "الأبحاث", href: "/research" },
  { label: "المختبرات", href: "/labs" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        className="flex-1 min-h-[70vh] flex items-center justify-center pt-28 pb-20 px-6 bg-[#f7f7f5]"
        dir="rtl"
      >
        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Error code badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e4e3e3] text-[#445e5f] font-mono text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span dir="ltr">ERROR 404 — PAGE NOT FOUND</span>
          </div>

          {/* Giant glitchy 404 */}
          <h1
            dir="ltr"
            className="font-mono font-bold text-[#222f30] leading-none select-none text-[6rem] sm:text-[9rem] tracking-tighter"
          >
            <span>4</span>
            <span className="inline-block px-2 rounded-2xl bg-[#cef79e] text-[#222f30] -rotate-3">
              0
            </span>
            <span>4</span>
          </h1>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222f30] font-kufi">
              ضاعت الصفحة في الأرشيف
            </h2>
            <p className="text-sm sm:text-base text-[#445e5f] leading-relaxed max-w-md mx-auto">
              يبدو أن الرابط الذي تبحث عنه غير موجود أو تم نقله. لا تقلق —
              المعرفة في JEMO لا تضيع، فقط اتبع أحد الطرق التالية.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <BioButton
              href="/"
              label="BACK HOME"
              secondaryLabel="العودة للرئيسية"
              variant="primary"
              dir="rtl"
            />
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#e4e3e3] bg-white text-xs sm:text-sm font-semibold text-[#222f30] hover:bg-[#e4e3e3] transition-colors"
            >
              <Search className="w-4 h-4" />
              تصفح الأبحاث
            </Link>
          </div>

          {/* Suggested destinations */}
          <div className="pt-6 border-t border-[#e4e3e3]">
            <p className="text-xs text-[#445e5f] font-mono mb-4 flex items-center justify-center gap-1.5">
              <Home className="w-3.5 h-3.5" />
              <span>وجهات مقترحة:</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTED_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full bg-white border border-[#e4e3e3] text-xs font-semibold text-[#445e5f] hover:border-[#bef264] hover:text-[#222f30] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
