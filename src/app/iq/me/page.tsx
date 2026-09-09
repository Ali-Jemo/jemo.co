"use client";

import { useEffect, useState } from "react";
import {
  Bookmark,
  ShieldCheck,
  SlidersHorizontal,
  MapPin,
  Trash2,
  Check,
  FileText,
  Star,
  HeartPulse,
  ShieldAlert,
  Flame,
  Eye,
  Car,
  ShieldHalf,
  Zap,
  Scale,
  MessageCircle,
  PhoneCall,
  Phone
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

const HELPLINES = [
  { name: "الإسعاف الفوري", number: "122", desc: "الحالات الطبية الطارئة", icon: HeartPulse },
  { name: "الشرطة والنجدة العامة", number: "104", desc: "الحوادث والجرائم", icon: ShieldAlert },
  { name: "الدفاع المدني والإطفاء", number: "115", desc: "الحرائق والإنقاذ", icon: Flame },
  { name: "جهاز الأمن الوطني", number: "131", desc: "الابتزاز والأمن المجتمعي", icon: Eye },
  { name: "شكاوى المرور العامة", number: "444", desc: "الحوادث وشكاوى الطرق", icon: Car },
  { name: "جهاز المخابرات الوطني", number: "133", desc: "مكافحة الإرهاب", icon: ShieldHalf },
  { name: "طوارئ الكهرباء وشكاوى المولدات", number: "159", desc: "شكاوى المولدات والانقطاع", icon: Zap },
  { name: "حماية المستهلك ومكافحة الغش", number: "554", desc: "مكافحة الغش التجاري", icon: Scale },
];

const DEFAULT_SAVED = [
  {
    id: "guide-passport",
    type: "guide",
    title: "دليل تجديد الجواز الإلكتروني (دائرة الكرخ)",
    meta: "دليل معاملة",
    href: "/iq/intel",
    icon: "FileText",
  },
  {
    id: "spot-ac",
    type: "spot",
    title: "ورشة المهندس لتصليح السبالت — حي الجامعة",
    meta: "تقييم 5.0",
    href: "/iq/map",
    icon: "Star",
    phone: "+9647700000000",
    note: "",
  },
];

const iconMap = {
  FileText,
  Star,
} as const;

export default function IqMePage() {
  const [governorate, setGovernorate] = useState("بغداد — الرصافة");
  const [district, setDistrict] = useState("الكرادة");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saved, setSaved] = useState<any[]>(DEFAULT_SAVED);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hassa-prefs");
      if (raw) {
        const p = JSON.parse(raw);
        if (p.governorate) setGovernorate(p.governorate);
        if (typeof p.district === "string") setDistrict(p.district);
      }
      const savedRaw = localStorage.getItem("hassa-saved-v2");
      if (savedRaw) {
        setSaved(JSON.parse(savedRaw));
      } else {
        // migrate v1 ids to v2 items if needed, simplified for this scope
      }
    } catch {}
    setLoaded(true);
  }, []);

  const handleSave = (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(
        "hassa-prefs",
        JSON.stringify({ governorate, district })
      );
    } catch {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleRemoveSaved = (id: string) => {
    const next = saved.filter((s) => s.id !== id);
    setSaved(next);
    try {
      localStorage.setItem("hassa-saved-v2", JSON.stringify(next));
    } catch {}
  };

  const handleUpdateNote = (id: string, note: string) => {
    const next = saved.map(s => s.id === id ? { ...s, note } : s);
    setSaved(next);
    try {
      localStorage.setItem("hassa-saved-v2", JSON.stringify(next));
    } catch {}
  };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-busy="true" aria-label="جاري تحميل حسابك">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-3xl border border-white/10 bg-[#0e1618]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5" dir="rtl">
      {/* 1. Profile header */}
      <section
        aria-label="الملف الشخصي"
        className="rounded-2xl border border-white/10 bg-[#0e1618] p-5 shadow-xs sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#080c0d] p-3 font-kufi text-xl font-black text-[#bef264]"
            >
              {(district.trim().charAt(0) || "ع") as string}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-kufi text-lg font-bold text-white">
                  مواطن عراقي
                </h1>
                <span className="flex items-center gap-1 rounded-full border border-[#bef264]/30 bg-[#bef264]/10 px-2 py-0.5 text-[10px] font-bold text-[#bef264]">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  مشارك محلي
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-white/60">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {governorate}
                  {district.trim() ? ` · ${district.trim()}` : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Emergency Directory */}
      <section aria-label="دليل طوارئ العراق" className="rounded-2xl border border-white/10 bg-[#0e1618] p-5 shadow-xs sm:p-6">
        <div className="mb-4 flex items-center gap-2 font-kufi text-base font-bold text-white">
          <Phone className="h-4 w-4 text-[#bef264]" aria-hidden="true" />
          <span>دليل أرقام الطوارئ والخطوط الساخنة الوطنية</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
          {HELPLINES.map((h) => {
            const Icon = h.icon;
            return (
              <a
                key={h.number}
                href={`tel:${h.number}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#080c0d] p-3 transition-colors hover:border-[#bef264]/50 hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <Icon className="h-5 w-5 text-[#bef264]" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-bold text-white group-hover:text-[#bef264] transition-colors">{h.name}</h3>
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-red-400 tabular-nums">{h.number}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-white/60">{h.desc}</p>
                  </div>
                </div>
                <PhoneCall className="h-4 w-4 text-white/40 group-hover:text-[#bef264] transition-colors" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>

      {/* 3. Saved offline */}
      <section aria-label="محفوظاتي" className="space-y-3 rounded-2xl border border-white/10 bg-[#0e1618] p-5 shadow-xs sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-kufi text-base font-bold text-white">
            <Bookmark className="h-4 w-4 text-[#bef264]" aria-hidden="true" />
            <span>المحلات والأماكن المحفوظة</span>
          </div>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-bold text-white/80 tabular-nums">
            {saved.length}
          </span>
        </div>

        {saved.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#080c0d] p-6 text-center">
            <Bookmark className="mx-auto h-6 w-6 text-white/30" aria-hidden="true" />
            <p className="mt-2 text-xs font-bold text-white">لا توجد أماكن محفوظة</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {saved.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || Bookmark;
              return (
                <li key={item.id} className="rounded-xl border border-white/10 bg-[#080c0d] overflow-hidden">
                  <div className="flex items-center justify-between gap-3 p-3 border-b border-white/5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Icon className="h-4 w-4 text-[#bef264]" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-white">{item.title}</p>
                        <p className="mt-0.5 truncate text-[11px] text-white/60">{item.meta}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {item.phone && (
                        <>
                          <a
                            href={`tel:${item.phone}`}
                            className="flex items-center justify-center rounded-lg bg-white/5 h-7 w-7 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${item.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center rounded-lg bg-green-500/10 h-7 w-7 text-green-400 transition-colors hover:bg-green-500/20"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveSaved(item.id)}
                        className="flex items-center justify-center rounded-lg h-7 w-7 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white/[0.02]">
                    <input
                      type="text"
                      value={item.note || ""}
                      onChange={(e) => handleUpdateNote(item.id, e.target.value)}
                      placeholder={item.type === "spot" ? "إضافة ملاحظة (مثلاً: أبو علي عنده طحين صفر أصلي)..." : "ملاحظاتي حول الدليل..."}
                      className="w-full bg-transparent text-[11px] text-white/80 placeholder:text-white/30 outline-none px-1"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* 4. Preferences */}
      <form
        onSubmit={handleSave}
        aria-label="تخصيص المحافظة والتنبيهات"
        className="space-y-5 rounded-2xl border border-white/10 bg-[#0e1618] p-5 shadow-xs sm:p-6"
      >
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-kufi text-base font-bold text-white">
          <SlidersHorizontal className="h-4 w-4 text-[#bef264]" aria-hidden="true" />
          <span>إعدادات منطقتي</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="gov" className="block text-xs font-bold text-white/90">
              المحافظة الأساسية
            </label>
            <select
              id="gov"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-white/10 bg-[#080c0d] px-3 text-xs text-white outline-none transition-colors focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
            >
              {GOVERNORATES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="district" className="block text-xs font-bold text-white/90">
              الحي أو القضاء
            </label>
            <input
              id="district"
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="مثال: الكرادة، المنصور، المعقل"
              className="h-11 w-full rounded-xl border border-white/10 bg-[#080c0d] px-3.5 text-xs text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs font-bold text-[#bef264]" role="status" aria-live="polite">
            {savedSuccess && (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                تم الحفظ
              </span>
            )}
          </span>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#bef264] px-6 py-2.5 font-kufi text-xs font-bold text-[#080c0d] transition-all hover:bg-[#a7e26e]"
          >
            حفظ التفضيلات
          </button>
        </div>
      </form>
    </div>
  );
}
