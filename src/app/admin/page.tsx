import type { Metadata } from "next";
import Link from "next/link";
import { 
  BookOpen, 
  Users, 
  FileText, 
  QrCode, 
  ArrowUpLeft, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  ExternalLink,
  GraduationCap,
  Layers,
  Database,
  Send,
  Printer
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "مركز لوحات التحكم | JEMO Command Center",
  description: "البوابة المركزية لإدارة أبحاث JEMO، نشر الأوراق العلمية، وإدارة طلبات المتقدمين وعمليات المنظومة.",
};

export default function AdminHubPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 sm:py-24 bg-[var(--bg)] min-h-screen text-[var(--ink-1)]">
        <div className="container max-w-6xl">
          {/* Header Banner */}
          <div className="mb-12 sm:mb-16 border-b border-[var(--border)] pb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>JEMO_CENTRAL_COMMAND // بوابة الإدارة المركزية</span>
              </div>
              <div className="text-xs font-mono text-[var(--ink-3)]">
                النظام: <span className="text-emerald-500 font-bold">متصل (ONLINE)</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-[var(--ink-1)]">
              اختر لوحة التحكم المطلوبة
            </h1>
            <p className="text-[var(--ink-2)] text-base sm:text-lg max-w-3xl leading-relaxed">
              مركز الإدارة الموحد لمنظومة <strong>JEMO</strong>. يتيح لك التنقل بين إدارة الأبحاث العلمية المنشورة وتعديل محتوى الموقع، أو الانتقال للوحة متابعة طلبات المتقدمين والعمليات الميدانية.
            </p>
          </div>

          {/* Dashboards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Dashboard 1: Research, Papers & Content */}
            <div className="relative group bg-[var(--surface-1)] border-2 border-[var(--border)] hover:border-[var(--brand)] rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">
                    أبحاث ومحتوى
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-[var(--ink-1)] flex items-center gap-2">
                  لوحة الأبحاث ونشر الأوراق العلمية
                  <ArrowUpLeft className="w-5 h-5 text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                <p className="text-[var(--ink-2)] text-sm leading-relaxed mb-6">
                  إدارة ونشر الأوراق العلمية المحكمة، توليد التوثيقات الأكاديمية (BibTeX &amp; APA)، وتعديل بيانات الموقع والإعلانات الرسمية فورياً.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-2 gap-3 mb-8 text-xs font-mono text-[var(--ink-2)]">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>نشر أوراق علمية جديدة</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <Database className="w-4 h-4 text-amber-500" />
                    <span>حفظ سحابي فوري</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>تعديل إعلانات الموقع</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <Layers className="w-4 h-4 text-amber-500" />
                    <span>فهرسة مجالات ومختبرات</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/admin/research"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--brand)] hover:bg-[var(--brand-bright)] text-black font-bold text-sm transition-all shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>دخول لوحة الأبحاث والمحتوى</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/research"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--ink-2)] text-xs font-mono border border-[var(--border)] transition-colors"
                >
                  <span>عرض الأبحاث العامة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Dashboard 2: Applications & Operations */}
            <div className="relative group bg-[var(--surface-1)] border-2 border-[var(--border)] hover:border-emerald-500/80 rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                    <Users className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                    عمليات وطلبات
                  </span>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-[var(--ink-1)] flex items-center gap-2">
                  لوحة إدارة الطلبات والعمليات (Jemo Admin)
                  <ArrowUpLeft className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                <p className="text-[var(--ink-2)] text-sm leading-relaxed mb-6">
                  اللوحة المتقدمة لإدارة متقدمي المهرجان والانضمام، فحص وقراءة الباركود وQR، إرسال إشعارات Telegram الجماعية، وتوليد الكشوفات الرسمية.
                </p>

                {/* Features list */}
                <div className="grid grid-cols-2 gap-3 mb-8 text-xs font-mono text-[var(--ink-2)]">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <QrCode className="w-4 h-4 text-emerald-500" />
                    <span>قارئ الباركود والحضور</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <Send className="w-4 h-4 text-emerald-500" />
                    <span>إرسال إشعارات جماعية</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <Printer className="w-4 h-4 text-emerald-500" />
                    <span>طباعة الكشوفات الرسمية</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span>بوابة الطالب التفاعلية</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/admin/applications"
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg"
                >
                  <Users className="w-4 h-4" />
                  <span>دخول لوحة إدارة الطلبات</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin-app/student.html"
                  target="_blank"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--ink-2)] text-xs font-mono border border-[var(--border)] transition-colors"
                >
                  <span>بوابة الطالب</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick System Status Card */}
          <div className="p-6 rounded-2xl bg-[var(--surface-1)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[var(--ink-2)]">الخادم الأساسي:</span>
              <span className="text-[var(--ink-1)] font-bold">Cloudflare Edge (lab.jemo.dev)</span>
            </div>
            <div className="flex items-center gap-6 text-[var(--ink-3)]">
              <span>مسار النظام: <code className="text-[var(--ink-2)]">/home/jemo/Projects/jemo-admin</code></span>
              <span>قاعدة البيانات: <span className="text-emerald-400 font-bold">Supabase PostgreSQL</span></span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
