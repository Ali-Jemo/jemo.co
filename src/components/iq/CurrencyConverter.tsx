"use client";

import { useState } from "react";
import { ArrowLeftRight, Calculator, Check, Copy } from "lucide-react";

const RATE = 1532.5; // 1 USD = 1,532.5 IQD (153,250 IQD per 100$)

export default function CurrencyConverter() {
  const [direction, setDirection] = useState<"usdToIqd" | "iqdToUsd">("usdToIqd");
  const [amount, setAmount] = useState<string>("100");
  const [copied, setCopied] = useState<boolean>(false);

  const numAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const result =
    direction === "usdToIqd"
      ? Math.round(numAmount * RATE)
      : Math.round((numAmount / RATE) * 100) / 100;

  const handleCopy = () => {
    const text =
      direction === "usdToIqd"
        ? `${amount} دولار = ${result.toLocaleString()} دينار عراقي`
        : `${amount} دينار = ${result.toLocaleString()} دولار`;
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setDirection(direction === "usdToIqd" ? "iqdToUsd" : "usdToIqd");
    setAmount(result > 0 ? result.toString() : "100");
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1618] border border-white/10 shadow-md space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#bef264]/10 border border-[#bef264]/30 flex items-center justify-center text-[#bef264]">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-kufi font-bold text-sm text-white">حاسبة الصرف السريعة</h3>
            <p className="text-[10px] font-mono text-white/50">
              حساب فوري بسعر الصيرفات (100$ = 153,250 د.ع)
            </p>
          </div>
        </div>

        <button
          onClick={handleSwap}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#bef264] border border-white/10 transition-colors cursor-pointer"
          title="عكس اتجاه التحويل"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{direction === "usdToIqd" ? "دولار ← دينار" : "دينار ← دولار"}</span>
        </button>
      </div>

      {/* Input & Output Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-white/60 block">
            المبلغ بـ {direction === "usdToIqd" ? "الدولار الأمريكي ($)" : "الدينار العراقي (د.ع)"}
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full h-11 px-3.5 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white font-mono text-lg font-bold outline-none transition-colors"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-white/40">
              {direction === "usdToIqd" ? "USD" : "IQD"}
            </span>
          </div>
        </div>

        {/* Result Output */}
        <div className="space-y-1">
          <label className="text-[11px] font-mono text-white/60 block">
            المعادل بـ {direction === "usdToIqd" ? "الدينار العراقي (د.ع)" : "الدولار الأمريكي ($)"}
          </label>
          <div className="h-11 px-3.5 bg-[#141e20] border border-[#bef264]/30 rounded-xl flex items-center justify-between text-white font-mono">
            <span className="text-lg sm:text-xl font-black text-[#bef264]">
              {result.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-white/50">
                {direction === "usdToIqd" ? "د.ع" : "$"}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded text-white/50 hover:text-white transition-colors cursor-pointer"
                title="نسخ النتيجة للمشاركة"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 text-[11px] font-mono">
        <span className="text-white/40 text-[10px] shrink-0">مبالغ شائعة:</span>
        {direction === "usdToIqd" ? (
          <>
            <button
              onClick={() => setAmount("100")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              $100 ورقة
            </button>
            <button
              onClick={() => setAmount("500")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              $500 خمس ورقات
            </button>
            <button
              onClick={() => setAmount("1000")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              $1,000 شدة
            </button>
            <button
              onClick={() => setAmount("5000")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              $5,000 خمس شدات
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAmount("150000")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              150 ألف
            </button>
            <button
              onClick={() => setAmount("500000")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              نصف مليون
            </button>
            <button
              onClick={() => setAmount("1000000")}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer shrink-0"
            >
              مليون دينار
            </button>
          </>
        )}
      </div>
    </div>
  );
}
