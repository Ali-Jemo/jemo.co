"use client";

import React, { useState } from "react";
import { Fuel, MapPin, Clock, AlertTriangle, CheckCircle, ThumbsUp } from "lucide-react";

type FuelType = "محسن" | "عادي" | "سوبر" | "كاز";

interface FuelPrice {
  type: FuelType;
  price: number;
  label: string;
}

const FUEL_PRICES: FuelPrice[] = [
  { type: "محسن", price: 850, label: "بنزين محسن (95)" },
  { type: "عادي", price: 450, label: "بنزين عادي" },
  { type: "سوبر", price: 1000, label: "بنزين سوبر (98)" },
  { type: "كاز", price: 400, label: "كاز / ديزل" },
];

type CrowdStatus = "انسيابي بدون طابور" | "طابور خفيف 5-10 دقائق" | "ازدحام";

interface Station {
  id: string;
  name: string;
  location: string;
  availableFuels: FuelType[];
  status: CrowdStatus;
  lastUpdated: string;
}

const INITIAL_STATIONS: Station[] = [
  {
    id: "1",
    name: "محطة اليرموك",
    location: "اليرموك - بغداد",
    availableFuels: ["محسن", "عادي"],
    status: "طابور خفيف 5-10 دقائق",
    lastUpdated: "قبل 10 دقائق",
  },
  {
    id: "2",
    name: "محطة موسى بن نصير",
    location: "الكرادة - بغداد",
    availableFuels: ["محسن", "عادي", "سوبر", "كاز"],
    status: "انسيابي بدون طابور",
    lastUpdated: "قبل 5 دقائق",
  },
  {
    id: "3",
    name: "محطة الجيل العربي",
    location: "المنصور - بغداد",
    availableFuels: ["محسن", "عادي"],
    status: "ازدحام",
    lastUpdated: "قبل 20 دقيقة",
  },
  {
    id: "4",
    name: "محطة الحرية",
    location: "الحرية - بغداد",
    availableFuels: ["عادي", "كاز"],
    status: "انسيابي بدون طابور",
    lastUpdated: "قبل 2 دقيقة",
  },
];

const getStatusColor = (status: CrowdStatus) => {
  switch (status) {
    case "انسيابي بدون طابور":
      return "bg-[#cef79e] text-[#222f30]";
    case "طابور خفيف 5-10 دقائق":
      return "bg-amber-100 text-amber-800";
    case "ازدحام":
      return "bg-rose-100 text-rose-800";
  }
};

const getStatusIcon = (status: CrowdStatus) => {
  switch (status) {
    case "انسيابي بدون طابور":
      return <CheckCircle className="w-4 h-4 mr-1" />;
    case "طابور خفيف 5-10 دقائق":
      return <Clock className="w-4 h-4 mr-1" />;
    case "ازدحام":
      return <AlertTriangle className="w-4 h-4 mr-1" />;
  }
};

export function FuelStationTracker() {
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [activeFilter, setActiveFilter] = useState<FuelType | "الكل">("الكل");

  const handleReport = (id: string, newStatus: CrowdStatus) => {
    // ponytail: local state mock for reporting. Real app would call API.
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus, lastUpdated: "الآن" } : s))
    );
  };

  const filteredStations = stations.filter(
    (s) => activeFilter === "الكل" || s.availableFuels.includes(activeFilter)
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6" dir="rtl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#222f30] mb-2 flex items-center gap-2">
          <Fuel className="w-6 h-6 text-[#a7e26e]" />
          موقف محطات الوقود
        </h2>
        <p className="text-[#55696a]">
          تابع حالة الطوابير وتوفر الوقود في محطات بغداد والمحافظات بلمحة واحدة.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {FUEL_PRICES.map((fuel) => (
          <div
            key={fuel.type}
            className="bg-white border border-[#e4e3e3] shadow-xs rounded-xl p-4 text-center cursor-pointer hover:border-[#a7e26e] transition-colors"
            onClick={() => setActiveFilter(activeFilter === fuel.type ? "الكل" : fuel.type)}
          >
            <div className={`font-semibold mb-1 ${activeFilter === fuel.type ? "text-[#a7e26e]" : "text-[#222f30]"}`}>
              {fuel.label}
            </div>
            <div className="text-sm text-[#55696a]">{fuel.price} د.ع/لتر</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="bg-white border border-[#e4e3e3] shadow-xs rounded-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-semibold text-[#222f30]">{station.name}</h3>
              <div className="flex items-center gap-1 text-sm text-[#55696a]">
                <MapPin className="w-4 h-4" />
                {station.location}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {station.availableFuels.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-gray-100 text-[#55696a] rounded-md text-xs font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3 min-w-[200px]">
              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                  station.status
                )}`}
              >
                {getStatusIcon(station.status)}
                <span className="mr-1">{station.status}</span>
              </div>
              <div className="text-xs text-[#55696a]">
                آخر تحديث: {station.lastUpdated}
              </div>

              <div className="flex gap-2 w-full mt-2">
                <button
                  onClick={() => handleReport(station.id, "انسيابي بدون طابور")}
                  className="flex-1 py-1.5 bg-gray-50 hover:bg-[#cef79e] border border-[#e4e3e3] rounded-lg text-xs font-medium text-[#222f30] transition-colors"
                  title="بلّغ: انسيابي"
                >
                  انسيابي
                </button>
                <button
                  onClick={() => handleReport(station.id, "ازدحام")}
                  className="flex-1 py-1.5 bg-gray-50 hover:bg-rose-100 border border-[#e4e3e3] rounded-lg text-xs font-medium text-[#222f30] transition-colors"
                  title="بلّغ: ازدحام"
                >
                  ازدحام
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
