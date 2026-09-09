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
  Trash2,
  Check,
} from "lucide-react";

interface IraqInteractiveMapProps {
  spots: LocalSpot[];
  onAddSpot?: (spot: LocalSpot) => void;
  onDeleteSpot?: (spotId: string) => void;
  selectedGovernorate?: string | null;
  onSelectGovernorate?: (govNameAr: string | null) => void;
}

// Map Tile Providers (100% free, zero billing, zero API key)
const TILE_PROVIDERS = {
  cartoDark: {
    name: "الوضع الليلي (CartoDB Dark)",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    subdomains: "abcd",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; CARTO',
    maxZoom: 20,
  },
  googleRoad: {
    name: "شوارع Google نظيفة (بدون محلات قديمة)",
    url: "https://mt1.google.com/vt/lyrs=m&apistyle=s.t:33|p.v:off&x={x}&y={y}&z={z}",
    subdomains: "",
    attribution: "&copy; Google Maps",
    maxZoom: 20,
  },
  googleRoadFull: {
    name: "شوارع Google (المحلات القديمة)",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    subdomains: "",
    attribution: "&copy; Google Maps",
    maxZoom: 20,
  },
  googleSat: {
    name: "أقمار صناعية Google",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    subdomains: "",
    attribution: "&copy; Google Maps Satellite",
    maxZoom: 20,
  },
  osmStandard: {
    name: "OpenStreetMap قياسي",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: "abc",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
};

const CATEGORIES = [
  "الكل",
  "أسواق وماركت",
  "تصليح وسبالت",
  "أفران ومخابز",
  "صيدليات وعيادات",
  "كوزمتك وعناية",
  "مطاعم ومقاهي",
  "معالم وسياحة",
];

export default function IraqInteractiveMap({
  spots,
  onAddSpot,
  onDeleteSpot,
  selectedGovernorate,
  onSelectGovernorate,
}: IraqInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activeTileLayerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accuracyCircleRef = useRef<any>(null);

  // States
  const [activeTileKey, setActiveTileKey] = useState<keyof typeof TILE_PROVIDERS>("googleRoad");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<LocalSpot | null>(null);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [closedLocations, setClosedLocations] = useState<Array<{ id: string; lat: number; lng: number }>>([]);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(5);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);
  // Add Place Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceCategory, setNewPlaceCategory] = useState("أسواق وماركت");
  const [newPlacePhone, setNewPlacePhone] = useState("");
  const [newPlaceNotes, setNewPlaceNotes] = useState("");

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    async function initLeaflet() {
      // Leaflet touches window on import; dynamic import required for Next.js SSR
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Center on Iraq (Baghdad center: 33.3152, 44.3661)
      const map = L.map(mapContainerRef.current, {
        center: [33.3152, 44.3661],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Zoom controls on bottom-left
      L.control.zoom({ position: "bottomleft" }).addTo(map);
      // Default Base Layer: Google Maps Streets (Free, clean, zero watermark)
      const baseLayer = L.tileLayer(TILE_PROVIDERS.googleRoad.url, {
        maxZoom: TILE_PROVIDERS.googleRoad.maxZoom,
        attribution: TILE_PROVIDERS.googleRoad.attribution,
      }).addTo(map);

      activeTileLayerRef.current = baseLayer;

      // Layer 2: Markers Feature Group
      const markersGroup = L.featureGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Map Click: Inspect coordinates or add custom place
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        setClickedLocation({
          lat: Math.round(e.latlng.lat * 100000) / 100000,
          lng: Math.round(e.latlng.lng * 100000) / 100000,
        });
      });
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Switch Tile Layers (Carto Dark, Google Streets, Google Satellite, OSM)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    async function changeTile() {
      // Leaflet touches window on import; dynamic import required for Next.js SSR
      const L = await import("leaflet");
      const map = mapInstanceRef.current;

      if (activeTileLayerRef.current) {
        map.removeLayer(activeTileLayerRef.current);
      }

      const prov = TILE_PROVIDERS[activeTileKey];
      const newLayer = L.tileLayer(prov.url, {
        subdomains: prov.subdomains || "abc",
        maxZoom: prov.maxZoom,
        attribution: prov.attribution,
      }).addTo(map);

      newLayer.bringToBack();
      activeTileLayerRef.current = newLayer;
    }

    changeTile();
  }, [activeTileKey]);

  // 3. Update Markers Overlay (Layer 2)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    async function renderMarkers() {
      // Leaflet touches window on import; dynamic import required for Next.js SSR
      const L = await import("leaflet");
      const markersGroup = markersGroupRef.current;
      markersGroup.clearLayers();

      const query = searchQuery.trim().toLowerCase();

      const visibleSpots = spots.filter((s) => {
        const matchGov = !selectedGovernorate || s.governorate === selectedGovernorate;
        const matchCat = activeCategory === "الكل" || s.category === activeCategory;
        const matchSearch =
          !query ||
          s.name.toLowerCase().includes(query) ||
          s.district.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.notes.toLowerCase().includes(query);

        return matchGov && matchCat && matchSearch;
      });

      visibleSpots.forEach((spot) => {
        const isGoogle = spot.source === "google";

        // Custom High-Quality Marker Pin
        const pinHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-2xl ${
              isGoogle
                ? "bg-sky-500 shadow-sky-500/50"
                : "bg-[#bef264] shadow-[#bef264]/50"
            } shadow-lg border-2 border-[#0c1415] flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-125">
              ${isGoogle ? "🏛️" : "🏪"}
            </div>
            <div class="absolute -bottom-1 w-2 h-2 rotate-45 ${
              isGoogle ? "bg-sky-500" : "bg-[#bef264]"
            }"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: pinHtml,
          className: "custom-leaflet-pin",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        const marker = L.marker([spot.lat, spot.lng], { icon });

        // Popup Card
        const popupHtml = `
          <div style="direction: rtl; font-family: sans-serif; min-width: 240px; max-width: 290px; padding: 4px;">
            <div style="font-size: 10px; font-weight: bold; color: ${isGoogle ? "#0284c7" : "#65a30d"}; margin-bottom: 2px;">
              ${isGoogle ? "معلم معتمد في خرائط Google" : "توثيق مجتمعي هسه"}
            </div>
            <div style="font-size: 15px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">
              ${spot.name}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              📍 ${spot.district}
            </div>
            <div style="font-size: 11px; color: #334155; background: #f8fafc; padding: 6px 8px; border-radius: 8px; margin-bottom: 8px; line-height: 1.4;">
              ${spot.notes}
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
              <span style="font-weight: bold; color: #d97706;">⭐ ${spot.rating} (${spot.reviewsCount} تقييم)</span>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                spot.name + " " + spot.district
              )}" target="_blank" rel="noopener noreferrer" style="color: #0284c7; text-decoration: none; font-weight: bold;">
                خرائط Google ↗
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, { maxWidth: 320 });

        marker.on("click", () => {
          setSelectedSpot(spot);
          if (onSelectGovernorate) onSelectGovernorate(spot.governorate);
        });

        markersGroup.addLayer(marker);
      });

      // Layer 2: Render Closed/Deleted Location Masks
      closedLocations.forEach((loc) => {
        const maskHtml = `
          <div class="flex items-center justify-center pointer-events-auto">
            <div class="px-2 py-0.5 rounded-md bg-red-600 text-white font-kufi font-bold text-[10px] shadow-lg border border-red-400 whitespace-nowrap flex items-center gap-1">
              <span>🚫</span>
              <span>مغلق نهائياً</span>
            </div>
          </div>
        `;
        const icon = L.divIcon({
          html: maskHtml,
          className: "closed-location-pin",
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });
        const marker = L.marker([loc.lat, loc.lng], { icon });
        marker.bindPopup(
          `<div style="direction: rtl; font-family: sans-serif; font-size: 11px; color: #dc2626; font-weight: bold; padding: 4px;">
            🚫 هذا المكان تم تأكيد إغلاقه وإزالته من الخريطة.
          </div>`
        );
        markersGroup.addLayer(marker);
      });
    }

    renderMarkers();
  }, [spots, searchQuery, activeCategory, selectedGovernorate, onSelectGovernorate, closedLocations]);

  // 4. GPS "Locate Me / أين أنا الآن"
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
        setUserLocation({ lat: latitude, lng: longitude });
        setGpsLoading(false);

        if (!mapInstanceRef.current) return;
        // Leaflet touches window on import; dynamic import required for Next.js SSR
        const L = await import("leaflet");
        const map = mapInstanceRef.current;

        // Fly directly to user's neighborhood down to street-level (zoom 16)
        map.flyTo([latitude, longitude], 16, { animate: true, duration: 1.5 });

        // Remove previous user marker
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
        if (accuracyCircleRef.current) map.removeLayer(accuracyCircleRef.current);

        // Pulsing User GPS Marker
        const userHtml = `
          <div class="relative flex items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-blue-500/30 animate-ping absolute"></div>
            <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-2xl relative z-10 flex items-center justify-center">
              <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
          </div>
        `;

        const userIcon = L.divIcon({
          html: userHtml,
          className: "user-radar-pin",
          iconSize: [48, 48],
          iconAnchor: [24, 24],
        });

        const marker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        marker.bindPopup(
          `<div style="direction: rtl; font-family: sans-serif; font-size: 13px; font-weight: bold; padding: 4px; color: #0284c7;">
            📍 أنت هنا الآن!
            <p style="font-size: 11px; font-weight: normal; color: #475569; margin: 4px 0 0 0;">
              المحلات والأماكن المجاورة تظهر حول هذا النطاق.
            </p>
          </div>`
        ).openPopup();

        userMarkerRef.current = marker;

        // Proximity radius ring around user
        const circle = L.circle([latitude, longitude], {
          radius: searchRadiusKm * 1000,
          color: "#38bdf8",
          fillColor: "#38bdf8",
          fillOpacity: 0.08,
          weight: 1.5,
          dashArray: "4, 6",
        }).addTo(map);

        accuracyCircleRef.current = circle;
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === 1) {
          setGpsError("يرجى تفعيل صلاحية الوصول إلى الموقع لمعرفة الأماكن القريبة حولك.");
        } else {
          setGpsError("تعذر الحصول على إشارة GPS بدقة. انقر على أي نقطة بالخريطة لتحديد مكانك.");
        }
      },
      { enableHighAccuracy: true, timeout: 9000 }
    );
  };

  // Nearby spots computed around user location
  const nearbySpots = userLocation
    ? spots
        .map((s) => ({
          ...s,
          dist: calculateDistanceKm(userLocation.lat, userLocation.lng, s.lat, s.lng),
        }))
        .filter((s) => s.dist <= searchRadiusKm)
        .sort((a, b) => a.dist - b.dist)
    : [];

  // Pan to spot
  const handlePanToSpot = (spot: LocalSpot) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([spot.lat, spot.lng], 16, { animate: true, duration: 1.2 });
    setSelectedSpot(spot);
  };

  // Quick Add Place Submit
  const handleQuickAddSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!clickedLocation || !newPlaceName.trim()) return;

    // Detect closest governorate
    let closestGov = IRAQ_GOVERNORATES[0];
    let minD = Infinity;
    IRAQ_GOVERNORATES.forEach((g) => {
      const d = calculateDistanceKm(clickedLocation.lat, clickedLocation.lng, g.lat, g.lng);
      if (d < minD) {
        minD = d;
        closestGov = g;
      }
    });

    const newSpot: LocalSpot = {
      id: `spot-usr-${Date.now()}`,
      name: newPlaceName.trim(),
      category: newPlaceCategory,
      governorate: closestGov.nameAr,
      governorateId: closestGov.id,
      district: `${closestGov.nameAr} — موقع محدد على الخريطة`,
      lat: clickedLocation.lat,
      lng: clickedLocation.lng,
      phone: newPlacePhone.trim() || "07700000000",
      whatsapp: (newPlacePhone.trim() || "07700000000").replace(/^0/, "964"),
      rating: 5.0,
      reviewsCount: 1,
      status: "مفتوح الآن",
      notes: newPlaceNotes.trim() || "محل معتمد من مجتمع المنطقة عبر الخريطة التفاعلية.",
      isVerified: true,
      source: "community",
      reviews: [
        {
          id: `rev-add-${Date.now()}`,
          author: "مستخدم هسه",
          rating: 5,
          comment: "تم تثبيت الموقع وإضافته لخدمة أهالي المحلة.",
          date: "الآن",
        },
      ],
    };

    if (onAddSpot) onAddSpot(newSpot);

    setShowAddModal(false);
    setNewPlaceName("");
    setNewPlacePhone("");
    setNewPlaceNotes("");
    setClickedLocation(null);
  };

  // Handle marking a clicked position as closed / deleted
  const handleMarkClosedAtLocation = () => {
    if (!clickedLocation) return;

    // Check if there is any spot within 70 meters
    let deletedCount = 0;
    spots.forEach((s) => {
      const d = calculateDistanceKm(clickedLocation.lat, clickedLocation.lng, s.lat, s.lng);
      if (d <= 0.08 && onDeleteSpot) {
        onDeleteSpot(s.id);
        deletedCount++;
      }
    });

    // Add closed mark mask at location
    setClosedLocations((prev) => [
      ...prev,
      { id: `closed-${Date.now()}`, lat: clickedLocation.lat, lng: clickedLocation.lng },
    ]);

    setDeleteNotice(
      deletedCount > 0
        ? "تم حذف المحل ووضع علامة (مغلق نهائياً) بنجاح."
        : "تم وضع علامة (مغلق نهائياً) وإخفاء المكان القديم من الخريطة."
    );
    setTimeout(() => setDeleteNotice(null), 4000);
    setClickedLocation(null);
  };

  return (
    <div className="space-y-3 sm:space-y-4" dir="rtl">
      {/* 1. Map Toolbar (Search, Layers, GPS Button) */}
      <div className="bg-[#0e1618] p-3 sm:p-4 rounded-3xl border border-white/10 shadow-lg space-y-3">
        {/* Row 1: Search & Locate Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في شوارع، أحياء، ومحلات العراق (مثلاً: الكرادة، المنصور، سبالت، قيمر)..."
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
          {/* Quick GPS "Locate Me" Button */}
          <button
            onClick={handleLocateMe}
            disabled={gpsLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0c1415] font-kufi font-bold text-xs sm:text-sm shadow-lg transition-all active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
            title="نقل الخريطة إلى موقعك الحالي وتحديد الأماكن المحيطة بك"
          >
            <LocateFixed className={`w-4 h-4 ${gpsLoading ? "animate-spin" : ""}`} />
            <span>{gpsLoading ? "جاري تحديد موقعك..." : "📍 الأماكن القريبة مني"}</span>
          </button>
        </div>

        {/* Row 2: Tile Switchers & Category Filter Chips */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pt-2 border-t border-white/5">
          {/* Tile Layer Selector */}
          <div className="flex items-center gap-1 bg-black/50 border border-white/10 p-1 rounded-xl text-xs font-mono shrink-0 overflow-x-auto no-scrollbar max-w-full">
            <span className="text-white/40 text-[10px] px-1 shrink-0">نوع الخريطة:</span>
            {(["cartoDark", "googleRoad", "googleSat", "osmStandard"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTileKey(key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] shrink-0 transition-colors cursor-pointer ${
                  activeTileKey === key
                    ? "bg-[#bef264] text-[#0c1415] font-bold shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {key === "cartoDark" && "الوضع الليلي (Carto)"}
                {key === "googleRoad" && "شوارع Google"}
                {key === "googleSat" && "أقمار Google"}
                {key === "osmStandard" && "OSM ملون"}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full py-0.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono shrink-0 transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#bef264] text-[#0c1415] font-bold"
                    : "bg-black/30 text-white/60 hover:text-white border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {gpsError && (
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
            {gpsError}
          </div>
        )}
        {deleteNotice && (
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{deleteNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Full Interactive Map Canvas (Leaflet + Dark/Google Tiles) */}
      <div className="relative w-full h-[540px] sm:h-[660px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#080c0d]">
        {/* Leaflet container */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Controls Overlay (Top Right) */}
        <div className="absolute top-3 right-3 z-10 pointer-events-auto flex flex-col gap-2">
          {/* Badge */}
          <div className="bg-[#0c1415]/95 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs font-mono text-white shadow-xl space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#bef264]">
              <Layers className="w-3.5 h-3.5" />
              <span>خريطة تفاعلية بالكامل (طبقتان)</span>
            </div>
            <div className="text-[10px] text-white/60 leading-relaxed">
              الطبقة 1: شوارع ومباني وأزقة العراق
              <br />
              الطبقة 2: أماكن مجتمعك وموقعك GPS
            </div>
          </div>

          {/* Radius Selector (when GPS is located) */}
          {userLocation && (
            <div className="bg-[#0c1415]/95 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-xs font-mono text-white shadow-xl space-y-1.5">
              <div className="text-[10px] text-white/60 flex items-center justify-between">
                <span>نطاق البحث:</span>
                <span className="font-bold text-[#bef264]">{searchRadiusKm} كم</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 3, 5, 10, 20].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSearchRadiusKm(r)}
                    className={`px-2 py-0.5 rounded-md text-[10px] cursor-pointer ${
                      searchRadiusKm === r
                        ? "bg-[#bef264] text-[#0c1415] font-bold"
                        : "bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    {r} كم
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Spot Float Card with Delete/Mark Closed Button */}
          {selectedSpot && (
            <div className="bg-[#0c1415]/95 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-xs font-mono text-white shadow-2xl space-y-2 max-w-[280px] animate-fadeIn">
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-[#bef264] leading-snug">{selectedSpot.name}</span>
                <button onClick={() => setSelectedSpot(null)} className="text-white/40 hover:text-white text-xs">✕</button>
              </div>
              <div className="text-[10px] text-white/60">{selectedSpot.district}</div>
              <div className="text-amber-300 font-bold text-[11px]">⭐ {selectedSpot.rating} ({selectedSpot.reviewsCount} تقييم)</div>

              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    if (onDeleteSpot) {
                      onDeleteSpot(selectedSpot.id);
                      setDeleteNotice(`تم حذف "${selectedSpot.name}" وإزالته من الخريطة.`);
                      setSelectedSpot(null);
                      setTimeout(() => setDeleteNotice(null), 4000);
                    }
                  }}
                  className="w-full py-1.5 px-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="إزالة هذا المحل من الخريطة لأنه مغلق أو تم نقله"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف المحل (مغلق نهائياً)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Click anywhere on map -> Actions: Add Place OR Delete/Mark Closed */}
        {clickedLocation && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[#0c1415]/95 backdrop-blur-md p-3 sm:p-3.5 rounded-3xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4 text-xs font-mono text-white animate-fadeIn max-w-[95vw]">
            <div className="text-center sm:text-right">
              <div className="font-bold text-[#bef264]">نقطة محددة على الخريطة:</div>
              <div className="text-[10px] text-white/60">
                {clickedLocation.lat}, {clickedLocation.lng}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-kufi font-bold text-xs cursor-pointer flex items-center gap-1 shadow-sm"
                title="إضافة محل أو مصلح جديد في هذه النقطة"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>أضف محلاً هنا</span>
              </button>

              <button
                onClick={handleMarkClosedAtLocation}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-kufi font-bold text-xs cursor-pointer flex items-center gap-1 shadow-sm"
                title="حذف أو وضع علامة مغلق نهائياً على المحل القديم في هذا المكان"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف المكان القديم (مغلق)</span>
              </button>

              <button
                onClick={() => setClickedLocation(null)}
                className="text-white/40 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Nearby Places Shelf (when user GPS is active) */}
      {userLocation && (
        <section className="p-4 sm:p-5 rounded-3xl bg-[#0e1618] border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-kufi font-bold text-white text-sm sm:text-base">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>المحلات والأماكن المجاورة لموقعك (ضمن {searchRadiusKm} كم):</span>
              <span className="text-xs font-mono text-[#bef264] font-bold">
                {nearbySpots.length} مكان
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/40 hidden sm:inline">
              انقر على أي بطاقة للانتقال المباشر إليها
            </span>
          </div>

          {nearbySpots.length === 0 ? (
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center text-xs font-mono text-white/60">
              لا توجد أماكن موثقة حالياً ضمن مسافة {searchRadiusKm} كم من موقعك. وسّع النطاق إلى 10 كم أو انقر على الخريطة لإضافة مكانك!
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
      {showAddModal && clickedLocation && (
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
                الإحداثيات الجغرافية: {clickedLocation.lat}, {clickedLocation.lng}
              </div>

              <div className="space-y-1">
                <label className="text-white/80 block">اسم المحل أو الورشة</label>
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
                  {CATEGORIES.filter((c) => c !== "الكل").map((c) => (
                    <option key={c} value={c} className="bg-[#0e1618]">
                      {c}
                    </option>
                  ))}
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
                  className="px-4 py-2 rounded-xl bg-[#bef264] hover:bg-[#a3e635] text-[#0c1415] font-bold cursor-pointer"
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
