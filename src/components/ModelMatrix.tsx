import Link from "next/link";
import { Cpu, Bot, Terminal, ArrowUpLeft, CheckCircle2 } from "lucide-react";

// Mistral-style Model Card Grid (mistral-block-card-model).
// Server component.
export default function ModelMatrix() {
  const models = [
    {
      id: "ziqa-kernel",
      name: "Ziqa Microkernel v1.0",
      nameEn: "Ziqa Memory-Safe OS Kernel",
      type: "نواة تشغيلية سيادية",
      license: "Open Source",
      specs: [
        { label: "السرعة", val: "0.12 µs" },
        { label: "الأمان", val: "Rust Safe" },
        { label: "البيئة", val: "Wasm" },
      ],
      tags: ["Microkernel", "Embedded", "Real-time", "IPC"],
      href: "/projects/ziqa-kernel",
      icon: Terminal,
      featured: true,
    },
    {
      id: "baghdad-llm",
      name: "Baghdad-LLM 70B",
      nameEn: "Arabic Reasoning & Generative AI",
      type: "نموذج لغوي استدلالي",
      license: "Open Weights",
      specs: [
        { label: "السياق", val: "128K" },
        { label: "الدقة", val: "91.4%" },
        { label: "المعلمات", val: "70B" },
      ],
      tags: ["Arabic NLP", "Reasoning", "Code Gen", "Multimodal"],
      href: "/benchmarks",
      icon: Bot,
    },
    {
      id: "heritage-vision",
      name: "Heritage OCR Transformer",
      nameEn: "Arabic Manuscript Document Parser",
      type: "رؤية حاسوبية للمخطوطات",
      license: "Open Dataset",
      specs: [
        { label: "المخطوطات", val: "+1.2M" },
        { label: "دقة التعرف", val: "99.1%" },
        { label: "المعمارية", val: "Vision-T" },
      ],
      tags: ["OCR", "Manuscripts", "Vision-T", "Open Dataset"],
      href: "/labs/heritage-ocr",
      icon: Cpu,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--j-line)] border border-[var(--j-line)]">
      {models.map((m) => {
        const Icon = m.icon;
        return (
          <article
            key={m.id}
            className="j-card p-7 md:p-8 flex flex-col justify-between group relative"
          >
            {m.featured && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--gold)] rounded-bl-sm" />
            )}
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="j-tag">{m.type}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--brand)] font-bold bg-[var(--brand)]/8 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" />
                  {m.license}
                </span>
              </div>

              <div className="w-10 h-10 grid place-items-center bg-[var(--ink)] text-white rounded-md mb-4 group-hover:bg-[var(--brand)] transition-colors">
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-[var(--ink)] mb-1 leading-snug">
                <Link href={m.href} className="hover:text-[var(--brand)] transition-colors">
                  {m.name}
                </Link>
              </h3>
              <p className="text-xs font-mono text-[var(--brand)] mb-5 dir-ltr text-right">
                {m.nameEn}
              </p>

              {/* Specs grid inside card */}
              <div className="grid grid-cols-3 gap-px bg-[var(--j-line)] border border-[var(--j-line)] rounded-md overflow-hidden mb-6">
                {m.specs.map((s) => (
                  <div key={s.label} className="bg-[var(--j-cream-2)] p-2.5 text-center">
                    <div className="text-xs font-bold font-mono text-[var(--ink)]">{s.val}</div>
                    <div className="text-[9px] text-[var(--ink-2)] font-mono mt-0.5 line-clamp-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {m.tags.map((t) => (
                  <span key={t} className="j-tag">{t}</span>
                ))}
              </div>
            </div>

            <Link href={m.href} className="j-link text-xs mt-4">
              <span>مستندات وتجارب النموذج</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
