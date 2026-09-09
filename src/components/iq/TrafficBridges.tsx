"use client";

import { useState } from "react";
import {
  Car,
  CheckCircle2,
  Clock,
  Send,
  Plus,
} from "lucide-react";

type BridgeStatus = "انسيابي وسالك" | "زخم متوسط" | "ازدحام شديد" | "مغلق مؤقتاً";

interface TrafficPoint {
  id: string;
  name: string;
  category: "جسور دجلة" | "مداخل وسيطرات" | "طرق سريعة";
  route: string;
  status: BridgeStatus;
  lastUpdated: string;
  reportedBy: string;
  notes: string;
}

const INITIAL_POINTS: TrafficPoint[] = [
  {
    id: "br-1",
    name: "جسر الجادرية",
    category: "جسور دجلة",
    route: "يربط الرصافة (الجادرية) بالكرخ (السيدية والقادسية)",
    status: "انسيابي وسالك",
    lastUpdated: "قبل 8 دقائق",
    reportedBy: "المرور العامة ومواطنون",
    notes: "حركة السير ممتازة بالاتجاهين بعد انتهاء ذروة الصباح.",
  },
  {
    id: "br-2",
    name: "جسر السنك",
    category: "جسور دجلة",
    route: "يربط ساحة الخلاني بالكرخ (الصالحية)",
    status: "زخم متوسط",
    lastUpdated: "قبل 14 دقيقة",
    reportedBy: "سائق تكسي",
    notes: "تباطؤ خفيف باتجاه الكرخ قرب تقاطع وزارة العدل.",
  },
  {
    id: "br-3",
    name: "جسر الجمهورية",
    category: "جسور دجلة",
    route: "يربط ساحة التحرير بكرادة مريم",
    status: "انسيابي وسالك",
    lastUpdated: "قبل 20 دقيقة",
    reportedBy: "دوريات النجدة",
    notes: "مفتوح بالكامل بحركة طبيعية.",
  },
  {
    id: "br-4",
    name: "جسر 14 رمضان (الأعظمية)",
    category: "جسور دجلة",
    route: "يربط الأعظمية بالعطيفية والكاظمية",
    status: "ازدحام شديد",
    lastUpdated: "قبل 5 دقائق",
    reportedBy: "أهالي الأعظمية",
    notes: "توقف جزئي بسبب أعمال صيانة الفواصل من جهة الكرخ.",
  },
  {
    id: "br-5",
    name: "جسر المعلق (الشهيد كنعان)",
    category: "جسور دجلة",
    route: "يربط الكرادة داخل بمجمع الوزارات",
    status: "انسيابي وسالك",
    lastUpdated: "قبل 25 دقيقة",
    reportedBy: "سائق باص",
    notes: "حركة انسيابية ممتازة.",
  },
  {
    id: "br-6",
    name: "سيطرة الصقور (مدخل بغداد الغربي)",
    category: "مداخل وسيطرات",
    route: "طريق المرور السريع 1 — باتجاه الفلوجة والرمادي",
    status: "زخم متوسط",
    lastUpdated: "قبل 18 دقيقة",
    reportedBy: "مسافر",
    notes: "طابور فحص السونار يستغرق قرابة 10 دقائق.",
  },
  {
    id: "br-7",
    name: "سيطرة التاجي (مدخل بغداد الشمالي)",
    category: "مداخل وسيطرات",
    route: "طريق بغداد — سامراء والموصل",
    status: "انسيابي وسالك",
    lastUpdated: "قبل 30 دقيقة",
    reportedBy: "نقل عام",
    notes: "كافة المسارات مفتوحة والتفتيش سريع.",
  },
  {
    id: "br-8",
    name: "طريق محمد القاسم السريع",
    category: "طرق سريعة",
    route: "يمتد من الباب الشرقي وصولاً للرستمية ومخرج الجنوب",
    status: "زخم متوسط",
    lastUpdated: "قبل 12 دقيقة",
    reportedBy: "مفرزة مرور",
    notes: "زخم معتاد قرب تقاطع النهضة وجسر الأمانة.",
  },
];

const getStatusBadge = (status: BridgeStatus) => {
  switch (status) {
    case "انسيابي وسالك":
      return {
        bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
        dot: "bg-emerald-400",
      };
    case "زخم متوسط":
      return {
        bg: "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300",
        dot: "bg-amber-400",
      };
    case "ازدحام شديد":
      return {
        bg: "bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300",
        dot: "bg-red-400",
      };
    case "مغلق مؤقتاً":
      return {
        bg: "bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300",
        dot: "bg-purple-400",
      };
  }
};

export default function TrafficBridges() {
  const [points, setPoints] = useState<TrafficPoint[]>(INITIAL_POINTS);
  const [activeTab, setActiveTab] = useState<string>("الكل");
  const [showReportModal, setShowReportModal] = useState(false);

  // Form state
  const [selectedPointId, setSelectedPointId] = useState<string>(INITIAL_POINTS[0].id);
  const [reportedStatus, setReportedStatus] = useState<BridgeStatus>("انسيابي وسالك");
  const [reportedNotes, setReportedNotes] = useState("");
  const [submittedToast, setSubmittedToast] = useState(false);

  const filteredPoints = activeTab === "الكل" ? points : points.filter((p) => p.category === activeTab);

  const handleReportSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setPoints((prev) =>
      prev.map((p) =>
        p.id === selectedPointId
          ? {
              ...p,
              status: reportedStatus,
              notes: reportedNotes.trim() || p.notes,
              lastUpdated: "الآن",
              reportedBy: "مواطن من الموقع",
            }
          : p
      )
    );
    setSubmittedToast(true);
    setTimeout(() => {
      setShowReportModal(false);
      setSubmittedToast(false);
      setReportedNotes("");
    }, 1800);
  };

  return (
    <div className="rounded-3xl border border-[#e4e3e3] dark:border-white/10 bg-white dark:bg-[#0e1618] p-4 sm:p-5 shadow-xs space-y-4" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e4e3e3] dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-[#bef264]">
            <Car className="w-4 h-4" />
            <span>موقف الجسور والسيطرات المرورية · بغداد</span>
            <span className="text-white/40">·</span>
            <span className="text-emerald-700/80 dark:text-emerald-400 font-bold">تحديث لحظي</span>
          </div>
          <h3 className="font-kufi font-bold text-base sm:text-lg text-[#222f30] dark:text-white">
            حركة السير وانسيابية جسور دجلة ومداخل العاصمة
          </h3>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-kufi font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>أبلغ عن زخم أو قطع</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-mono py-0.5">
        {["الكل", "جسور دجلة", "مداخل وسيطرات", "طرق سريعة"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-[#222f30] dark:bg-[#bef264] text-white dark:text-[#0c1415] font-bold shadow-xs"
                : "bg-[#f7f7f5] dark:bg-black/30 text-[#55696a] dark:text-white/60 hover:text-white border border-[#e4e3e3] dark:border-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredPoints.map((point) => {
          const badge = getStatusBadge(point.status);
          return (
            <div
              key={point.id}
              className="p-3.5 rounded-2xl bg-[#f7f7f5]/80 dark:bg-black/40 border border-[#e4e3e3] dark:border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1.5 text-xs font-mono">
                  <span className="text-[10px] text-[#55696a] dark:text-white/50">{point.category}</span>
                  <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 ${badge.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    <span>{point.status}</span>
                  </div>
                </div>

                <h4 className="font-kufi font-bold text-sm text-[#222f30] dark:text-white">
                  {point.name}
                </h4>

                <p className="text-[11px] text-[#55696a] dark:text-white/60 leading-tight">
                  {point.route}
                </p>
              </div>

              <div className="pt-2 border-t border-[#e4e3e3] dark:border-white/5 space-y-1 text-[10px] font-mono">
                <p className="text-[#222f30] dark:text-white/80 leading-relaxed font-sans line-clamp-2">
                  &ldquo;{point.notes}&rdquo;
                </p>
                <div className="flex items-center justify-between text-[#55696a] dark:text-white/40 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{point.lastUpdated}</span>
                  </span>
                  <span>بواسطة: {point.reportedBy}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Community Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0e1618] border border-[#e4e3e3] dark:border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e4e3e3] dark:border-white/10">
              <div className="flex items-center gap-2 font-kufi font-bold text-[#222f30] dark:text-white text-base">
                <Car className="w-4 h-4 text-emerald-500" />
                <span>الإبلاغ عن حالة جسر أو سيطرة</span>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {submittedToast ? (
              <div className="py-8 text-center space-y-2 font-kufi">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-[#222f30] dark:text-white font-bold text-base">تم تحديث الموقف المروري!</h4>
                <p className="text-xs text-[#55696a] dark:text-white/60">
                  شكراً لمشاركتك الميدانية في مساعدة السائقين والمواطنين على تجنب الازدحامات.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3.5 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-[#222f30] dark:text-white/80 block">الجسر أو النقطة المرورية</label>
                  <select
                    value={selectedPointId}
                    onChange={(e) => setSelectedPointId(e.target.value)}
                    className="w-full h-10 px-3 bg-[#f7f7f5] dark:bg-black/40 border border-[#e4e3e3] dark:border-white/15 focus:border-emerald-500 rounded-xl text-[#222f30] dark:text-white outline-none"
                  >
                    {points.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#0e1618]">
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#222f30] dark:text-white/80 block">الحالة الحالية للسير</label>
                  <select
                    value={reportedStatus}
                    onChange={(e) => setReportedStatus(e.target.value as BridgeStatus)}
                    className="w-full h-10 px-3 bg-[#f7f7f5] dark:bg-black/40 border border-[#e4e3e3] dark:border-white/15 focus:border-emerald-500 rounded-xl text-[#222f30] dark:text-white outline-none"
                  >
                    <option value="انسيابي وسالك">انسيابي وسالك (حركة طبيعية)</option>
                    <option value="زخم متوسط">زخم متوسط (تباطؤ حركة)</option>
                    <option value="ازدحام شديد">ازدحام شديد (توقف حركة السير)</option>
                    <option value="مغلق مؤقتاً">مغلق مؤقتاً (قطع أمني أو صيانة)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#222f30] dark:text-white/80 block">ملاحظة أو سبب الزخم (حادث، صيانة، تدقيق)</label>
                  <textarea
                    rows={2}
                    value={reportedNotes}
                    onChange={(e) => setReportedNotes(e.target.value)}
                    placeholder="مثال: حادث دراجة عند المطلع، السونار متوقف..."
                    className="w-full p-2.5 bg-[#f7f7f5] dark:bg-black/40 border border-[#e4e3e3] dark:border-white/15 focus:border-emerald-500 rounded-xl text-[#222f30] dark:text-white outline-none resize-none font-sans"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/5 hover:bg-black/20 text-[#55696a] dark:text-white/70 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>نشر التحديث الميداني</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
