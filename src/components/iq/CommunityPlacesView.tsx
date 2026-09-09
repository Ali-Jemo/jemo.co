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
  Trash2,
} from "lucide-react";
interface CommunityPlacesViewProps {
  spots: LocalSpot[];
  onAddSpot: (spot: LocalSpot) => void;
  onAddReview: (spotId: string, review: CommunityReview) => void;
  onDeleteSpot?: (spotId: string) => void;
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
  onDeleteSpot,
  initialGovernorate,
  onOpenMap,
}: CommunityPlacesViewProps) {
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
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#55696a]">
              <Compass className="w-4 h-4 text-[#728825]" />
              <span className="font-bold text-[#222f30]">دليل الأماكن الأقرب والأعلى تقييماً</span>
              <span>·</span>
              <span>تقييمات حقيقية من المجتمع</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-kufi font-black text-[#222f30] tracking-tight">
              أقرب المحلات الموثوقة من أهالي منطقتك
            </h2>
            <p className="text-xs sm:text-sm text-[#55696a] leading-relaxed font-sans max-w-2xl">
              رتب المحلات حسب المسافة الحقيقية، واختر النخبة الأعلى تقييماً مع آراء الجيران وأرقام الواتساب المباشرة.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleGetGpsLocation}
              disabled={gpsLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-kufi font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
              <span>{gpsLoading ? "جاري تحديد موقعك..." : "📍 حدد موقعي (الأقرب إليك)"}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#222f30] hover:bg-[#162021] text-[#cef79e] font-kufi font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>أضف محلاً جديداً</span>
            </button>
          </div>
        </div>

        {/* Location Reference Bar */}
        <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#222f30]">
            <MapPin className="w-4 h-4 text-[#728825] shrink-0" />
            <span className="text-[#55696a]">نقطة حساب المسافة:</span>
            <span className="font-bold text-[#222f30]">{userLocation.name}</span>
            {userLocation.isGps && (
              <span className="px-2 py-0.5 rounded-full bg-[#cef79e] text-[#222f30] font-bold text-[10px]">
                دقيق عبر GPS
              </span>
            )}
          </div>

          {/* Quick city switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
            <span className="text-[11px] text-[#55696a] shrink-0">أو غيّر منطقتك:</span>
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
                className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 transition-colors font-medium ${
                  userLocation.name === city.name
                    ? "bg-[#222f30] text-white font-bold shadow-xs"
                    : "bg-white text-[#55696a] border border-[#e4e3e3] hover:text-[#222f30] hover:bg-[#f0f2f0]"
                }`}
              >
                {city.name.split("—")[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {gpsError && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono">
            {gpsError}
          </div>
        )}
      </section>

      {/* 2. Control Toolbar: Search, Highs Filter, Sorting */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#e4e3e3] shadow-xs">
        {/* Row 1: Search and High Rating / Sort Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، المهنة، المحافظة، الحي (مثلاً: سبالت، الكرادة، قيمر)..."
              className="w-full h-11 pr-10 pl-4 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] font-sans text-xs sm:text-sm outline-none transition-colors"
            />
            <Search className="w-4 h-4 text-[#55696a] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55696a] hover:text-[#222f30] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort By Dropdown ("الأعلى تقييماً" / "الأقرب إليك" / "الأكثر مراجعات") */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="w-full flex items-center rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] p-1 text-xs font-mono">
              <button
                onClick={() => setSortBy("highest")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  sortBy === "highest"
                    ? "bg-[#222f30] text-white font-bold shadow-xs"
                    : "text-[#55696a] hover:text-[#222f30]"
                }`}
                title="ترتيب حسب الأعلى تقييماً"
              >
                <Star className="w-3.5 h-3.5" />
                <span>الأعلى تقييماً</span>
              </button>

              <button
                onClick={() => setSortBy("nearest")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  sortBy === "nearest"
                    ? "bg-[#222f30] text-white font-bold shadow-xs"
                    : "text-[#55696a] hover:text-[#222f30]"
                }`}
                title="ترتيب حسب الأقرب إليك بالمسافة"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>الأقرب إليك</span>
              </button>

              <button
                onClick={() => setSortBy("reviews")}
                className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  sortBy === "reviews"
                    ? "bg-[#222f30] text-white font-bold shadow-xs"
                    : "text-[#55696a] hover:text-[#222f30]"
                }`}
                title="ترتيب حسب الأكثر مراجعات وشهرة"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>الأكثر مراجعة</span>
              </button>
            </div>
          </div>

          {/* Minimum Rating Selector */}
          <div className="md:col-span-3">
            <div className="relative">
              <select
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-11 px-3 bg-[#f7f7f5] border border-[#e4e3e3] focus:border-[#a7e26e] rounded-xl text-[#222f30] font-mono text-xs outline-none cursor-pointer"
              >
                <option value={0}>⭐ كل التقييمات</option>
                <option value={4.9}>⭐ 4.9 فما فوق (نخبة النخبة)</option>
                <option value={4.8}>⭐ 4.8 فما فوق (الممتاز جداً)</option>
                <option value={4.5}>⭐ 4.5 فما فوق (موثوق وعالي)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Source Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] text-xs font-mono shrink-0">
          <span className="text-[#55696a] text-[11px] px-1">المصدر:</span>
          <button
            onClick={() => setSourceFilter("all")}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              sourceFilter === "all"
                ? "bg-[#222f30] text-white font-bold shadow-xs"
                : "text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            الكل ({spots.length})
          </button>
          <button
            onClick={() => setSourceFilter("google")}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              sourceFilter === "google"
                ? "bg-sky-700 text-white font-bold shadow-xs"
                : "text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>معالم Google ({spots.filter((s) => s.source === "google").length})</span>
          </button>
          <button
            onClick={() => setSourceFilter("community")}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              sourceFilter === "community"
                ? "bg-[#222f30] text-[#cef79e] font-bold shadow-xs"
                : "text-[#55696a] hover:text-[#222f30]"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#a7e26e]" />
            <span>توثيقات هسه ({spots.filter((s) => s.source === "community").length})</span>
          </button>
        </div>

        {/* Governorates & Categories Chips */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#e4e3e3]">
          {/* Governorates */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-mono">
            <span className="text-[#55696a] shrink-0 text-[11px] ml-1">المحافظة:</span>
            <button
              onClick={() => setSelectedGov("الكل")}
              className={`px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                selectedGov === "الكل"
                  ? "bg-[#222f30] text-white font-bold shadow-xs"
                  : "bg-[#f7f7f5] text-[#55696a] hover:bg-white hover:text-[#222f30] border border-[#e4e3e3]"
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
                  className={`px-3 py-1 rounded-lg transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    selectedGov === gov.nameAr
                      ? "bg-[#222f30] text-white font-bold shadow-xs"
                      : "bg-[#f7f7f5] text-[#55696a] hover:bg-white hover:text-[#222f30] border border-[#e4e3e3]"
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
            <span className="text-[#55696a] shrink-0 text-[11px] ml-1 font-mono">المهنة:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#222f30] text-white font-bold shadow-xs"
                    : "bg-[#f7f7f5] text-[#55696a] hover:bg-white hover:text-[#222f30] border border-[#e4e3e3]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs font-mono text-[#55696a] pt-1 border-t border-[#e4e3e3]">
          <div>
            تم العثور على <strong className="text-[#222f30] font-bold">{processedSpots.length}</strong> مكان
            {sortBy === "highest" && " (مرتبة بالأعلى تقييماً)"}
            {sortBy === "nearest" && ` (مرتبة بالأقرب إلى ${userLocation.name})`}
            {sortBy === "reviews" && " (مرتبة بالأكثر مراجعات)"}
          </div>
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="text-[#728825] hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <span>عرض الكل على خريطة العراق</span>
              <span>←</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Spots Cards Grid with Rich Community Ratings & Reviews */}
      {processedSpots.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
          <MapPin className="w-12 h-12 text-[#55696a]/30 mx-auto" />
          <h3 className="text-lg font-kufi font-bold text-[#222f30]">لا توجد أماكن مطابقة لهذا الفلتر</h3>
          <p className="text-xs text-[#55696a] max-w-md mx-auto">
            جرّب تغيير التصنيف، خفض الحد الأدنى للتقييم، أو كن أول من يضيف محلاً معتمداً في منطقتك!
          </p>
          <button
            onClick={() => {
              setActiveCategory("الكل");
              setSelectedGov("الكل");
              setMinRating(0);
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-xl bg-[#222f30] hover:bg-[#162021] text-white text-xs font-mono font-bold cursor-pointer"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {processedSpots.map((spot) => (
            <div
              key={spot.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] hover:border-[#a7e26e] transition-all flex flex-col justify-between space-y-4 group shadow-xs hover:shadow-md relative"
            >
              {/* Proximity / High Rank Badge */}
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-md border text-[11px] font-bold ${
                      spot.source === "google"
                        ? "bg-sky-50 text-sky-800 border-sky-300"
                        : "bg-[#cef79e] text-[#222f30] border-[#a7e26e]"
                    }`}
                  >
                    {spot.source === "google" ? "معلم Google" : spot.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#f7f7f5] text-[#55696a] text-[10px]">
                    {spot.governorate}
                  </span>
                </div>
                {/* Distance Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-[11px]">
                  <Navigation className="w-3 h-3" />
                  <span>{spot.distanceKm < 1 ? "أقل من 1 كم" : `يبعد ${spot.distanceKm} كم`}</span>
                </div>
              </div>

              {/* Title & Verified */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-kufi font-bold text-base sm:text-lg text-[#222f30] group-hover:text-[#162021] transition-colors leading-snug">
                    {spot.name}
                  </h3>
                  {spot.isVerified && (
                    <span title="موثق محلياً من المجتمع" className="shrink-0 pt-1">
                      <CheckCircle2 className="w-4 h-4 text-[#728825]" />
                    </span>
                  )}
                </div>

                <p className="text-xs font-mono text-[#55696a] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#55696a] shrink-0" />
                  <span className="line-clamp-1">{spot.district}</span>
                </p>
              </div>

              {/* Notes */}
              <p className="text-xs text-[#55696a] leading-relaxed font-sans bg-[#f7f7f5] p-3 rounded-xl border border-[#e4e3e3]">
                {spot.notes}
              </p>

              {/* Community Reviews Snippet */}
              {spot.reviews && spot.reviews.length > 0 && (
                <div className="p-3 rounded-xl bg-[#f7f7f5] border border-[#e4e3e3] space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#55696a]">
                    <span className="flex items-center gap-1 font-bold text-[#222f30]">
                      <MessageSquare className="w-3 h-3 text-[#728825]" />
                      <span>رأي المجتمع:</span>
                    </span>
                    <span>{spot.reviews[0].date}</span>
                  </div>
                  <p className="text-xs text-[#222f30] italic font-sans leading-relaxed">
                    &ldquo;{spot.reviews[0].comment}&rdquo;
                  </p>
                  <div className="text-[10px] font-mono text-[#55696a] text-left">
                    — {spot.reviews[0].author}
                  </div>
                </div>
              )}

              {/* Bottom Row: Rating, Review Button, Contact */}
              <div className="pt-3 border-t border-[#e4e3e3] flex items-center justify-between gap-2 text-xs font-mono">
                {/* Rating score */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{spot.rating.toFixed(1)}</span>
                  </div>
                  <button
                    onClick={() => setReviewingSpot(spot)}
                    className="text-[11px] text-[#728825] font-bold hover:underline cursor-pointer"
                  >
                    + أضف تقييمك
                  </button>
                  {onDeleteSpot && (
                    <button
                      onClick={() => onDeleteSpot(spot.id)}
                      className="text-[10px] text-rose-600 hover:underline cursor-pointer flex items-center gap-0.5"
                      title="إزالة المحل من الخريطة لأنه مغلق نهائياً"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>إزالة</span>
                    </button>
                  )}
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
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800 text-[11px] font-bold transition-all"
                    title="فتح في خرائط Google"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>خرائط Google</span>
                  </a>

                  {/* WhatsApp Direct Link */}
                  <a
                    href={`https://wa.me/${spot.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold transition-all"
                    title="مراسلة عبر واتساب مباشرة"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>واتساب</span>
                  </a>

                  {/* Call Direct Link */}
                  <a
                    href={`tel:${spot.phone}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#f0f2f0] hover:bg-white border border-[#e4e3e3] text-[#222f30] text-[11px] font-medium transition-all"
                    title="اتصال هاتفي"
                  >
                    <Phone className="w-3 h-3" />
                    <span>اتصال</span>
                  </a>
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
