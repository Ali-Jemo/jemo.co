"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { SEEDED_SPOTS } from "@/lib/data/iq-map-data";
import type { LocalSpot, CommunityReview } from "@/lib/data/iq-map-data";
import CommunityPlacesView from "@/components/iq/CommunityPlacesView";
import { MapPin, Star, Layers } from "lucide-react";

// Dynamic import for Leaflet-backed interactive map to prevent Next.js SSR window errors
const IraqInteractiveMap = dynamic(() => import("@/components/iq/IraqInteractiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] sm:h-[660px] rounded-3xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col items-center justify-center space-y-3 font-mono text-xs text-[#55696a]">
      <div className="w-9 h-9 rounded-full border-2 border-[#222f30] border-t-transparent animate-spin" />
      <span>جاري تحميل الخريطة التفاعلية وطبقة الأماكن...</span>
    </div>
  ),
});

export default function IqMapPage() {
  const [activeView, setActiveView] = useState<"places" | "map">("map");
  const [spots, setSpots] = useState<LocalSpot[]>(SEEDED_SPOTS);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | null>(null);

  // Handle adding a new spot to state
  const handleAddSpot = (newSpot: LocalSpot) => {
    setSpots((prev) => [newSpot, ...prev]);
  };

  // Handle deleting or marking a spot as closed/removed
  const handleDeleteSpot = (spotId: string) => {
    setSpots((prev) => prev.filter((s) => s.id !== spotId));
  };

  // Handle adding a review and updating spot rating
  const handleAddReview = (spotId: string, review: CommunityReview) => {
    setSpots((prev) =>
      prev.map((spot) => {
        if (spot.id !== spotId) return spot;
        const updatedReviews = [review, ...(spot.reviews || [])];
        const avgRating =
          Math.round(
            (updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length) * 10
          ) / 10;
        return {
          ...spot,
          rating: avgRating,
          reviewsCount: spot.reviewsCount + 1,
          reviews: updatedReviews,
        };
      })
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6" dir="rtl">
      {/* 1. Header Banner (Jemo Labs Light Theme) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#55696a]">
            <MapPin className="w-4 h-4 text-[#728825]" />
            <span className="font-bold text-[#222f30]">خريطة المحلة الشعبية</span>
            <span>·</span>
            <span>الأماكن التي يتجاهلها غوغل ماب</span>
          </div>

          <h1 className="text-lg sm:text-xl font-kufi font-black text-[#222f30] tracking-tight">
            دليل الأماكن الموثقة بأرقام الواتساب وتقييمات الجيران الحقيقية.
          </h1>

          <p className="text-xs text-[#55696a] leading-relaxed font-sans max-w-2xl">
            أسواق، كوزمتك، أفران، ومصلحين مجربين داخل الأحياء مع أرقام الهاتف والواتساب المباشرة.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-[#f7f7f5] border border-[#e4e3e3] p-1.5 rounded-xl text-xs font-mono text-[#55696a] shrink-0">
          <div className="text-center px-3 border-l border-[#e4e3e3]">
            <div className="font-bold text-[#222f30] text-sm font-kufi">{spots.length}</div>
            <div className="text-[10px] text-[#55696a]">مكان موثق</div>
          </div>
          <div className="text-center px-3">
            <div className="font-bold text-[#222f30] text-sm font-kufi">18</div>
            <div className="text-[10px] text-[#55696a]">محافظة</div>
          </div>
        </div>
      </section>

      {/* 2. Clean 2-Way View Switcher (Jemo Labs Theme) */}
      <div className="p-1.5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs flex items-center gap-1 text-xs font-mono">
        <button
          onClick={() => setActiveView("places")}
          className={`flex-1 py-2 px-3 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "places"
              ? "bg-[#222f30] text-white shadow-xs"
              : "text-[#55696a] hover:text-[#222f30] hover:bg-[#f0f2f0]"
          }`}
          role="tab"
          aria-selected={activeView === "places"}
        >
          <Star className={`w-3.5 h-3.5 ${activeView === "places" ? "fill-amber-300 text-amber-300" : ""}`} />
          <span>دليل المحلات والتقييمات</span>
        </button>

        <button
          onClick={() => setActiveView("map")}
          className={`flex-1 py-2 px-3 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "map"
              ? "bg-[#222f30] text-white shadow-xs"
              : "text-[#55696a] hover:text-[#222f30] hover:bg-[#f0f2f0]"
          }`}
          role="tab"
          aria-selected={activeView === "map"}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>الخريطة التفاعلية الشاملة</span>
        </button>
      </div>

      {/* 3. Render View */}
      {activeView === "places" ? (
        <section aria-label="دليل الأماكن الأقرب وتقييمات المجتمع">
          <CommunityPlacesView
            spots={spots}
            initialGovernorate={selectedGovernorate}
            onAddSpot={handleAddSpot}
            onAddReview={handleAddReview}
            onOpenMap={() => setActiveView("map")}
          />
        </section>
      ) : (
        <section aria-label="خريطة العراق التفاعلية">
          <IraqInteractiveMap
            spots={spots}
            onAddSpot={handleAddSpot}
            onDeleteSpot={handleDeleteSpot}
            selectedGovernorate={selectedGovernorate}
            onSelectGovernorate={setSelectedGovernorate}
          />
        </section>
      )}
    </div>
  );
}
