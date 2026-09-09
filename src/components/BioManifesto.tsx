"use client";

export default function BioManifesto() {
  return (
    <section 
      dir="rtl"
      className="w-full bg-[#f7f7f5] text-[#222f30] py-14 sm:py-28 px-4 sm:px-10 lg:px-16 border-b border-[#e4e3e3]"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-16 items-start">
        {/* ponytail: sticky sidebar folio mark during section scroll */}
        <div className="lg:sticky lg:top-24 space-y-2.5 self-start">
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#55696a]">
            <span className="font-bold text-[#222f30] text-sm tracking-normal">01</span>
            <span className="w-5 h-px bg-[#c9cbbe]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
            <span className="tracking-widest uppercase text-[11px] font-semibold text-[#738284]">
              البيان العلمي
            </span>
          </div>
          <p className="text-xs font-mono tracking-wider uppercase text-[#738284]">
            عصر التوليد الفردي الفائق · HYPER-INDIVIDUAL RESEARCH
          </p>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-8 max-w-4xl">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.25] sm:leading-[1.18] tracking-tight font-kufi text-[#222f30]">
            نحن جميعاً نبحث ونصل لنتائج غير مسبوقة يومياً داخل شاشات المحادثة،{" "}
            <span className="text-[#738284] font-normal block sm:inline mt-1 sm:mt-0">
              لكن 99% من هذا الجهد يتبخر دون توثيق.
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-[#55696a] leading-relaxed max-w-3xl font-normal">
            الجيل الجديد لم يعد ينتظر تمويلاً أو مختبراً تقليدياً لكي يبحث؛ حاسوب مع واجهة AI يكفي ليجعله مختبراً لشخص واحد. لكن الويب العربي مهدد بفخين: إما أن تضيع هذه الاكتشافات الفردية العميقة في أرشيف المحادثات الخاصة، أو أن تتحول المنصات إلى مكب لغثاء الـ AI السطحي (AI Slop). <strong className="text-[#222f30] font-semibold">JEMO هي منصة التوثيق والتدقيق للاكتشافات المتقدمة في النظم والبرمجة والذكاء الاصطناعي</strong> — نلتقط نتائجك ونحميها بمعيار التحقق البشري الصارم (Proof of Work).
          </p>

          {/* 3 Core Pillars: Power, Proof of Work & Value Exchange */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-2">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#222f30] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
                <span>01. كسر احتكار البحث</span>
              </div>
              <h4 className="text-base font-bold text-[#222f30] font-kufi">
                Democratization of Research
              </h4>
              <p className="text-xs text-[#55696a] leading-relaxed">
                شخص يقضي 8 ساعات مع نموذج ذكي في تفكيك خوارزمية أو فحص نواة نظام قد يصل لنتيجة أدق وأسرع من بحث أكاديمي استغرق 6 أشهر. منصتنا تمنحه الاعتراف والشرعية.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-2">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#222f30] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#bef264]" />
                <span>02. معيار التحقق البشري</span>
              </div>
              <h4 className="text-base font-bold text-[#222f30] font-kufi">
                Proof of Work vs AI Slop
              </h4>
              <p className="text-xs text-[#55696a] leading-relaxed">
                لا مكان للهلوسة أو المحتوى منخفض الجهد؛ نفرض قالباً صارماً يوثق: ما المشكلة؟ ما الفرضيات؟ وكيف تحققت بشرياً عبر الاختبارات القياسية (Benchmarks) والشفرات؟
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-2">
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#222f30] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#cef79e]" />
                <span>03. الفهرسة والسبق الفكري</span>
              </div>
              <h4 className="text-base font-bold text-[#222f30] font-kufi">
                The Value Exchange
              </h4>
              <p className="text-xs text-[#55696a] leading-relaxed">
                أرشيف تقني نخبوي قابل للبحث والفهرسة المتخصصة، رابط مرجعي يحفظ السبق الفكري باسمك، وإمكانية إرفاق كود تفاعلي وجلسات قابلة للتكرار تُثبت نتائجك للمجتمع.
              </p>
            </div>
          </div>

          {/* 4-Step Research Journey Trail */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#e4e3e3]">
            <div className="p-4 rounded-2xl bg-[#f0f2f0] border border-[#e4e3e3] shadow-xs">
              <span className="font-mono text-xs text-[#445e5f] font-bold block mb-1">01. المشكلة والفرضية</span>
              <h4 className="text-sm font-bold text-[#222f30] mb-1">The Problem</h4>
              <p className="text-[11px] text-[#55696a]">المعضلة الهندسية أو السؤال الذي دفعك للتحقيق.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f0f2f0] border border-[#e4e3e3] shadow-xs">
              <span className="font-mono text-xs text-[#445e5f] font-bold block mb-1">02. الأدوات ومسار الـ AI</span>
              <h4 className="text-sm font-bold text-[#222f30] mb-1">Tools & Journey</h4>
              <p className="text-[11px] text-[#55696a]">النماذج المستخدمة، التوجيه، والتجارب الأولية.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f0f2f0] border border-[#e4e3e3] shadow-xs">
              <span className="font-mono text-xs text-[#445e5f] font-bold block mb-1">03. التحقق البشري</span>
              <h4 className="text-sm font-bold text-[#222f30] mb-1">Proof of Work</h4>
              <p className="text-[11px] text-[#55696a]">فحص الأكواد، الاختبارات (Benchmarks)، وتصحيح الهلوسة.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#f0f2f0] border border-[#e4e3e3] shadow-xs">
              <span className="font-mono text-xs text-[#445e5f] font-bold block mb-1">04. الأثر والسبق</span>
              <h4 className="text-sm font-bold text-[#222f30] mb-1">Indexable Impact</h4>
              <p className="text-[11px] text-[#55696a]">مرجع تقني قابل للتكرار ومحفوظ باسم الباحث.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
