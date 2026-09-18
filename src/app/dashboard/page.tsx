"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth, type ResearcherProfile } from "@/lib/auth-context";
import { RESEARCH_PAPERS } from "@/lib/data/research-data";
import { useReplications, type UserReplication } from "@/lib/replications";
import {
  User,
  Zap,
  FileText,
  Repeat,
  Bookmark,
  Key,
  Settings,
  ChevronLeft
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import ResearchObjectsTab from "@/components/dashboard/ResearchObjectsTab";
import ReplicationsTab from "@/components/dashboard/ReplicationsTab";
import BookmarksTab from "@/components/dashboard/BookmarksTab";
import ApiHubTab from "@/components/dashboard/ApiHubTab";
import ProfileSettingsTab from "@/components/dashboard/ProfileSettingsTab";
import ProfileEditModal from "@/components/dashboard/ProfileEditModal";
import ReplicationModal from "@/components/dashboard/ReplicationModal";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header />
          <main className="flex-1 py-24 bg-[#f7f7f5] flex items-center justify-center font-mono text-xs text-[#738284]" dir="rtl">
            جارٍ فحص جلسة الباحث...
          </main>
          <Footer />
        </>
      }
    >
      <DashboardInner />
    </Suspense>
  );
}

function DashboardInner() {
  const { profile, loading, loginAsDemo, logout, updateProfile, publishedPapers } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");
  const initialTab: "research" | "replications" | "bookmarks" | "api" | "settings" =
    initialTabParam === "replications" ||
    initialTabParam === "bookmarks" ||
    initialTabParam === "api" ||
    initialTabParam === "settings"
      ? initialTabParam
      : "research";
  const initialSectionParam = searchParams.get("section");
  const initialSection: "academic" | "account" | "tier" =
    initialSectionParam === "account" || initialSectionParam === "tier"
      ? initialSectionParam
      : "academic";
  const { replications, add: addReplication, remove: removeReplication } = useReplications();

  const [activeTab, setActiveTab] = useState<"research" | "replications" | "bookmarks" | "api" | "settings">(initialTab);
  const [settingsSection, setSettingsSection] = useState<"academic" | "account" | "tier">(initialSection);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReplicationModalOpen, setIsReplicationModalOpen] = useState(false);

  const handleLogout = () => {
    void logout().finally(() => {
      router.push("/");
    });
  };

  const handleManageAccount = () => {
    setSettingsSection("account");
    setActiveTab("settings");
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 py-24 bg-[#f7f7f5] flex items-center justify-center font-mono text-xs text-[#738284]" dir="rtl">
          جارٍ فحص جلسة الباحث...
        </main>
        <Footer />
      </>
    );
  }

  // Not logged in guest banner (supports testing and guest flow)
  if (!profile) {
    return (
      <>
        <Header />
        <main className="flex-1 py-16 sm:py-24 bg-[#f7f7f5] flex items-center justify-center px-4" dir="rtl">
          <div className="max-w-md w-full space-y-4">
            <nav aria-label="خطوات البدء" className="p-3.5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs text-xs font-mono">
              <div className="flex items-center justify-between text-[11px] text-[#55696a]">
                <span className="font-bold text-[#222f30] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#222f30] text-white flex items-center justify-center text-[10px] font-mono shadow-xs">1</span>
                  <span>الهوية والتسجيل</span>
                </span>
                <ChevronLeft className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" aria-hidden="true" />
                <Link href="/publish" className="hover:text-[#222f30] flex items-center gap-1.5 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#f0f2f0] text-[#55696a] flex items-center justify-center text-[10px] font-mono">2</span>
                  <span>نشر البحث</span>
                </Link>
                <ChevronLeft className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" aria-hidden="true" />
                <span className="text-[#738284] flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#f0f2f0] text-[#55696a] flex items-center justify-center text-[10px] font-mono">3</span>
                  <span>لوحة التحكم</span>
                </span>
              </div>
            </nav>

            <div className="p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-md text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#cef79e] text-[#222f30] flex items-center justify-center mx-auto font-bold">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-kufi text-[#222f30]">
                  لوحة تحكم الباحث المستقل
                </h1>
                <p className="text-xs text-[#55696a] mt-1.5">
                  سجّل الدخول للوصول إلى محفظة أبحاثك، ومتابعة إعادات التجارب المحققة وتوثيق أبحاث جديدة.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href="/sign-in?redirect_url=/dashboard"
                  prefetch={true}
                  className="block w-full py-3 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs"
                >
                  تسجيل الدخول كباحث
                </Link>

                <Link
                  href="/sign-up?redirect_url=/dashboard"
                  prefetch={true}
                  className="block w-full py-3 rounded-xl border border-[#e4e3e3] bg-white text-[#222f30] text-xs font-bold hover:bg-[#f5f8f7] transition-all shadow-xs"
                >
                  إنشاء حساب باحث جديد
                </Link>

                <button
                  type="button"
                  onClick={() => loginAsDemo("karkhi")}
                  className="w-full py-2.5 rounded-xl border border-[#cef79e] bg-[#f8fdf2] hover:bg-[#cef79e]/40 text-[#222f30] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>دخول تجريبي فوري (عمر الكرخي)</span>
                </button>

                <div className="pt-2 border-t border-[#e4e3e3] text-xs text-[#55696a]">
                  <span>أو ابدأ بدون تسجيل: </span>
                  <Link href="/publish" className="text-[#222f30] font-bold underline hover:text-[#a7e26e]">
                    توثيق كائن بحث كضيف ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Merge user-published papers with authored demo papers
  const authoredDemoPapers = RESEARCH_PAPERS.filter((p) =>
    (p.authors ?? []).some((a: unknown) => {
      const name = typeof a === "string" ? a : (a as { name?: string })?.name || "";
      return name.includes("عمر الكرخي") || (profile.name && name.includes(profile.name));
    })
  );

  const seenIds = new Set<string>();
  const myPapers = [...publishedPapers, ...authoredDemoPapers].filter((p) => {
    if (!p || !p.id || seenIds.has(p.id)) return false;
    seenIds.add(p.id);
    return true;
  });

  const handleSaveProfile = (updated: Partial<ResearcherProfile>) => {
    updateProfile(updated);
  };

  const handleAddReplication = (repData: Omit<UserReplication, "id" | "date">) => {
    addReplication(repData);
    updateProfile({
      stats: {
        ...profile.stats,
        replicationsCount: (profile.stats?.replicationsCount || 0) + 1,
        contributionsCount: (profile.stats?.contributionsCount || 0) + 1,
      },
    });
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-10 sm:py-14 bg-[#f7f7f5] text-[#222f30]" dir="rtl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Banner */}
          <DashboardHeader
            profile={profile}
            onEditProfile={() => setIsEditModalOpen(true)}
            onLogout={handleLogout}
            onManageAccount={handleManageAccount}
          />

          {/* Metrics Row */}
          <DashboardMetrics
            profile={profile}
            publishedCount={myPapers.length}
            replicationsCount={replications.length}
            onSelectTab={setActiveTab}
          />

          {/* Accessible Segmented Pill Navigation */}
          <nav aria-label="أقسام لوحة التحكم" className="bg-[#eaece9]/70 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto border border-[#e4e3e3]/70 scrollbar-none font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("research")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "research"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${activeTab === "research" ? "text-[#bef264]" : "text-[#738284]"}`} />
              <span>كائنات البحث</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                activeTab === "research" ? "bg-white/20 text-white" : "bg-[#dedfdc] text-[#55696a]"
              }`}>
                {myPapers.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("replications")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "replications"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
              }`}
            >
              <Repeat className={`w-3.5 h-3.5 ${activeTab === "replications" ? "text-purple-300" : "text-[#738284]"}`} />
              <span>إعادات التجارب والمراجعات</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                activeTab === "replications" ? "bg-white/20 text-white" : "bg-[#dedfdc] text-[#55696a]"
              }`}>
                {replications.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bookmarks")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "bookmarks"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${activeTab === "bookmarks" ? "text-blue-300" : "text-[#738284]"}`} />
              <span>المحفوظات والمسائل</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("api")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "api"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
              }`}
            >
              <Key className={`w-3.5 h-3.5 ${activeTab === "api" ? "text-[#bef264]" : "text-[#738284]"}`} />
              <span>واجهة البرمجة (API) والأدوات</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "settings"
                  ? "bg-[#222f30] text-white shadow-xs"
                  : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
              }`}
            >
              <Settings className={`w-3.5 h-3.5 ${activeTab === "settings" ? "text-amber-300" : "text-[#738284]"}`} />
              <span>الملف الشخصي والأمان</span>
            </button>
          </nav>

          {/* Active Tab View */}
          {activeTab === "research" && (
            <ResearchObjectsTab
              papers={myPapers}
              publishedPapers={publishedPapers}
            />
          )}

          {activeTab === "replications" && (
            <ReplicationsTab
              replications={replications}
              onOpenNewReplication={() => setIsReplicationModalOpen(true)}
              onRemoveReplication={removeReplication}
            />
          )}

          {activeTab === "bookmarks" && <BookmarksTab />}

          {activeTab === "api" && (
            <ApiHubTab
              profile={profile}
              onUpdateApiKey={(newKey) => updateProfile({ apiKey: newKey })}
            />
          )}

          {activeTab === "settings" && (
            <ProfileSettingsTab
              key={settingsSection}
              profile={profile}
              onUpdateProfile={handleSaveProfile}
              initialSection={settingsSection}
            />
          )}
        </div>
      </main>
      <Footer />

      {/* Modals */}
      <ProfileEditModal
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <ReplicationModal
        isOpen={isReplicationModalOpen}
        onClose={() => setIsReplicationModalOpen(false)}
        onSubmit={handleAddReplication}
      />
    </>
  );
}
