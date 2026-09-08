"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  GraduationCap, 
  Users, 
  ShieldCheck 
} from "lucide-react";

export default function ApplicationsAdminPage() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d131f] text-slate-100 overflow-hidden font-sans">
      {/* Top Admin Control Strip */}
      <header className="h-14 bg-[#131d2e] border-b border-slate-800/80 px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-md">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700/60"
          >
            <ArrowRight className="w-4 h-4 text-emerald-400" />
            <span>مركز لوحات التحكم</span>
          </Link>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>لوحة إدارة الطلبات والمتقدمين</span>
            </span>
            <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              jemo-admin v4.9
            </span>
          </div>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            title="إعادة تحميل اللوحة"
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          
          <Link
            href="/admin-app/student.html"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors border border-slate-700/50"
          >
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span>بوابة الطالب</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>

          <Link
            href="/admin-app/index.html"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium transition-colors border border-emerald-500/30"
          >
            <span>فتح في نافذة مستقلة</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "تصغير" : "ملء الشاشة"}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Embedded jemo-admin Dashboard */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] relative bg-[#0f172a]">
        <iframe
          key={iframeKey}
          src="/admin-app/index.html"
          title="Jemo Applications Dashboard"
          className="w-full h-full border-0"
          allow="camera; microphone; clipboard-read; clipboard-write;"
        />
      </main>
    </div>
  );
}
