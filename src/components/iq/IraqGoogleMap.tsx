"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  LocalSpot,
  IRAQ_GOVERNORATES,
  calculateDistanceKm,
} from "@/lib/data/iq-map-data";
import {
  Navigation,
  Search,
  Layers,
  Plus,
  LocateFixed,
} from "lucide-react";

interface IraqGoogleMapProps {
  spots: LocalSpot[];
  onAddSpot?: (spot: LocalSpot) => void;
  selectedGovernorate?: string | null;
  onSelectGovernorate?: (govNameAr: string | null) => void;
}

// Google Maps free tile layers (no API key required)
const GOOGLE_TILE_LAYERS = {
  roadmap: {
    name: "خرائط Google (طرق وشوارع)",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps",
    maxZoom: 20,
  },
  satellite: {
    name: "أقمار صناعية Google (مع الشوارع)",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps Satellite",
    maxZoom: 20,
  },
  terrain: {
    name: "تضاريس Google (طبيعة وجبال)",
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    attribution: "&copy; Google Maps Terrain",
    maxZoom: 20,
  },
  dark: {
    name: "الوضع الليلي الذكي (Dark)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap & CartoDB",
    maxZoom: 19,
  },
};

export default function IraqGoogleMap({
  spots,
  onAddSpot,
  selectedGovernorate,
  onSelectGovernorate,
}: IraqGoogleMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const radiusCircleRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTileLayerRef = useRef<any>(null);

  // States
  const [activeTileKey, setActiveTileKey] = useState<keyof typeof GOOGLE_TILE_LAYERS>("roadmap");
  const [sourceFilter, setSourceFilter] = useState<"all" | "google" | "community">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [selectedSpot, setSelectedSpot] = useState<LocalSpot | null>(null);
  const [clickedCoords, setClickedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Quick Add Place Modal on map click
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("أسواق وماركت");
  const [newPlaceNotes, setNewPlaceNotes] = useState("");
  const [newPlacePhone, setNewPlacePhone] = useState("");

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Default center: Baghdad (Center of Iraq)
      const map = L.map(mapContainerRef.current, {
        center: [33.3152, 44.3661],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      // Add zoom control at bottom-left
      L.control.zoom({ position: "bottomleft" }).addTo(map);

      // Add default Google Roadmap Tile layer
      const defaultLayer = L.tileLayer(GOOGLE_TILE_LAYERS.roadmap.url, {
        attribution: GOOGLE_TILE_LAYERS.roadmap.attribution,
        maxZoom: GOOGLE_TILE_LAYERS.roadmap.maxZoom,
      }).addTo(map);

      activeTileLayerRef.current = defaultLayer;

      // Feature group for markers
      const markersLayer = L.featureGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      // Click on map to inspect coords or add place
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        setClickedCoords({
          lat: Math.round(lat * 10000) / 10000,
          lng: Math.round(lng * 10000) / 10000,
        });
      });
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when user switches between Roadmap, Satellite, Terrain, Dark
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    async function switchLayer() {
      const L = await import("leaflet");
      const map = mapInstanceRef.current;

      if (activeTileLayerRef.current) {
        map.removeLayer(activeTileLayerRef.current);
      }

      const cfg = GOOGLE_TILE_LAYERS[activeTileKey];
      const newLayer = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        maxZoom: cfg.maxZoom,
      }).addTo(map);

      // Keep tile layer in the background
      newLayer.bringToBack();
      activeTileLayerRef.current = newLayer;
    }

    switchLayer();
  }, [activeTileKey]);

  // Update Layer 2: Places and Markers Overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    async function updateMarkers() {
      const L = await import("leaflet");
      const markersLayer = markersLayerRef.current;
      markersLayer.clearLayers();

      const filtered = spots.filter((s) => {
        const matchesGov = !selectedGovernorate || s.governorate === selectedGovernorate;
        const matchesSource =
          sourceFilter === "all" ||
          (sourceFilter === "google" && s.source === "google") ||
          (sourceFilter === "community" && s.source === "community");
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          s.name.toLowerCase().includes(query) ||
          s.district.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query);

        return matchesGov && matchesSource && matchesSearch;
      });

      filtered.forEach((spot) => {
        const isGoogle = spot.source === "google";

        // Custom HTML Marker Icon
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-full ${
              isGoogle
                ? "bg-sky-500 shadow-sky-500/50"
                : "bg-[#bef264] shadow-[#bef264]/50"
            } shadow-lg border-2 border-[#0e1618] flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-125">
              ${isGoogle ? "🏛️" : "🏪"}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${
              isGoogle ? "bg-sky-500" : "bg-[#bef264]"
            }"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-map-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon: customIcon });

        // Popup Content
        const popupContent = `
          <div style="direction: rtl; font-family: sans-serif; min-width: 220px; max-width: 280px; padding: 4px;">
            <div style="font-size: 11px; color: ${isGoogle ? "#0284c7" : "#65a30d"}; font-weight: bold; margin-bottom: 2px;">
              ${isGoogle ? "معلم معتمد في خرائط Google" : "توثيق مجتمعي هسه"}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 4px;">
              ${spot.name}
            </div>
            <div style="font-size: 11px; color: #4b5563; margin-bottom: 6px;">
              📍 ${spot.district}
            </div>
            <div style="font-size: 11px; color: #374151; background: #f3f4f6; padding: 6px; border-radius: 8px; margin-bottom: 8px;">
              ${spot.notes}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #e5e7eb; padding-top: 6px;">
              <span style="font-weight: bold; color: #d97706;">⭐ ${spot.rating} (${spot.reviewsCount})</span>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                spot.name + " " + spot.district
              )}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: none; font-weight: bold;">
                Google Maps ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300 });

        marker.on("click", () => {
          setSelectedSpot(spot);
          if (onSelectGovernorate) onSelectGovernorate(spot.governorate);
        });

        markersLayer.addLayer(marker);
      });
    }

    updateMarkers();
  }, [spots, sourceFilter, searchQuery, selectedGovernorate]);

  // Handle GPS Locate User ("أين أنا؟ / حدد موقعي")
  const handleLocateMe = () => {
    if (!("geolocation" in navigator)) {
      setGpsError("خاصية تحديد الموقع غير مدعومة في متصفحك.");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        setGpsLoading(false);

        if (!mapInstanceRef.current) return;
        const L = await import("leaflet");
        const map = mapInstanceRef.current;

        // Fly camera smoothly to user's location
        map.flyTo([latitude, longitude], 14, { duration: 1.5 });

        // Remove old user marker/circle if exists
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
        if (radiusCircleRef.current) map.removeLayer(radiusCircleRef.current);

        // Pulsing User GPS Marker Icon
        const userIconHtml = `
          <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 rounded-full bg-blue-500/30 animate-ping absolute"></div>
            <div class="w-5 h-5 rounded-full bg-blue-500 border-2 border-white shadow-xl relative z-10 flex items-center justify-center">
              <div class="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userIconHtml,
          className: "user-gps-pin",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const userMarker = L.marker([latitude, longitude], { icon: userIcon })
          .addTo(map)
          .bindPopup(
            `<div style="direction: rtl; font-family: sans-serif; font-size: 12px; font-weight: bold; padding: 4px;">
              📍 أنت هنا (موقعك الحالي عبر GPS)
            </div>`
          );
        userMarkerRef.current = userMarker;

        // Proximity Radius Circle
        const circle = L.circle([latitude, longitude], {
          radius: radiusKm * 1000,
          color: "#38bdf8",
          fillColor: "#38bdf8",
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: "4, 6",
        }).addTo(map);
        radiusCircleRef.current = circle;
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError("يرجى السماح بصلاحية الوصول للموقع في المتصفح لتحديد مكانك.");
        } else {
          setGpsError("تعذر التقاط إشارة GPS، يمكنك النقر على أي نقطة بالخريطة لتحديد مكانك.");
        }
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  // Compute nearby places around user
  const nearbySpots = userCoords
    ? spots
        .map((s) => ({
          ...s,
          dist: calculateDistanceKm(userCoords.lat, userCoords.lng, s.lat, s.lng),
        }))
        .filter((s) => s.dist <= radiusKm)
        .sort((a, b) => a.dist - b.dist)
    : [];

  // Pan to spot
  const handlePanToSpot = (spot: LocalSpot) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([spot.lat, spot.lng], 16, { duration: 1.2 });
    setSelectedSpot(spot);
  };

  // Submit quick spot at clicked position
  const handleQuickAddSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!clickedCoords || !newPlaceName.trim()) return;

    // Detect nearest governorate
    let closestGov = IRAQ_GOVERNORATES[0];
    let minD = Infinity;
    IRAQ_GOVERNORATES.forEach((g) => {
      const d = calculateDistanceKm(clickedCoords.lat, clickedCoords.lng, g.lat, g.lng);
      if (d < minD) {
        minD = d;
        closestGov = g;
      }
    });

    const newSpot: LocalSpot = {
      id: `custom-spot-${Date.now()}`,
      name: newPlaceName.trim(),
      category: newPlaceCategory,
      governorate: closestGov.nameAr,
      governorateId: closestGov.id,
      district: `${closestGov.nameAr} — موقع مخصص على الخريطة`,
      lat: clickedCoords.lat,
      lng: clickedCoords.lng,
      phone: newPlacePhone.trim() || "07700000000",
      whatsapp: (newPlacePhone.trim() || "07700000000").replace(/^0/, "964"),
      rating: 5.0,
      reviewsCount: 1,
      status: "مفتوح الآن",
      notes: newPlaceNotes.trim() || "مكان أضيف بواسطة مستخدم على خريطة Google المباشرة.",
      isVerified: true,
      source: "community",
      reviews: [
        {
          id: `rev-custom-${Date.now()}`,
          author: "مستخدم هسه",
          rating: 5,
          comment: "تمت إضافة الموقع وتثبيت إحداثياته الدقيقة على خريطة هسه.",
          date: "اليوم",
        },
      ],
    };

    if (onAddSpot) onAddSpot(newSpot);

    setShowAddModal(false);
    setNewPlaceName("");
    setNewPlaceNotes("");
    setNewPlacePhone("");
    setClickedCoords(null);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* 1. Map Toolbar (Layer 1: Google Tiles & Layer 2: Controls) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0e1618] p-3 sm:p-4 rounded-3xl border border-white/10 shadow-lg">
        {/* Search Bar */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في شوارع ومعالم العراق (مثلاً: الكرادة، المتنبي، المنصور، العشار)..."
            className="w-full h-11 pr-10 pl-4 bg-black/40 border border-white/10 focus:border-[#bef264] rounded-2xl text-white text-xs sm:text-sm font-sans outline-none"
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

        {/* Source Filter: Google Landmarks vs Our Community Places */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono shrink-0">
          <button
            onClick={() => setSourceFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              sourceFilter === "all"
                ? "bg-[#bef264] text-[#0e1618] font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
          >
            الكل ({spots.length})
          </button>
          <button
            onClick={() => setSourceFilter("google")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              sourceFilter === "google"
                ? "bg-sky-500 text-white font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-300" />
            <span>معالم Google</span>
          </button>
          <button
            onClick={() => setSourceFilter("community")}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
              sourceFilter === "community"
                ? "bg-emerald-500 text-white font-bold shadow-xs"
                : "text-white/60 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            <span>أماكننا وتوثيقاتنا</span>
          </button>
        </div>

        {/* Google Map Mode Pickers & GPS Button */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          {/* Tile Switcher Dropdown */}
          <div className="flex items-center rounded-xl bg-black/40 border border-white/10 p-0.5 text-xs font-mono">
            {(["roadmap", "satellite", "terrain", "dark"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveTileKey(mode)}
                className={`px-2.5 py-1.5 rounded-lg transition-colors text-[11px] cursor-pointer ${
                  activeTileKey === mode
                    ? "bg-[#bef264] text-[#0e1618] font-bold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {mode === "roadmap" && "شوارع Google"}
                {mode === "satellite" && "أقمار Google"}
                {mode === "terrain" && "تضاريس"}
                {mode === "dark" && "داكن"}
              </button>
            ))}
          </div>

          {/* GPS Button ("أين أنا؟ / حدد موقعي") */}
          <button
            onClick={handleLocateMe}
            disabled={gpsLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-kufi font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="تحديد موقعك الحالي على خريطة Google المباشرة"
          >
            <LocateFixed className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
            <span>{gpsLoading ? "جاري التحديد..." : "📍 أين أنا (GPS)"}</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
          {gpsError}
        </div>
      )}

      {/* 2. Interactive Map Container (Full Google Street Map + Overlay) */}
      <div className="relative w-full h-[520px] sm:h-[640px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
        {/* Leaflet map div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Controls Overlay on Map (Top Right) */}
        <div className="absolute top-4 right-4 z-10 pointer-events-auto flex flex-col gap-2">
          <div className="bg-[#0e1618]/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs font-mono text-white shadow-xl space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#bef264]">
              <Layers className="w-3.5 h-3.5" />
              <span>خريطة بطبقتين (Google + أماكننا)</span>
            </div>
            <div className="text-[10px] text-white/60">
              الطبقة 1: شوارع ومباني Google الحقيقية
              <br />
              الطبقة 2: أماكننا ومعالم العراق وموقعك
            </div>
          </div>

          {selectedSpot && (
            <div className="bg-[#0e1618]/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs font-mono text-white shadow-xl space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#bef264]">{selectedSpot.name}</span>
                <button onClick={() => setSelectedSpot(null)} className="text-white/40 hover:text-white text-xs">✕</button>
              </div>
              <div className="text-[10px] text-white/60">{selectedSpot.district} · {selectedSpot.category}</div>
            </div>
          )}
          {/* Proximity Radius Selector when User Location is active */}
          {userCoords && (
            <div className="bg-[#0e1618]/90 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs font-mono text-white shadow-xl space-y-1.5">
              <div className="text-[10px] text-white/60 flex items-center justify-between">
                <span>نطاق البحث حولك:</span>
                <span className="font-bold text-[#bef264]">{radiusKm} كم</span>
              </div>
              <div className="flex items-center gap-1">
                {[2, 5, 10, 25].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusKm(r)}
                    className={`px-2 py-0.5 rounded-md text-[10px] cursor-pointer ${
                      radiusKm === r
                        ? "bg-[#bef264] text-[#0e1618] font-bold"
                        : "bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    {r} كم
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Click on Map Floating Action Badge (Bottom Center) */}
        {clickedCoords && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#0e1618]/95 backdrop-blur-md p-3 rounded-2xl border border-[#bef264]/40 shadow-2xl flex items-center gap-3 text-xs font-mono text-white animate-fadeIn">
            <div className="space-y-0.5">
              <div className="font-bold text-[#bef264]">نقطة محددة على الخريطة:</div>
              <div className="text-[11px] text-white/70">
                {clickedCoords.lat}, {clickedCoords.lng}
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0e1618] font-kufi font-bold text-xs cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>أضف محلك هنا</span>
            </button>

            <button
              onClick={() => setClickedCoords(null)}
              className="text-white/40 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 3. Nearby Places Around You (Live Proximity Shelf) */}
      {userCoords && (
        <section className="p-4 sm:p-5 rounded-3xl bg-[#0e1618] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-kufi font-bold text-white text-sm sm:text-base">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span>الأماكن المحيطة بك (ضمن نطاق {radiusKm} كم):</span>
              <span className="text-xs font-mono text-[#bef264] font-bold">
                {nearbySpots.length} مكان
              </span>
            </div>
            <span className="text-[11px] font-mono text-white/40">
              انقر على أي بطاقة للتحليق إليها على الخريطة
            </span>
          </div>

          {nearbySpots.length === 0 ? (
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center text-xs font-mono text-white/60">
              لا توجد أماكن موثقة حالياً ضمن مسافة {radiusKm} كم من موقعك. وسّع النطاق إلى 25 كم أو انقر على الخريطة لإضافة مكان جديد!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {nearbySpots.map((spot) => (
                <div
                  key={spot.id}
                  onClick={() => handlePanToSpot(spot)}
                  className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-[#bef264]/40 transition-all cursor-pointer space-y-1.5 group shadow-sm"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-emerald-300 font-bold">
                      {spot.dist < 1 ? "أقل من 1 كم" : `${spot.dist} كم عنك`}
                    </span>
                    <span className="text-amber-300 font-bold">⭐ {spot.rating}</span>
                  </div>
                  <h4 className="font-kufi font-bold text-xs text-white group-hover:text-[#bef264] transition-colors line-clamp-1">
                    {spot.name}
                  </h4>
                  <p className="text-[11px] text-white/60 line-clamp-1 font-mono">
                    {spot.district}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Add Place Modal on Clicked Position */}
      {showAddModal && clickedCoords && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0e1618] border border-white/20 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 font-kufi font-bold text-white text-base">
                <Plus className="w-4 h-4 text-[#bef264]" />
                <span>إضافة محل عند النقطة المحددة</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white/70">
                الإحداثيات الجغرافية: {clickedCoords.lat}, {clickedCoords.lng}
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">اسم المحل أو المعلم</label>
                <input
                  type="text"
                  required
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  placeholder="مثال: أسواق دجلة، ورشة أبو أحمد للسبالت"
                  className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">التصنيف</label>
                <select
                  value={newPlaceCategory}
                  onChange={(e) => setNewPlaceCategory(e.target.value)}
                  className="w-full h-10 px-2.5 bg-[#14221b] border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                >
                  <option value="أسواق وماركت" className="bg-[#0e1618]">أسواق وماركت</option>
                  <option value="تصليح وسبالت" className="bg-[#0e1618]">تصليح وسبالت</option>
                  <option value="أفران ومخابز" className="bg-[#0e1618]">أفران ومخابز</option>
                  <option value="صيدليات وعيادات" className="bg-[#0e1618]">صيدليات وعيادات</option>
                  <option value="كوزمتك وعناية" className="bg-[#0e1618]">كوزمتك وعناية</option>
                  <option value="مطاعم ومقاهي" className="bg-[#0e1618]">مطاعم ومقاهي</option>
                  <option value="معالم وسياحة" className="bg-[#0e1618]">معالم وسياحة</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">رقم الهاتف أو الواتساب</label>
                <input
                  type="text"
                  value={newPlacePhone}
                  onChange={(e) => setNewPlacePhone(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="w-full h-10 px-3 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">ملاحظات وخدمات المكان</label>
                <textarea
                  rows={2}
                  value={newPlaceNotes}
                  onChange={(e) => setNewPlaceNotes(e.target.value)}
                  placeholder="توصيل سريع، أسعار جملة، مصلح أمين..."
                  className="w-full p-2.5 bg-black/40 border border-white/15 focus:border-[#bef264] rounded-xl text-white outline-none resize-none font-sans"
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
                  className="px-4 py-2 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0e1618] font-bold cursor-pointer"
                >
                  تثبيت المكان على الخريطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
