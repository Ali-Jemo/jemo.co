"use client";

import { useState, useMemo } from "react";
import {
  LocalSpot,
  CATEGORIES,
  IRAQ_GOVERNORATES,
  calculateDistanceKm,
  CommunityReview,
} from "@/lib/data/iq-map-data";
import {
  Search,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Navigation,
  Plus,
  Compass,
  MessageSquare,
  Send,
  ExternalLink,
} from "lucide-react";

interface CommunityPlacesViewProps {
  spots: LocalSpot[];
  onAddSpot: (spot: LocalSpot) => void;
  onAddReview: (spotId: string, review: CommunityReview) => void;
  initialGovernorate?: string | null;
  onOpenMap?: () => void;
}

// Reference anchor coordinates for key Iraqi cities (used as fallbacks or user selection)
const REFERENCE_CITIES = [
  { name: "بغداد — الكرادة", lat: 33.311, lng: 44.425 },
  { name: "بغداد — المنصور", lat: 33.315, lng: 44.354 },
  { name: "البصرة — العشار", lat: 30.514, lng: 47.838 },
  { name: "أربيل — الإسكان", lat: 36.195, lng: 43.998 },
  { name: "النجف الأشرف", lat: 32.029, lng: 44.348 },
  { name: "كربلاء المقدسة", lat: 32.614, lng: 44.032 },
  { name: "الموصل — الزهور", lat: 36.362, lng: 43.168 },
  { name: "الرمادي — الأنبار", lat: 33.428, lng: 43.308 },
  { name: "الحلة — بابل", lat: 32.481, lng: 44.432 },
];

export default function CommunityPlacesView({
  spots,
  onAddSpot,
  onAddReview,
  initialGovernorate,
  onOpenMap,
}: CommunityPlacesViewProps) {
  // Filter & Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedGov, setSelectedGov] = useState<string>(initialGovernorate || "الكل");
  const [minRating, setMinRating] = useState<number>(0); // 0 = all, 4.8 = highs, 4.5, 4.0
  const [sortBy, setSortBy] = useState<"highest" | "nearest" | "reviews">("highest");
  const [sourceFilter, setSourceFilter] = useState<"all" | "google" | "community">("all");

  // User location / reference point for "nearest" calculation
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    isGps: boolean;
  }>({
    lat: 33.3152,
    lng: 44.3661,
    name: "بغداد (المركز الافتراضي)",
    isGps: false,
  });

  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Review Modal state
  const [reviewingSpot, setReviewingSpot] = useState<LocalSpot | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Add Place Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("أسواق وماركت");
  const [newPlaceGov, setNewPlaceGov] = useState("بغداد");
  const [newPlaceDistrict, setNewPlaceDistrict] = useState("");
  const [newPlacePhone, setNewPlacePhone] = useState("");
  const [newPlaceNotes, setNewPlaceNotes] = useState("");
  const [addSubmitted, setAddSubmitted] = useState(false);

  // Trigger browser GPS
  const handleGetGpsLocation = () => {
    if (!("geolocation" in navigator)) {
      setGpsError("خاصية تحديد الموقع غير مدعومة في متصفحك.");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          name: "موقعك الحالي عبر الـ GPS 📍",
          isGps: true,
        });
        setSortBy("nearest"); // auto switch to nearest
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError("يرجى السماح بالوصول للموقع لحساب أقرب الأماكن إليك.");
        } else {
          setGpsError("تعذر الحصول على إحداثيات GPS بدقة، يمكنك اختيار منطقتك يدوياً.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Distance computation helper
  const getSpotDistance = (spot: LocalSpot) => {
    return calculateDistanceKm(userLocation.lat, userLocation.lng, spot.lat, spot.lng);
  };

  // Filter and sort places
  const processedSpots = useMemo(() => {
    return spots
      .filter((spot) => {
        // Category filter
        const matchCat = activeCategory === "الكل" || spot.category === activeCategory;
        // Governorate filter
        const matchGov = selectedGov === "الكل" || spot.governorate === selectedGov;
        // Rating threshold (Choose the highs!)
        const matchRating = spot.rating >= minRating;
        // Source filter (Google vs Our community)
        const matchSource =
          sourceFilter === "all" ||
          (sourceFilter === "google" && spot.source === "google") ||
          (sourceFilter === "community" && spot.source === "community");
        // Search query
        const query = searchQuery.trim().toLowerCase();
        const matchSearch =
          !query ||
          spot.name.toLowerCase().includes(query) ||
          spot.district.toLowerCase().includes(query) ||
          spot.category.toLowerCase().includes(query) ||
          spot.notes.toLowerCase().includes(query) ||
          spot.governorate.toLowerCase().includes(query);

        return matchCat && matchGov && matchRating && matchSource && matchSearch;
      })
      .map((spot) => ({
        ...spot,
        distanceKm: getSpotDistance(spot),
      }))
      .sort((a, b) => {
        if (sortBy === "highest") {
          // Sort by highest rating first, then by review count
          if (b.rating !== a.rating) return b.rating - a.rating;
          return b.reviewsCount - a.reviewsCount;
        }
        if (sortBy === "nearest") {
          // Sort by proximity
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === "reviews") {
          // Sort by most reviewed
          return b.reviewsCount - a.reviewsCount;
        }
        return 0;
      });
  }, [spots, activeCategory, selectedGov, minRating, searchQuery, sortBy, userLocation]);

  // Handle submitting a new community review
  const handleReviewSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!reviewingSpot || !reviewComment.trim()) return;

    const newRev: CommunityReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim() || "مواطن من المنطقة",
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: "الآن",
    };

    onAddReview(reviewingSpot.id, newRev);
    setReviewingSpot(null);
    setReviewAuthor("");
    setReviewComment("");
    setReviewRating(5);
  };

  // Handle adding a new place
  const handleAddPlaceSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim() || !newPlaceDistrict.trim()) return;

    const matchedGov = IRAQ_GOVERNORATES.find((g) => g.nameAr === newPlaceGov);

    const newSpot: LocalSpot = {
      id: `spot-${Date.now()}`,
      name: newPlaceName.trim(),
      category: newPlaceCategory,
      governorate: newPlaceGov,
      governorateId: matchedGov?.id || "iq-bg",
      district: `${newPlaceGov} — ${newPlaceDistrict.trim()}`,
      lat: matchedGov?.lat || userLocation.lat,
      lng: matchedGov?.lng || userLocation.lng,
      phone: newPlacePhone.trim() || "07700000000",
      whatsapp: (newPlacePhone.trim() || "07700000000").replace(/^0/, "964"),
      rating: 5.0,
      reviewsCount: 1,
      status: "مفتوح الآن",
      notes: newPlaceNotes.trim() || "محل معتمد من مجتمع المنطقة.",
      isVerified: true,
      source: "community",
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          author: "موثق المحل",
          rating: 5,
          comment: "تمت إضافة المحل وتزكيته لخدمة أهالي المحلة.",
          date: "اليوم",
        },
      ],
    };

    onAddSpot(newSpot);
    setAddSubmitted(true);

    setTimeout(() => {
      setShowAddModal(false);
      setAddSubmitted(false);
      setNewPlaceName("");
      setNewPlaceDistrict("");
      setNewPlacePhone("");
      setNewPlaceNotes("");
    }, 1800);
  };

  return (
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* 1. Proximity & Nearest Compass Banner */}
      <section className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface)] to-[var(--surface)] border border-white/10 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--gold)]">
              <Compass className="w-4 h-4 text-[var(--gold)]" />
              <span>دليل الأماكن الأقرب والأعلى تقييماً</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">تقييمات حقيقية من المجتمع</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-kufi font-black text-white tracking-tight">
              أقرب المحلات الموثوقة من أهالي منطقتك
            </h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans max-w-2xl">
              رتب المحلات حسب المسافة الحقيقية، واختر النخبة الأعلى تقييماً مع آراء الجيران وأرقام الواتساب المباشرة.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGetGpsLocation}
              disabled={gpsLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-kufi font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
              <span>{gpsLoading ? "جاري تحديد موقعك..." : "📍 حدد موقعي (الأقرب إليك)"}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--gold)] hover:bg-[var(--accent-tint)] text-[var(--surface)] font-kufi font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>أضف محلاً جديداً</span>
            </button>
          </div>
        </div>

        {/* Location Reference Bar */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-[var(--gold)] shrink-0" />
            <span className="text-white/60">نقطة حساب المسافة:</span>
            <span className="font-bold text-white">{userLocation.name}</span>
            {userLocation.isGps && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                دقيق عبر GPS
              </span>
            )}
          </div>

          {/* Quick city switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
            <span className="text-[11px] text-white/40 shrink-0">أو غيّر منطقتك:</span>
            {REFERENCE_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() =>
                  setUserLocation({
                    lat: city.lat,
                    lng: city.lng,
                    name: city.name,
                    isGps: false,
                  })
                }
                className={`px-2 py-0.5 rounded-lg text-[11px] shrink-0 transition-colors ${
                  userLocation.name === city.name
                    ? "bg-[var(--gold)] text-[var(--surface)] font-bold"
                    : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                }`}
              >
                {city.name.split("—")[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {gpsError && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            {gpsError}
          </div>
        )}
      </section>

      {/* 2. Control Toolbar: Search, Highs Filter, Sorting */}
      <div className="space-y-3 bg-[var(--surface)] p-4 rounded-3xl border border-white/10 shadow-md">
        {/* Row 1: Search and High Rating / Sort Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، المهنة، المحافظة، الحي (مثلاً: سبالت، الكرادة، قيمر)..."
              className="w-full h-11 pr-10 pl-4 bg-black/40 border border-white/10 focus:border-[var(--gold)] rounded-xl text-white font-sans text-xs sm:text-sm outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-white/40 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By Dropdown ("الأعلى تقييماً" / "الأقرب إليك" / "الأكثر مراجعات") */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="w-full flex items-center rounded-xl bg-black/40 border border-white/10 p-1 text-xs font-mono">
              <button
                onClick={() => setSortBy("highest")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sortBy === "highest"
                    ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
                title="ترتيب حسب الأعلى تقييماً"
              >
                <Star className="w-3.5 h-3.5" />
                <span>الأعلى تقييماً</span>
              </button>

              <button
                onClick={() => setSortBy("nearest")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sortBy === "nearest"
                    ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
                title="ترتيب حسب الأقرب إليك بالمسافة"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>الأقرب إليك</span>
              </button>

              <button
                onClick={() => setSortBy("reviews")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  sortBy === "reviews"
                    ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                    : "text-white/70 hover:text-white"
                }`}
                title="ترتيب حسب الأكثر مراجعات وشهرة"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>الأكثر مراجعة</span>
              </button>
            </div>
          </div>

          {/* Minimum Rating Selector ("اختر التقييم العالي") */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-11 px-3 bg-black/40 border border-white/10 focus:border-[var(--gold)] rounded-xl text-white font-mono text-xs outline-none cursor-pointer"
              >
                <option value={0} className="bg-[var(--surface)]">
                  ⭐ كل التقييمات
                </option>
                <option value={4.9} className="bg-[var(--surface)]">
                  ⭐ 4.9 فما فوق (نخبة النخبة)
                </option>
                <option value={4.8} className="bg-[var(--surface)]">
                  ⭐ 4.8 فما فوق (الممتاز جداً)
                </option>
                <option value={4.5} className="bg-[var(--surface)]">
                  ⭐ 4.5 فما فوق (موثوق وعالي)
                </option>
              </select>
            </div>
          </div>
        </div>

          {/* Source Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono shrink-0">
            <span className="text-white/40 text-[11px] px-1">المصدر:</span>
            <button
              onClick={() => setSourceFilter("all")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                sourceFilter === "all"
                  ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              الكل ({spots.length})
            </button>
            <button
              onClick={() => setSourceFilter("google")}
              className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                sourceFilter === "google"
                  ? "bg-sky-500 text-white font-bold shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-300" />
              <span>معالم Google ({spots.filter((s) => s.source === "google").length})</span>
            </button>
            <button
              onClick={() => setSourceFilter("community")}
              className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                sourceFilter === "community"
                  ? "bg-emerald-500 text-white font-bold shadow-xs"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              <span>توثيقات هسه ({spots.filter((s) => s.source === "community").length})</span>
            </button>
          </div>

          {/* Governorates */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
          {/* Governorates */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-mono">
            <span className="text-white/40 shrink-0 text-[11px] ml-1">المحافظة:</span>
            <button
              onClick={() => setSelectedGov("الكل")}
              className={`px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
                selectedGov === "الكل"
                  ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                  : "bg-black/40 text-white/60 hover:text-white border border-white/10"
              }`}
            >
              كل العراق
            </button>
            {IRAQ_GOVERNORATES.map((gov) => {
              const count = spots.filter((s) => s.governorate === gov.nameAr).length;
              if (count === 0) return null;
              return (
                <button
                  key={gov.id}
                  onClick={() => setSelectedGov(gov.nameAr)}
                  className={`px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    selectedGov === gov.nameAr
                      ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                      : "bg-black/40 text-white/70 hover:text-white border border-white/10"
                  }`}
                >
                  <span>{gov.nameAr}</span>
                  <span className="text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-white/40 shrink-0 text-[11px] ml-1 font-mono">المهنة:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[var(--gold)] text-[var(--surface)] font-bold shadow-xs"
                    : "bg-black/30 text-white/70 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-1">
          <div>
            تم العثور على <span className="text-[var(--gold)] font-bold">{processedSpots.length}</span> مكان
            {sortBy === "highest" && " (مرتبة بالأعلى تقييماً)"}
            {sortBy === "nearest" && ` (مرتبة بالأقرب إلى ${userLocation.name})`}
            {sortBy === "reviews" && " (مرتبة بالأكثر مراجعات)"}
          </div>
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="text-[var(--gold)] hover:underline flex items-center gap-1"
            >
              <span>عرض الكل على خريطة العراق</span>
              <span>←</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Spots Cards Grid with Rich Community Ratings & Reviews */}
      {processedSpots.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-white/10 space-y-3">
          <MapPin className="w-12 h-12 text-white/20 mx-auto" />
          <h3 className="text-lg font-kufi font-bold text-white">لا توجد أماكن مطابقة لهذا الفلتر</h3>
          <p className="text-xs text-white/60 max-w-md mx-auto">
            جرّب تغيير التصنيف، خفض الحد الأدنى للتقييم، أو كن أول من يضيف محلاً معتمداً في منطقتك!
          </p>
          <button
            onClick={() => {
              setActiveCategory("الكل");
              setSelectedGov("الكل");
              setMinRating(0);
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {processedSpots.map((spot) => (
            <div
              key={spot.id}
              className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-white/10 hover:border-[var(--gold)]/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg hover:shadow-2xl relative"
            >
              {/* Proximity / High Rank Badge */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${
                      spot.source === "google"
                        ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                        : "bg-white/5 text-white/80 border-white/10"
                    }`}
                  >
                    {spot.source === "google" ? "معلم Google" : spot.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.03] text-white/50 text-[10px]">
                    {spot.governorate}
                  </span>
                </div>
                {/* Distance Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                  <Navigation className="w-3 h-3" />
                  <span>{spot.distanceKm < 1 ? "أقل من 1 كم" : `يبعد ${spot.distanceKm} كم`}</span>
                </div>
              </div>

              {/* Title & Verified */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-kufi font-bold text-base sm:text-lg text-white group-hover:text-[var(--gold)] transition-colors leading-snug">
                    {spot.name}
                  </h3>
                  {spot.isVerified && (
                    <span title="موثق محلياً من المجتمع" className="shrink-0 pt-1">
                      <CheckCircle2 className="w-4 h-4 text-[var(--gold)]" />
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-white/60 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/40 shrink-0" />
                  <span className="line-clamp-1">{spot.district}</span>
                </p>
              </div>

              {/* Notes */}
              <p className="text-xs text-white/70 leading-relaxed font-sans bg-black/30 p-3 rounded-xl border border-white/5">
                {spot.notes}
              </p>

              {/* Community Reviews Snippet */}
              {spot.reviews && spot.reviews.length > 0 && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/50">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-[var(--gold)]" />
                      <span>رأي المجتمع:</span>
                    </span>
                    <span>{spot.reviews[0].date}</span>
                  </div>
                  <p className="text-xs text-white/90 italic font-sans leading-relaxed">
                    &ldquo;{spot.reviews[0].comment}&rdquo;
                  </p>
                  <div className="text-[10px] font-mono text-white/40 text-left">
                    — {spot.reviews[0].author}
                  </div>
                </div>
              )}

              {/* Bottom Row: Rating, Review Button, Contact */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                {/* Rating score */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{spot.rating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => setReviewingSpot(spot)}
                    className="text-[11px] text-[var(--gold)] hover:underline cursor-pointer"
                  >
                    + أضف تقييمك
                  </button>
                </div>

                {/* Direct WhatsApp & Call Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {/* Open in Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      spot.name + " " + spot.district
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-[11px] font-bold transition-all"
                    title="فتح في خرائط Google"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>خرائط Google</span>
                  </a>

                  {spot.whatsapp && spot.whatsapp !== "9647700000000" && (
                    <a
                      href={`https://wa.me/${spot.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>واتساب</span>
                    </a>
                  )}

                  {spot.phone && spot.phone !== "—" && (
                    <a
                      href={`tel:${spot.phone}`}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[11px] transition-all"
                    >
                      <Phone className="w-3 h-3" />
                      <span>اتصال</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Review Submission Modal */}
      {reviewingSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--surface)] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-kufi font-bold text-white text-base">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>تقييم: {reviewingSpot.name}</span>
              </div>
              <button
                onClick={() => setReviewingSpot(null)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-white/80 block">درجة التقييم (النجوم)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating
                            ? "fill-amber-300 text-amber-300"
                            : "text-white/20"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-amber-300 font-bold text-sm mr-2 font-mono">
                    {reviewRating} من 5
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">اسمك أو كنيتك (اختياري)</label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="مثلاً: أبو فهد، كرار البغدادي..."
                  className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">رأيك وتجربتك مع المحل</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="كيف كانت الخدمة؟ الأسعار؟ الأمانة؟ هل تنصح جيرانك بالتعامل معه؟"
                  className="w-full p-3 bg-black/40 border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingSpot(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--gold)] hover:bg-[var(--accent-tint)] text-[var(--surface)] font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر التقييم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Place Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[var(--surface)] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-kufi font-bold text-white text-base">
                <Plus className="w-4 h-4 text-[var(--gold)]" />
                <span>توثيق محل جديد في منطقتك</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {addSubmitted ? (
              <div className="py-8 text-center space-y-2 font-kufi">
                <CheckCircle2 className="w-10 h-10 text-[var(--gold)] mx-auto" />
                <h4 className="text-white font-bold text-base">تمت إضافة المحل وتوثيقه بنجاح!</h4>
                <p className="text-xs text-white/60">
                  شكراً لمساهمتك في خدمة جيرانك وبناء خريطة المحلة العراقية.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddPlaceSubmit} className="space-y-3.5 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-white/80 block">اسم المحل أو الورشة</label>
                  <input
                    type="text"
                    required
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    placeholder="مثال: ورشة أبو سجاد للسبالت، أسواق الفردوس"
                    className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-white/80 block">المحافظة</label>
                    <select
                      value={newPlaceGov}
                      onChange={(e) => setNewPlaceGov(e.target.value)}
                      className="w-full h-10 px-2.5 bg-[var(--surface-2)] border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none"
                    >
                      {IRAQ_GOVERNORATES.map((g) => (
                        <option key={g.id} value={g.nameAr} className="bg-[var(--surface)]">
                          {g.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/80 block">التصنيف</label>
                    <select
                      value={newPlaceCategory}
                      onChange={(e) => setNewPlaceCategory(e.target.value)}
                      className="w-full h-10 px-2.5 bg-[var(--surface-2)] border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none"
                    >
                      {CATEGORIES.filter((c) => c !== "الكل").map((c) => (
                        <option key={c} value={c} className="bg-[var(--surface)]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 block">المنطقة والشارع بالتفصيل</label>
                  <input
                    type="text"
                    required
                    value={newPlaceDistrict}
                    onChange={(e) => setNewPlaceDistrict(e.target.value)}
                    placeholder="مثال: الكرادة، شارع العطار قرب الفرن الحجري"
                    className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none"
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
                    className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-white/80 block">ملاحظة أو ميزة المحل (توصيل، أمانة، مواعيد)</label>
                  <textarea
                    rows={2}
                    value={newPlaceNotes}
                    onChange={(e) => setNewPlaceNotes(e.target.value)}
                    placeholder="مثال: يوصل مجاناً للأفرع، أسعاره أرخص من السوق، ما يبدل قطع صالحة..."
                    className="w-full p-2.5 bg-black/40 border border-white/15 focus:border-[var(--gold)] rounded-xl text-white outline-none resize-none font-sans"
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
                    className="px-4 py-2 rounded-xl bg-[var(--gold)] hover:bg-[var(--accent-tint)] text-[var(--surface)] font-bold cursor-pointer"
                  >
                    إرسال وتوثيق
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
