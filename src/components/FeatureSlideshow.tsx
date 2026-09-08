"use client";

import { useEffect, useRef, useState } from "react";
import { Microscope, Eye, Cog, Users } from "lucide-react";

// IntegratedBio-style numbered feature slideshow: pastel mineral-tinted cards,
// large bold indices, deep pine titles, slate descriptions, bio-lime progress bar,
// auto-advance every 6s; hover pins selection.
const ITEMS = [
  { icon: Microscope, title: "بحث من المبادئ الأولى", desc: "نبدأ من الأساس ونبتكر من الصفر بدل تكييف الحلول الجاهزة." },
  { icon: Eye, title: "شفافية كاملة", desc: "كل أبحاثنا وشيفراتنا وبياناتنا منشورة ومفتوحة للجميع." },
  { icon: Cog, title: "تطوير من النواة", desc: "نصمم النوى والأنظمة من الطبقة الأدنى لضمان السيادة التقنية." },
  { icon: Users, title: "مجتمع مفتوح", desc: "نبني مع باحثين ومهندسين عرب حول رؤية علمية مشتركة." },
];

const TINT_CLASSES = [
  "bg-[#cef79e]/25 border-l-2 border-l-[#a7e26e]",
  "bg-[#c9cbbe]/25 border-l-2 border-l-[#c9cbbe]",
  "bg-[#f5f8f7] border-l-2 border-l-[#a7e26e]/60",
  "bg-[#f7f7f5] border-l-2 border-l-[#e4e3e3]",
];

export default function FeatureSlideshow() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);
  const n = ITEMS.length;

  useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % n);
    }, 6000);
    return () => clearInterval(id);
  }, [n]);

  return (
    <div
      className="grid md:grid-cols-4 gap-px bg-[var(--j-line)] border border-[var(--j-line)]"
      onMouseLeave={() => (paused.current = false)}
    >
      {ITEMS.map((it, i) => {
        const Icon = it.icon;
        const on = i === active;
        const tint = TINT_CLASSES[i] || TINT_CLASSES[TINT_CLASSES.length - 1];
        return (
          <div
            key={it.title}
            className={`j-slide j-card p-3.5 sm:p-6 relative min-h-[64px] md:min-h-[176px] flex flex-col cursor-pointer transition-all ${tint}`}
            data-active={on}
            onMouseEnter={() => {
              setActive(i);
              paused.current = true;
            }}
            onClick={() => setActive(i)}
          >
            {on && <span className="j-prog run bg-[#a7e26e]" key={active} />}
            <div className="flex items-center md:block gap-3 mb-1.5 md:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 grid place-items-center bg-white/70 border border-[#e4e3e3] text-[#222f30] rounded-md">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="font-bold text-xs sm:text-base text-[#222f30]">{it.title}</h3>
            </div>
            <div className="j-slide__more">
              <p className="text-[10px] sm:text-xs text-[#445e5f] leading-relaxed font-medium">
                <span className="text-[11px] sm:text-xs font-bold text-[#222f30] mr-1">{`0${i + 1}.`}</span>
                {it.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
