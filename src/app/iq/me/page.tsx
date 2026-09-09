"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  ShieldCheck,
  Building2,
  SlidersHorizontal,
  MapPin,
  BookOpen,
  Calculator,
  Bell,
  Trash2,
  Check,
  ChevronLeft,
  FileText,
  Star,
} from "lucide-react";

const GOVERNORATES = [
  "بغداد — الرصافة",
  "بغداد — الكرخ",
  "البصرة",
  "نينوى (الموصل)",
  "أربيل",
  "السليمانية",
  "دهوك",
  "كركوك",
  "صلاح الدين",
  "الأنبار",
  "ديالى",
  "بابل",
  "كربلاء المقدسة",
  "النجف الأشرف",
  "واسط",
  "ذي قار",
  "ميسان",
  "المثنى",
  "القادسية",
];

const DEFAULT_SAVED = [
  {
    id: "guide-passport",
    title: "دليل تجديد الجواز الإلكتروني (دائرة الكرخ)",
    meta: "دليل معاملة · محفوظ للقراءة بدون إنترنت",
    href: "/iq/intel",
    icon: FileText,
  },
  {
    id: "spot-ac",
    title: "ورشة المهندس لتصليح السبالت — حي الجامعة",
    meta: "تقييم 5.0 · رقم الواتساب مسجل",
    href: "/iq/map",
    icon: Star,
  },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30] ${
        checked ? "bg-[#222f30]" : "bg-[#e4e3e3]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "right-0.5 bg-[#cef79e]" : "right-[22px]"
        }`}
      />
    </button>
  );
}

export default function IqMePage() {
  const [governorate, setGovernorate] = useState("بغداد — الرصافة");
  const [district, setDistrict] = useState("الكرادة");
  const [alertUsd, setAlertUsd] = useState(true);
  const [alertPrices, setAlertPrices] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saved, setSaved] = useState(DEFAULT_SAVED);
  const [loaded, setLoaded] = useState(false);

  // persist preferences locally — no account needed
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hassa-prefs");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.governorate) setGovernorate(p.governorate);
        if (typeof p.district === "string") setDistrict(p.district);
        if (typeof p.alertUsd === "boolean") setAlertUsd(p.alertUsd);
        if (typeof p.alertPrices === "boolean") setAlertPrices(p.alertPrices);
      }
      const savedRaw = localStorage.getItem("hassa-saved");
      if (savedRaw) {
        const ids: string[] = JSON.parse(savedRaw);
        setSaved(DEFAULT_SAVED.filter((s) => ids.includes(s.id)));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const completeness =
    [governorate !== "", district.trim() !== "", alertUsd || alertPrices].filter(Boolean)
      .length / 3;

  const handleSave = (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "hassa-prefs",
        JSON.stringify({ governorate, district, alertUsd, alertPrices })
      );
    } catch {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemoveSaved = (id: string) => {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next);
    try {
      localStorage.setItem("hassa-saved", JSON.stringify(next.map((s) => s.id)));
    } catch {}
  };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-busy="true" aria-label="جاري تحميل حسابك">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-3xl border border-[#e4e3e3] bg-white"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      {/* 1. Profile header */}
      <section
        aria-label="الملف الشخصي"
        className="rounded-2xl border border-[#e4e3e3] bg-white p-5 shadow-xs sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#222f30] p-3 font-kufi text-xl font-black text-[#cef79e]"
            >
              {(district.trim().charAt(0) || "ع") as string}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-kufi text-lg font-bold text-[#222f30]">
                  مواطن عراقي
                </h1>
                <span className="flex items-center gap-1 rounded-full border border-[#a7e26e] bg-[#cef79e]/40 px-2 py-0.5 text-[10px] font-bold text-[#222f30]">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  مشارك محلي
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[#55696a]">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {governorate}
                  {district.trim() ? ` · ${district.trim()}` : ""}
                </span>
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#e4e3e3] bg-white px-3.5 py-1.5 text-xs text-[#55696a] transition-colors hover:border-[#a7e26e] hover:text-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30] sm:inline-flex"
          >
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>JEMO LABS</span>
          </Link>
        </div>

        {/* completeness */}
        <div className="mt-4 border-t border-[#e4e3e3] pt-3">
          <div className="flex items-center justify-between text-[11px] text-[#55696a]">
            <span>اكتمال ملف المنطقة — أسعار أدق وتنبيهات أنسب</span>
            <span className="font-bold text-[#222f30] tabular-nums">
              {Math.round(completeness * 100)}%
            </span>
          </div>
          <div
            className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#f0f2f0]"
            role="progressbar"
            aria-valuenow={Math.round(completeness * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="اكتمال ملف المنطقة"
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#728825] to-[#a7e26e] transition-all"
              style={{ width: `${Math.round(completeness * 100)}%` }}
            />
          </div>
        </div>
      </section>

      {/* 2. Stats row */}
      <section aria-label="ملخص نشاطك" className="grid grid-cols-3 gap-2.5">
        {[
          { value: String(saved.length), label: "أدلة محفوظة" },
          {
            value: String((alertUsd ? 1 : 0) + (alertPrices ? 1 : 0)),
            label: "تنبيهات مفعلة",
          },
          { value: "0", label: "مساهمات منشورة" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[#e4e3e3] bg-white p-3 text-center shadow-xs"
          >
            <div className="font-kufi text-xl font-black text-[#222f30] tabular-nums">
              {s.value}
            </div>
            <div className="mt-0.5 text-[10px] font-bold text-[#55696a]">{s.label}</div>
          </div>
        ))}
      </section>

      {/* 3. Quick actions */}
      <nav
        aria-label="إجراءات سريعة"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
      >
        {[
          { href: "/iq/map", icon: MapPin, label: "خريطة المحلة" },
          { href: "/iq/intel", icon: BookOpen, label: "دليل المعاملات" },
          { href: "/iq#calculator", icon: Calculator, label: "حاسبة الدولار" },
          { href: "/iq", icon: Bell, label: "نبض اليوم" },
        ].map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className="group flex items-center justify-center gap-1.5 rounded-xl border border-[#e4e3e3] bg-white px-2 py-3 text-xs font-bold text-[#222f30] shadow-xs transition-all hover:-translate-y-0.5 hover:border-[#a7e26e] hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
            >
              <Icon
                className="h-3.5 w-3.5 text-[#728825]"
                aria-hidden="true"
              />
              <span>{a.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 4. Preferences */}
      <form
        onSubmit={handleSave}
        aria-label="تخصيص المحافظة والتنبيهات"
        className="space-y-5 rounded-2xl border border-[#e4e3e3] bg-white p-5 shadow-xs sm:p-6"
      >
        <div className="flex items-center gap-2 border-b border-[#e4e3e3] pb-3 font-kufi text-base font-bold text-[#222f30]">
          <SlidersHorizontal
            className="h-4 w-4 text-[#728825]"
            aria-hidden="true"
          />
          <span>منطقتي وتنبيهات الأسعار</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="gov"
              className="block text-xs font-bold text-[#222f30]"
            >
              المحافظة الأساسية
            </label>
            <select
              id="gov"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] px-3 text-xs text-[#222f30] outline-none transition-colors focus:border-[#728825] focus:bg-white focus:ring-2 focus:ring-[#cef79e]"
            >
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="district"
              className="block text-xs font-bold text-[#222f30]"
            >
              الحي أو القضاء
            </label>
            <input
              id="district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="مثال: الكرادة، المنصور، المعقل"
              autoComplete="address-level2"
              className="h-11 w-full rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] px-3.5 text-xs text-[#222f30] outline-none transition-colors placeholder:text-[#a1a1aa] focus:border-[#728825] focus:bg-white focus:ring-2 focus:ring-[#cef79e]"
            />
          </div>
        </div>

        <fieldset className="space-y-2.5 border-t border-[#e4e3e3] pt-4">
          <legend className="sr-only">خيارات التنبيهات</legend>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] p-3">
            <div>
              <span className="block text-xs font-bold text-[#222f30]">
                تنبيه صعود وهبوط الدولار
              </span>
              <span className="mt-0.5 block text-[11px] text-[#55696a]">
                إشعار عند كسر 154 ألف أو النزول تحت 152 ألف
              </span>
            </div>
            <Toggle checked={alertUsd} onChange={setAlertUsd} label="تنبيه الدولار" />
          </div>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] p-3">
            <div>
              <span className="block text-xs font-bold text-[#222f30]">
                تنبيه أسعار الأمبير والغاز
              </span>
              <span className="mt-0.5 block text-[11px] text-[#55696a]">
                تسعيرة المولد الشهرية وساحة الغاز بمنطقتك
              </span>
            </div>
            <Toggle
              checked={alertPrices}
              onChange={setAlertPrices}
              label="تنبيه الأمبير والغاز"
            />
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs font-bold text-emerald-700" role="status" aria-live="polite">
            {savedSuccess ? (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                تم حفظ تفضيلاتك على هذا الجهاز
              </span>
            ) : (
              <span className="font-normal text-[#a1a1aa]">
                تُحفظ على جهازك فقط — بدون حساب
              </span>
            )}
          </span>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#222f30] px-6 py-2.5 font-kufi text-xs font-bold text-white shadow-xs transition-all hover:bg-[#162021] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30] active:scale-95"
          >
            حفظ التفضيلات
          </button>
        </div>
      </form>

      {/* 5. Saved offline */}
      <section
        aria-label="محفوظاتي"
        className="space-y-3 rounded-2xl border border-[#e4e3e3] bg-white p-5 shadow-xs sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-[#e4e3e3] pb-3">
          <div className="flex items-center gap-2 font-kufi text-base font-bold text-[#222f30]">
            <Bookmark className="h-4 w-4 text-[#728825]" aria-hidden="true" />
            <span>محفوظاتي — بدون إنترنت</span>
          </div>
          <span className="rounded-full bg-[#f0f2f0] px-2.5 py-0.5 text-[11px] font-bold text-[#55696a] tabular-nums">
            {saved.length} محفوظ
          </span>
        </div>

        {saved.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#e4e3e3] bg-[#f7f7f5] p-6 text-center">
            <Bookmark
              className="mx-auto h-6 w-6 text-[#a1a1aa]"
              aria-hidden="true"
            />
            <p className="mt-2 text-xs font-bold text-[#222f30]">
              لا شيء محفوظ بعد
            </p>
            <p className="mx-auto mt-1 max-w-xs text-[11px] leading-relaxed text-[#55696a]">
              احفظ الأدلة المهمة من صفحتي الدليل والخريطة لقراءتها لاحقاً حتى
              بدون إنترنت.
            </p>
            <Link
              href="/iq/intel"
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#222f30] px-4 py-2 text-[11px] font-bold text-white transition-colors hover:bg-[#162021] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
            >
              <span>تصفح الدليل</span>
              <ChevronLeft className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {saved.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] p-3 transition-colors hover:border-[#a7e26e] hover:bg-white"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#e4e3e3] bg-white">
                      <Icon
                        className="h-4 w-4 text-[#728825]"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#222f30]">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-[#55696a]">
                        {item.meta}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <Link
                      href={item.href}
                      className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold text-[#728825] transition-colors hover:bg-[#cef79e]/40 hover:text-[#222f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
                    >
                      عرض ←
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(item.id)}
                      aria-label={`إزالة ${item.title} من المحفوظات`}
                      className="cursor-pointer rounded-lg p-1.5 text-[#a1a1aa] transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 6. Bridge */}
      <section className="space-y-2 rounded-2xl border border-[#e4e3e3] bg-white p-5 text-center text-xs text-[#55696a] shadow-xs sm:text-right">
        <div className="flex items-center justify-center gap-2 font-bold text-[#222f30] sm:justify-start">
          <Building2
            className="h-4 w-4 text-[#728825]"
            aria-hidden="true"
          />
          <span>هسه — مبادرة مجتمعية من JEMO LABS</span>
        </div>
        <p className="leading-relaxed">
          منصة مفتوحة تخدم المواطن العراقي وتربط الحلول التقنية باحتياجات
          الشارع اليومية.
        </p>
        <div className="pt-1">
          <Link
            href="/"
            className="font-bold text-[#222f30] underline decoration-[#a7e26e] decoration-2 underline-offset-4 hover:decoration-[#222f30]"
          >
            زيارة منصة الأبحاث jemo.co ←
          </Link>
        </div>
      </section>
    </div>
  );
}
