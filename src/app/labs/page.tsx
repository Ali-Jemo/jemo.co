import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LabBentoCard from "@/components/ui/LabBentoCard";
import { getLiveLabs } from "@/lib/live-content";

export const metadata: Metadata = {
  title: "المختبرات البحثية المتخصصة | JEMO LABS",
  description: "مختبرات JEMO LABS للذكاء الاصطناعي، أنظمة التشغيل، الرؤية الحاسوبية، والروبوتات.",
};

export default async function LabsIndexPage() {
  const labs = await getLiveLabs();

  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#f7f7f5]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>المختبرات والمنصات · RESEARCH LABS &amp; PLATFORMS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-4 tracking-tight leading-tight font-kufi">
              المختبرات البحثية المتخصصة.
            </h1>
            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-2xl">
              ستة مختبرات متكاملة تُهندس النوى الذكية، الحوسبة الفائقة، والرؤية الحاسوبية لبناء السيادة العلمية من بغداد إلى العالم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-fr">
            {labs.map((lab, idx) => {
              const isFeatured = idx === 0;
              return (
                <LabBentoCard
                  key={lab.id}
                  lab={lab}
                  featured={isFeatured}
                />
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
