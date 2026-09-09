"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
} from "lucide-react";

export default function IqMePage() {
  const [governorate, setGovernorate] = useState("بغداد — الرصافة");
  const [district, setDistrict] = useState("الكرادة");
  const [alertUsd, setAlertUsd] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* 1. Header Profile Card */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#0e1618] border border-white/10 shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#bef264] to-[#a3e635] text-[#0c1415] font-kufi font-black text-xl flex items-center justify-center shadow-md">
            ع
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-kufi font-bold text-lg text-white">
                مواطن عراقي
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#bef264]/10 text-[#bef264] border border-[#bef264]/20 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                مشارك محلي
              </span>
            </div>
            <p className="text-xs font-mono text-white/60 mt-0.5">
              منطقتك الحالية: {governorate} ({district})
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-[#bef264] text-xs font-mono transition-colors"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>JEMO LABS</span>
        </Link>
      </section>

      {/* 2. Preferences & Location Settings Form */}
      <form onSubmit={handleSave} className="p-5 sm:p-6 rounded-3xl bg-[#0e1618] border border-white/10 shadow-lg space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10 font-kufi font-bold text-white text-base">
          <SlidersHorizontal className="w-4 h-4 text-[#bef264]" />
          <span>تخصيص المحافظة ومصادر الأرقام</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-white/80 block">المحافظة الأساسية</label>
            <select
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="w-full h-11 px-3 bg-[#141e20] border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
            >
              <option value="بغداد — الرصافة">بغداد — الرصافة</option>
              <option value="بغداد — الكرخ">بغداد — الكرخ</option>
              <option value="البصرة">البصرة</option>
              <option value="أربيل">أربيل</option>
              <option value="النجف الأشرف">النجف الأشرف</option>
              <option value="نينوى (الموصل)">نينوى (الموصل)</option>
              <option value="كربلاء المقدسة">كربلاء المقدسة</option>
              <option value="كركوك">كركوك</option>
              <option value="السليمانية">السليمانية</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/80 block">الحي أو القضاء التابع له</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="مثال: الكرادة، المنصور، المعقل، بختياري"
              className="w-full h-11 px-3.5 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="pt-2 border-t border-white/10 space-y-3 text-xs font-mono">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="space-y-0.5">
              <span className="text-white font-bold block">تنبيهات صعود وهبوط الدولار</span>
              <span className="text-white/50 text-[11px] block">
                إشعار عند كسر عتبة الـ 154 ألف أو النزول تحت 152 ألف
              </span>
            </div>
            <input
              type="checkbox"
              checked={alertUsd}
              onChange={(e) => setAlertUsd(e.target.checked)}
              className="w-5 h-5 accent-[#bef264] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs font-mono text-emerald-400">
            {savedSuccess && "✓ تم حفظ تفضيلاتك بنجاح!"}
          </span>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-kufi font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            حفظ التفضيلات
          </button>
        </div>
      </form>

      {/* 3. Saved Offline Guides & Bookmarks */}
      <section className="p-5 sm:p-6 rounded-3xl bg-[#0e1618] border border-white/10 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 font-kufi font-bold text-white text-base">
            <Bookmark className="w-4 h-4 text-[#bef264]" />
            <span>محفوظاتي للأوقات بدون إنترنت</span>
          </div>
          <span className="text-xs font-mono text-white/40">2 أدلة محفوظة</span>
        </div>

        <div className="space-y-2.5">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-white/90">دليل تجديد الجواز الإلكتروني (دائرة الكرخ)</span>
            <Link href="/iq/intel" className="text-[#bef264] hover:underline">
              عرض الدليل ←
            </Link>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono">
            <span className="text-white/90">ورشة المهندس لتصليح السبالت (رقم الواتساب مسجل)</span>
            <Link href="/iq/map" className="text-[#bef264] hover:underline">
              عرض في الخريطة ←
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Connection to Jemo Labs */}
      <section className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs font-mono text-white/60 space-y-2 text-center sm:text-right">
        <div className="flex items-center gap-2 justify-center sm:justify-start font-bold text-white/90">
          <Building2 className="w-4 h-4 text-[#bef264]" />
          <span>منظومة هسه تابعة لمختبرات JEMO LABS</span>
        </div>
        <p className="leading-relaxed">
          هسه هي مبادرة رقمية مستقلة تهدف لخدمة المواطن العراقي وربط الحلول التقنية باحتياجات الشارع اليومية.
        </p>
        <div className="pt-1">
          <Link href="/" className="text-[#bef264] hover:underline">
            زيارة منصة الأبحاث والذكاء الاصطناعي (jemo.co) ←
          </Link>
        </div>
      </section>
    </div>
  );
}
