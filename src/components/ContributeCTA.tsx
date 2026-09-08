"use client";

import BioButton from "@/components/BioButton";

export default function ContributeCTA() {
  return (
    <section className="py-20 sm:py-28 bg-[#f7f7f5] border-b border-[#e4e3e3]" dir="rtl">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative rounded-[2.5rem] bg-[#222f30] text-white p-8 sm:p-14 lg:p-20 overflow-hidden shadow-2xl">
          
          {/* Ambient subtle mesh reflection */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#a7e26e] blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#cef79e] blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Copy */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/10 font-mono text-xs uppercase tracking-widest text-white shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
                <span>المجتمع المفتوح · OPEN SCIENCE ALLIANCE</span>
              </div>

              <h2
                style={{ color: "#ffffff" }}
                className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-kufi !text-white"
              >
                ابنِ معنا مستقبل العلم العربي والسيادة الرقمية.
              </h2>

              <p
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
                className="text-base sm:text-lg !text-white/90 leading-relaxed max-w-2xl font-normal"
              >
                نبحث عن باحثين ومطوري نظم يؤمنون بأن المعرفة تُنتج ولا تُستهلك فقط. كل أبحاثنا، خوارزمياتنا، وشيفراتنا البرمجية مفتوحة ومتاحة للمجتمع العلمي الدولي.
              </p>
            </div>

            {/* Actions using BioButton */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end justify-start">
              <BioButton
                href="/join"
                label="JOIN AS RESEARCHER"
                secondaryLabel="انضم كباحث"
                variant="primary"
                dir="ltr"
              />
              <BioButton
                href="https://github.com/Ali-Jemo/ziqa-kernal"
                label="OPEN SOURCE REPOS"
                secondaryLabel="الشيفرات"
                variant="dark-glass"
                dir="ltr"
                target="_blank"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
