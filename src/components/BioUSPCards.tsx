"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CARDS = [
  {
    num: "01.",
    icon: "/bio-icon-1.svg",
    bg: "bg-[#cef79e]",
    textColor: "text-[#222f30]",
    subColor: "text-[#3f5456]",
    borderColor: "border-[#b8eb7c]",
    title: "أبحاث النظم والأنوية والعتاد",
    desc: "نواة Ziqa، هندسة النظم منخفضة المستوى، المترجمات، وهندسة الحوسبة — كود حقيقي واختبارات معمارية لا تعتمد على التخمين.",
    href: "/projects",
    actionText: "استكشف أبحاث النظم",
  },
  {
    num: "02.",
    icon: "/bio-icon-2.svg",
    bg: "bg-[#222f30]",
    textColor: "text-white",
    subColor: "text-[#c2cbcc]",
    borderColor: "border-[#2e3e40]",
    title: "تقييم النماذج وتفكيك الهلوسة",
    desc: "مقارنات أداء واقعية (Benchmarks)، تفكيك وتصحيح هلوسات النماذج، واختبار حدود الاستدلال — نتائج مدعومة بأدلة تجريبية صارمة.",
    href: "/research",
    actionText: "استكشف سجلات النماذج",
  },
  {
    num: "03.",
    icon: "/bio-icon-3.svg",
    bg: "bg-[#e7e8e1]",
    textColor: "text-[#222f30]",
    subColor: "text-[#55696a]",
    borderColor: "border-[#d8d9d0]",
    title: "بروتوكول التحقق والسبق الفكري",
    desc: "قالب إثبات العمل (Proof of Work): توثيق السؤال، مسار التفاعل، التدقيق البشري، وحفظ السبق الفكري برابط مرجعي دائم.",
    href: "/publish",
    actionText: "وثّق اكتشافك الآن",
  },
];

export default function BioUSPCards() {
  return (
    <section
      dir="rtl"
      className="w-full bg-[#f7f7f5] py-8 sm:py-16 px-4 sm:px-10 lg:px-16 border-b border-[#e4e3e3]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
          {CARDS.map((card) => (
            <Link
              key={card.num}
              href={card.href}
              className={`group ${card.bg} ${card.textColor} border ${card.borderColor} rounded-2xl sm:rounded-[2rem] p-5 sm:p-10 flex flex-col justify-between min-h-0 sm:min-h-[440px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              {/* Top Row: Index & Icon */}
              <div className="flex items-start justify-between">
                <span className="text-sm sm:text-base font-mono font-bold opacity-75">
                  {card.num}
                </span>
                <div className="w-12 h-12 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Bottom Content: Title & Text */}
              <div className="flex flex-col gap-3 sm:gap-4 mt-auto pt-6 sm:pt-12">
                <h3 className="text-xl sm:text-3xl font-normal tracking-tight font-kufi leading-snug">
                  {card.title}
                </h3>
                <p className={`text-xs sm:text-base leading-relaxed ${card.subColor} font-normal`}>
                  {card.desc}
                </p>

                <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-bold font-mono">
                  <span>{card.actionText}</span>
                  <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-1">
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
