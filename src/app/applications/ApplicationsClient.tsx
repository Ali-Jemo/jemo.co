"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search, X, User, Layers, ShieldCheck, ExternalLink,
  Hourglass, XCircle, CheckCircle2,
  ArrowUpRight, Activity
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface Application {
  id: string;
  name: string;
  email: string;
  created_at: string;
  section: string;
  status: "accepted" | "pending" | "rejected";
  experience: string;
  hours: string;
  portfolio?: string;
  motivation?: string;
  contract_id?: string;
}

const STATUS_ICONS: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 size={16} />,
  pending: <Hourglass size={16} />,
  rejected: <XCircle size={16} />,
};

const STATUS_LABELS: Record<string, string> = {
  accepted: "مقبول",
  pending: "قيد المراجعة",
  rejected: "مرفوض",
};

const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-semibold",
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 font-semibold",
  rejected: "bg-rose-500/10 text-rose-600 border-rose-500/20 font-semibold opacity-70",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-IQ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  const masked = name.length > 2 ? name[0] + "•••" + name[name.length - 1] : name[0] + "••";
  return `${masked}@${domain}`;
}

export default function ApplicationsClient() {
    const [apps, setApps] = useState<Application[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [mounted, setMounted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchApps = useCallback(async (silent = false) => {
    if (!silent) setInitialLoading(true);
    else setIsRefreshing(true);

    try {
      const res = await fetch("/api/public/applications");
      if (res.ok) {
        const data = await res.json();
        setApps(data);
        setError(false);
        setLastUpdate(new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" }));
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      setError(true);
    } finally {
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
    const interval = setInterval(() => fetchApps(true), 20000);
    return () => clearInterval(interval);
  }, [fetchApps]);

  
  const filteredApps = useMemo(() => {
    const searchLower = search.toLowerCase();
    return apps.filter((app) => {
      const matchesSearch =
        (app.name?.toLowerCase() || "").includes(searchLower) ||
        (app.section?.toLowerCase() || "").includes(searchLower) ||
        (app.experience?.toLowerCase() || "").includes(searchLower);
      const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [apps, search, selectedStatus]);

  const stats = useMemo(() => ({
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  }), [apps]);

  return (
    <div className="w-full relative bg-[var(--bg)] min-h-screen pb-32 font-kufi selection:bg-[var(--surface-2)] selection:text-[var(--ink)]">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%)" }} />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 70%)" }} />
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30" style={{ backgroundImage: 'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
      <div className="relative z-10 pt-[160px] px-6 max-w-7xl mx-auto">
        
        {/* HEADER & LIVE INDICATOR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--brand)]/20 bg-[var(--brand)]/5 text-[var(--brand)] text-xs font-mono mb-6 shadow-xs">
              <Activity size={14} className={isRefreshing ? "animate-pulse" : ""} />
              {mounted && lastUpdate ? (
                <span suppressHydrationWarning className="tracking-widest">LIVE SYSTEM • LAST UPDATE: {lastUpdate}</span>
              ) : (
                <span className="tracking-widest">LIVE SYSTEM INITIALIZING...</span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--ink)] leading-tight">
              سجل <span className="text-[var(--ink)]/70">القبولات الشفاف</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--ink)]/50 max-w-2xl">
              نظام لا مركزي يعرض جميع طلبات الانضمام لـ jemo labs فورياً. لا واسطات، لا غرف مغلقة.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/apply" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold !text-white transition-all duration-300 bg-gradient-to-r from-[var(--brand-700)] to-[var(--brand)] rounded-xl overflow-hidden shadow-[0_10px_20px_-10px_var(--brand)] hover:shadow-[0_15px_30px_-10px_var(--brand)] hover:-translate-y-1">
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2 font-kufi">
                تقديم طلب انضمام
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {/* BENTO STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "إجمالي الطلبات", value: stats.total, icon: <Layers size={24} />, bg: "bg-[var(--surface)]", color: "text-[var(--ink)]", hover: "group-hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.15)] group-hover:border-[var(--brand)]/30" },
            { label: "قيد المراجعة", value: stats.pending, icon: <Hourglass size={24} />, bg: "bg-[var(--surface)]", color: "text-amber-500", hover: "group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.15)] group-hover:border-amber-500/30" },
            { label: "النخبة المقبولة", value: stats.accepted, icon: <ShieldCheck size={24} />, bg: "bg-[var(--brand)]/5 border-[var(--brand)]/20", color: "text-[var(--brand)]", hover: "group-hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.3)] group-hover:border-[var(--brand)]/50 group-hover:-translate-y-1" },
            { label: "طلبات مرفوضة", value: stats.rejected, icon: <XCircle size={24} />, bg: "bg-[var(--surface)]", color: "text-red-500/70", hover: "group-hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.1)] group-hover:border-red-500/20" },
          ].map((stat, i) => (
            <div key={i} className={`p-5 sm:p-6 rounded-2xl border border-[var(--line)] flex flex-col relative overflow-hidden group transition-all duration-300 ${stat.bg} ${stat.hover}`}>
              <div className={`absolute top-0 right-0 p-5 sm:p-6 opacity-20 group-hover:opacity-40 transition-all group-hover:scale-110 group-hover:-rotate-6 duration-500 ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="text-xs sm:text-sm font-mono opacity-60 mb-3 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</div>
              <div className={`text-4xl md:text-5xl font-bold font-mono mt-auto ${stat.color}`}>
                {initialLoading ? "—" : stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* FILTER & SEARCH */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow max-w-md group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center w-full h-14 rounded-xl bg-[var(--surface)] border border-[var(--line)] overflow-hidden focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/20 transition-all shadow-sm">
              <div className="pl-4 pr-3 text-[var(--ink)]/40 group-focus-within:text-[var(--brand)] transition-colors"><Search size={18} /></div>
              <input
                type="text"
                placeholder="ابحث بالاسم، التخصص، أو الخبرة..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none text-[var(--ink)] placeholder-white/30 text-sm font-kufi px-2"
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="flex bg-[var(--surface)] border border-[var(--line)] rounded-xl p-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shadow-sm">
            {[
              { id: "all", label: "الكل" },
              { id: "pending", label: "قيد المراجعة" },
              { id: "accepted", label: "المقبولين" },
              { id: "rejected", label: "المرفوضين" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id as any)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  selectedStatus === tab.id
                    ? "bg-[var(--brand)] text-white shadow-md"
                    : "text-[var(--ink)]/50 hover:text-[var(--ink)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* APPLICATIONS GRID */}
        {initialLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] animate-pulse">
                <div className="flex gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)]" />
                  <div className="space-y-2 flex-grow mt-1">
                    <div className="h-4 w-1/2 bg-[var(--surface-2)] rounded" />
                    <div className="h-3 w-1/3 bg-[var(--surface-2)] rounded" />
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-3 w-full bg-[var(--surface-2)] rounded" />
                  <div className="h-3 w-3/4 bg-[var(--surface-2)] rounded" />
                </div>
                <div className="pt-4 border-t border-[var(--line)] flex justify-between mt-auto">
                  <div className="h-6 w-20 bg-[var(--surface-2)] rounded-md" />
                  <div className="h-4 w-16 bg-[var(--surface-2)] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="w-full py-32 flex flex-col items-center justify-center border border-red-500/20 rounded-3xl bg-red-500/5 text-center px-6">
            <XCircle size={48} className="text-red-500 mb-6" />
            <p className="text-xl text-red-200">فشل في الاتصال بقاعدة البيانات.</p>
            <button onClick={() => fetchApps()} className="mt-6 px-6 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">إعادة المحاولة</button>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center border border-[var(--line)] rounded-3xl bg-[var(--surface)]">
            <Search size={48} className="text-[var(--ink)]/20 mb-6" />
            <p className="text-xl text-[var(--ink)]/50">لا توجد طلبات تطابق معايير البحث.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="group cursor-pointer p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)]/30 hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]/50 group-hover:text-[var(--ink)] group-hover:bg-[var(--surface-2)] transition-colors">
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--ink)] text-lg line-clamp-1">{app.name}</h3>
                      <p className="text-xs text-[var(--ink)]/40 font-mono mt-0.5">{maskEmail(app.email)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--ink)]/40">القسم:</span>
                    <span className="text-[var(--ink)] font-medium">{app.section}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--ink)]/40">الخبرة:</span>
                    <span className="text-[var(--ink)] font-medium line-clamp-1">{app.experience}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between mt-auto">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${STATUS_STYLES[app.status]}`}>
                    {STATUS_ICONS[app.status]}
                    {STATUS_LABELS[app.status]}
                  </div>
                  <span className="text-xs text-[var(--ink)]/30 font-mono">{formatDate(app.created_at).split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--surface)] border border-[var(--line)] rounded-3xl p-6 md:p-8 shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-l from-[var(--brand)]/30 to-transparent" />
            
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-bold text-[var(--ink)] mb-2">{selectedApp.name}</h2>
                <div className="flex items-center gap-3 text-sm text-[var(--ink)]/50 font-mono">
                  <span>{maskEmail(selectedApp.email)}</span>
                  <span>•</span>
                  <span>{formatDate(selectedApp.created_at)}</span>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="w-10 h-10 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--ink)]/50 hover:bg-[var(--surface-2)] hover:text-[var(--ink)] transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                  <div className="text-xs text-[var(--ink)]/40 mb-1">القسم المستهدف</div>
                  <div className="font-bold text-[var(--ink)]">{selectedApp.section}</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                  <div className="text-xs text-[var(--ink)]/40 mb-1">الحالة</div>
                  <div className={`inline-flex items-center gap-1.5 text-sm font-bold ${STATUS_STYLES[selectedApp.status].split(' ')[1]}`}>
                    {STATUS_ICONS[selectedApp.status]}
                    {STATUS_LABELS[selectedApp.status]}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                  <div className="text-xs text-[var(--ink)]/40 mb-1">مستوى الخبرة</div>
                  <div className="font-bold text-[var(--ink)]">{selectedApp.experience}</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                  <div className="text-xs text-[var(--ink)]/40 mb-1">التفرغ الأسبوعي</div>
                  <div className="font-bold text-[var(--ink)]">{selectedApp.hours}</div>
                </div>
              </div>

              {selectedApp.portfolio && (
                <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                  <div className="text-xs text-[var(--ink)]/60 mb-2 uppercase tracking-widest font-mono">Portfolio Link</div>
                  <a href={selectedApp.portfolio} target="_blank" rel="noopener noreferrer" className="text-[var(--ink)] hover:text-[var(--ink)]/80 flex items-center gap-2 underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors break-all">
                    {selectedApp.portfolio}
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {selectedApp.motivation && (
                <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                  <div className="text-xs text-[var(--ink)]/60 mb-2 uppercase tracking-widest font-mono">Motivation</div>
                  <p className="text-[var(--ink)]/70 leading-relaxed text-sm whitespace-pre-wrap">{selectedApp.motivation}</p>
                </div>
              )}

              {selectedApp.contract_id && selectedApp.status === "accepted" && (
                <div className="p-5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-start gap-4">
                  <ShieldCheck className="text-[var(--ink)] shrink-0 mt-1" size={24} />
                  <div>
                    <div className="text-sm font-bold text-[var(--ink)] mb-1">تم إصدار عقد الانضمام</div>
                    <p className="text-xs text-[var(--ink)]/70 font-mono">Contract ID: {selectedApp.contract_id}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
