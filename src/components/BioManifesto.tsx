"use client";

export default function BioManifesto() {
  return (
    <section 
      dir="rtl"
      className="w-full bg-[#f7f7f5] text-[#222f30] py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-b border-[#e4e3e3]"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
        
        {/* Sidebar Label (IntegratedBio style) */}
        <div className="text-xs sm:text-sm font-mono tracking-wider uppercase text-[#738284] font-semibold sticky top-24">
          المنظومة المتكاملة · THE INTEGRATED PLATFORM
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-8 max-w-4xl">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight font-kufi text-[#222f30]">
            دمج النوى التشغيلية، والذكاء الاصطناعي، والحوسبة الفائقة في{" "}
            <span className="text-[#a4a89a]">
              محرك وطني موحّد للاكتشاف العلمي والسيادة التقنية.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#55696a] leading-relaxed max-w-2xl font-normal">
            نحن نبني منظومة متكاملة تجمع بين أحدث نماذج الاستدلال اللغوي والرياضي العربي، ونواة Ziqa البرمجية متناهية الصغر، وعنقود بغداد-١ للحوسبة الفائقة. لا نكتفي بنقل التقنيات — بل نُهندسها من النواة لضمان استقلال علمي كامل.
          </p>
        </div>

      </div>
    </section>
  );
}
