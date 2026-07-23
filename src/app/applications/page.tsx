"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  X,
  Clock,
  User,
  Layers,
  Info,
  ShieldCheck,
  ExternalLink,
  Send,
  Users,
  FileCheck,
  Hourglass,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SectionHeader from "@/components/ui/SectionHeader";
import Link from "next/link";

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

const STATUS_LABELS: Record<Application["status"], string> = {
  accepted: "مقبول",
  pending: "قيد المراجعة",
  rejected: "مرفوض",
};

 const STATUS_COLORS: Record<string, string> = {
   accepted: "color: #FFFFFF; border-color: rgba(255,255,255,0.3)",
   pending: "color: #D4D4D8; border-color: rgba(255,255,255,0.2)",
   rejected: "color: #A1A1AA; border-color: rgba(255,255,255,0.1)",
 };

const STATUS_ICONS: Record<string, React.ReactNode> = {
  accepted: <CheckCircle2 className="w-3.5 h-3.5" />,
  pending: <Hourglass className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-IQ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  const masked =
    name.length > 2 ? name[0] + "•••" + name[name.length - 1] : name[0] + "•••";
  return `${masked}@${domain}`;
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "pending" | "accepted" | "rejected"
  >("all");
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
        setLastUpdate(
          new Date().toLocaleTimeString("ar-IQ", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
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

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.section.toLowerCase().includes(search.toLowerCase()) ||
      app.experience.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
    rejected: apps.filter((a) => a.status === "rejected").length,
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: "var(--bg)", color: "var(--ink)" }}
    >
      <Header />
      <main className="flex-grow pt-28 pb-24 px-6 mx-auto w-full max-w-[1200px]">
        <SectionHeader
          eyebrow="منظومة القبول"
          title="طلبات الانضمام"
          description="جميع طلبات الانضمام لفرع jemo البحثي — شفافية كاملة"
          center
        />

        <div className="mt-8 flex justify-center">
          <Button href="/apply" icon={<Send className="w-5 h-5" />}>
            قدّم طلب الانضمام
          </Button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs" style={{ color: "var(--ink-2)" }}>
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: isRefreshing ? "var(--brand-700)" : "var(--accent)" }}
          />
          {mounted && lastUpdate ? (
            <span suppressHydrationWarning>
              تحديث تلقائي • آخر تحديث {lastUpdate}
            </span>
          ) : (
            <span>تحديث تلقائي</span>
          )}
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "إجمالي الطلبات", value: stats.total, icon: <Users className="w-5 h-5" /> },
            { label: "قيد المراجعة", value: stats.pending, icon: <Hourglass className="w-5 h-5" /> },
            { label: "مقبول", value: stats.accepted, icon: <FileCheck className="w-5 h-5" /> },
            { label: "مرفوض", value: stats.rejected, icon: <XCircle className="w-5 h-5" /> },
          ].map((stat) => (
            <Card key={stat.label} className="p-5 text-center">
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {stat.icon}
              </div>
              <div className="text-3xl font-extrabold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink)" }}>
                {initialLoading ? "–" : stat.value}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--ink-2)" }}>{stat.label}</div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--ink-2)" }} />
            <input
              type="text"
              placeholder="البحث بالاسم، القسم، أو الخبرة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border pr-11 pl-4 py-3 text-sm transition-colors focus:outline-none"
              style={{
                background: "var(--bg)",
                borderColor: "var(--line)",
                color: "var(--ink)",
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "accepted", "rejected"] as const).map((status) => {
              const active = selectedStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className="chip"
                  style={
                    active
                      ? {
                          background: "var(--brand)",
                          color: "var(--brand-ink)",
                          borderColor: "transparent",
                          boxShadow: "var(--sh-2)",
                        }
                      : {
                          background: "var(--bg)",
                          color: "var(--ink-2)",
                          borderColor: "var(--line)",
                        }
                  }
                >
                  {status === "all" ? "الكل" : STATUS_LABELS[status]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {initialLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl" style={{ background: "var(--accent-soft)" }} />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 rounded w-2/3" style={{ background: "var(--accent-soft)" }} />
                    <div className="h-3 rounded w-1/3" style={{ background: "var(--accent-soft)" }} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 rounded w-full" style={{ background: "var(--accent-soft)" }} />
                  <div className="h-3 rounded w-4/5" style={{ background: "var(--accent-soft)" }} />
                </div>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-20">
              <p className="text-lg mb-2" style={{ color: "var(--ink-2)" }}>تعذّر تحميل الطلبات</p>
              <p className="text-sm mb-8" style={{ color: "var(--ink-2)" }}>يرجى المحاولة مرة أخرى لاحقاً</p>
              <Button onClick={() => fetchApps()}>إعادة المحاولة</Button>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}
              >
                <Info className="w-8 h-8" style={{ color: "var(--ink-2)" }} />
              </div>
              <p className="text-lg mb-2" style={{ color: "var(--ink-2)" }}>لا توجد طلبات تطابق البحث</p>
              <p className="text-sm mb-8" style={{ color: "var(--ink-2)" }}>
                جرّب تغيير الفلتر أو كلمة البحث
              </p>
              <Button href="/apply" variant="outline" icon={<Send className="w-4 h-4" />}>
                كن أول من يقدّم
              </Button>
            </div>
          ) : (
            filteredApps.map((app) => (
              <Card
                key={app.id}
                hover
                active={selectedApp?.id === app.id}
                className="cursor-pointer"
                onClick={() => setSelectedApp(app)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedApp(app);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", color: "var(--accent)" }}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[15px]" style={{ color: "var(--ink)" }}>{app.name}</h3>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--ink-2)" }}>
                        {formatDate(app.created_at)}
                      </p>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={STATUS_COLORS[app.status] ? { color: "var(--ink-2)", borderColor: "var(--line)" } : undefined}
                  >
                    {STATUS_ICONS[app.status]}
                    {STATUS_LABELS[app.status]}
                  </span>
                </div>

                <div className="mb-4">
                  <span
                    className="inline-block px-3 py-1 rounded-lg text-[11px] font-medium"
                    style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", color: "var(--ink-2)" }}
                  >
                    {app.section}
                  </span>
                </div>

                <div className="space-y-2.5" style={{ borderTop: "1px solid var(--line)" }}>
                  <div className="flex items-center gap-2.5 pt-4 text-sm">
                    <Layers className="w-3.5 h-3.5" style={{ color: "var(--ink-2)" }} />
                    <span className="text-[13px]" style={{ color: "var(--ink-2)" }}>{app.experience}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Clock className="w-3.5 h-3.5" style={{ color: "var(--ink-2)" }} />
                    <span className="text-[13px]" style={{ color: "var(--ink-2)" }}>{app.hours}</span>
                  </div>
                  {app.portfolio && (
                    <a
                      href={app.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm transition-colors"
                      style={{ color: "var(--accent)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="text-[13px]">معرض أعمال</span>
                    </a>
                  )}
                </div>

                {app.status === "accepted" && app.contract_id && (
                  <div
                    className="mt-4 p-3 rounded-xl flex items-center justify-between"
                    style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", color: "var(--accent)" }}
                  >
                    <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)" }}>{app.contract_id}</span>
                    <ShieldCheck className="w-4 h-4" style={{ color: "var(--ink-2)" }} />
                  </div>
                )}
              </Card>
            ))
          )}
        </div>

        <Card className="mt-20 text-center py-16 px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-heading)", color: "var(--ink)" }}>
            هل تمتلك الشغف والمهارة؟
          </h2>
          <p className="mb-8 max-w-md mx-auto" style={{ color: "var(--ink-2)" }}>
            انضم لفريقنا البحثي وكن جزءاً من بناء المستقبل الرقمي العراقي.
          </p>
          <Button href="/apply" icon={<Send className="w-5 h-5" />}>
            قدّم طلب الانضمام
          </Button>
          <div className="mt-10">
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-1.5 text-[11px] transition-colors"
              style={{ color: "var(--ink-2)" }}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>لوحة الإدارة</span>
            </Link>
          </div>
        </Card>
      </main>

      <Footer />

      {selectedApp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(5,8,7,0.8)", backdropFilter: "blur(12px)" }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl max-h-[85vh] overflow-y-auto"
            style={{ background: "var(--surface)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-7 md:p-9">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", color: "var(--accent)" }}
                  >
                    <User className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>{selectedApp.name}</h2>
                    <p className="text-sm mt-0.5" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
                      {maskEmail(selectedApp.email)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-2.5 rounded-xl transition-colors"
                  style={{ color: "var(--ink-2)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div
                className="flex items-center gap-3 p-4 rounded-2xl border mb-7"
                style={selectedApp.status ? STATUS_COLORS[selectedApp.status] ? { color: "var(--ink-2)", borderColor: "var(--line)" } : undefined : undefined}
              >
                {STATUS_ICONS[selectedApp.status]}
                <span className="font-semibold text-sm">{STATUS_LABELS[selectedApp.status]}</span>
                {selectedApp.status === "accepted" && selectedApp.contract_id && (
                  <span className="mr-auto text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--ink-2)" }}>
                    {selectedApp.contract_id}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
                {[
                  { label: "القسم", value: selectedApp.section },
                  { label: "تاريخ التقديم", value: formatDate(selectedApp.created_at) },
                  { label: "الخبرة", value: selectedApp.experience },
                  { label: "الساعات الأسبوعية", value: selectedApp.hours },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-xl" style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}>
                    <p className="text-[11px] mb-1.5" style={{ color: "var(--ink-2)" }}>{item.label}</p>
                    <p className="font-medium text-sm" style={{ color: "var(--ink)" }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {selectedApp.portfolio && (
                <a
                  href={selectedApp.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors mb-6"
                  style={{ background: "var(--accent-soft)", border: "1px solid var(--line)", color: "var(--accent)" }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>زيارة معرض الأعمال</span>
                </a>
              )}

              {selectedApp.motivation && (
                <div className="p-5 rounded-xl" style={{ background: "var(--accent-soft)", border: "1px solid var(--line)" }}>
                  <p className="text-[11px] mb-3" style={{ color: "var(--ink-2)" }}>الدافع والرسالة</p>
                  <p className="leading-relaxed whitespace-pre-wrap text-sm" style={{ color: "var(--ink)" }}>
                    {selectedApp.motivation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
