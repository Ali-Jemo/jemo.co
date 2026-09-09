"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, Circle, Share2, Printer, Check, ListChecks } from "lucide-react";

type Procedure = {
  id: string;
  title: string;
  items: string[];
};

const PROCEDURES: Procedure[] = [
  {
    id: "passport",
    title: "إصدار / تجديد الجواز الإلكتروني",
    items: [
      "حجز إلكتروني مسبق ومطبوع",
      "البطاقة الوطنية الأصلية (مع استنساخ ملون)",
      "الجواز القديم (في حال التجديد)",
      "وصل تسديد 25 ألف دينار (الدفع بالبطاقة الإلكترونية حصراً)",
      "حضور صاحب العلاقة للتبصيم والتصوير",
    ],
  },
  {
    id: "national-id",
    title: "إصدار البطاقة الوطنية الموحدة",
    items: [
      "حجز إلكتروني مسبق ومطبوع",
      "هوية الأحوال المدنية وشهادة الجنسية الأصلية",
      "بطاقة السكن الأصلية (باسم رب الأسرة) واستنساخ",
      "حضور صاحب العلاقة (أو رب الأسرة مع أفراد عائلته)",
    ],
  },
  {
    id: "vehicle-transfer",
    title: "تحويل ملكية مركبة وعقد مروري",
    items: [
      "السنوية الأصلية للمركبة",
      "عقد مروري إلكتروني مصدق",
      "الفحص المروري (الهزة) نافذ المفعول",
      "براءة ذمة من الغرامات المرورية (وصل الحاسبة)",
      "المستمسكات الثبوتية للبائع والمشتري (بطاقة وطنية، بطاقة سكن)",
      "حضور البائع والمشتري (أو وكيل قانوني)",
    ],
  },
  {
    id: "driving-license",
    title: "إصدار رخصة قيادة خصوصي",
    items: [
      "استمارة الفحص الطبي مصدقة",
      "البطاقة الوطنية الأصلية واستنساخ",
      "بطاقة السكن الأصلية واستنساخ",
      "وصل تسديد رسوم الإجازة",
      "اجتياز الاختبار النظري والعملي",
    ],
  },
];

export default function ProcedureChecklist() {
  const [selectedId, setSelectedId] = useState<string>(PROCEDURES[0].id);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const selectedProcedure = useMemo(
    () => PROCEDURES.find((p) => p.id === selectedId) || PROCEDURES[0],
    [selectedId]
  );

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [`${selectedId}-${index}`]: !prev[`${selectedId}-${index}`],
    }));
  };

  const { progress, checkedCount, missingItems } = useMemo(() => {
    const total = selectedProcedure.items.length;
    const checked = selectedProcedure.items.filter(
      (_, index) => checkedItems[`${selectedId}-${index}`]
    );
    const missing = selectedProcedure.items.filter(
      (_, index) => !checkedItems[`${selectedId}-${index}`]
    );
    
    return {
      progress: total === 0 ? 0 : Math.round((checked.length / total) * 100),
      checkedCount: checked.length,
      missingItems: missing,
    };
  }, [selectedProcedure, checkedItems, selectedId]);

  const handleCopyWhatsApp = () => {
    const lines = [`*متطلبات ${selectedProcedure.title}:*`, ""];
    
    selectedProcedure.items.forEach((item, index) => {
      const isChecked = checkedItems[`${selectedId}-${index}`];
      lines.push(`${isChecked ? "✅" : "🔲"} ${item}`);
    });
    
    if (progress < 100) {
      lines.push("", `⚠️ نسبة الإنجاز: ${progress}%`);
      lines.push(`المتبقي: ${missingItems.length} متطلبات`);
    } else {
      lines.push("", "🎉 الأوراق جاهزة بالكامل!");
    }

    const text = lines.join("\n");
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleProcedureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedId(e.target.value);
  };

  return (
    <div dir="rtl" className="w-full max-w-2xl mx-auto font-sans">
      <div className="bg-white border border-[#e4e3e3] rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#e4e3e3] bg-[#f7f7f5] flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg border border-[#e4e3e3] shadow-xs text-[#222f30]">
            <ListChecks className="w-5 h-5 text-[#a7e26e]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222f30]">منشئ قائمة متطلبات المعاملات</h2>
            <p className="text-sm text-[#55696a] mt-1">
              تأكد من اكتمال أوراقك قبل الذهاب للدائرة
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Procedure Selector */}
          <div>
            <label className="block text-sm font-medium text-[#222f30] mb-2">
              اختر نوع المعاملة:
            </label>
            <div className="relative">
              <select
                value={selectedId}
                onChange={handleProcedureChange}
                className="w-full appearance-none bg-white border border-[#e4e3e3] rounded-xl px-4 py-3 pr-4 pl-10 text-[#222f30] focus:outline-none focus:ring-2 focus:ring-[#cef79e] focus:border-[#a7e26e] transition-colors"
              >
                {PROCEDURES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="bg-[#f7f7f5] rounded-xl p-4 border border-[#e4e3e3]">
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-sm text-[#55696a] mb-1">التقدم</div>
                <div className="font-bold text-[#222f30]">
                  {progress === 100 ? (
                    <span className="text-green-600">الأوراق جاهزة بالكامل 🎉</span>
                  ) : (
                    <span>
                      أوراقك جاهزة بنسبة {progress}%
                    </span>
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold text-[#222f30]">
                {checkedCount}<span className="text-sm text-[#55696a]">/{selectedProcedure.items.length}</span>
              </div>
            </div>
            
            <div className="w-full bg-[#e4e3e3] rounded-full h-2.5 mb-3 overflow-hidden flex">
              <div
                className="bg-[#a7e26e] h-2.5 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {progress < 100 && missingItems.length > 0 && (
              <div className="text-xs text-[#55696a] mt-2">
                <span className="font-semibold text-[#222f30]">متبقي:</span> {missingItems[0]}
                {missingItems.length > 1 && ` (و ${missingItems.length - 1} أخرى)`}
              </div>
            )}
          </div>

          {/* Checklist */}
          <div className="space-y-3 print:space-y-2">
            {selectedProcedure.items.map((item, index) => {
              const isChecked = checkedItems[`${selectedId}-${index}`] || false;
              
              return (
                <button
                  key={index}
                  onClick={() => toggleItem(index)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-right transition-all duration-200 ${
                    isChecked 
                      ? 'bg-[#f7f7f5] border-[#e4e3e3] opacity-75' 
                      : 'bg-white border-[#e4e3e3] hover:border-[#a7e26e] hover:shadow-xs'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-[#a7e26e]" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#55696a]" />
                    )}
                  </div>
                  <span className={`text-sm md:text-base ${isChecked ? 'line-through text-[#55696a]' : 'text-[#222f30]'}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[#e4e3e3] print:hidden">
            <button
              onClick={handleCopyWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 bg-[#222f30] text-white py-3 px-4 rounded-xl hover:bg-opacity-90 transition-colors text-sm font-medium"
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'تم التجهيز' : 'مشاركة عبر واتساب'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-white border border-[#e4e3e3] text-[#222f30] py-3 px-4 rounded-xl hover:bg-[#f7f7f5] transition-colors text-sm font-medium shadow-xs"
            >
              <Printer className="w-4 h-4" />
              طباعة
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
