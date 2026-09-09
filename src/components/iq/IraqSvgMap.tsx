"use client";

import { useState, useRef, useMemo } from "react";
import {
  IRAQ_GOVERNORATES,
  IRAQ_RIVERS,
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
  Phone,
  X,
  Check,
} from "lucide-react";

interface IraqSvgMapProps {
  spots: LocalSpot[];
  onSelectSpot?: (spot: LocalSpot) => void;
  selectedGovernorate?: string | null;
  onSelectGovernorate?: (govNameAr: string | null) => void;
}

export default function IraqSvgMap({
  spots,
  onSelectSpot,
  selectedGovernorate: externalSelectedGov,
  onSelectGovernorate: externalOnSelectGov,
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

  const [hoveredGov, setHoveredGov] = useState<Governorate | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<LocalSpot | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showRivers, setShowRivers] = useState(true);
  const [showSpots, setShowSpots] = useState(true);
  const [showCapitals, setShowCapitals] = useState(true);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // Normalize Arabic text for resilient search (e.g. أ, إ, آ -> ا, ة -> ه)
  const normalizeAr = (text: string) =>
    text
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .toLowerCase()
      .trim();

  const normalizedQuery = normalizeAr(searchQuery);

  // Filtered governorates matching search
  const matchingGovs = useMemo(() => {
    if (!normalizedQuery) return IRAQ_GOVERNORATES;
    return IRAQ_GOVERNORATES.filter(
      (gov) =>
        normalizeAr(gov.nameAr).includes(normalizedQuery) ||
        normalizeAr(gov.capital).includes(normalizedQuery) ||
        gov.nameEn.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  // Filtered spots on map
  const mapSpots = useMemo(() => {
    return spots.filter((s) => {
      const matchesGov = !selectedGov || s.governorate === selectedGov;
      if (!normalizedQuery) return matchesGov;
      const matchesSearch =
        normalizeAr(s.name).includes(normalizedQuery) ||
        normalizeAr(s.category).includes(normalizedQuery) ||
        normalizeAr(s.district).includes(normalizedQuery) ||
        normalizeAr(s.governorate).includes(normalizedQuery);
      return matchesGov && matchesSearch;
    });
  }, [spots, selectedGov, normalizedQuery]);

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
        // High-res export (2x)
        canvas.width = 1600;
        canvas.height = 1560;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Dark background
        ctx.fillStyle = "#0c1415";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw header badge
        ctx.fillStyle = "#bef264";
        ctx.font = "bold 32px sans-serif";
        ctx.direction = "rtl";
        ctx.fillText("جمهورية العراق — خريطة المحافظات والأماكن المجتمعية", canvas.width - 60, 60);

        ctx.fillStyle = "#ffffff";
        ctx.font = "20px sans-serif";
        ctx.fillText("منصة هسه العراقية · hessa.iq", canvas.width - 60, 95);

        ctx.drawImage(image, 0, 100, canvas.width, canvas.height - 100);

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "khareetat-al-iraq.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(blobURL);

        setDownloadSuccess("تم تحميل خريطة العراق بصيغة PNG بنجاح!");
        setTimeout(() => setDownloadSuccess(null), 3500);
      };

      image.src = blobURL;
    } catch {
      // Fallback to SVG download if canvas security prevents
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

    setDownloadSuccess("تم تحميل خريطة العراق بصيغة SVG متجهة بنجاح!");
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  const handleGovClick = (gov: Governorate) => {
    if (selectedGov === gov.nameAr) {
      setSelectedGov(null);
    } else {
      setSelectedGov(gov.nameAr);
    }
    setSelectedSpot(null);
  };

  return (
    <div className="space-y-4">
      {/* 1. Map Search & Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0e1618] p-3 sm:p-4 rounded-2xl border border-white/10 shadow-md">
        {/* Search on Map */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الخريطة: محافظة، مدينة، أو محل (مثلاً: نينوى، الكرادة، سبالت)..."
            className="w-full h-10 pr-9 pl-4 bg-black/40 border border-white/10 focus:border-[#bef264] rounded-xl text-white text-xs sm:text-sm font-sans outline-none transition-colors"
          />
          <Search className="w-4 h-4 text-white/40 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Map Actions: Zoom, Layers, Download */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-0.5 text-white/80">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.25))}
              title="تكبير الخريطة"
              className="p-1.5 hover:text-[#bef264] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
              title="تصغير الخريطة"
              className="p-1.5 hover:text-[#bef264] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedGov(null);
                setSelectedSpot(null);
              }}
              title="إعادة ضبط الرؤية"
              className="p-1.5 hover:text-[#bef264] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Toggle Layers Dropdown */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1 text-[11px] font-mono">
            <button
              onClick={() => setShowRivers(!showRivers)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                showRivers ? "bg-cyan-950 text-cyan-300 font-bold" : "text-white/40 hover:text-white"
              }`}
              title="إظهار أو إخفاء نهري دجلة والفرات"
            >
              الأنهار
            </button>
            <button
              onClick={() => setShowCapitals(!showCapitals)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                showCapitals ? "bg-amber-950 text-amber-300 font-bold" : "text-white/40 hover:text-white"
              }`}
              title="إظهار أو إخفاء مراكز المحافظات"
            >
              المدن
            </button>
            <button
              onClick={() => setShowSpots(!showSpots)}
              className={`px-2 py-0.5 rounded-md transition-colors ${
                showSpots ? "bg-[#bef264]/20 text-[#bef264] font-bold" : "text-white/40 hover:text-white"
              }`}
              title="إظهار أو إخفاء نقاط المحلات"
            >
              الأماكن ({mapSpots.length})
            </button>
          </div>

          {/* Download Map Button */}
          <div className="relative group">
            <button
              onClick={handleDownloadPng}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-kufi font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              title="تحميل خريطة العراق كصورة عالية الجودة"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">تحميل الخريطة</span>
              <span className="sm:hidden">تحميل</span>
            </button>
          </div>

          <button
            onClick={handleDownloadSvg}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-mono transition-colors cursor-pointer"
            title="تحميل كملف متجهي SVG"
          >
            SVG
          </button>
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* 2. Governorate Filter Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs font-mono">
        <button
          onClick={() => setSelectedGov(null)}
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
              onClick={() => setSelectedGov(isSelected ? null : g.nameAr)}
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

      {/* 3. Main Interactive Map Canvas */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#0e1618] to-[#070b0c] border border-white/10 overflow-hidden shadow-2xl">
        {/* Watermark and Compass Badge */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-xs font-kufi font-bold text-white/80 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
            <span>خريطة جمهورية العراق</span>
          </div>
          <span className="text-[10px] font-mono text-white/40">18 محافظة موثقة بالكامل</span>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none bg-black/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-[11px] font-mono space-y-1 text-white/70 hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-xs bg-[#162325] border border-[#bef264]/60" />
            <span>محافظات العراق</span>
          </div>
          {showRivers && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-cyan-400" />
              <span>نهرا دجلة والفرات</span>
            </div>
          )}
          {showSpots && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bef264] ring-2 ring-[#bef264]/30" />
              <span>أماكن مجتمعية موثقة ({mapSpots.length})</span>
            </div>
          )}
        </div>

        {/* Interactive SVG Surface */}
        <div className="w-full flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[420px] sm:min-h-[560px]">
          <svg
            ref={svgRef}
            viewBox="0 0 800 780"
            className="w-full h-auto max-w-[760px] select-none transition-transform duration-300 origin-center"
            style={{ transform: `scale(${zoomLevel})` }}
            aria-label="خريطة جمهورية العراق التفاعلية"
          >
            <defs>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
              </linearGradient>
              <filter id="glowPin" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#bef264" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Background Base */}
            <rect width="800" height="780" fill="transparent" />

            {/* 18 Iraqi Governorates Paths */}
            <g id="iraq-governorates">
              {IRAQ_GOVERNORATES.map((gov) => {
                const isHovered = hoveredGov?.id === gov.id;
                const isSelected = selectedGov === gov.nameAr;
                const isMatchingSearch = matchingGovs.some((g) => g.id === gov.id);
                const hasSpots = spots.some((s) => s.governorate === gov.nameAr);

                let fillColor = "#111b1d";
                let strokeColor = "rgba(255, 255, 255, 0.15)";
                let strokeWidth = "1.2";

                if (isSelected) {
                  fillColor = "#1a3229";
                  strokeColor = "#bef264";
                  strokeWidth = "2.5";
                } else if (isHovered) {
                  fillColor = "#19282b";
                  strokeColor = "#bef264";
                  strokeWidth = "2";
                } else if (!isMatchingSearch && normalizedQuery) {
                  fillColor = "#090f10";
                  strokeColor = "rgba(255, 255, 255, 0.05)";
                } else if (hasSpots) {
                  fillColor = "#132123";
                  strokeColor = "rgba(255, 255, 255, 0.25)";
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

            {/* Tigris and Euphrates Rivers */}
            {showRivers && (
              <g id="iraq-rivers" pointerEvents="none">
                {/* Tigris */}
                <path
                  d={IRAQ_RIVERS.tigris}
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
                {/* Euphrates */}
                <path
                  d={IRAQ_RIVERS.euphrates}
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.85"
                />
                {/* Shatt al-Arab */}
                <path
                  d={IRAQ_RIVERS.shattAlArab}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                />

                {/* River Labels */}
                <text x="360" y="210" fill="#38bdf8" fontSize="9" fontFamily="sans-serif" opacity="0.6">
                  نهر دجلة
                </text>
                <text x="270" y="325" fill="#38bdf8" fontSize="9" fontFamily="sans-serif" opacity="0.6">
                  نهر الفرات
                </text>
                <text x="685" y="640" fill="#38bdf8" fontSize="8" fontFamily="sans-serif" opacity="0.7">
                  شط العرب
                </text>
              </g>
            )}

            {/* Governorate Centers & Capital Labels */}
            {showCapitals && (
              <g id="capitals" pointerEvents="none">
                {IRAQ_GOVERNORATES.map((gov) => {
                  const isBaghdad = gov.id === "iq-bg";
                  const [cx, cy] = gov.center;
                  const isSelected = selectedGov === gov.nameAr;

                  return (
                    <g key={`cap-${gov.id}`} className="transition-opacity">
                      {/* Capital Dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isBaghdad ? 4.5 : 2.5}
                        fill={isBaghdad ? "#bef264" : isSelected ? "#bef264" : "#ffffff"}
                        stroke="#0c1415"
                        strokeWidth="1.2"
                      />
                      {isBaghdad && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="8"
                          fill="none"
                          stroke="#bef264"
                          strokeWidth="1"
                          opacity="0.6"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* City Name Label */}
                      <text
                        x={cx}
                        y={cy - 6}
                        textAnchor="middle"
                        fill={isSelected ? "#bef264" : isBaghdad ? "#ffffff" : "#d1d5db"}
                        fontSize={isBaghdad ? "11" : "9"}
                        fontWeight={isBaghdad || isSelected ? "bold" : "normal"}
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

            {/* Community Spots Plotted on Map */}
            {showSpots && (
              <g id="community-spots">
                {mapSpots.map((spot) => {
                  const [sx, sy] = projectToSvg(spot.lng, spot.lat);
                  const isSelected = selectedSpot?.id === spot.id;

                  return (
                    <g
                      key={`spot-marker-${spot.id}`}
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
                        fill="#bef264"
                        opacity={isSelected ? "0.35" : "0.15"}
                        className="animate-ping origin-center"
                      />
                      {/* Pin Circle */}
                      <circle
                        r={isSelected ? "6" : "4.5"}
                        fill={isSelected ? "#bef264" : "#a3e635"}
                        stroke="#0c1415"
                        strokeWidth="1.5"
                        filter="url(#glowPin)"
                      />
                      {/* Star icon inside for high ratings */}
                      <circle cx="0" cy="0" r="1.5" fill="#0c1415" />
                    </g>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Selected Spot Detail Popup Float */}
        {selectedSpot && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-20 p-4 rounded-2xl bg-[#0e1618]/95 backdrop-blur-md border border-[#bef264]/40 shadow-2xl space-y-2 animate-fadeIn text-right" dir="rtl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-white/80">
                  {selectedSpot.category} · {selectedSpot.governorate}
                </span>
                <h4 className="font-kufi font-bold text-sm text-white mt-1">
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

            <p className="text-xs text-white/70 line-clamp-2">{selectedSpot.notes}</p>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{selectedSpot.rating}</span>
                <span className="text-white/40 text-[10px]">({selectedSpot.reviewsCount} تقييم)</span>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`https://wa.me/${selectedSpot.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-bold"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span>واتساب</span>
                </a>
                <a
                  href={`tel:${selectedSpot.phone}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 text-[11px]"
                >
                  <Phone className="w-3 h-3" />
                  <span>اتصال</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Hovered Governorate Live Banner (Bottom Left) */}
        {hoveredGov && !selectedSpot && (
          <div className="absolute bottom-4 left-4 z-10 bg-black/80 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs font-mono space-y-1 text-white animate-fadeIn hidden sm:block text-right" dir="rtl">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#bef264] text-sm font-kufi">
                محافظة {hoveredGov.nameAr}
              </span>
              <span className="text-white/40">({hoveredGov.nameEn})</span>
            </div>
            <div className="text-white/70 text-[11px] flex items-center gap-3">
              <span>المركز: {hoveredGov.capital}</span>
              <span>السكان: {hoveredGov.population}</span>
            </div>
            <div className="text-[#bef264] text-[11px]">
              {spots.filter((s) => s.governorate === hoveredGov.nameAr).length} أماكن موثقة من المجتمع
            </div>
          </div>
        )}
      </div>

      {/* 4. Active Governorate Scope Header (when filtered) */}
      {selectedGov && (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#bef264]" />
            <span className="text-white/80">المحافظة المحددة:</span>
            <span className="font-bold text-[#bef264]">{selectedGov}</span>
            <span className="text-white/40">
              ({spots.filter((s) => s.governorate === selectedGov).length} أماكن متوفرة)
            </span>
          </div>
          <button
            onClick={() => setSelectedGov(null)}
            className="text-xs text-white/60 hover:text-white underline cursor-pointer"
          >
            إلغاء التحديد وتوسيع الرؤية لكل العراق
          </button>
        </div>
      )}
    </div>
  );
}
