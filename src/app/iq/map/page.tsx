"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  SEEDED_SPOTS,
  LocalSpot,
  CommunityReview,
} from "@/lib/data/iq-map-data";
import IraqSvgMap from "@/components/iq/IraqSvgMap";
import CommunityPlacesView from "@/components/iq/CommunityPlacesView";
import {
  MapPin,
  Star,
  Compass,
  Layers,
} from "lucide-react";

// Dynamic import for Leaflet-backed Google Map to prevent Next.js SSR window errors
const IraqGoogleMap = dynamic(() => import("@/components/iq/IraqGoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] sm:h-[680px] rounded-3xl bg-[#0e1618] border border-white/10 flex flex-col items-center justify-center space-y-3 font-mono text-xs text-white/60">
      <div className="w-9 h-9 rounded-full border-2 border-[#bef264] border-t-transparent animate-spin" />
      <span>جاري تحميل خريطة Google المباشرة مع طبقة الأماكن والموقع...</span>
    </div>
  ),
});

export default function IqMapPage() {
  const [activeView, setActiveView] = useState<"google" | "vector" | "places">("google");
  const [spots, setSpots] = useState<LocalSpot[]>(SEEDED_SPOTS);
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | null>(null);

  // Handle adding a new spot to state
  const handleAddSpot = (newSpot: LocalSpot) => {
    setSpots((prev) => [newSpot, ...prev]);
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
      {/* 1. Header Banner (Compact & Dark) */}
      <section className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#121c1e] via-[#0e1618] to-[#0a1012] border border-white/10 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#bef264]">
              <MapPin className="w-4 h-4 text-[#bef264]" />
              <span>خريطة العراق الحقيقية · طبقتان (Google + أماكننا)</span>
              <span className="text-white/30">·</span>
              <span className="text-emerald-400">تفاعل مباشر مع موقعك GPS</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-kufi font-black text-white tracking-tight leading-tight">
              خريطة Google المباشرة مجاناً، مدمجة بأماكن محلتك وموقعك الجغرافي.
            </h1>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              شوارع وأقمار Google Maps الحقيقية لمحافظات وأحياء العراق، مع طبقة تفاعلية تحدد موقعك، تعرض الأماكن المحيطة بك بدقة، وتتيح النقر على أي مكان لإضافته.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-black/50 border border-white/10 p-2 rounded-2xl text-xs font-mono text-white/80 shrink-0">
            <div className="text-center px-2.5 border-l border-white/10">
              <div className="font-bold text-sky-400 text-xs sm:text-sm font-kufi">Google Maps</div>
              <div className="text-[10px] text-white/50">طبقة الشوارع والأقمار</div>
            </div>
            <div className="text-center px-2.5 border-l border-white/10">
              <div className="font-bold text-[#bef264] text-xs sm:text-sm font-kufi">{spots.length}</div>
              <div className="text-[10px] text-white/50">مكان ومعلم موثق</div>
            </div>
            <div className="text-center px-2">
              <div className="font-bold text-amber-300 text-xs sm:text-sm font-kufi">18</div>
              <div className="text-[10px] text-white/50">محافظة</div>
            </div>
          </div>
        </div>

        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-[#bef264]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Sub-Page View Switcher Tabs */}
      <div className="p-1.5 rounded-2xl bg-[#0c1415] border border-white/10 shadow-md flex items-center gap-1.5 text-xs font-mono overflow-x-auto no-scrollbar">
        {/* Tab 1: Google Map with 2 Layers (Default) */}
        <button
          onClick={() => setActiveView("google")}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "google"
              ? "bg-[#bef264] text-[#0c1415] shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
          aria-selected={activeView === "google"}
          role="tab"
        >
          <Layers className="w-4 h-4 stroke-[2.5]" />
          <span>خريطة Google التفاعلية وموقعي (طبقتان)</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
              activeView === "google" ? "bg-[#0c1415]/20 text-[#0c1415]" : "bg-sky-500/20 text-sky-300"
            }`}
          >
            مجاناً
          </span>
        </button>

        {/* Tab 2: Nearest Places & Community Ratings */}
        <button
          onClick={() => setActiveView("places")}
          className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "places"
              ? "bg-[#bef264] text-[#0c1415] shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
          aria-selected={activeView === "places"}
          role="tab"
        >
          <Star className="w-4 h-4 fill-current stroke-[2]" />
          <span>أقرب الأماكن وتقييمات المجتمع</span>
        </button>

        {/* Tab 3: Full Vector Map of Iraq & Download */}
        <button
          onClick={() => setActiveView("vector")}
          className={`flex-1 min-w-[160px] py-2.5 px-4 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "vector"
              ? "bg-[#bef264] text-[#0c1415] shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
          aria-selected={activeView === "vector"}
          role="tab"
        >
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span>خريطة المحافظات المتجهة (SVG)</span>
        </button>
      </div>

      {/* 3. Conditional Sub-Page Content */}
      {activeView === "google" && (
        <section aria-label="خريطة Google المباشرة بطبقتين" className="space-y-4">
          <IraqGoogleMap
            spots={spots}
            onAddSpot={handleAddSpot}
            selectedGovernorate={selectedGovernorate}
            onSelectGovernorate={setSelectedGovernorate}
          />
        </section>
      )}

      {activeView === "places" && (
        <section aria-label="دليل الأماكن الأقرب وتقييمات المجتمع" className="space-y-4">
          <CommunityPlacesView
            spots={spots}
            initialGovernorate={selectedGovernorate}
            onAddSpot={handleAddSpot}
            onAddReview={handleAddReview}
            onOpenMap={() => setActiveView("google")}
          />
        </section>
      )}

      {activeView === "vector" && (
        <section aria-label="خريطة جمهورية العراق المتجهة" className="space-y-4">
          <IraqSvgMap
            spots={spots}
            selectedGovernorate={selectedGovernorate}
            onSelectGovernorate={setSelectedGovernorate}
            onSelectSpot={(spot) => {
              setSelectedGovernorate(spot.governorate);
            }}
            onAddSpotClick={() => setActiveView("places")}
          />
        </section>
      )}
    </div>
  );
}
