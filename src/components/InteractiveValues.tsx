"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Heart, Zap, CheckCircle2 } from "lucide-react";

const VALUES = [
  {
    id: "transparency",
    icon: Eye,
    title: "الشفافية الكاملة",
    desc: "كل قراراتنا موثقة. سجل القبولات والمشاريع مفتوح للجميع. لا توجد أسرار أو غرف مغلقة خلف الأبواب.",
    principle: "100% مشاركة المعرفة مع المجتمع",
    color: "#0ea5e9",
  },
  {
    id: "quality",
    icon: Heart,
    title: "الجودة بلا مساومة",
    desc: "لا نرسل عملًا لا نفتخر به أمام التاريخ. كل منتج أو بحث يمر بمراجعات دقيقة واختبارات صارمة قبل الإطلاق.",
    principle: "معايير بناء تصمد لسنوات",
    color: "#10b981",
  },
  {
    id: "speed",
    icon: Zap,
    title: "السرعة الحاسمة",
    desc: "البطء هو القاتل الخفي للابتكار. نتخذ القرار بشجاعة وننفّذ الشفرة ونطلق التجارب بسرعة قياسية.",
    principle: "من الفكرة إلى الإطلاق بأقل زمن",
    color: "#f59e0b",
  },
];

export default function InteractiveValues() {
  const [selectedId, setSelectedId] = useState<string | null>(VALUES[0].id);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
      {VALUES.map((val) => {
        const isSelected = val.id === selectedId;
        const Icon = val.icon;
        return (
          <motion.div
            key={val.id}
            onClick={() => setSelectedId(val.id)}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`relative p-8 rounded-2xl cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden ${
              isSelected
                ? "bg-[var(--surface)] border-[var(--brand)] shadow-xl shadow-[var(--brand)]/10"
                : "bg-[var(--surface)]/70 border-[var(--line)] hover:border-[var(--line)]/80 hover:bg-[var(--surface)]"
            }`}
          >
            {/* Background Glow */}
            {isSelected && (
              <div
                className="absolute -top-16 -left-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40"
                style={{ backgroundColor: val.color }}
              />
            )}

            <div>
              {/* Icon & Title */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${val.color} 15%, transparent)`,
                    color: val.color,
                  }}
                >
                  <Icon size={28} />
                </div>
                {isSelected && (
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-full border flex items-center gap-1 font-semibold"
                    style={{
                      borderColor: `color-mix(in srgb, ${val.color} 30%, transparent)`,
                      color: val.color,
                      backgroundColor: `color-mix(in srgb, ${val.color} 10%, transparent)`,
                    }}
                  >
                    <CheckCircle2 size={12} />
                    المبدأ
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-3">{val.title}</h3>
              <p className="text-[var(--ink-2)] leading-relaxed text-sm md:text-base m-0">
                {val.desc}
              </p>
            </div>

            {/* Principle Tag */}
            <div className="pt-6 mt-6 border-t border-[var(--line)]/60">
              <span className="text-xs font-mono text-[var(--ink-2)] block mb-1">
                تعهد جيمو
              </span>
              <span className="text-xs font-semibold text-[var(--brand)]">
                {val.principle}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
