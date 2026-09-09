"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Star,
  ThumbsUp,
  ThumbsDown,
  Search,
  Filter,
  Plus,
  Share2,
  Calendar,
} from "lucide-react";

type PostType = "guide" | "review" | "price" | "alert";

interface IntelPost {
  id: string;
  type: PostType;
  typeLabel: string;
  badgeColor: string;
  title: string;
  content: string;
  district: string;
  authorAlias: string;
  date: string;
  trustedCount: number;
  unreliableCount: number;
  rating?: number;
  placeName?: string;
}

const POSTS: IntelPost[] = [
  {
    id: "post-1",
    type: "guide",
    typeLabel: "دليل معاملة رسمية",
    badgeColor: "bg-purple-400/15 text-purple-300 border-purple-400/30",
    title: "خطوات تجديد الجواز الإلكتروني في دائرة الكرخ بدون معقب — تحديث آذار 2026",
    content:
      "1. ادخل بوابة أور وسدد الرسوم إلكترونياً عبر زين كاش أو الماستر (25 ألف دينار ولا تدفع أكثر بالمكاتب الخارجية). 2. احجز موعد الصباح قبل الساعة 10. 3. خذ البطاقة الوطنية الأصلية والجواز القديم فقط، لا يحتاج صور ملونة لأن التصوير فوري بالدائرة. استلمت الجواز خلال ساعتين ونصف فقط.",
    district: "بغداد — الكرخ",
    authorAlias: "مواطن_رقمي_94",
    date: "اليوم",
    trustedCount: 142,
    unreliableCount: 3,
  },
  {
    id: "post-2",
    type: "review",
    typeLabel: "تقييم مكان موثق",
    badgeColor: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    title: "تجربة ورشة المهندس لتصليح السبالت في حي الجامعة",
    content:
      "السبلت كان يفصل كومبريسر بعد الظهر، صاحب الورشة فحص القطعة واكتشف عطل كبستر بسيط وكلف 15 ألف دينار فقط، بينما مصلح ثاني طلب 120 ألف وقال الكومبريسر محروق. رجل ثقة وموجود بخريطة هسه.",
    district: "بغداد — حي الجامعة",
    authorAlias: "أبو_يوسف_البغدادي",
    date: "أمس",
    trustedCount: 88,
    unreliableCount: 1,
    rating: 5.0,
    placeName: "ورشة المهندس لتصليح السبالت",
  },
  {
    id: "post-3",
    type: "price",
    typeLabel: "سعر محلي مشاهد",
    badgeColor: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    title: "تسعيرة أمبير المولد في الدورة لشهر آذار 2026",
    content:
      "مولد فرعنا في شارع 60 فرض 16 ألف للأمبير للخط الذهبي، بعد شكوى المختار ومركز الشرطة نزل السعر للـ 13 ألف الرسمي مع تشغيل 24 ساعة. لا تدفعون أكثر من التسعيرة المحددة من المحافظة.",
    district: "بغداد — الدورة",
    authorAlias: "مهندس_كهرباء_عراقي",
    date: "قبل يومين",
    trustedCount: 65,
    unreliableCount: 2,
  },
  {
    id: "post-4",
    type: "alert",
    typeLabel: "تنبيه محلي مؤقت",
    badgeColor: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    title: "تحويلة مرورية مؤقتة قرب ساحة النسور بسبب أعمال الصيانة",
    content:
      "المرور حوّلوا المسار القادم من دمشق باتجاه حي الكندي عبر النفق السفلي. تجنبوا الزخم بالذروة الصباحية واسلكوا طريق القادسية البديل.",
    district: "بغداد — ساحة النسور",
    authorAlias: "متابع_الطرق",
    date: "قبل 5 ساعات",
    trustedCount: 114,
    unreliableCount: 0,
  },
];

export default function IqIntelPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("الكل");
  const [search, setSearch] = useState<string>("");
  const [posts, setPosts] = useState<IntelPost[]>(POSTS);

  const handleVote = (id: string, isUp: boolean) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            trustedCount: isUp ? p.trustedCount + 1 : p.trustedCount,
            unreliableCount: !isUp ? p.unreliableCount + 1 : p.unreliableCount,
          };
        }
        return p;
      })
    );
  };

  const filteredPosts = posts.filter((p) => {
    const matchType =
      selectedFilter === "الكل" ||
      (selectedFilter === "معاملات" && p.type === "guide") ||
      (selectedFilter === "تقييمات" && p.type === "review") ||
      (selectedFilter === "أسعار" && p.type === "price") ||
      (selectedFilter === "تنبيهات" && p.type === "alert");

    const matchSearch =
      search === "" ||
      p.title.includes(search) ||
      p.content.includes(search) ||
      p.district.includes(search);

    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Banner */}
      <section className="p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-white/10 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--gold)]">
              <BookOpen className="w-4 h-4 text-[var(--gold)]" />
              <span>الباب الثالث · مجتمع الخبرة والأدلة الحية</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">معلومات لا يوميات</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-kufi font-black text-white tracking-tight">
              أدلة المعاملات، تقييمات الأماكن، والأسعار الواقعية.
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-3xl">
              لا مكان للصور الشخصية أو السوالف الفارغة. هنا تجارب عملية تمنع أن تُنصب عليك، تشرح لك كيف تخلص معاملتك، وتوثق جودة المحلات المسجلة بالخريطة.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filters Toolbar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في الأدلة (مثلاً: جواز، بطاقة، سبلت، غرامات، الكرادة)..."
            className="w-full h-11 pr-10 pl-4 bg-[var(--surface)] border border-white/10 focus:border-[var(--gold)] rounded-xl text-white font-sans text-sm outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
          {[
            { id: "الكل", label: "كل المشاركات" },
            { id: "معاملات", label: "أدلة المعاملات الحكومية" },
            { id: "تقييمات", label: "تقييمات الأماكن والشركات" },
            { id: "أسعار", label: "أسعار مشاهدة (مولد/غاز)" },
            { id: "تنبيهات", label: "تنبيهات الطرق والخدمات" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-full transition-all shrink-0 cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                  : "bg-[var(--surface)] text-white/70 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="p-4 sm:p-5 rounded-2xl bg-[var(--surface)] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-md"
          >
            {/* Header: Tag + District + Date */}
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono flex-wrap">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md border font-semibold ${post.badgeColor}`}
                >
                  {post.typeLabel}
                </span>
                <span className="text-white/60">{post.district}</span>
                {post.rating && (
                  <span className="inline-flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3 h-3 fill-amber-300" />
                    {post.rating}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-white/40">
                <span>بواسطة: {post.authorAlias}</span>
                <span>·</span>
                <span>{post.date}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-kufi font-bold text-base sm:text-lg text-white leading-snug">
              {post.title}
            </h3>

            {/* Content body */}
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
              {post.content}
            </p>

            {/* Place Link if Review */}
            {post.placeName && (
              <div className="text-xs font-mono pt-1">
                <Link
                  href="/iq/map"
                  className="inline-flex items-center gap-1 text-[var(--gold)] hover:underline"
                >
                  <span>عرض بطاقة المحل في الخريطة ({post.placeName})</span>
                  <span>←</span>
                </Link>
              </div>
            )}

            {/* Bottom Actions: Explicit Verification Voting */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                {/* Trusted Vote Button */}
                <button
                  onClick={() => handleVote(post.id, true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-colors cursor-pointer"
                  title="أؤكد هذه المعلومة / جربتها بنفسي"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>معلومة موثوقة ({post.trustedCount})</span>
                </button>

                {/* Unreliable Vote Button */}
                <button
                  onClick={() => handleVote(post.id, false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-rose-300 border border-white/5 transition-colors cursor-pointer"
                  title="المعلومة غير دقيقة أو قديمة"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>غير دقيق ({post.unreliableCount})</span>
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  alert("تم نسخ رابط الدليل للمشاركة على واتساب!");
                }}
                className="inline-flex items-center gap-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="مشاركة الدليل"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">مشاركة</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
