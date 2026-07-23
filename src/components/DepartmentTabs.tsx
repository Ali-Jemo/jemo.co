"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Code2, Palette, Tv, ArrowUpLeft, Sparkles } from "lucide-react";

const DEPARTMENTS = [
  {
    id: "research",
    icon: FlaskConical,
    title: "الأبحاث العلمية",
    subtitle: "Research & Development",
    desc: "أبحاث ميدانية ونظرية في العلوم التقنية والاجتماعية. نكسر بها أطروحة النقص المعرفي في المنطقة وننشر نتائجنا للجميع.",
    color: "#0ea5e9",
    tags: ["الذكاء الاصطناعي", "معالجة اللغة العربية", "الأنظمة الموزعة"],
    stats: "12+ ورقة بحثية",
  },
  {
    id: "code",
    icon: Code2,
    title: "التقنية والبرمجة",
    subtitle: "Software Engineering",
    desc: "بناء منصات مفتوحة المصدر وأنظمة ذكية فائقة الأداء. كل سطر شفرة يكتب لمعالجة تحديات واقعية وتدوم لسنوات.",
    color: "#10b981",
    tags: ["Rust / Next.js", "مفتوح المصدر", "البنية التحتية"],
    stats: "24+ مكتبة برمجية",
  },
  {
    id: "design",
    icon: Palette,
    title: "التصميم والهوية",
    subtitle: "UI/UX & Visual Identity",
    desc: "هوية بصرية متكاملة تعكس فلسفة الجودة والتفوق. ندمج البساطة الحديثة مع الهوية الثقافية في منتجاتنا.",
    color: "#a855f7",
    tags: ["تصميم الواجهات", "نظم التصميم", "التفاعل البصري"],
    stats: "100% أنظمة مخصصة",
  },
  {
    id: "media",
    icon: Tv,
    title: "المحتوى والألعاب",
    subtitle: "Media & Interactive",
    desc: "إنتاج محتوى مرئي عالي المستوى وتجارب تفاعلية وألعاب تنقل رسالة جيمو وتلهم الجيل الجديد من المبتكرين.",
    color: "#f97316",
    tags: ["ألعاب تفاعلية", "وثائقيات تقنية", "صناعة الأثر"],
    stats: "50K+ متفاعل",
  },
];

export default function DepartmentTabs() {
  const [activeId, setActiveId] = useState(DEPARTMENTS[0].id);
  const activeDept = DEPARTMENTS.find((d) => d.id === activeId) || DEPARTMENTS[0];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DEPARTMENTS.map((dept) => {
          const isActive = dept.id === activeId;
          const Icon = dept.icon;
          return (
            <button
              key={dept.id}
              onClick={() => setActiveId(dept.id)}
              className={`relative flex items-center gap-3 p-4 rounded-xl text-end transition-all duration-500 border group overflow-hidden ${
                isActive
                  ? "bg-[var(--surface)] border-[var(--brand)] shadow-lg shadow-[var(--brand)]/10 scale-[1.02]"
                  : "bg-[var(--bg)] border-[var(--line)] hover:border-transparent hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
              }`}
              style={{
                boxShadow: isActive ? '' : undefined, // Handled by Tailwind classes
              }}
            >
              {/* Glowing Background Flare */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at right center, ${dept.color} 0%, transparent 70%)` }}
              />
              
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-90 group-hover:rounded-full group-hover:shadow-[0_0_40px_currentColor] z-10"
                style={{ backgroundColor: `color-mix(in srgb, ${dept.color} 15%, transparent)`, color: dept.color }}
              >
                <div className="ultimate-svg-trace relative z-20 transition-transform duration-300 group-hover:animate-[ultimate-icon-launch_1.2s_cubic-bezier(0.34,1.56,0.64,1)_both]">
                  <Icon size={20} />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate">{dept.title}</span>
                <span className="text-[11px] font-mono text-[var(--ink-2)] truncate">
                  {dept.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Department Spotlight View */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--line)] p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDept.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group relative"
          >
            {/* Spotlight Glowing Background Flare */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none rounded-2xl"
              style={{ background: `radial-gradient(circle at top right, ${activeDept.color} 0%, transparent 60%)` }}
            />

            <div className="flex-1 flex flex-col gap-4 z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-90 group-hover:rounded-full group-hover:shadow-[0_0_50px_currentColor]"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${activeDept.color} 15%, transparent)`,
                    color: activeDept.color,
                  }}
                >
                  <div className="ultimate-svg-trace relative z-20 transition-transform duration-300 group-hover:animate-[ultimate-icon-launch_1.2s_cubic-bezier(0.34,1.56,0.64,1)_both]">
                    <activeDept.icon size={26} />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{activeDept.title}</h3>
                  <span className="text-xs font-mono text-[var(--ink-2)]">
                    {activeDept.subtitle}
                  </span>
                </div>
              </div>

              <p className="text-[var(--ink-2)] text-base md:text-lg leading-relaxed m-0 max-w-2xl">
                {activeDept.desc}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {activeDept.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] flex items-center gap-1.5"
                  >
                    <Sparkles size={12} style={{ color: activeDept.color }} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Stat & Action */}
            <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--line)] shrink-0">
              <div className="text-end">
                <span className="text-xs font-mono text-[var(--ink-2)] block uppercase tracking-wider">
                  الإنجاز
                </span>
                <span
                  className="text-2xl md:text-3xl font-mono font-bold"
                  style={{ color: activeDept.color }}
                >
                  {activeDept.stats}
                </span>
              </div>

              <a
                href="/applications"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-[var(--bg)] border border-[var(--line)] hover:border-[var(--brand)] hover:text-[var(--brand)] transition-colors"
              >
                <span>استكشف المشاريع</span>
                <ArrowUpLeft size={16} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
