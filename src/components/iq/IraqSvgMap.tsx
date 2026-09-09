"use client";

import { useState, useRef, useMemo } from "react";
import {
  IRAQ_GOVERNORATES,
  IRAQ_RIVERS,
  IRAQ_HIGHWAYS,
  projectToSvg,
  Governorate,
  LocalSpot,
} from "@/lib/data/iq-map-data";
import {
  Search,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Star,
  MessageCircle,
  X,
  Check,
  ExternalLink,
  Plus,
  Compass,
  Sparkles,
  Info,
  Map as MapIcon,
} from "lucide-react";

interface IraqSvgMapProps {
  spots: LocalSpot[];
  onSelectSpot?: (spot: LocalSpot) => void;
  selectedGovernorate?: string | null;
  onSelectGovernorate?: (govNameAr: string | null) => void;
  onAddSpotClick?: () => void;
}

export default function IraqSvgMap({
  spots,
  onSelectSpot,
  selectedGovernorate: externalSelectedGov,
  onSelectGovernorate: externalOnSelectGov,
  onAddSpotClick,
}: IraqSvgMapProps) {
  const [internalSelectedGov, setInternalSelectedGov] = useState<string | null>(null);
  const selectedGov = externalSelectedGov !== undefined ? externalSelectedGov : internalSelectedGov;
  const setSelectedGov = (gov: string | null) => {
    if (externalOnSelectGov) {
      externalOnSelectGov(gov);
    } else {
      setInternalSelectedGov(gov);
    }
  };

  // Map theme: "dark" (Jemo Dark) vs "google" (Google Maps Roadmap style)
  const [mapTheme, setMapTheme] = useState<"dark" | "google">("google");
  // Source filter: all vs google landmarks vs our community spots
  const [sourceFilter, setSourceFilter] = useState<"all" | "google" | "community">("all");

  const [hoveredGov, setHoveredGov] = useState<Governorate | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<LocalSpot | null>(null);
  const [inspectedGov, setInspectedGov] = useState<Governorate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRivers, setShowRivers] = useState(true);
  const [showHighways, setShowHighways] = useState(true);
  const [showSpots, setShowSpots] = useState(true);
  const [showCapitals, setShowCapitals] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Normalize Arabic text for resilient search
  const normalizeAr = (text: string) =>
    text
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .toLowerCase()
      .trim();

  const normalizedQuery = normalizeAr(searchQuery);

  // Active governorate object
  const currentGovObj = useMemo(() => {
    if (!selectedGov) return null;
    return IRAQ_GOVERNORATES.find((g) => g.nameAr === selectedGov) || null;
  }, [selectedGov]);

  // Filtered governorates matching search
  const matchingGovs = useMemo(() => {
    if (!normalizedQuery) return IRAQ_GOVERNORATES;
    return IRAQ_GOVERNORATES.filter(
      (gov) =>
        normalizeAr(gov.nameAr).includes(normalizedQuery) ||
        normalizeAr(gov.capital).includes(normalizedQuery) ||
        gov.nameEn.toLowerCase().includes(normalizedQuery) ||
        gov.districts.some((d) => normalizeAr(d).includes(normalizedQuery)) ||
        gov.landmarks.some((l) => normalizeAr(l).includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  // Filtered spots on map based on governorate, search, and source filter
  const mapSpots = useMemo(() => {
    return spots.filter((s) => {
      const matchesGov = !selectedGov || s.governorate === selectedGov;
      const matchesSource =
        sourceFilter === "all" ||
        (sourceFilter === "google" && s.source === "google") ||
        (sourceFilter === "community" && s.source === "community");

      if (!normalizedQuery) return matchesGov && matchesSource;

      const matchesSearch =
        normalizeAr(s.name).includes(normalizedQuery) ||
        normalizeAr(s.category).includes(normalizedQuery) ||
        normalizeAr(s.district).includes(normalizedQuery) ||
        normalizeAr(s.governorate).includes(normalizedQuery) ||
        normalizeAr(s.notes).includes(normalizedQuery);

      return matchesGov && matchesSource && matchesSearch;
    });
  }, [spots, selectedGov, sourceFilter, normalizedQuery]);

  const googleCount = spots.filter((s) => s.source === "google").length;
  const communityCount = spots.filter((s) => s.source === "community").length;

  // Handle PNG Download
  const handleDownloadPng = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1600;
        canvas.height = 1560;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background based on theme
        ctx.fillStyle = mapTheme === "google" ? "#1e293b" : "#0c1415";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw header badge
        ctx.fillStyle = "#bef264";
        ctx.font = "bold 32px sans-serif";
        ctx.direction = "rtl";
        ctx.fillText("جمهورية العراق — خريطة المحافظات ومعالم Google وتوثيقات هسه", canvas.width - 60, 60);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px sans-serif";
        ctx.fillText("18 محافظة موثقة بالكامل · شبكة الطرق السريعة والمعالم المجتمعية", canvas.width - 60, 95);

        ctx.drawImage(image, 0, 100, canvas.width, canvas.height - 100);

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "khareetat-al-iraq.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobURL);

        setDownloadSuccess("تم تحميل خريطة العراق بصيغة PNG عالية الجودة بنجاح!");
        setTimeout(() => setDownloadSuccess(null), 3500);
      };

      image.src = blobURL;
    } catch {
      handleDownloadSvg();
    }
  };

  // Handle SVG Download
  const handleDownloadSvg = () => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "khareetat-al-iraq.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess("تم تحميل خريطة العراق المتجهة SVG بنجاح!");
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleGovClick = (gov: Governorate) => {
    if (selectedGov === gov.nameAr) {
      setSelectedGov(null);
      setInspectedGov(null);
    } else {
      setSelectedGov(gov.nameAr);
      setInspectedGov(gov);
    }
    setSelectedSpot(null);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* 1. Map Search & Google/Community Style Controls Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0e1618] p-3 sm:p-4 rounded-3xl border border-white/10 shadow-md">
        {/* Search on Map */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الخريطة: اسم محافظة، قضاء، معلم Google، أو محل (مثلاً: نينوى، المتنبي، الكرادة، سبالت)..."
            className="w-full h-11 pr-10 pl-4 bg-black/40 border border-white/10 focus:border-[#bef264] rounded-2xl text-white text-xs sm:text-sm font-sans outline-none transition-colors"
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

        {/* Source Filter: Google vs Our Community Spots */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono shrink-0">
          <button
            onClick={() => setSourceFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              sourceFilter === "all"
                ? "bg-[#bef264] text-[#0c1415] font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
          >
            الكل ({spots.length})
          </button>

          <button
            onClick={() => setSourceFilter("google")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              sourceFilter === "google"
                ? "bg-sky-500 text-white font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
            title="معالم خرائط Google المعتمدة في العراق"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>معالم Google ({googleCount})</span>
          </button>

          <button
            onClick={() => setSourceFilter("community")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              sourceFilter === "community"
                ? "bg-emerald-500 text-white font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
            title="توثيقات هسه المجتمعية التي يضيفها أهالي الأحياء"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>توثيقات هسه ({communityCount})</span>
          </button>
        </div>

        {/* Map Actions: Themes, Zoom, Download */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {/* Map theme toggle */}
          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-0.5 text-xs font-mono">
            <button
              onClick={() => setMapTheme("google")}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                mapTheme === "google"
                  ? "bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40"
                  : "text-white/50 hover:text-white"
              }`}
              title="نمط خرائط Google مع شبكة الطرق السريعة"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>نمط Google</span>
            </button>
            <button
              onClick={() => setMapTheme("dark")}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                mapTheme === "dark"
                  ? "bg-[#bef264]/20 text-[#bef264] font-bold border border-[#bef264]/40"
                  : "text-white/50 hover:text-white"
              }`}
              title="النمط الليلي الداكن"
            >
              داكن
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-0.5 text-white/80">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.25))}
              title="تكبير"
              className="p-1.5 hover:text-[#bef264] rounded-lg transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              title="تصغير"
              className="p-1.5 hover:text-[#bef264] rounded-lg transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedGov(null);
                setSelectedSpot(null);
                setInspectedGov(null);
              }}
              title="إعادة ضبط الرؤية"
              className="p-1.5 hover:text-[#bef264] rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Download Map Button */}
          <button
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-kufi font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            title="تحميل خريطة العراق كصورة عالية الجودة"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>تحميل الخريطة</span>
          </button>

          {onAddSpotClick && (
            <button
              onClick={onAddSpotClick}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-kufi font-bold text-xs transition-colors cursor-pointer"
              title="إضافة مكان جديد لخريطتنا"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">أضف مكاناً</span>
            </button>
          )}
        </div>
      </div>

      {/* Layer Toggles & Alerts */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono px-1">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-white/40 text-[11px] ml-1">الطبقات:</span>
          <button
            onClick={() => setShowHighways(!showHighways)}
            className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
              showHighways ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30" : "bg-black/40 text-white/40"
            }`}
          >
            🛣️ الطرق السريعة
          </button>
          <button
            onClick={() => setShowRivers(!showRivers)}
            className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
              showRivers ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30" : "bg-black/40 text-white/40"
            }`}
          >
            🌊 دجلة والفرات
          </button>
          <button
            onClick={() => setShowCapitals(!showCapitals)}
            className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
              showCapitals ? "bg-white/15 text-white font-bold border border-white/20" : "bg-black/40 text-white/40"
            }`}
          >
            🏛️ مراكز المحافظات
          </button>
          <button
            onClick={() => setShowSpots(!showSpots)}
            className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
              showSpots ? "bg-[#bef264]/20 text-[#bef264] font-bold border border-[#bef264]/30" : "bg-black/40 text-white/40"
            }`}
          >
            📍 الأماكن ({mapSpots.length})
          </button>
        </div>

        {downloadSuccess && (
          <div className="text-emerald-300 text-xs flex items-center gap-1 animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{downloadSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. 18 Governorate Filter Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
        <button
          onClick={() => {
            setSelectedGov(null);
            setInspectedGov(null);
          }}
          className={`px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer ${
            selectedGov === null
              ? "bg-[#bef264] text-[#0c1415] font-bold shadow-xs"
              : "bg-[#0e1618] text-white/60 hover:text-white border border-white/10"
          }`}
        >
          كل العراق (18 محافظة)
        </button>
        {IRAQ_GOVERNORATES.map((g) => {
          const isSelected = selectedGov === g.nameAr;
          const count = spots.filter((s) => s.governorate === g.nameAr).length;
          return (
            <button
              key={g.id}
              onClick={() => handleGovClick(g)}
              className={`px-3 py-1 rounded-full transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                isSelected
                  ? "bg-[#bef264] text-[#0c1415] font-bold shadow-xs"
                  : "bg-[#0e1618] text-white/70 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              <span>{g.nameAr}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] px-1 rounded-full ${
                    isSelected ? "bg-[#0c1415]/20 text-[#0c1415]" : "bg-white/10 text-white/60"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Main Interactive Map Canvas and Side Sheet Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Canvas Column */}
        <div
          className={`relative w-full rounded-3xl overflow-hidden shadow-2xl transition-all border ${
            inspectedGov ? "lg:col-span-8" : "lg:col-span-12"
          } ${
            mapTheme === "google"
              ? "bg-[#18232c] border-sky-900/40"
              : "bg-gradient-to-b from-[#0e1618] to-[#070b0c] border-white/10"
          }`}
        >
          {/* Watermark and Style Badge */}
          <div className="absolute top-4 right-4 z-10 pointer-events-none flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 text-xs font-kufi font-bold text-white/90 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
              <span>خريطة جمهورية العراق</span>
              {mapTheme === "google" && (
                <span className="text-[10px] text-sky-300 font-mono">· نمط Google</span>
              )}
            </div>
            <span className="text-[10px] font-mono text-white/50">
              {matchingGovs.length} محافظة · {mapSpots.length} معلم ومحل موثق
            </span>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-[11px] font-mono space-y-1.5 text-white/80 hidden sm:block">
            <div className="font-bold text-white text-[10px] pb-1 border-b border-white/10">دليل الخريطة:</div>
            {showHighways && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-amber-400 rounded-full" />
                <span>طريق المرور السريع والوطني</span>
              </div>
            )}
            {showRivers && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-sky-400 rounded-full" />
                <span>نهرا دجلة والفرات وشط العرب</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span>معالم Google المعتمدة</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bef264]" />
              <span>توثيقات هسه المجتمعية</span>
            </div>
          </div>

          {/* Interactive SVG Surface */}
          <div className="w-full flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[460px] sm:min-h-[580px]">
            <svg
              ref={svgRef}
              viewBox="0 0 800 780"
              className="w-full h-auto max-w-[760px] select-none transition-transform duration-300 origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
              aria-label="خريطة جمهورية العراق التفاعلية"
            >
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.95" />
                </linearGradient>
                <filter id="glowPin" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#bef264" floodOpacity="0.6" />
                </filter>
                <filter id="glowGoogle" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#38bdf8" floodOpacity="0.7" />
                </filter>
              </defs>

              <rect width="800" height="780" fill="transparent" />

              {/* 18 Iraqi Governorates */}
              <g id="iraq-governorates">
                {IRAQ_GOVERNORATES.map((gov) => {
                  const isHovered = hoveredGov?.id === gov.id;
                  const isSelected = selectedGov === gov.nameAr;
                  const isMatchingSearch = matchingGovs.some((g) => g.id === gov.id);

                  // Theme-based coloring
                  let fillColor = mapTheme === "google" ? "#23333f" : "#111b1d";
                  let strokeColor = mapTheme === "google" ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.15)";
                  let strokeWidth = "1.2";

                  if (isSelected) {
                    fillColor = mapTheme === "google" ? "#1e3a47" : "#1a3229";
                    strokeColor = "#bef264";
                    strokeWidth = "2.6";
                  } else if (isHovered) {
                    fillColor = mapTheme === "google" ? "#2a3d4c" : "#19282b";
                    strokeColor = "#bef264";
                    strokeWidth = "2";
                  } else if (!isMatchingSearch && normalizedQuery) {
                    fillColor = mapTheme === "google" ? "#152028" : "#090f10";
                    strokeColor = "rgba(255, 255, 255, 0.05)";
                  }

                  return (
                    <path
                      key={gov.id}
                      d={gov.path}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      className="transition-colors duration-200 cursor-pointer focus:outline-none"
                      onMouseEnter={() => setHoveredGov(gov)}
                      onMouseLeave={() => setHoveredGov(null)}
                      onClick={() => handleGovClick(gov)}
                      tabIndex={0}
                      role="button"
                      aria-label={`محافظة ${gov.nameAr}`}
                    />
                  );
                })}
              </g>

              {/* Major Highway Network (Google Maps Style) */}
              {showHighways && (
                <g id="iraq-highways" pointerEvents="none">
                  {/* Road Casing (Dark stroke) */}
                  <path
                    d={IRAQ_HIGHWAYS.highway1}
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="3.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                  <path
                    d={IRAQ_HIGHWAYS.northHighway}
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                  <path
                    d={IRAQ_HIGHWAYS.erbilHighway}
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />
                  <path
                    d={IRAQ_HIGHWAYS.sulaymaniyahHighway}
                    fill="none"
                    stroke="#78350f"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.7"
                  />

                  {/* Highway Inner Lines (Warm Amber / Gold like Google Maps) */}
                  <path
                    d={IRAQ_HIGHWAYS.highway1}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  <path
                    d={IRAQ_HIGHWAYS.northHighway}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                  <path
                    d={IRAQ_HIGHWAYS.erbilHighway}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                  <path
                    d={IRAQ_HIGHWAYS.sulaymaniyahHighway}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />

                  {/* Highway Number 1 Badge Label */}
                  <text x="360" y="380" fill="#fef3c7" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                    طريق المرور السريع 1
                  </text>
                </g>
              )}

              {/* Tigris and Euphrates Rivers */}
              {showRivers && (
                <g id="iraq-rivers" pointerEvents="none">
                  <path
                    d={IRAQ_RIVERS.tigris}
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  <path
                    d={IRAQ_RIVERS.euphrates}
                    fill="none"
                    stroke="url(#riverGrad)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.9"
                  />
                  <path
                    d={IRAQ_RIVERS.shattAlArab}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.95"
                  />

                  <text x="360" y="210" fill="#38bdf8" fontSize="9" fontFamily="sans-serif" opacity="0.75">
                    نهر دجلة
                  </text>
                  <text x="270" y="325" fill="#38bdf8" fontSize="9" fontFamily="sans-serif" opacity="0.75">
                    نهر الفرات
                  </text>
                  <text x="685" y="640" fill="#38bdf8" fontSize="8" fontFamily="sans-serif" opacity="0.85">
                    شط العرب
                  </text>
                </g>
              )}

              {/* Capitals & Major Cities */}
              {showCapitals && (
                <g id="capitals" pointerEvents="none">
                  {IRAQ_GOVERNORATES.map((gov) => {
                    const isBaghdad = gov.id === "iq-bg";
                    const [cx, cy] = gov.center;
                    const isSelected = selectedGov === gov.nameAr;

                    return (
                      <g key={`cap-${gov.id}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isBaghdad ? 5 : 2.8}
                          fill={isBaghdad ? "#bef264" : isSelected ? "#bef264" : "#ffffff"}
                          stroke="#0c1415"
                          strokeWidth="1.2"
                        />
                        {isBaghdad && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="9"
                            fill="none"
                            stroke="#bef264"
                            strokeWidth="1.2"
                            opacity="0.7"
                            strokeDasharray="2 2"
                          />
                        )}
                        <text
                          x={cx}
                          y={cy - 7}
                          textAnchor="middle"
                          fill={isSelected ? "#bef264" : isBaghdad ? "#ffffff" : "#e2e8f0"}
                          fontSize={isBaghdad ? "11" : "9"}
                          fontWeight={isBaghdad || isSelected ? "bold" : "500"}
                          fontFamily="sans-serif"
                          className="select-none drop-shadow-md"
                        >
                          {gov.nameAr}
                        </text>
                      </g>
                    );
                  })}
                </g>
              )}

              {/* Spots & Landmarks Plotted on Map */}
              {showSpots && (
                <g id="map-spots">
                  {mapSpots.map((spot) => {
                    const [sx, sy] = projectToSvg(spot.lng, spot.lat);
                    const isSelected = selectedSpot?.id === spot.id;
                    const isGoogle = spot.source === "google";

                    return (
                      <g
                        key={`marker-${spot.id}`}
                        transform={`translate(${sx}, ${sy})`}
                        className="cursor-pointer group"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(spot);
                          if (onSelectSpot) onSelectSpot(spot);
                        }}
                      >
                        {/* Pulse Ring */}
                        <circle
                          r={isSelected ? "11" : "7"}
                          fill={isGoogle ? "#38bdf8" : "#bef264"}
                          opacity={isSelected ? "0.4" : "0.18"}
                          className="animate-ping origin-center"
                        />
                        {/* Pin Dot */}
                        <circle
                          r={isSelected ? "6.5" : isGoogle ? "5" : "4.5"}
                          fill={isGoogle ? (isSelected ? "#38bdf8" : "#0284c7") : isSelected ? "#bef264" : "#a3e635"}
                          stroke="#0c1415"
                          strokeWidth="1.4"
                          filter={isGoogle ? "url(#glowGoogle)" : "url(#glowPin)"}
                        />
                        {/* Center Icon hint */}
                        <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
                      </g>
                    );
                  })}
                </g>
              )}
            </svg>
          </div>

          {/* Selected Spot Floating Card Popup */}
          {selectedSpot && (
            <div
              className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 p-4 rounded-3xl bg-[#0c1415]/95 backdrop-blur-md border border-white/20 shadow-2xl space-y-3 animate-fadeIn text-right"
              dir="rtl"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                        selectedSpot.source === "google"
                          ? "bg-sky-500/20 border border-sky-500/30 text-sky-300"
                          : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300"
                      }`}
                    >
                      {selectedSpot.source === "google" ? "معلم Google معتمد" : "توثيق مجتمعي هسه"}
                    </span>
                    <span className="text-[10px] font-mono text-white/60">
                      {selectedSpot.category} · {selectedSpot.governorate}
                    </span>
                  </div>

                  <h4 className="font-kufi font-bold text-base text-white leading-snug">
                    {selectedSpot.name}
                  </h4>
                </div>

                <button
                  onClick={() => setSelectedSpot(null)}
                  className="text-white/60 hover:text-white text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">{selectedSpot.notes}</p>

              <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{selectedSpot.rating}</span>
                  <span className="text-white/40 text-[10px]">
                    ({selectedSpot.reviewsCount.toLocaleString("ar-IQ")} تقييم)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Open in Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      selectedSpot.name + " " + selectedSpot.district
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-[11px] font-bold transition-all"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>فتح في Google Maps</span>
                  </a>

                  {selectedSpot.whatsapp && selectedSpot.whatsapp !== "9647700000000" && (
                    <a
                      href={`https://wa.me/${selectedSpot.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>واتساب</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Small Detail of Each محافظة (Governorate Detailed Sheet) */}
        {inspectedGov && (
          <aside className="lg:col-span-4 p-5 rounded-3xl bg-[#0e1618] border border-white/15 shadow-xl space-y-4 animate-fadeIn">
            {/* Header with Title & Close */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#bef264]">
                  <Compass className="w-4 h-4 text-[#bef264]" />
                  <span>تفاصيل المحافظة</span>
                  <span className="text-white/30">·</span>
                  <span className="text-white/60">{inspectedGov.region}</span>
                </div>
                <h3 className="font-kufi font-black text-xl text-white mt-1">
                  محافظة {inspectedGov.nameAr}
                </h3>
                <span className="text-xs font-mono text-white/50">{inspectedGov.nameEn}</span>
              </div>

              <button
                onClick={() => {
                  setInspectedGov(null);
                  setSelectedGov(null);
                }}
                className="text-white/50 hover:text-white p-1"
                title="إغلاق تفاصيل المحافظة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 block">المركز</span>
                <span className="font-bold text-white text-xs">{inspectedGov.capital}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 block">السكان</span>
                <span className="font-bold text-[#bef264] text-xs">{inspectedGov.population}</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10">
                <span className="text-[10px] text-white/50 block">المساحة</span>
                <span className="font-bold text-white text-xs">{inspectedGov.areaKm2}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-white/50 block">نبذة عن المحافظة:</span>
              <p className="text-xs text-white/80 leading-relaxed font-sans bg-black/20 p-3 rounded-2xl border border-white/5">
                {inspectedGov.description}
              </p>
            </div>

            {/* Key Districts & Sub-districts (الأقضية والنواحي) */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-white/50 block">
                الأقضية والنواحي الرئيسية ({inspectedGov.districts.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar">
                {inspectedGov.districts.map((d) => (
                  <span
                    key={d}
                    className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Google Landmarks in this Governorate */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-sky-300 block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>أبرز معالم Google في {inspectedGov.nameAr}:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectedGov.landmarks.map((l) => (
                  <span
                    key={l}
                    className="px-2 py-0.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-200 text-[11px] font-mono"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>

            {/* Spots Count & Direct Actions */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-white/70">
                <span>المحلات والأماكن الموثقة:</span>
                <span className="font-bold text-[#bef264]">
                  {spots.filter((s) => s.governorate === inspectedGov.nameAr).length} مكان
                </span>
              </div>

              {/* Direct Open in Google Maps */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  "محافظة " + inspectedGov.nameAr + " العراق"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-2xl bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-kufi font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>استكشاف {inspectedGov.nameAr} في Google Maps</span>
              </a>
            </div>
          </aside>
        )}
      </div>

      {/* Active Governorate Scope Bar */}
      {selectedGov && !inspectedGov && currentGovObj && (
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#bef264]" />
            <span className="text-white/80">المحافظة النشطة:</span>
            <span className="font-bold text-[#bef264]">{selectedGov}</span>
            <span className="text-white/40">({currentGovObj.population} · {currentGovObj.capital})</span>
          </div>
          <button
            onClick={() => setInspectedGov(currentGovObj)}
            className="text-xs text-[#bef264] hover:underline cursor-pointer flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>عرض تفاصيل {selectedGov} كاملة</span>
          </button>
        </div>
      )}
    </div>
  );
}
