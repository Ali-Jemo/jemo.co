"use client";

import { useState } from "react";
import { Calculator, Zap, AlertTriangle, CheckCircle2, Info, Plus } from "lucide-react";

type Neighborhood = {
  id: string;
  name: string;
  actualPrice: number;
  officialPrice: number;
};

const INITIAL_DATA: Neighborhood[] = [
  { id: "karada", name: "الكرادة", actualPrice: 16000, officialPrice: 14000 },
  { id: "mansour", name: "المنصور", actualPrice: 18000, officialPrice: 14000 },
  { id: "adhamiya", name: "الأعظمية", actualPrice: 15000, officialPrice: 14000 },
  { id: "dora", name: "الدورة", actualPrice: 14000, officialPrice: 14000 },
  { id: "jamia", name: "حي الجامعة", actualPrice: 17000, officialPrice: 14000 },
  { id: "kadhimiya", name: "الكاظمية", actualPrice: 15000, officialPrice: 14000 },
  { id: "sadr", name: "مدينة الصدر", actualPrice: 12000, officialPrice: 12000 },
  { id: "basra", name: "البصرة", actualPrice: 13000, officialPrice: 11000 },
  { id: "najaf", name: "النجف", actualPrice: 10000, officialPrice: 10000 },
  { id: "erbil", name: "أربيل", actualPrice: 18000, officialPrice: 15000 },
  { id: "ninawa", name: "نينوى", actualPrice: 12000, officialPrice: 12000 },
];

export default function AmpereTracker() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(INITIAL_DATA);
  const [selectedAmperes, setSelectedAmperes] = useState<string>("5");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>("karada");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportName, setReportName] = useState("");
  const [reportPrice, setReportPrice] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const selectedNeighborhood = neighborhoods.find((n) => n.id === selectedNeighborhoodId) || neighborhoods[0];
  const amperesNum = parseInt(selectedAmperes) || 0;
  const totalBillIQD = selectedNeighborhood.actualPrice * amperesNum;
  // Approximation for USD equivalent
  const totalBillUSD = (totalBillIQD / 1500).toFixed(2);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportName || !reportPrice) return;
    
    const newPrice = parseInt(reportPrice.replace(/,/g, ""));
    if (isNaN(newPrice)) return;

    setNeighborhoods((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: reportName,
        actualPrice: newPrice,
        officialPrice: 14000, // Default official price assumption for reporting
      }
    ]);
    
    setReportName("");
    setReportPrice("");
    setIsModalOpen(false);
    
    setToastMessage("تم تسجيل السعر بنجاح، شكراً لمساهمتك!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div dir="rtl" className="space-y-4 rounded-2xl border border-white/10 bg-[#080c0d] p-5 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2 font-bold text-[#bef264]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#bef264]/10">
            <Zap className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="text-lg">مؤشر وسجل أمبير المولدات حسب المحلة</h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#0e1618] border border-white/10 px-3 py-1.5 text-xs font-bold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5 text-[#bef264]" />
          <span>أبلغ عن سعر منطقتك</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: Calculator */}
        <div className="rounded-xl border border-white/10 bg-[#0e1618] p-4">
          <div className="mb-4 flex items-center gap-1.5 font-bold text-white/90">
            <Calculator className="h-4 w-4 text-[#bef264]" />
            <h3>حاسبة فاتورة المولد</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="neighborhood-select" className="mb-1.5 block text-xs font-bold text-white/60">
                اختر المنطقة
              </label>
              <select
                id="neighborhood-select"
                value={selectedNeighborhoodId}
                onChange={(e) => setSelectedNeighborhoodId(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#080c0d] px-3 py-2 text-sm text-white/90 outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
              >
                {neighborhoods.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amperes-input" className="mb-1.5 block text-xs font-bold text-white/60">
                عدد الأمبيرات
              </label>
              <div className="relative">
                <input
                  id="amperes-input"
                  type="range"
                  min="1"
                  max="50"
                  value={selectedAmperes}
                  onChange={(e) => setSelectedAmperes(e.target.value)}
                  className="w-full accent-[#bef264]"
                />
                <div className="mt-2 flex justify-between text-xs text-white/50">
                  <span>1</span>
                  <span className="font-bold text-[#bef264]">{selectedAmperes} أمبير</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#080c0d] p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">الفاتورة الإجمالية</span>
                <div className="text-left">
                  <div className="text-lg font-black text-[#bef264]">
                    {totalBillIQD.toLocaleString("ar-IQ")} د.ع
                  </div>
                  <div className="text-[10px] text-white/50">
                    ≈ ${totalBillUSD}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Index */}
        <div className="rounded-xl border border-white/10 bg-[#0e1618] p-4">
          <div className="mb-3 flex items-center gap-1.5 font-bold text-white/90">
            <Info className="h-4 w-4 text-[#bef264]" />
            <h3>مؤشر الأسعار المباشر</h3>
          </div>
          <div className="h-[250px] space-y-2 overflow-y-auto pr-1">
            {neighborhoods.map((n) => {
              const diff = n.actualPrice - n.officialPrice;
              const isCompliant = diff <= 0;
              return (
                <div key={n.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-[#080c0d] p-2.5">
                  <div>
                    <div className="text-sm font-bold text-white/90">{n.name}</div>
                    <div className="mt-0.5 flex gap-2 text-[10px]">
                      <span className="text-white/50">الرسمي: {n.officialPrice.toLocaleString("ar-IQ")}</span>
                      <span className="text-white/80">الفعلي: {n.actualPrice.toLocaleString("ar-IQ")}</span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold ${
                      isCompliant
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {isCompliant ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        <span>التزام</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        <span>زيادة {(diff).toLocaleString("ar-IQ")}</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reporting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1618] p-5 shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-[#bef264]">أبلغ عن سعر أمبير منطقتك</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/70">اسم المنطقة / المحافظة</label>
                <input
                  type="text"
                  required
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="مثال: البصرة - العشار"
                  className="w-full rounded-lg border border-white/10 bg-[#080c0d] px-3 py-2 text-sm text-white focus:border-[#bef264] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-white/70">سعر الشارع الفعلي (د.ع)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={reportPrice}
                  onChange={(e) => setReportPrice(e.target.value)}
                  placeholder="مثال: 16000"
                  className="w-full rounded-lg border border-white/10 bg-[#080c0d] px-3 py-2 text-sm text-white focus:border-[#bef264] focus:outline-none"
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#bef264] py-2 text-sm font-bold text-[#080c0d] transition-opacity hover:opacity-90"
                >
                  إرسال الإبلاغ
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-white/10 bg-transparent py-2 text-sm font-bold text-white/70 transition-colors hover:bg-white/5"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-[#bef264] px-4 py-2 font-bold text-[#080c0d] shadow-lg animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
