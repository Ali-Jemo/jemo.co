"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import { RESEARCH_PAPERS, OPEN_QUESTIONS } from "@/lib/data/research-data";
import { 
  User, 
  BrainCircuit, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  LogOut, 
  ShieldCheck, 
  GitFork, 
  Flame, 
  HelpCircle, 
  Copy, 
  Key, 
  ExternalLink, 
  Repeat, 
  FileText, 
  Scale, 
  Bookmark, 
  Settings, 
  Terminal,
  Zap,
  ArrowUpLeft
} from "lucide-react";

export default function DashboardPage() {
  const { user, profile, loading, loginAsDemo, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"research" | "replications" | "bookmarks" | "settings">("research");
  const [copiedKey, setCopiedKey] = useState(false);
  const [apiKey] = useState("jemo_live_res_89fa41c09b2e817d");

  // Sample bookmarked items
  const bookmarkedPapers = RESEARCH_PAPERS.slice(1, 3);
  const bookmarkedQuestions = OPEN_QUESTIONS.slice(0, 2);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-24 bg-[#f7f7f5] flex items-center justify-center font-mono text-xs text-[#738284]">
          جارٍ فحص جلسة الباحث...
        </main>
        <Footer />
      </>
    );
  }

  // Not logged in guest banner
  if (!profile) {
    return (
      <>
        <Header />
        <main className="flex-1 py-20 sm:py-28 bg-[#f7f7f5] flex items-center justify-center px-4" dir="rtl">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-md text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-[#cef79e] text-[#222f30] flex items-center justify-center mx-auto font-bold">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-kufi text-[#222f30]">
                لوحة تحكم الباحث المستقل
              </h1>
              <p className="text-xs text-[#55696a] mt-1.5">
                سجّل الدخول للوصول إلى محفظة أبحاثك، وإدارتها، ومتابعة إعادات التجارب المحققة.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="block w-full py-3 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs"
              >
                تسجيل الدخول كباحث
              </Link>

              <button
                type="button"
                onClick={() => loginAsDemo("karkhi")}
                className="w-full py-3 rounded-xl border border-[#cef79e] bg-[#f8fdf2] hover:bg-[#cef79e]/40 text-[#222f30] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>دخول تجريبي فوري (عمر الكرخي)</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Filter papers authored by this researcher or demo
  const myPapers = RESEARCH_PAPERS.filter((p) => 
    p.authors.some((a) => a.name.includes("عمر الكرخي") || a.name.includes(profile.name))
  );

  return (
    <>
      <Header />
      <main className="flex-1 py-12 sm:py-16 bg-[#f7f7f5] text-[#222f30]" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Top Researcher Profile Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Profile Meta */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#222f30] text-white flex items-center justify-center font-bold font-mono text-xl border-2 border-[#cef79e] shrink-0 shadow-xs">
                  {profile.name.slice(0, 2)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold font-kufi text-[#222f30]">
                      {profile.name}
                    </h1>
                    <span className="text-xs font-mono text-[#55696a] dir-ltr text-right">
                      {profile.handle}
                    </span>
                    {profile.isDemo && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        حساب تجريبي (Demo Mode)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#55696a] mt-0.5 font-medium">
                    {profile.role} · <span className="text-[#222f30] font-semibold">{profile.domain}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2 font-mono text-[11px] text-[#738284]">
                    <span className="px-2 py-0.5 rounded-md bg-[#f0f2f0] text-[#222f30] font-bold">
                      {profile.researchId}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      باحث مستقل معتمد (Proof of Work Tier 1)
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/publish"
                  className="px-4 py-2.5 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4 text-[#bef264]" />
                  <span>وثّق كائن بحث جديد</span>
                </Link>

                <button
                  onClick={() => logout()}
                  className="px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-white text-xs font-mono text-[#55696a] hover:text-red-700 hover:border-red-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>

            </div>

            {/* Cognitive Proof-of-Work Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#e4e3e3]">
              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#e4e3e3] shadow-xs">
                <span className="text-[11px] font-mono font-bold text-[#738284] block mb-1">
                  كائنات البحث المنشورة
                </span>
                <div className="text-2xl font-black font-mono text-[#222f30]">
                  {profile.stats.publishedCount || myPapers.length || 2}
                </div>
                <span className="text-[10px] text-emerald-700 font-mono">Research Objects</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#e4e3e3] shadow-xs">
                <span className="text-[11px] font-mono font-bold text-[#738284] block mb-1">
                  إعادات التجارب المحققة
                </span>
                <div className="text-2xl font-black font-mono text-purple-700">
                  {profile.stats.replicationsCount}×
                </div>
                <span className="text-[10px] text-purple-700 font-mono">Replications Verified</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#e4e3e3] shadow-xs">
                <span className="text-[11px] font-mono font-bold text-[#738284] block mb-1">
                  المراجعات والتحديات
                </span>
                <div className="text-2xl font-black font-mono text-[#222f30]">
                  {profile.stats.contributionsCount}
                </div>
                <span className="text-[10px] text-[#55696a] font-mono">Peer Contributions</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#fcfdfc] border border-[#e4e3e3] shadow-xs">
                <span className="text-[11px] font-mono font-bold text-[#738284] block mb-1">
                  درجة الإثبات (Proof Score)
                </span>
                <div className="text-2xl font-black font-mono text-emerald-600">
                  {profile.stats.evidenceScore}%
                </div>
                <span className="text-[10px] text-emerald-700 font-mono">Evidence-Backed</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#e4e3e3] pb-3 font-mono">
            <button
              onClick={() => setActiveTab("research")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "research"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#bef264]" />
              <span>أبحاثي المسجلة (My Objects)</span>
            </button>

            <button
              onClick={() => setActiveTab("replications")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "replications"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
              }`}
            >
              <Repeat className="w-3.5 h-3.5 text-purple-400" />
              <span>إعادات التجارب والمراجعات (Peer Reviews)</span>
            </button>

            <button
              onClick={() => setActiveTab("bookmarks")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "bookmarks"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-400" />
              <span>المحفوظات (Saved Research)</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "settings"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30]"
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>الإعدادات والـ API</span>
            </button>
          </div>

          {/* Tab 1: My Research Objects */}
          {activeTab === "research" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold font-kufi text-[#222f30]">
                  كائنات البحث الموثقة باسمك
                </h2>
                <Link
                  href="/publish"
                  className="text-xs font-mono font-bold text-[#222f30] underline hover:text-[#a7e26e]"
                >
                  + إضافة كائن بحث جديد
                </Link>
              </div>

              {(myPapers.length > 0 ? myPapers : RESEARCH_PAPERS.slice(0, 2)).map((paper) => (
                <div
                  key={paper.id}
                  className="p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3 hover:border-[#a7e26e] transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#f0f2f0] text-[#222f30] font-bold">
                        {paper.researchType || "Experiment"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
                        تمت إعادة التجربة ({paper.lineage?.replicationsCount || 14}×)
                      </span>
                      <span className="text-[11px] text-[#738284]">
                        {paper.field}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#738284]">
                      {paper.publishDate}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-kufi text-[#222f30]">
                      <Link href={`/research/${paper.slug}`} className="hover:underline">
                        {paper.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#55696a] mt-1 line-clamp-2">
                      {paper.findings || paper.abstract}
                    </p>
                  </div>

                  {paper.question && (
                    <div className="p-3 rounded-xl bg-[#f9faf9] border border-[#e4e3e3] text-xs text-[#55696a]">
                      <strong className="text-[#222f30]">المسألة: </strong>
                      {paper.question}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e4e3e3]">
                    <div className="flex items-center gap-3 text-xs font-mono text-[#55696a]">
                      <span>{paper.lineage?.replicationsCount || 14} إعادات</span>
                      <span>•</span>
                      <span>{paper.lineage?.challengesCount || 2} مراجعات</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/research/${paper.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all"
                      >
                        <span>عرض كائن البحث</span>
                        <ArrowUpLeft className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/publish?fork=${paper.slug}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#e4e3e3] bg-white text-xs font-mono text-[#55696a] hover:text-[#222f30]"
                      >
                        <GitFork className="w-3.5 h-3.5" />
                        <span>تفريعة (Fork)</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Replications & Peer Reviews */}
          {activeTab === "replications" && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold font-kufi text-[#222f30]">
                مساهماتك في مراجعة وتكرار أبحاث الآخرين (Peer Replications)
              </h2>

              <div className="p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
                      ✓ إعـادة تـجـربـة مـحـقـقـة (Verified Replication)
                    </span>
                    <span className="text-xs font-bold text-[#222f30]">
                      على بحث: استقصاء ومقارنة 6 نماذج ذكاء اصطناعي
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#738284]">2026-08-18</span>
                </div>
                <p className="text-xs text-[#55696a] leading-relaxed">
                  "أعدت التجربة على 10 نصوص جديدة من العصر العباسي؛ تكررت نفس نسبة الهلوسة (حوالي 26%) في اختلاق المصادر الفرعية، مما يؤكد صحة استنتاج البحث ودقة المنهجية."
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold">
                      ⚖️ تـحـدي وتـقـريـر نـقـد (Peer Challenge)
                    </span>
                    <span className="text-xs font-bold text-[#222f30]">
                      على بحث: عزل تسريب الذاكرة في خدمات Node.js
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#738284]">2026-08-05</span>
                </div>
                <p className="text-xs text-[#55696a] leading-relaxed">
                  "عند تفعيل نمط التفكير العميق الموصول بقواعد بيانات خارجية، انخفضت نسبة الهلوسة إلى 8%؛ تم إرفاق شفرة الاختبار المعدلة ومقارنة الأداء."
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Bookmarks */}
          {activeTab === "bookmarks" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold font-kufi text-[#222f30]">
                المحفوظات والمسائل المفتوحة المتابعة
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookmarkedPapers.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f0f2f0] text-[#222f30]">
                      {p.field}
                    </span>
                    <h3 className="text-sm font-bold font-kufi text-[#222f30]">
                      <Link href={`/research/${p.slug}`} className="hover:underline">
                        {p.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#55696a] line-clamp-2">{p.abstract}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-bold font-kufi text-[#222f30]">
                  مسائل مفتوحة تتابعها (Followed Open Problems):
                </h3>
                {bookmarkedQuestions.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-white border border-[#e4e3e3] flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#222f30]">{q.title}</h4>
                      <span className="text-[10px] font-mono text-[#738284]">الحالة: {q.status}</span>
                    </div>
                    <Link
                      href={`/publish?question=${encodeURIComponent(q.title)}`}
                      className="px-3 py-1.5 rounded-xl bg-[#222f30] text-white text-[11px] font-bold shrink-0"
                    >
                      حل المسألة ←
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Settings & API Access */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs space-y-6">
                <h2 className="text-lg font-bold font-kufi text-[#222f30] flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#a7e26e]" />
                  <span>مفتاح الـ API لرفع الأبحاث آلياً (CLI & Notebooks)</span>
                </h2>

                <p className="text-xs text-[#55696a] leading-relaxed max-w-2xl">
                  يمكنك استخدام هذا المفتاح من خلال مكتبة JEMO Python أو عبر سطر الأوامر (CLI) لتوثيق جلسات المحادثة وتفريغات الاختبارات (Benchmarks) مباشرة داخل أرشيفك الشخصي:
                </p>

                <div className="p-4 rounded-2xl bg-[#0c1415] text-white font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px]">API SECRET KEY:</span>
                    <button
                      onClick={handleCopyKey}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#bef264] text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedKey ? "تم النسخ!" : "نسخ المفتاح"}</span>
                    </button>
                  </div>
                  <div className="tracking-wider text-[#bef264] overflow-x-auto py-1">
                    {apiKey}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#f7f7f5] border border-[#e4e3e3] font-mono text-xs text-[#222f30] space-y-2">
                  <span className="font-bold block text-xs">مثال الاستخدام في بايثون:</span>
                  <pre className="text-[11px] text-[#445e5f] overflow-x-auto dir-ltr text-left">
{`from jemo import ResearchRegistry

client = ResearchRegistry(api_key="${apiKey}")
client.publish_object(
    title="My Benchmark Analysis",
    tools=["Claude 3.7", "DeepSeek-R1"],
    findings="94% accuracy on dialectal reasoning",
    evidence="https://github.com/my-repo"
)`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
