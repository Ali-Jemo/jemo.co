"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  Hourglass,
  Layers,
  Lock,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

/**
 * Public transparency page.
 *
 * SECURITY: this view renders aggregate COUNTS only. Applicant names, emails,
 * experience, availability, portfolio URLs, and contract IDs are never fetched
 * here — `/api/public/applications/feed` returns counts and a timestamp, and
 * the per-applicant endpoint requires an admin session.
 */
interface ApplicationStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  updatedAt: string;
}

const EMPTY_STATS: ApplicationStats = {
  total: 0,
  pending: 0,
  accepted: 0,
  rejected: 0,
  updatedAt: "",
};

const POLL_INTERVAL_MS = 30_000;

function toCount(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export default function ApplicationsClient() {
  const [stats, setStats] = useState<ApplicationStats>(EMPTY_STATS);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  const fetchStats = useCallback(async (): Promise<ApplicationStats> => {
    const res = await fetch("/api/public/applications/feed", {
      headers: { accept: "application/json" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      total: toCount(data?.total),
      pending: toCount(data?.pending),
      accepted: toCount(data?.accepted),
      rejected: toCount(data?.rejected),
      updatedAt: typeof data?.updatedAt === "string" ? data.updatedAt : "",
    };
  }, []);

  const commit = useCallback((next: ApplicationStats) => {
    setStats(next);
    setError(false);
    setLastUpdate(
      new Date().toLocaleTimeString("ar-IQ", { hour: "2-digit", minute: "2-digit" })
    );
  }, []);

  useEffect(() => {
    let active = true;

    // State is written only after the await, never synchronously in the effect.
    void (async () => {
      try {
        const next = await fetchStats();
        if (active) commit(next);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setInitialLoading(false);
      }
    })();

    const interval = setInterval(() => {
      void (async () => {
        try {
          const next = await fetchStats();
          if (active) commit(next);
        } catch {
          if (active) setError(true);
        }
      })();
    }, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [fetchStats, commit]);

  const handleRetry = async () => {
    setInitialLoading(true);
    setError(false);
    try {
      commit(await fetchStats());
    } catch {
      setError(true);
    } finally {
      setInitialLoading(false);
    }
  };

  const distribution = [
    { key: "accepted", label: "مقبول", value: stats.accepted, bar: "bg-[var(--brand)]", text: "text-[var(--brand)]" },
    { key: "pending", label: "قيد المراجعة", value: stats.pending, bar: "bg-amber-500", text: "text-amber-500" },
    { key: "rejected", label: "مرفوض", value: stats.rejected, bar: "bg-red-500/70", text: "text-red-500/70" },
  ] as const;

  const denominator = Math.max(stats.total, 1);

  const statCards = [
    {
      label: "إجمالي الطلبات",
      value: stats.total,
      icon: <Layers size={24} />,
      color: "text-[var(--ink)]",
      hover: "group-hover:border-[var(--brand)]/30",
    },
    {
      label: "قيد المراجعة",
      value: stats.pending,
      icon: <Hourglass size={24} />,
      color: "text-amber-500",
      hover: "group-hover:border-amber-500/30",
    },
    {
      label: "النخبة المقبولة",
      value: stats.accepted,
      icon: <ShieldCheck size={24} />,
      color: "text-[var(--brand)]",
      hover: "group-hover:border-[var(--brand)]/50",
    },
    {
      label: "طلبات مرفوضة",
      value: stats.rejected,
      icon: <XCircle size={24} />,
      color: "text-red-500/70",
      hover: "group-hover:border-red-500/20",
    },
  ];

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
              <Activity size={14} className={initialLoading ? "animate-pulse" : ""} />
              {lastUpdate ? (
                <span className="tracking-widest">LIVE SYSTEM • LAST UPDATE: {lastUpdate}</span>
              ) : (
                <span className="tracking-widest">LIVE SYSTEM INITIALIZING...</span>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--ink)] leading-tight">
              سجل <span className="text-[var(--ink)]/70">القبولات الشفاف</span>
            </h1>
            <p className="mt-4 text-lg text-[var(--ink)]/50 max-w-2xl">
              مؤشرات مباشرة عن طلبات الانضمام إلى jemo labs. ننشر الأرقام لا الهويات —
              حمايةً لخصوصية المتقدمين.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/apply" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold !text-white transition-all duration-300 bg-gradient-to-r from-[var(--brand-700)] to-[var(--brand)] rounded-xl overflow-hidden shadow-[0_10px_20px_-10px_var(--brand)] hover:shadow-[0_15px_30px_-10px_var(--brand)] hover:-translate-y-1">
              <span className="absolute inset-0 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2 font-kufi">
                تقديم طلب انضمام
                <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        {error ? (
          <div className="w-full py-32 flex flex-col items-center justify-center border border-red-500/20 rounded-3xl bg-red-500/5 text-center px-6">
            <XCircle size={48} className="text-red-500 mb-6" />
            <p className="text-xl text-red-200">فشل في الاتصال بقاعدة البيانات.</p>
            <button
              onClick={() => void handleRetry()}
              className="mt-6 px-6 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : (
          <>
            {/* BENTO STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, i) => (
                <div
                  key={i}
                  className={`p-5 sm:p-6 rounded-2xl border border-[var(--line)] flex flex-col relative overflow-hidden group transition-all duration-300 bg-[var(--surface)] ${stat.hover}`}
                >
                  <div className={`absolute top-0 right-0 p-5 sm:p-6 opacity-20 group-hover:opacity-40 transition-all group-hover:scale-110 group-hover:-rotate-6 duration-500 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-xs sm:text-sm font-mono opacity-60 mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
                    {stat.label}
                  </div>
                  <div className={`text-4xl md:text-5xl font-bold font-mono mt-auto ${stat.color}`}>
                    {initialLoading ? "—" : stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* STATUS DISTRIBUTION */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--line)] shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-[var(--ink)]">توزيع حالات الطلبات</h2>
                {!initialLoading && (
                  <span className="text-xs font-mono text-[var(--ink)]/40">
                    {stats.total} طلب إجمالاً
                  </span>
                )}
              </div>

              <div
                className="h-4 w-full rounded-full overflow-hidden flex bg-[var(--surface-2)] border border-[var(--line)]"
                role="img"
                aria-label={`توزيع الطلبات: ${stats.accepted} مقبول، ${stats.pending} قيد المراجعة، ${stats.rejected} مرفوض`}
              >
                {initialLoading
                  ? null
                  : distribution.map((segment) => (
                      <div
                        key={segment.key}
                        className={segment.bar}
                        style={{ width: `${(segment.value / denominator) * 100}%` }}
                        title={`${segment.label}: ${segment.value}`}
                      />
                    ))}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {distribution.map((segment) => (
                  <div key={segment.key} className="flex items-center gap-2 text-sm">
                    <span className={`w-2.5 h-2.5 rounded-full ${segment.bar}`} />
                    <span className="text-[var(--ink)]/60">{segment.label}</span>
                    <span className={`font-mono font-bold ${segment.text}`}>
                      {initialLoading ? "—" : segment.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* PRIVACY NOTE */}
            <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-[var(--ink)]/60 shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-[var(--ink)] mb-1">خصوصية المتقدمين</h3>
                <p className="text-sm text-[var(--ink)]/50 leading-relaxed">
                  تفاصيل الطلبات الفردية — الأسماء، بيانات التواصل، الخبرة، وروابط الأعمال — لا
                  تُنشر علناً. تظهر هذه المؤشرات فقط، بينما تُراجع التفاصيل داخل لوحة الإدارة المصرّح بها.
                </p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
