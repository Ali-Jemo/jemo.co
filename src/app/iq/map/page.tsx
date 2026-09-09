"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function IqMapPage() {
  const [activeView, setActiveView] = useState<"map" | "places">("map");
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
    <div className="space-y-6 sm:space-y-8" dir="rtl">
      {/* 1. Header Banner */}
      <section className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-[#121c1e] via-[#0d1618] to-[#0a1012] border border-white/10 shadow-lg relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-[#bef264]">
              <MapPin className="w-4 h-4 text-[#bef264]" />
              <span>الباب الثاني · خريطة العراق ودليل المحلة الحقيقي</span>
              <span className="text-white/30">·</span>
              <span className="text-white/60">تحديثات مجتمعية وتغطية شاملة</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-kufi font-black text-white tracking-tight leading-tight">
              خريطة العراق التفاعلية، وأقرب الأماكن الأعلى تقييماً من المجتمع.
            </h1>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
              خريطة كاملة خاصة بالعراق فقط تشمل جميع المحافظات الـ 18 مع إمكانية البحث والتحميل الفوري، مقترنة بدليل تفاعلي لأقرب المحلات، الورش، والخدمات الموثوقة مع تقييمات أهالي المنطقة الحقيقية.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-black/40 border border-white/10 p-2.5 rounded-2xl text-xs font-mono text-white/80 shrink-0">
            <div className="text-center px-2 border-l border-white/10">
              <div className="font-bold text-[#bef264] text-sm font-kufi">18</div>
              <div className="text-[10px] text-white/50">محافظة</div>
            </div>
            <div className="text-center px-2 border-l border-white/10">
              <div className="font-bold text-amber-300 text-sm font-kufi">{spots.length}</div>
              <div className="text-[10px] text-white/50">مكان موثق</div>
            </div>
            <div className="text-center px-2">
              <div className="font-bold text-emerald-400 text-sm font-kufi">4.9 ★</div>
              <div className="text-[10px] text-white/50">متوسط النخبة</div>
            </div>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-[#bef264]/5 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 2. Sub-Page View Switcher Tabs (In the same page) */}
      <div className="p-1.5 rounded-2xl bg-[#0c1415] border border-white/10 shadow-md flex items-center gap-1.5 text-xs font-mono">
        <button
          onClick={() => setActiveView("map")}
          className={`flex-1 py-3 px-4 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "map"
              ? "bg-[#bef264] text-[#0c1415] shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
          aria-selected={activeView === "map"}
          role="tab"
        >
          <Compass className="w-4 h-4 stroke-[2.5]" />
          <span>خريطة العراق التفاعلية (مع البحث والتحميل)</span>
          <span
            className={`hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full font-mono ${
              activeView === "map" ? "bg-[#0c1415]/20 text-[#0c1415]" : "bg-white/10 text-white/60"
            }`}
          >
            18 محافظة
          </span>
        </button>

        <button
          onClick={() => setActiveView("places")}
          className={`flex-1 py-3 px-4 rounded-xl font-kufi font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeView === "places"
              ? "bg-[#bef264] text-[#0c1415] shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
          aria-selected={activeView === "places"}
          role="tab"
        >
          <Star className="w-4 h-4 fill-current stroke-[2]" />
          <span>أقرب الأماكن وتقييمات المجتمع (الأعلى تقييماً)</span>
          <span
            className={`hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full font-mono ${
              activeView === "places" ? "bg-[#0c1415]/20 text-[#0c1415]" : "bg-white/10 text-white/60"
            }`}
          >
            {spots.length} مكان
          </span>
        </button>
      </div>

      {/* 3. Conditional Sub-Page Content */}
      {activeView === "map" ? (
        <section aria-label="خريطة جمهورية العراق التفاعلية" className="space-y-4">
          <IraqSvgMap
            spots={spots}
            selectedGovernorate={selectedGovernorate}
            onSelectGovernorate={setSelectedGovernorate}
            onSelectSpot={(spot) => {
              // Option to directly switch to places view and view this spot
              setSelectedGovernorate(spot.governorate);
            }}
          />

          {/* Bottom helper prompt to explore community ratings */}
          <div className="p-4 rounded-2xl bg-[#0e1618] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300 shrink-0" />
              <span>تريد رؤية أقرب الأماكن لموقعك مرتبة بالأعلى تقييماً من المجتمع؟</span>
            </div>
            <button
              onClick={() => setActiveView("places")}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#bef264] font-bold transition-colors cursor-pointer shrink-0"
            >
              الانتقال إلى دليل الأماكن والتقييمات ←
            </button>
          </div>
        </section>
      ) : (
        <section aria-label="دليل الأماكن الأقرب وتقييمات المجتمع" className="space-y-4">
          <CommunityPlacesView
            spots={spots}
            initialGovernorate={selectedGovernorate}
            onAddSpot={handleAddSpot}
            onAddReview={handleAddReview}
            onOpenMap={() => setActiveView("map")}
          />
        </section>
      )}
    </div>
  );
}
