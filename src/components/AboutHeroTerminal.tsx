"use client";

import { useState, useEffect } from "react";
import { Terminal, Copy, Check } from "lucide-react";

const LINES = [
  { text: "$ jemo-labs init --mode=radical-excellence" },
  { text: "> Target: Autonomous Technology Infrastructure" },
  { text: "> Philosophy: Independence over dependency" },
  { text: "> Location: Mesopotamia (Iraq)" },
  { text: "> Status: Active & Deploying Open Source" },
];

export default function AboutHeroTerminal() {
  const [copied, setCopied] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => (prev < LINES.length ? prev + 1 : prev));
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx jemo-labs info");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div dir="ltr" className="w-full max-w-xl mx-auto mt-10 rounded-2xl bg-[var(--bg)] border border-[var(--line)] shadow-2xl overflow-hidden text-start font-mono text-xs sm:text-sm">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--line)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="text-[11px] text-[var(--ink-2)] me-2 flex items-center gap-1.5 ms-2 font-mono">
            <Terminal size={13} className="text-[var(--brand)]" />
            jemo-manifest.sh
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors px-2 py-1 rounded bg-[var(--surface-2)] border border-[var(--line)]"
        >
          {copied ? <Check size={12} className="text-[var(--ok)]" /> : <Copy size={12} />}
          <span>{copied ? "Copied!" : "npx jemo-labs"}</span>
        </button>
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 sm:p-5 flex flex-col gap-2 text-[var(--ink)]">
        {LINES.slice(0, visibleCount).map((line, i) => (
          <div key={i} className="flex items-center gap-2 font-mono leading-relaxed">
            <span
              className={
                line.text.startsWith("$")
                  ? "text-[var(--brand)] font-bold"
                  : "text-[var(--ink-2)]"
              }
            >
              {line.text}
            </span>
          </div>
        ))}

        <div className="flex items-center gap-2 pt-1 text-[var(--brand)] font-bold">
          <span>&gt;</span>
          <span className="w-2 h-4 bg-[var(--brand)] inline-block animate-pulse" />
        </div>
      </div>
    </div>
  );
}
