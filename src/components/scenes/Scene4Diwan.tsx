"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Accordion from "@/components/ui/Accordion";
interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: "هل الانضمام مجاني؟",
    a: "نعم، نحن مؤسسة غير ربحية. لا توجد أي رسوم، اشتراكات، أو تكاليف على المتقدمين والمنضمين.",
  },
  {
    q: "ما الذي أحتاجه للتقديم؟",
    a: "تحتاج إلى اسمك، بريدك الإلكتروني، تخصصك المطلوب، ونبذة عن مهاراتك وشغفك. لا تُشترط أي شهادة أكاديمية.",
  },
  {
    q: "كم يستغرق الرد على طلبي؟",
    a: "تستغرق المراجعة من 3 إلى 7 أيام. وتتحدث حالة طلبك في سجل القبولات العام مباشرة بشفافية تامة.",
  },
  {
    q: "ماذا يحصل بعد قبول طلبي؟",
    a: "تستلم رسالة إلكترونية وتنبيه تليجرام يتضمن عقد الانضمام وقناة قسمك للتنسيق المباشر.",
  },
  {
    q: "هل أحتاج التواجد في مكان معين؟",
    a: "لا، جميع الأنشطة والفرق تعمل رقمياً وعن بُعد عبر القنوات والمنصات المخصصة.",
  },
];

export default function Scene4Diwan() {
  const [search, setSearch] = useState("");
  return (
    <div
      id="faq"
      className="w-full min-h-screen relative flex flex-col items-center justify-center py-20 px-6 overflow-hidden"
       style={{ background: "#0A0A0A" }}
    >
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center gap-8 text-center">
        {/* Section Header */}
        <div>
          <span className="text-xs font-mono text-[var(--gold)] tracking-widest uppercase">
            الديوان · The Diwan
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-kufi text-white mt-2">
            الأسئلة الشائعة
          </h2>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto mt-3">
            إجابات مباشرة حول الانضمام، المراجعة، والعمل داخل منظومة jemo labs.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الأسئلة..."
            className="w-full pr-11 pl-4 py-3 rounded-xl border border-white/10 bg-black/50 text-right text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--gold)]"
          />
        </div>

        {/* Manuscript Scroll FAQ Items */}
        <div className="w-full text-right max-h-[60vh] overflow-y-auto">
          <Accordion items={FAQS} searchTerm={search} />
        </div>
      </div>
    </div>
  );
}
