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
        ? `${amount}$ = ${result.toLocaleString()} د.ع`
        : `${amount} د.ع = ${result.toLocaleString()}$`;
    navigator.clipboard?.writeText?.(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 shadow-md space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Calculator className="w-4 h-4 text-[#bef264]" />
          <span>حاسبة التحويل</span>
          <span className="text-[10px] text-white/40 font-normal">
            (100$ = {(rate * 100).toLocaleString()} د.ع)
          </span>
        </div>

        <button
          onClick={() => {
            setDirection(direction === "usdToIqd" ? "iqdToUsd" : "usdToIqd");
            setAmount(result > 0 ? result.toString() : "100");
          }}
          className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#bef264] border border-white/10 transition-colors cursor-pointer flex items-center gap-1"
        >
          <ArrowLeftRight className="w-2.5 h-2.5" />
          <span>{direction === "usdToIqd" ? "دولار ← دينار" : "دينار ← دولار"}</span>
        </button>
      </div>

      {/* Inputs & Output Row */}
      <div className="grid grid-cols-2 gap-2.5 items-center">
        {/* Input */}
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white font-mono text-base font-bold outline-none"
          />
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/40">
            {direction === "usdToIqd" ? "$" : "د.ع"}
          </span>
        </div>

        {/* Result */}
        <div className="h-10 px-3 bg-[#14261d] border border-emerald-500/30 rounded-xl flex items-center justify-between text-white font-mono">
          <span className="text-base font-black text-[#bef264] truncate">
            {result.toLocaleString()}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-white/40">
              {direction === "usdToIqd" ? "د.ع" : "$"}
            </span>
            <button
              onClick={handleCopy}
              className="p-0.5 rounded text-white/50 hover:text-white transition-colors cursor-pointer"
              title="نسخ"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Chips */}
      <div className="flex items-center gap-1 text-[10px] font-mono pt-0.5">
        <span className="text-white/40 text-[9px] shrink-0">سريع:</span>
        {direction === "usdToIqd" ? (
          <>
            <button
              onClick={() => setAmount("100")}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer"
            >
              100$ (ورقة)
            </button>
            <button
              onClick={() => setAmount("500")}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer"
            >
              500$
            </button>
            <button
              onClick={() => setAmount("1000")}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer"
            >
              1,000$ (شدة)
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAmount("150000")}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer"
            >
              150 ألف
            </button>
            <button
              onClick={() => setAmount("500000")}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer"
            >
              نصف مليون
            </button>
            <button
              onClick={() => setAmount("1000000")}
              className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 cursor-pointer"
            >
              مليون
            </button>
          </>
        )}
      </div>
    </div>
  );
}
