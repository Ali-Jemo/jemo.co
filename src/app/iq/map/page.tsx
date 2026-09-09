"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Plus,
  Search,
  Star,
  Phone,
  Clock,
  CheckCircle2,
  Filter,
  MessageCircle,
  ExternalLink,
} from "lucide-react";

interface LocalSpot {
  id: string;
  name: string;
  category: string;
  district: string;
  phone: string;
  whatsapp: string;
  rating: number;
  reviewsCount: number;
  status: "مفتوح الآن" | "يغلق قريباً" | "مغلق";
  notes: string;
  isVerified: boolean;
}

const CATEGORIES = [
  "الكل",
  "أسواق وماركت",
  "كوزمتك وعناية",
  "تصليح وسبالت",
  "أفران ومخابز",
  "صيدليات وعيادات",
  "استنساخ وترجمة",
];

const SEEDED_SPOTS: LocalSpot[] = [
  {
    id: "spot-1",
    name: "أسواق العائلة (أبو علي)",
    category: "أسواق وماركت",
    district: "بغداد — الكرادة داخل، قرب ساحة كهرمانة",
    phone: "07701234567",
    whatsapp: "9647701234567",
    rating: 4.9,
    reviewsCount: 38,
    status: "مفتوح الآن",
    notes: "يوصل للبيوت داخل الأفرع مجاناً، يقبل الدفع بـ زين كاش وكي كارد.",
    isVerified: true,
  },
  {
    id: "spot-2",
    name: "كوزمتك لمسة الجمال (أصلي 100%)",
    category: "كوزمتك وعناية",
    district: "بغداد — المنصور، شارع 14 رمضان، فرع الرواد",
    phone: "07809876543",
    whatsapp: "9647809876543",
    rating: 4.8,
    reviewsCount: 52,
    status: "مفتوح الآن",
    notes: "بضاعة مستوردة ومفحوصة بالباركود، الأسعار أرخص من المحلات الرئيسية.",
    isVerified: true,
  },
  {
    id: "spot-3",
    name: "ورشة المهندس لتصليح السبالت والإنفيرتر",
    category: "تصليح وسبالت",
    district: "بغداد — حي الجامعة، مجاور مدرسة البحتري",
    phone: "07505551234",
    whatsapp: "9647505551234",
    rating: 5.0,
    reviewsCount: 41,
    status: "مفتوح الآن",
    notes: "مصلح شاطر ومجرب وما يبدل قطع صالحة، صيانة منزلية فورية.",
    isVerified: true,
  },
  {
    id: "spot-4",
    name: "صمون حجري وفرن البركة التراثي",
    category: "أفران ومخابز",
    district: "بغداد — الأعظمية، راغبة خاتون",
    phone: "07712398472",
    whatsapp: "9647712398472",
    rating: 4.9,
    reviewsCount: 64,
    status: "مفتوح الآن",
    notes: "صمون حار وجاهز مع فتح باكر عند صلاة الفجر، جودة طحين ممتازة.",
    isVerified: true,
  },
  {
    id: "spot-5",
    name: "مكتب الإتقان للترجمة القانونية والاستنساخ",
    category: "استنساخ وترجمة",
    district: "بغداد — الكرخ، قرب مديرية المرور العامة",
    phone: "07812984711",
    whatsapp: "9647812984711",
    rating: 4.7,
    reviewsCount: 29,
    status: "مفتوح الآن",
    notes: "ملء استمارات الجواز الإلكتروني والبطاقة الوطنية بدون ابتزاز وبأسعار رمزية.",
    isVerified: true,
  },
  {
    id: "spot-6",
    name: "صيدلية النبض الخافرة (24 ساعة)",
    category: "صيدليات وعيادات",
    district: "بغداد — الدورة، شارع 60",
    phone: "07739182746",
    whatsapp: "9647739182746",
    rating: 4.9,
    reviewsCount: 77,
    status: "مفتوح الآن",
    notes: "خافرة ليلاً بعد الـ 12، توفير أدوية الأمراض المزمنة بأسعار نقابة الصيادلة.",
    isVerified: true,
  },
];

export default function IqMapPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("أسواق وماركت");
  const [newPlaceDistrict, setNewPlaceDistrict] = useState("");
  const [newPlacePhone, setNewPlacePhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredSpots = SEEDED_SPOTS.filter((spot) => {
    const matchCat = activeCategory === "الكل" || spot.category === activeCategory;
    const matchSearch =
      searchQuery === "" ||
      spot.name.includes(searchQuery) ||
      spot.district.includes(searchQuery) ||
      spot.notes.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowAddModal(false);
      setSubmitted(false);
      setNewPlaceName("");
      setNewPlaceDistrict("");
      setNewPlacePhone("");
    }, 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Banner */}
      <section className="p-4 sm:p-6 rounded-3xl bg-[#0e1618] border border-white/10 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#bef264]">
              <MapPin className="w-4 h-4 text-[#bef264]" />
              <span>الباب الثاني · خريطة المحلة الحقيقية</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">كثافة حيّ واحد أولاً</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-kufi font-black text-white tracking-tight">
              الأماكن التي يتجاهلها غوغل ماب — موثقة بأرقام الواتساب وتقييمات الناس.
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-3xl">
              غوغل ماب ممتاز للمطاعم الكبيرة والشركات فقط. في أحيائنا نحتاج: مصلح سبالت ثقة، أسواق يوصل، بنجرجي فاتح الجمعة، ومكتب استنساخ قانوني.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-kufi font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>أضف محلاً في منطقتك</span>
          </button>
        </div>

        {/* Coverage Scope Badge */}
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-white/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">نطاق التغطية التجريبي:</span>
            <span>أحياء بغداد (الكرادة · المنصور · الدورة · الأعظمية)</span>
          </div>
          <span className="text-[11px] text-[#bef264]">باقي المحافظات تُضاف تباعاً</span>
        </div>
      </section>

      {/* 2. Filter & Search Toolbar */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المحل، المهنة، المنطقة (مثلاً: مصلح، صمون، الكرادة)..."
            className="w-full h-11 pr-10 pl-4 bg-[#0e1618] border border-white/10 focus:border-[#bef264] rounded-xl text-white font-sans text-sm outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#bef264] text-[#0c1415] font-bold shadow-xs"
                  : "bg-[#0e1618] text-white/70 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Spots Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpots.map((spot) => (
          <div
            key={spot.id}
            className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 hover:border-[#bef264]/40 transition-all flex flex-col justify-between space-y-3 group shadow-md"
          >
            <div className="space-y-2">
              {/* Top Row: Category & Status */}
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/80">
                  {spot.category}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {spot.status}
                </span>
              </div>

              {/* Title & Verified Badge */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-kufi font-bold text-base text-white group-hover:text-[#bef264] transition-colors leading-snug">
                  {spot.name}
                </h3>
                {spot.isVerified && (
                  <span title="موثق محلياً من المجتمع">
                    <CheckCircle2 className="w-4 h-4 text-[#bef264] shrink-0" />
                  </span>
                )}
              </div>

              {/* District location */}
              <p className="text-xs font-mono text-white/60 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                <span>{spot.district}</span>
              </p>

              {/* Notes */}
              <p className="text-xs text-white/70 leading-relaxed font-sans bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                {spot.notes}
              </p>
            </div>

            {/* Bottom Actions: Rating & Direct WhatsApp/Call */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{spot.rating}</span>
                <span className="text-white/40 font-normal text-[10px]">
                  ({spot.reviewsCount} تقييم)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${spot.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>واتساب</span>
                </a>

                <a
                  href={`tel:${spot.phone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[11px] transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Add Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0e1618] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-kufi font-bold text-white text-base">
                <Plus className="w-4 h-4 text-[#bef264]" />
                <span>توثيق محل أو مصلح في منطقتك</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2 font-kufi">
                <CheckCircle2 className="w-10 h-10 text-[#bef264] mx-auto" />
                <h4 className="text-white font-bold text-base">تم إرسال المحل للمراجعة!</h4>
                <p className="text-xs text-white/60">
                  شكراً لمساهمتك في بناء خريطة حقيقية لخدمة أهل منطقتك.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-white/80 block">اسم المحل أو الورشة</label>
                  <input
                    type="text"
                    required
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    placeholder="مثال: أسواق النور، ورشة أبو حيدر للسبالت"
                    className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 block">التصنيف</label>
                  <select
                    value={newPlaceCategory}
                    onChange={(e) => setNewPlaceCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-[#141e20] border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "الكل").map((c) => (
                      <option key={c} value={c} className="bg-[#0e1618]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 block">المنطقة والشارع بالتفصيل</label>
                  <input
                    type="text"
                    required
                    value={newPlaceDistrict}
                    onChange={(e) => setNewPlaceDistrict(e.target.value)}
                    placeholder="مثال: بغداد، الكرادة، شارع العطار قرب الفرن"
                    className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 block">رقم الهاتف أو الواتساب</label>
                  <input
                    type="text"
                    required
                    value={newPlacePhone}
                    onChange={(e) => setNewPlacePhone(e.target.value)}
                    placeholder="07XXXXXXXXX"
                    className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-bold cursor-pointer"
                  >
                    إرسال للتوثيق
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
