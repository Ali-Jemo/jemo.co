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

export const metadata: Metadata = {
  title: "لوحة الإدارة السيادية | JEMO LABS",
  description: "بوابة إدارة المنظومة وأبحاث الذكاء الاصطناعي السيادية.",
};

export default async function AdminPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/admin");
  }

  const role = (user.publicMetadata as { role?: string })?.role;
  const isSuperAdminEmail = user.emailAddresses.some(e => e.emailAddress === "ali.jemo1.9@gmail.com");
  const isAdmin = role === "admin" || isSuperAdminEmail;

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
                المسؤول: {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Ali Hadi"} (@{user.username || "jemo"}) · {user.emailAddresses[0]?.emailAddress}
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
                  ربط موحد بين موقع المنصة jemo.co ومحرك الإدارة الداخلي (/home/jemo/Projects/jemo-admin)
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
                      <p className="text-[11px] font-mono text-[#738284]">Port :3301 • Jemo Admin Engine (Sovereign Core)</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#55696a] leading-relaxed">
                  لوحة التحكم المركزية الرئيسية: إدارة طلبات مهرجان التخرج، تسجيل الحضور بالباركود، إدارة وتعديل محتوى موقع jemo.co، تحرير مستودع الأبحاث والمشاريع، والمزامنة السحابية الفورية.
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-500">
                    رمز PIN: <span className="font-bold text-[#222f30]">a.j1_6</span>
                  </div>
                  <a
                    href="http://localhost:3301"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#222f30] hover:bg-[#162021] text-white text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>فتح محرك الإدارة الرئيسي (:3301)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
                      <p className="text-[11px] font-mono text-[#738284]">Port :3300 • Node Desktop Bridge (مؤرشف: old-projects)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 text-zinc-700">DESKTOP BRIDGE</span>
                </div>

                <p className="text-xs text-[#55696a] leading-relaxed">
                  خادم الربط المحلي لعمليات ملفات Git و Cloudflare. تم أرشفة لوحة الموقع القديمة إلى مجلد المشاريع القديمة (old-projects/old-website-admin).
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] font-mono text-zinc-500">
                    الربط: <span className="font-bold text-emerald-600">x-admin-secret</span>
                  </div>
                  <a
                    href="http://localhost:3300/hub.html"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-zinc-50 text-[#222f30] border border-[#e4e3e3] text-xs font-bold transition-colors shadow-xs"
                  >
                    <span>فتح Hub الميداني (:3300)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
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
                <strong className="text-[#222f30]">ali.jemo1.9@gmail.com</strong>
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
                  <span className="font-bold text-[#222f30]">jemo</span>
                </div>
                <div className="p-3 rounded-xl bg-[#f5f8f7] border border-[#e4e3e3] flex items-center justify-between">
                  <span>الدور الوظيفي:</span>
                  <span className="font-bold text-emerald-700">admin (System Founder)</span>
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
                  // Core Kernel & Services Diagnostics
                </p>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1 text-[11px]">
                  <p>AUTH_PROVIDER: <span className="text-[#bef264]">CLERK_v3</span></p>
                  <p>ENCRYPTION: <span className="text-zinc-200">SHA-256 + OAuth2</span></p>
                  <p>TARGET_APP: <span className="text-zinc-200">app_3JBeECW9w6hwJDmB0buQyuggNjG</span></p>
                  <p>ENVIRONMENT: <span className="text-emerald-400">DEVELOPMENT (ONLINE)</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
