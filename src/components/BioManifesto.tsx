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
          لجميع العلوم · ALL SCIENCES
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-8 max-w-4xl">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] tracking-tight font-kufi text-[#222f30]">
            من العلوم الشرعية والإسلامية، إلى الذكاء الاصطناعي، إلى{" "}
            <span className="text-[#a4a89a]">
              جميع العلوم الطبيعية والطبية والإنسانية في بيت معرفي واحد.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-[#55696a] leading-relaxed max-w-2xl font-normal">
            نحن مؤسسة لجميع العلوم دون استثناء: القرآن وعلومه، الحديث والفقه، اللغة العربية والتراث، الفيزياء والكيمياء والرياضيات، الطب وعلوم الحياة، الفلك والبيئة، الهندسة والحاسوب، والعلوم الإنسانية — نبحث ونوثّق وننشر معرفة مفتوحة للجميع.
          </p>
        </div>

      </div>
    </section>
  );
}
