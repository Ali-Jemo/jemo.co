"use client";

import { useState } from "react";
import { Check, Sparkles, Cpu, Award, BookOpen, Server, Heart, ArrowUpLeft, Layers } from "lucide-react";

export interface SupportTiersProps {
  onSelectTier: (tierName: string, amount: number) => void;
  onOpenInquiry: (category?: string) => void;
}

export default function SupportTiers({ onSelectTier, onOpenInquiry }: SupportTiersProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "once">("monthly");
  const [customAmount, setCustomAmount] = useState<number>(150);

  const tiers = [
    {
      id: "advocate",
      name: "مناصر النظم الحرة",
      nameEn: "Open Systems Advocate",
      monthlyPrice: 25,
      oncePrice: 50,
      description: "تغطية تكاليف استضافة المستودعات وعقد توزيع البيانات والنماذج المفتوحة.",
      features: [
        "إدراج الاسم في لوحة الشرف الرقمية",
        "شارة رقمية رسمية لداعم JEMO LABS",
        "تلقي النشرة البريدية البحثية الشهرية المغلقة للمجتمع",
        "الوصول لقناة المجتمع التقني على ديسكورد/تليغرام",
      ],
      icon: Layers,
      popular: false,
    },
    {
      id: "fellow",
      name: "راعي باحث مستقل",
      nameEn: "Research Fellow Sponsor",
      monthlyPrice: 150,
      oncePrice: 300,
      description: "تأمين منحة تفرغ وبحث علمي لطالب دراسات عليا أو باحث عراقي مستقل.",
      features: [
        "كافة مزايا الفئة السابقة",
        "شكر خاص باسم الراعي في الأوراق العلمية المدعومة",
        "وصول مبكر لمسودات النماذج والأكواد قبل إطلاقها للعامة",
        "جلسة حوارية افتراضية فصلية مع فريق الأبحاث",
        "تقرير ربع سنوي مخصص بأثر الأبحاث المنجزة",
      ],
      icon: Sparkles,
      popular: true,
    },
    {
      id: "open-access",
      name: "كفيل نشر علمي",
      nameEn: "Open Access Patron",
      monthlyPrice: 500,
      oncePrice: 1000,
      description: "تغطية نفقات التحكيم والنشر المفتوح (Gold Open Access) لورقة بحثية كاملة.",
      features: [
        "كافة مزايا الفئات السابقة",
        "إدراج الراعي رسمياً في متن ورقة بحثية محكمة دولياً",
        "نسخة ورقية فاخرة موثقة وموقعة من الباحثين والمؤسس",
        "دعوة شرفية لحضور المؤتمرات والهاكاثونات السنوية",
        "استشارة تقنية مباشرة مع خبراء النواة والذكاء الاصطناعي",
      ],
      icon: BookOpen,
      popular: false,
    },
    {
      id: "sovereign",
      name: "شريك بنية سيادية",
      nameEn: "Sovereign Infrastructure",
      monthlyPrice: 2000,
      oncePrice: 5000,
      description: "هدف تمويلي مستقبلي لبنية حوسبية مخططة — لا عتاد حالي.",
      features: [
        "شراكة استراتيجية وتسمية قاعة بحثية أو عنقود حوسبي",
        "تنسيق الأولويات البحثية للمشاريع السيادية ذات الأثر",
        "تمثيل رسمي في التقرير المالي والأكاديمي السنوي",
        "ورش عمل حصرية لنقل التقنية وبناء القدرات للمؤسسة الراعية",
      ],
      icon: Cpu,
      popular: false,
    },
  ];

  // Calculations for custom amount
  const gpuHours = Math.round(customAmount * 2.2);
  const researchStipend = Math.round(customAmount * 0.5);
  const hardwareLab = Math.round(customAmount * 0.25);
  const openAccess = Math.round(customAmount * 0.15);
  const serversHosting = Math.round(customAmount * 0.1);

  return (
    <section id="sponsorship-tiers" className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
          <Award className="w-3.5 h-3.5 text-[#728825]" />
          <span>برامج الرعاية والمساهمة</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink-1)] font-kufi">
          اختر مستوى الدعم الذي يناسبك
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-2)]">
          سواء كنت فرداً شغوفاً بالعلم أو مؤسسة تسعى للسيادة التكنولوجية، مساهمتك تصنع فرقاً حقيقياً في مستقبل التقنية العراقية.
        </p>

        {/* Billing cycle toggle */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] mt-4">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === "monthly"
                ? "bg-[var(--surface)] text-[var(--ink-1)] shadow-xs border border-[var(--line)]"
                : "text-[var(--ink-2)] hover:text-[var(--ink-1)]"
            }`}
          >
            دعم شهري مستمر (Monthly)
          </button>
          <button
            onClick={() => setBillingCycle("once")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              billingCycle === "once"
                ? "bg-[var(--surface)] text-[var(--ink-1)] shadow-xs border border-[var(--line)]"
                : "text-[var(--ink-2)] hover:text-[var(--ink-1)]"
            }`}
          >
            تبرع لمرة واحدة (One-Time)
          </button>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {tiers.map((tier) => {
          const price = billingCycle === "monthly" ? tier.monthlyPrice : tier.oncePrice;
          const TierIcon = tier.icon;

          return (
            <div
              key={tier.id}
              className={`relative p-6 sm:p-7 rounded-3xl bg-[var(--surface)] border transition-all duration-300 flex flex-col justify-between ${
                tier.popular
                  ? "border-[#728825] shadow-lg ring-2 ring-[#a7e26e]/30 -translate-y-1 bg-gradient-to-b from-[#cef79e]/10 to-[var(--surface)]"
                  : "border-[var(--line)] shadow-xs hover:border-[#a7e26e] hover:shadow-md"
              }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#728825] text-white text-[10px] font-bold font-mono tracking-wider shadow-xs">
                  الأكثر تأثيراً وشعبية
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-[#cef79e]/30 text-[#222f30] flex items-center justify-center">
                    <TierIcon className="w-5 h-5 text-[#728825]" />
                  </div>
                  <span className="text-[11px] font-mono text-[var(--ink-2)] uppercase">
                    {tier.nameEn}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--ink-1)] font-kufi mb-1">
                  {tier.name}
                </h3>
                <p className="text-xs text-[var(--ink-2)] mb-5 min-h-[36px] leading-relaxed">
                  {tier.description}
                </p>

                <div className="mb-6 pb-6 border-b border-[var(--line)]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[var(--ink-1)]">
                      ${price}
                    </span>
                    <span className="text-xs font-mono text-[var(--ink-2)]">
                      {billingCycle === "monthly" ? "/ شهرياً" : " مرة واحدة"}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 text-right">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[var(--ink-1)] leading-relaxed">
                      <Check className="w-4 h-4 text-[#728825] mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {tier.id === "sovereign" ? (
                  <button
                    onClick={() => onOpenInquiry("institutional")}
                    className="w-full py-3 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ink-1)] text-xs font-bold hover:bg-[#cef79e]/30 hover:border-[#728825] transition-all flex items-center justify-center gap-2"
                  >
                    <span>طلب مناقشة الشراكة</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onSelectTier(tier.name, price);
                      const el = document.getElementById("payment-methods");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      tier.popular
                        ? "bg-[var(--brand)] text-white hover:bg-[#162021] shadow-md"
                        : "bg-[var(--surface-2)] text-[var(--ink-1)] border border-[var(--line)] hover:bg-[#cef79e]/30 hover:border-[#728825]"
                    }`}
                  >
                    <span>اختيار هذه الفئة (${price})</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Research Impact Calculator */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#728825]" />
              <span>حاسبة الأثر العلمي التفاعلية</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[var(--ink-1)] font-kufi">
              حدد قيمة مساهمتك واكتشف أثرها المباشر
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
              كل دولار يتم إدارته وفق أعلى معايير الشفافية والتوجيه العلمي الصارم لخدمة الباحثين وتوفير المعامل الحوسبية المفتوحة.
            </p>

            {/* Quick preset pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[25, 50, 100, 150, 300, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setCustomAmount(amt)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                    customAmount === amt
                      ? "bg-[var(--brand)] text-white shadow-xs"
                      : "bg-[var(--surface-2)] text-[var(--ink-2)] border border-[var(--line)] hover:border-[#a7e26e]"
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Amount input slider & box */}
            <div className="pt-2 flex items-center gap-4">
              <input
                type="range"
                min="10"
                max="2000"
                step="10"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="w-full accent-[#728825] cursor-pointer"
              />
              <div className="flex items-center gap-1 font-mono font-bold text-lg text-[var(--ink-1)] px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] min-w-[100px] justify-center">
                <span>$</span>
                <span>{customAmount}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Impact Result Card */}
          <div className="lg:col-span-6 bg-[var(--surface-2)] p-6 sm:p-7 rounded-2xl border border-[var(--line)] space-y-4">
            <div className="text-xs font-mono text-[#728825] font-bold flex items-center justify-between">
              <span>الأثر الفعلي لمبلغ ${customAmount}</span>
              <span className="text-[var(--ink-2)]">100% مكرس للأبحاث</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="text-2xl font-black font-mono text-[var(--ink-1)]">
                  ~{gpuHours}
                </div>
                <div className="text-[11px] text-[var(--ink-2)] mt-0.5">
                  ساعة تدريب GPU حرة لنماذج الذكاء الاصطناعي
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="text-2xl font-black font-mono text-[var(--ink-1)]">
                  ${researchStipend}
                </div>
                <div className="text-[11px] text-[var(--ink-2)] mt-0.5">
                  (50%) دعم مباشر لمنح وبحوث العقول العلمية
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="text-2xl font-black font-mono text-[var(--ink-1)]">
                  ${hardwareLab}
                </div>
                <div className="text-[11px] text-[var(--ink-2)] mt-0.5">
                  (25%) شراء أجهزة ومختبرات معالجات RISC-V
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--line)]">
                <div className="text-2xl font-black font-mono text-[var(--ink-1)]">
                  ${openAccess + serversHosting}
                </div>
                <div className="text-[11px] text-[var(--ink-2)] mt-0.5">
                  (25%) رسوم نشر أوراق مفتوحة واستضافة المستودعات
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onSelectTier("مساهمة مخصصة", customAmount);
                  const el = document.getElementById("payment-methods");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex-1 py-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-bold shadow-xs hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-3.5 h-3.5 text-[#a7e26e]" />
                <span>المتابعة للتبرع بمبلغ ${customAmount}</span>
              </button>

              <button
                onClick={() => onOpenInquiry("grant")}
                className="px-4 py-2.5 rounded-xl bg-white border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] hover:bg-[var(--surface-hover)] transition-all"
              >
                تحويل بنكي / استفسار
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
