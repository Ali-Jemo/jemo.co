import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  ShieldCheck, 
  FileText, 
  Settings, 
  Activity, 
  Lock, 
  ExternalLink, 
  CheckCircle2, 
  ArrowUpLeft,
  Terminal,
  Cpu,
  Zap,
  Layers,
  KeyRound
} from "lucide-react";
import { RESEARCH_PROJECTS, RESEARCH_PAPERS, OPEN_QUESTIONS } from "@/lib/data/research-data";
import { isAdminUser } from "@/lib/security";
import { supabaseAdmin } from "@/lib/supabase";
export const metadata: Metadata = {
  title: "لوحة الإدارة السيادية | JEMO LABS",
  description: "بوابة إدارة المنظومة وأبحاث الذكاء الاصطناعي السيادية.",
};

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/admin");
  }

  const isAdmin = isAdminUser(user);

  let inquiries: Array<Record<string, unknown>> = [];
  let initiatives: Array<Record<string, unknown>> = [];
  let recentSubscribers: Array<{ email: string; created_at: string }> = [];
  let dbError = false;

  if (isAdmin) {
    try {
      const supabase = supabaseAdmin();
      const [inqRes, initRes, subsRes] = await Promise.all([
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("initiative_interest").select("*").order("created_at", { ascending: false }).limit(50),
        supabase.from("newsletter_subscribers").select("email, created_at").order("created_at", { ascending: false }).limit(20),
      ]);
      if (inqRes.data) inquiries = inqRes.data;
      if (initRes.data) initiatives = initRes.data;
      if (subsRes.data) recentSubscribers = subsRes.data;
    } catch {
      dbError = true;
    }
  }
  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="flex-1 min-h-[calc(100vh-160px)] flex items-center justify-center py-20 px-4 bg-[#f7f7f5]" dir="rtl">
          <div className="max-w-md w-full bg-white border border-rose-200 p-8 rounded-3xl text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-[#222f30] font-kufi">غير مصرح بالدخول</h1>
            <p className="text-xs text-[#55696a] leading-relaxed">
              هذه الصفحة مخصصة لمدراء النظام ومطوري النواة السيادية فقط. تم تسجيل دخولك كـ <strong>{user.username || user.firstName || "مستخدم"}</strong> ولكنك لا تملك صلاحية الأدمن.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162021] transition-colors"
              >
                <span>العودة إلى لوحة الباحث</span>
                <ArrowUpLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-12 sm:py-16 bg-[#f7f7f5] text-[#222f30]" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#162021] text-white border border-[#222f30] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#bef264]/15 border border-[#bef264]/30 text-[#bef264] text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ROOT ADMIN PRIVILEGES // CLERK AUTH</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-kufi">
                لوحة الإدارة والتحكم السيادي
              </h1>
              <p className="text-xs text-zinc-400 font-mono">
                المسؤول: {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "مدير النظام"} (@{user.username || "admin"}) · {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-mono transition-colors"
              >
                <span>Clerk Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#bef264] text-[#162021] text-xs font-bold hover:bg-[#a7e26e] transition-colors"
              >
                <span>لوحة الباحث</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-1 font-mono">
              <div className="flex items-center justify-between text-xs text-[#738284]">
                <span>المشاريع السيادية</span>
                <Cpu className="w-4 h-4 text-[#728825]" />
              </div>
              <p className="text-2xl font-bold text-[#222f30]">{RESEARCH_PROJECTS.length}</p>
              <p className="text-[10px] text-emerald-600">نواة Ziqa + أنظمة Axiq</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-1 font-mono">
              <div className="flex items-center justify-between text-xs text-[#738284]">
                <span>الأوراق والبحوث</span>
                <FileText className="w-4 h-4 text-[#728825]" />
              </div>
              <p className="text-2xl font-bold text-[#222f30]">{RESEARCH_PAPERS.length}</p>
              <p className="text-[10px] text-emerald-600">منشورة ومحققة رقمياً</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-1 font-mono">
              <div className="flex items-center justify-between text-xs text-[#738284]">
                <span>الأسئلة المفتوحة</span>
                <Activity className="w-4 h-4 text-[#728825]" />
              </div>
              <p className="text-2xl font-bold text-[#222f30]">{OPEN_QUESTIONS.length}</p>
              <p className="text-[10px] text-emerald-600">قيد النقاش والتكرار</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-1 font-mono">
              <div className="flex items-center justify-between text-xs text-[#738284]">
                <span>حالة الجلسة</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">VERIFIED</p>
              <p className="text-[10px] text-[#738284]">صلاحيات كاملة (Admin)</p>
            </div>
          </div>

          {/* JEMO Admin Suite Integration Cards */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0efee] pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-[#728825]/10 text-[#728825] text-xs font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>JEMO ADMIN SUITE ECOSYSTEM</span>
                </div>
                <h2 className="text-lg font-bold text-[#222f30] font-kufi">
                  لوحات التحكم المتصلة ونظام إدارة الطلبات والأبحاث
                </h2>
                <p className="text-xs text-[#55696a]">
                  ربط موحد بين موقع المنصة ومحرك الإدارة الداخلي
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>SYNCED & PROTECTED</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Modern Admin Engine - MAIN ADMIN PANEL */}
              <div className="p-5 rounded-2xl bg-[#fafaf9] border-2 border-[#728825]/60 space-y-4 hover:border-[#728825] transition-colors shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#728825]/15 text-[#728825] flex items-center justify-center border border-[#728825]/30">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#222f30]">محرك الإدارة الرئيسي (Next.js 16)</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#bef264] text-[#162021]">MAIN PANEL</span>
                      </div>
                      <p className="text-[11px] font-mono text-[#738284]">Jemo Admin Engine (Sovereign Core)</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#55696a] leading-relaxed">
                  لوحة التحكم المركزية الرئيسية: إدارة طلبات مهرجان التخرج، تسجيل الحضور بالباركود، إدارة وتعديل محتوى موقع jemo.co، تحرير مستودع الأبحاث والمشاريع، والمزامنة السحابية الفورية.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-500">
                    الوصول: <span className="font-bold text-emerald-600">محمي بنظام الصلاحيات</span>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-500 text-xs font-bold">
                    <span>محرك الإدارة الداخلي</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </span>
                </div>
              </div>

              {/* Card 2: Desktop Bridge & Archived Hub */}
              <div className="p-5 rounded-2xl bg-[#fafaf9] border border-[#e4e3e3] space-y-4 hover:border-zinc-400 transition-colors opacity-85">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-200">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#222f30]">جسر سطح المكتب الميداني (Bridge)</h3>
                      <p className="text-[11px] font-mono text-[#738284]">Node Desktop Bridge (مؤرشف)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">DESKTOP BRIDGE</span>
                </div>

                <p className="text-xs text-[#55696a] leading-relaxed">
                  خادم الربط للعمليات الإدارية وأرشفة المشاريع السابقة.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-500">
                    الحالة: <span className="font-bold text-zinc-600">مؤرشف</span>
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 text-zinc-500 text-xs font-bold">
                    <span>Hub الميداني</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Secret & Credentials Status Bar */}
            <div className="p-4 rounded-2xl bg-[#f5f8f7] border border-[#d2e3dc] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#728825]" />
                <span className="text-[#3a524a]">ADMIN_SECRET:</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#d2e3dc] font-bold text-[#222f30]">•••••••••••• (مؤمّن مشفر)</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#55696a]">
                <span>المسؤول المعتمد:</span>
                <strong className="text-[#222f30]">
                  {user.primaryEmailAddress?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? "—"}
                </strong>
                <span className="text-emerald-600 font-bold">✓ مُفعل</span>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions & Console */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
              <h2 className="text-base font-bold text-[#222f30] flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#728825]" />
                <span>إدارة المستخدمين والجلسات</span>
              </h2>
              <p className="text-xs text-[#55696a] leading-relaxed">
                يتم إدارة الصلاحيات وتوثيق الحسابات والأدوار من خلال Clerk Backend API واللوحة المركزية.
              </p>
              <div className="space-y-2 pt-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-between">
                  <span>اسم المستخدم:</span>
                  <span className="font-bold text-[#222f30]">{user.username || "admin"}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-between">
                  <span>الدور الوظيفي:</span>
                  <span className="font-bold text-emerald-700">admin</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-between">
                  <span>المعرف الرقمي:</span>
                  <span className="text-[11px] text-[#738284]">{user.id}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c1415] text-white border border-[#222f30] shadow-xs space-y-4 font-mono">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-2 text-[#bef264] font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>SYSTEM TELEMETRY CONSOLE</span>
                </span>
                <span className="text-emerald-400">● LIVE</span>
              </div>
              <div className="space-y-2 text-xs text-zinc-300">
                <p className="text-[11px] text-zinc-400">
                  {"// Core Kernel & Services Diagnostics"}
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                  <p>AUTH: <span className="text-[#bef264]">Clerk (server-verified)</span></p>
                  <p>DB: <span className="text-zinc-200">Supabase PostgreSQL</span></p>
                  <p>RUNTIME: <span className="text-zinc-200">Cloudflare Workers</span></p>
                  <p>ENV: <span className="text-emerald-400">production</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Submissions & Inquiries Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0efee] pb-4">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#222f30] font-kufi">
                  طلبات ومبادرات ومشتركين
                </h2>
                <p className="text-xs text-[#55696a]">
                  سجلات استمارات الدعم، الحوسبة، مبادرات البحث، والمشتركين في النشرة البريدية
                </p>
              </div>
              <div className="flex gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  {inquiries.length} طلبات
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                  {initiatives.length} مبادرات
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold border border-amber-200">
                  {recentSubscribers.length} مشتركون
                </span>
              </div>
            </div>

            {dbError ? (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold text-center">
                تعذر الاتصال بقاعدة البيانات
              </div>
            ) : (
              <div className="space-y-6">
                {/* Inquiries */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono text-[#738284]">
                    {"// أحدث طلبات الحوسبة والرعاية (INQUIRIES)"}
                  </h3>
                  {inquiries.length === 0 ? (
                    <p className="text-xs text-[#738284] p-4 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] text-center">
                      لا توجد طلبات مسجلة بعد
                    </p>
                  ) : (
                    <div className="divide-y divide-[#f0efee] border border-[#e4e3e3] rounded-2xl overflow-hidden">
                      {inquiries.slice(0, 10).map((inq, idx) => (
                        <div key={String(inq.id ?? idx)} className="p-4 bg-white hover:bg-[#fafafa] transition-colors space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#222f30]">
                              {String(inq.name || "—")} ({String(inq.email || "—")})
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#728825]/10 text-[#728825]">
                              {String(inq.type === "compute" ? "حوسبة" : "رعاية")}
                            </span>
                          </div>
                          <p className="text-xs text-[#55696a]">
                            {String(inq.institution || inq.organization || inq.resource || inq.amount_or_funding || inq.message || "—")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Initiatives */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono text-[#738284]">
                    {"// تسجيلات الاهتمام بالمبادرات (INITIATIVE INTEREST)"}
                  </h3>
                  {initiatives.length === 0 ? (
                    <p className="text-xs text-[#738284] p-4 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] text-center">
                      لا توجد تسجيلات اهتمام بعد
                    </p>
                  ) : (
                    <div className="divide-y divide-[#f0efee] border border-[#e4e3e3] rounded-2xl overflow-hidden">
                      {initiatives.slice(0, 10).map((init, idx) => (
                        <div key={String(init.id ?? idx)} className="p-4 bg-white hover:bg-[#fafafa] transition-colors space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#222f30]">
                              {String(init.name || "—")} ({String(init.email || "—")})
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700">
                              {String(init.initiative_slug || "—")}
                            </span>
                          </div>
                          {Boolean(init.message) && (
                            <p className="text-xs text-[#55696a]">{String(init.message)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subscribers */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold font-mono text-[#738284]">
                    {"// أحدث مشتركي النشرة البريدية (NEWSLETTER)"}
                  </h3>
                  {recentSubscribers.length === 0 ? (
                    <p className="text-xs text-[#738284] p-4 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] text-center">
                      لا يوجد مشتركون بعد
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {recentSubscribers.map((sub, idx) => (
                        <div key={String(sub.email ?? idx)} className="p-2.5 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-between">
                          <span className="text-[#222f30] truncate">{sub.email}</span>
                          <span className="text-[10px] text-[#738284]">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString("ar-EG") : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
