"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CitationBoxProps {
  bibtex: string;
  apa: string;
  ieee?: string;
  ris?: string;
}

export default function CitationBox({ bibtex, apa, ieee, ris }: CitationBoxProps) {
  const [tab, setTab] = useState<"bibtex" | "apa" | "ieee" | "ris">("bibtex");
  const [copied, setCopied] = useState(false);

  const fallbackIeee = `A. Al-Furati and A. Jemo, "Ziqa Kernel: Safe and Lightweight Microkernel Architecture for Critical Systems," JEMO LABS Research Papers, vol. 1, pp. 14-29, 2026.`;
  const fallbackRis = `TY  - JOUR
TI  - Ziqa Kernel: Safe and Lightweight Microkernel Architecture
AU  - Al-Furati, Ahmed
AU  - Jemo, Ali
JO  - JEMO LABS Research Papers
PY  - 2026
ER  -`;

  let textToCopy = bibtex;
  if (tab === "apa") textToCopy = apa;
  if (tab === "ieee") textToCopy = ieee ?? fallbackIeee;
  if (tab === "ris") textToCopy = ris ?? fallbackRis;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)] rounded-xl p-5 font-mono text-xs shadow-xs">
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--line)] pb-3 mb-3 gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTab("bibtex")}
            className={`px-3 py-1 rounded-md transition-colors ${
              tab === "bibtex"
                ? "bg-[var(--brand)] text-white font-bold"
                : "bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
            }`}
          >
            BibTeX
          </button>
          <button
            onClick={() => setTab("apa")}
            className={`px-3 py-1 rounded-md transition-colors ${
              tab === "apa"
                ? "bg-[var(--brand)] text-white font-bold"
                : "bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
            }`}
          >
            APA Format
          </button>
          <button
            onClick={() => setTab("ieee")}
            className={`px-3 py-1 rounded-md transition-colors ${
              tab === "ieee"
                ? "bg-[var(--brand)] text-white font-bold"
                : "bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
            }`}
          >
            IEEE
          </button>
          <button
            onClick={() => setTab("ris")}
            className={`px-3 py-1 rounded-md transition-colors ${
              tab === "ris"
                ? "bg-[var(--brand)] text-white font-bold"
                : "bg-[var(--bg)] text-[var(--ink-2)] hover:text-[var(--ink-1)]"
            }`}
          >
            EndNote / RIS
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors font-bold"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>تم النسخ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span>نسخ الصيغة</span>
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 bg-[var(--bg)] rounded-lg text-[var(--ink-2)] leading-relaxed dir-ltr text-left border border-[var(--line)]/60">
        {textToCopy}
      </pre>
    </div>
  );
}
