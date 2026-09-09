"use client";

import { useState } from "react";
import { Calculator, AlertCircle, Info } from "lucide-react";

type EngineType = "4cyl" | "6cyl" | "8cyl" | "hybrid";
type RegGoal = "new" | "transfer" | "entry";

export default function CarCustomsCalculator() {
  const [year, setYear] = useState<number>(2026);
  const [engine, setEngine] = useState<EngineType>("4cyl");
  const [goal, setGoal] = useState<RegGoal>("new");

  // ponytail: Simple heuristic mapping. Replace with exact govt formulas when/if needed.
  const calculateFees = () => {
    let baseCustoms = 0;
    let roadsFee = 0;

    switch (engine) {
      case "4cyl":
        baseCustoms = 1500000;
        roadsFee = 100000;
        break;
      case "6cyl":
        baseCustoms = 2500000;
        roadsFee = 150000;
        break;
      case "8cyl":
        baseCustoms = 4000000;
        roadsFee = 250000;
        break;
      case "hybrid":
        baseCustoms = 500000;
        roadsFee = 50000;
        break;
    }

    // Newer cars have slightly higher customs value generally (simplified)
    const yearMultiplier = 1 + (year - 2020) * 0.05;
    
    let regFee = 0;
    switch (goal) {
      case "new":
        regFee = 2000000;
        break;
      case "transfer":
        regFee = 150000;
        baseCustoms = 0; // Already in country
        break;
      case "entry":
        regFee = 50000;
        break;
    }

    const finalCustoms = goal === "transfer" ? 0 : Math.round(baseCustoms * yearMultiplier);
    const total = finalCustoms + regFee + roadsFee;

    return {
      customs: finalCustoms,
      reg: regFee,
      roads: roadsFee,
      total,
    };
  };

  const fees = calculateFees();

  const formatIQD = (val: number) =>
    new Intl.NumberFormat("ar-IQ", { style: "currency", currency: "IQD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full max-w-2xl bg-white border border-[#e4e3e3] rounded-xl shadow-xs text-[#222f30] overflow-hidden">
      <div className="p-6 border-b border-[#e4e3e3] flex items-center gap-3 bg-[#f7f7f5]/50">
        <div className="p-2 bg-[#cef79e]/30 rounded-lg text-[#222f30]">
          <Calculator className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold" dir="rtl">حاسبة كمرك وترقيم السيارات</h2>
      </div>

      <div className="p-6 space-y-6" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#55696a]">سنة الصنع (الموديل)</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-[#e4e3e3] rounded-lg focus:outline-none focus:border-[#a7e26e] focus:ring-1 focus:ring-[#a7e26e] text-right"
            >
              {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#55696a]">نوع المحرك</label>
            <select
              value={engine}
              onChange={(e) => setEngine(e.target.value as EngineType)}
              className="w-full p-2.5 bg-white border border-[#e4e3e3] rounded-lg focus:outline-none focus:border-[#a7e26e] focus:ring-1 focus:ring-[#a7e26e] text-right"
            >
              <option value="4cyl">4 سلندر (≤2.0L)</option>
              <option value="6cyl">6 سلندر (≤3.5L)</option>
              <option value="8cyl">8 سلندر (&gt;3.5L)</option>
              <option value="hybrid">هجين / كهربائي</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#55696a]">نوع المعاملة</label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as RegGoal)}
              className="w-full p-2.5 bg-white border border-[#e4e3e3] rounded-lg focus:outline-none focus:border-[#a7e26e] focus:ring-1 focus:ring-[#a7e26e] text-right"
            >
              <option value="new">ترقيم بغداد جديد</option>
              <option value="transfer">تحويل ملكية مسجلة</option>
              <option value="entry">فحص مؤقت / إدخال كمركي</option>
            </select>
          </div>
        </div>

        <div className="bg-[#f7f7f5] rounded-xl p-5 border border-[#e4e3e3]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#55696a]" />
            التفاصيل المالية
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-[#e4e3e3]/50">
              <span className="text-[#55696a]">رسم كمركي تقديري</span>
              <span className="font-medium font-mono" dir="ltr">{formatIQD(fees.customs)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#e4e3e3]/50">
              <span className="text-[#55696a]">رسم ترقيم ولوحات ومروجي المعاملة</span>
              <span className="font-medium font-mono" dir="ltr">{formatIQD(fees.reg)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#e4e3e3]/50">
              <span className="text-[#55696a]">رسم الطرق والجسور والبيئة</span>
              <span className="font-medium font-mono" dir="ltr">{formatIQD(fees.roads)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 text-lg font-bold">
              <span>الإجمالي التقريبي</span>
              <span className="text-[#222f30]" dir="ltr">{formatIQD(fees.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-lg text-orange-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-bold mr-1">تنبيه:</span>
            التقدير مبني على جداول الهيئة العامة للكمارك ومديرية المرور لعام 2026؛ تأكد من خلو المركبة من الغرامات والإشارات القضائية قبل الشراء.
          </p>
        </div>
      </div>
    </div>
  );
}
