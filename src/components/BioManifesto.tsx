"use client";

import { EditorialEyebrow } from "@/components/EditorialSectionHeader";
import RevealGroup, { cohereDelay } from "@/components/RevealGroup";

const PILLARS = [
  {
    dot: "bg-[#a7e26e]",
    kicker: "01. كسر احتكار البحث",
    title: "Democratization of Research",
    body: "شخص يقضي ساعات مع نموذج ذكي في تفكيك خوارزمية قد يصل لنتيجة مفيدة — مثال توضيحي، ليس ادعاء قياس. منصتنا تمنحه التوثيق والمراجعة.",
  },
  {
    dot: "bg-[#bef264]",
    kicker: "02. معيار التحقق البشري",
    title: "Proof of Work vs AI Slop",
    body: "لا مكان للهلوسة أو المحتوى منخفض الجهد؛ نفرض قالباً صارماً يوثق: ما المشكلة؟ ما الفرضيات؟ وكيف تحققت بشرياً عبر الاختبارات القياسية (Benchmarks) والشفرات؟",
  },
  {
    dot: "bg-[#cef79e]",
    kicker: "03. الفهرسة والسبق الفكري",
    title: "The Value Exchange",
    body: "أرشيف تقني نخبوي قابل للبحث والفهرسة المتخصصة، رابط مرجعي يحفظ السبق الفكري باسمك، وإمكانية إرفاق كود تفاعلي وجلسات قابلة للتكرار تُثبت نتائجك للمجتمع.",
  },
];

const STEPS = [
  { kicker: "01. المشكلة والفرضية", title: "The Problem", body: "المعضلة الهندسية أو السؤال الذي دفعك للتحقيق." },
  { kicker: "02. الأدوات ومسار الـ AI", title: "Tools & Journey", body: "النماذج المستخدمة، التوجيه، والتجارب الأولية." },
  { kicker: "03. التحقق البشري", title: "Proof of Work", body: "فحص الأكواد، الاختبارات (Benchmarks)، وتصحيح الهلوسة." },
  { kicker: "04. الأثر والسبق", title: "Indexable Impact", body: "مرجع تقني قابل للتكرار ومحفوظ باسم الباحث." },
];

const CARD_LIFT =
  "transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[#a7e26e] hover:shadow-md motion-reduce:transform-none";

export default function BioManifesto() {
  return (
    <section
      dir="rtl"
      className="w-full bg-[#f7f7f5] text-[#222f30] py-12 sm:py-20 lg:py-24 px-4 sm:px-10 lg:px-16 border-b border-[#e4e3e3]"
    >
      <RevealGroup className="max-w-[1440px] mx-auto grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-16 items-start">
        {/* ponytail: sticky sidebar folio mark during section scroll */}
        <div
          className="lg:sticky lg:top-24 space-y-2.5 self-start"
          data-cohere-item=""
          style={cohereDelay(0)}
        >
          <EditorialEyebrow num="01" kickerAr="البيان العلمي" />
          <p className="text-xs font-mono tracking-wider uppercase text-[#738284]">
            عصر التوليد الفردي الفائق · HYPER-INDIVIDUAL RESEARCH
          </p>
        </div>

        <div className="flex flex-col gap-8 max-w-4xl">
          <h2
            className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.25] sm:leading-[1.18] tracking-tight font-kufi text-[#222f30]"
            data-cohere-item=""
            style={cohereDelay(80)}
          >
            نحن جميعاً نبحث يومياً داخل عالمنا الرقمي،{" "}
            <span className="text-[#738284] font-normal block sm:inline mt-1 sm:mt-0">
              لكن كثيراً من هذا الجهد يضيع دون توثيق.
            </span>
          </h2>
          <p
            className="text-sm sm:text-lg text-[#55696a] leading-relaxed max-w-3xl font-normal"
            data-cohere-item=""
            style={cohereDelay(160)}
          >
            الجيل الجديد لم يعد ينتظر تمويلاً أو مختبراً تقليدياً لكي يبحث؛ حاسوب أو هاتف مع واجهة AI يكفي ليجعله مختبراً لشخص واحد. لكن الويب العربي مهدد بفخين: إما أن تضيع هذه الاكتشافات الفردية العميقة في أرشيف المحادثات الخاصة أو يخضع لنظرية الأنترنيت الميت!، أو أن تتحول المنصات إلى مكب لغثاء الـ AI السطحي (AI Slop). <strong className="text-[#222f30] font-semibold">JEMO هي منصة التوثيق والتدقيق للاكتشافات المتقدمة في النظم والبرمجة والذكاء الاصطناعي</strong> — نلتقط نتائجك ونحميها بمعيار التحقق البشري الصارم (Proof of Work).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 pt-2">
            {PILLARS.map((pillar, i) => (
              <article
                key={pillar.title}
                data-cohere-item=""
                style={cohereDelay(240 + i * 90)}
                className={`group relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-2 ${CARD_LIFT}`}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 right-0 w-[3px] origin-top scale-y-0 bg-[#a7e26e] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 motion-reduce:transition-none"
                />
                <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#222f30] font-bold">
                  <span className={`w-2 h-2 rounded-full ${pillar.dot}`} />
                  <span>{pillar.kicker}</span>
                </div>
                <h3 className="text-base font-bold text-[#222f30] font-kufi">{pillar.title}</h3>
                <p className="text-xs text-[#55696a] leading-relaxed">{pillar.body}</p>
              </article>
            ))}
          </div>

          <div className="pt-4 border-t border-[#e4e3e3]">
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-6 left-6 hidden sm:block h-px -translate-y-1/2 bg-[#e4e3e3]"
              />
              <div
                aria-hidden
                className="manifesto-trail pointer-events-none absolute top-1/2 right-6 left-6 hidden sm:block h-px bg-[#a7e26e]"
              />
              <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-3">
                {STEPS.map((step, i) => (
                  <article
                    key={step.title}
                    data-cohere-item=""
                    style={cohereDelay(520 + i * 80)}
                    className={`p-4 rounded-2xl bg-[#f0f2f0] border border-[#e4e3e3] shadow-xs ${CARD_LIFT}`}
                  >
                    <span className="font-mono text-xs text-[#445e5f] font-bold block mb-1">{step.kicker}</span>
                    <h3 className="text-sm font-bold text-[#222f30] mb-1">{step.title}</h3>
                    <p className="text-[11px] text-[#55696a]">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
