"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Calculator, Check, Copy } from "lucide-react";

export default function CurrencyConverter() {
  const [rate, setRate] = useState<number>(1556.5);
  const [direction, setDirection] = useState<"usdToIqd" | "iqdToUsd">("usdToIqd");
  const [amount, setAmount] = useState<string>("100");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadRate() {
      try {
        const res = await fetch("/api/iq/dollar");
        if (res.ok) {
          const data = await res.json();
          if (data?.sellRate) {
            setRate(data.sellRate / 100);
          }
        }
      } catch {}
    }
    loadRate();
  }, []);

  const numAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const result =
    direction === "usdToIqd"
      ? Math.round(numAmount * rate)
      : Math.round((numAmount / rate) * 100) / 100;

  const handleCopy = () => {
    const text =
      direction === "usdToIqd"
        ? `${amount}$ = ${result.toLocaleString("ar-IQ")} د.ع`
        : `${amount} د.ع = ${result.toLocaleString("ar-IQ")}$`;
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickChips =
    direction === "usdToIqd"
      ? [
          { label: "100$ (ورقة)", value: "100" },
          { label: "500$", value: "500" },
          { label: "1,000$ (شدة)", value: "1000" },
        ]
      : [
          { label: "150 ألف", value: "150000" },
          { label: "نصف مليون", value: "500000" },
          { label: "مليون", value: "1000000" },
        ];

  return (
    <div className="space-y-3 rounded-2xl border border-[#e4e3e3] bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-[#e4e3e3] pb-2.5 text-xs">
        <div className="flex min-w-0 items-center gap-1.5 font-bold text-[#222f30]">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#cef79e]">
            <Calculator className="h-4 w-4 text-[#222f30]" aria-hidden="true" />
          </span>
          <span className="truncate">حاسبة التحويل</span>
          <span className="hidden text-[10px] font-normal text-[#55696a] sm:inline">
            (100$ = {(rate * 100).toLocaleString("ar-IQ")} د.ع)
          </span>
        </div>

        <button
          onClick={() => {
            setDirection(direction === "usdToIqd" ? "iqdToUsd" : "usdToIqd");
            setAmount(result > 0 ? result.toString() : "100");
          }}
          aria-label="عكس اتجاه التحويل"
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-[#e4e3e3] bg-[#f0f2f0] px-2.5 py-1 text-[10px] font-bold text-[#55696a] transition-colors hover:bg-[#e4e3e3] hover:text-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
        >
          <ArrowLeftRight className="h-2.5 w-2.5" aria-hidden="true" />
          <span>{direction === "usdToIqd" ? "دولار ← دينار" : "دينار ← دولار"}</span>
        </button>
      </div>

      {/* Inputs & Output Row */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:items-center">
        <div className="relative">
          <label htmlFor="iq-amount" className="sr-only">
            {direction === "usdToIqd" ? "المبلغ بالدولار" : "المبلغ بالدينار"}
          </label>
          <input
            id="iq-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] px-3 pl-10 font-mono text-base font-bold text-[#222f30] tabular-nums outline-none transition-colors focus:border-[#728825] focus:bg-white focus:ring-2 focus:ring-[#cef79e]"
          />
          <span className="absolute top-1/2 left-2.5 -translate-y-1/2 rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#55696a]">
            {direction === "usdToIqd" ? "$" : "د.ع"}
          </span>
        </div>

        <div className="flex h-11 items-center justify-between gap-2 rounded-xl border border-[#a7e26e] bg-[#cef79e]/30 px-3">
          <span
            className="truncate font-mono text-base font-black text-[#222f30] tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {result.toLocaleString("ar-IQ")}
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#55696a]">
              {direction === "usdToIqd" ? "د.ع" : "$"}
            </span>
            <button
              onClick={handleCopy}
              aria-label="نسخ نتيجة التحويل"
              className="cursor-pointer rounded-md p-1 text-[#55696a] transition-colors hover:bg-white hover:text-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#222f30]"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              ) : (
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
        <span className="shrink-0 font-bold text-[#55696a]">سريع:</span>
        {quickChips.map((chip) => (
          <button
            key={chip.value}
            onClick={() => setAmount(chip.value)}
            aria-pressed={amount === chip.value}
            className={`cursor-pointer rounded-lg border px-2.5 py-1 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30] ${
              amount === chip.value
                ? "border-[#222f30] bg-[#222f30] text-white"
                : "border-[#e4e3e3] bg-[#f0f2f0] text-[#55696a] hover:border-[#a7e26e] hover:text-[#222f30]"
            }`}
          >
            {chip.label}
          </button>
        ))}
        {copied && (
          <span className="mr-auto text-[10px] font-bold text-emerald-700" role="status">
            تم النسخ ✓
          </span>
        )}
      </div>
    </div>
  );
}
