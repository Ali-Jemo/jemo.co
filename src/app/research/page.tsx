import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchSearchFilter from "@/components/ResearchSearchFilter";
import { RESEARCH_PAPERS } from "@/lib/data/research-data";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "الأبحاث العلمية | JEMO LABS",
  description: "المستودع الرقمي للأوراق والأبحاث العلمية المحكمة من مختبرات JEMO LABS.",
};

export default function ResearchIndexPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-16 bg-[var(--bg)]">
        <div className="container">
          <div className="max-w-4xl mb-8 sm:mb-12 border-b-2 border-[var(--ink)] pb-6 sm:pb-10">
            <div className="flex items-center gap-2 text-[var(--brand)] text-xs sm:text-sm font-bold font-mono uppercase tracking-widest mb-4 sm:mb-6">
              <span className="bg-[var(--brand)] text-white px-2 py-0.5 rounded-sm">JEMO_LABS</span>
              <span>/ OPEN_RESEARCH</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-[var(--ink-1)] mb-4 sm:mb-6 leading-tight tracking-tight">
              الأوراق البحثية المحكمة.
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-[var(--ink-2)] leading-relaxed max-w-2xl font-mono">
              {">"} نشر مفتوح للشيفرات المصدرية، البيانات، والمنهجيات. كافة الأوراق والنسخ المسبقة متاحة مجاناً للمجتمع العلمي.
            </p>
          </div>
        </div>
        
        {/* Mistral-style Ticker Tape */}
        <div className="w-full bg-[var(--ink-1)] text-white overflow-hidden py-2 sm:py-3 mb-10 sm:mb-16 border-y-2 border-black flex items-center font-mono text-xs sm:text-sm tracking-widest uppercase whitespace-nowrap">
          <div className="flex w-fit animate-[marquee_20s_linear_infinite]">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <span className="mx-8">ARTIFICIAL INTELLIGENCE</span>
                <span className="text-[var(--brand)]">✦</span>
                <span className="mx-8">MICROKERNELS</span>
                <span className="text-[var(--brand)]">✦</span>
                <span className="mx-8">COMPUTER VISION</span>
                <span className="text-[var(--brand)]">✦</span>
                <span className="mx-8">OPEN SOURCE</span>
                <span className="text-[var(--brand)]">✦</span>
                <span className="mx-8">ROBOTICS</span>
                <span className="text-[var(--brand)]">✦</span>
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <ResearchSearchFilter papers={RESEARCH_PAPERS} />
        </div>
      </main>
      <Footer />
    </>
  );
}
