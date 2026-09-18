"use client";

import React, { useState } from "react";
import {
  User,
  Edit3,
  BookOpen,
  Lock,
  CheckCircle2,
  Award,
  Check,
  Save,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { UserProfile, Show } from "@clerk/nextjs";
import type { ResearcherProfile } from "@/lib/auth-context";
import { clerkUserProfileAppearance } from "@/lib/clerk-appearance";
import {
  cardClass,
  primaryBtnClass,
  inputClass,
  textareaClass,
  SectionHeader,
  IconChip,
} from "@/components/dashboard/ui";

interface ProfileSettingsTabProps {
  profile: ResearcherProfile;
  onUpdateProfile: (updated: Partial<ResearcherProfile>) => void;
  initialSection?: "academic" | "account" | "tier";
}

export default function ProfileSettingsTab({
  profile,
  onUpdateProfile,
  initialSection = "academic",
}: ProfileSettingsTabProps) {
  const [activeSection, setActiveSection] = useState<"academic" | "account" | "tier">(initialSection);

  // Editable academic profile state
  const [academicData, setAcademicData] = useState({
    name: profile.name || "",
    role: profile.role || "",
    domain: profile.domain || "",
    institution: profile.institution || "",
    bio: profile.bio || "",
    githubHandle: profile.githubHandle || "",
    orcidId: profile.orcidId || "",
    scholarUrl: profile.scholarUrl || "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(academicData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const currentTier = (profile.stats.replicationsCount || 0) >= 5 ? 2 : 1;
  const progressToNextTier = Math.min(100, Math.round(((profile.stats.replicationsCount || 0) / 5) * 100));

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher */}
      <nav aria-label="أقسام إعدادات الملف" className="p-1.5 rounded-2xl bg-[#eaece9]/70 border border-[#e4e3e3]/70 shadow-xs flex flex-wrap items-center gap-1.5 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveSection("academic")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === "academic"
              ? "bg-[#222f30] text-white shadow-xs"
              : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
          }`}
        >
          <User className="w-3.5 h-3.5 text-[#bef264]" />
          <span>الملف الأكاديمي والبحثي (Research Profile)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("account")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === "account"
              ? "bg-[#222f30] text-white shadow-xs"
              : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-[#a7e26e]" />
          <span>إدارة الحساب والأمان (Clerk Account Suite)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection("tier")}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === "tier"
              ? "bg-[#222f30] text-white shadow-xs"
              : "text-[#55696a] hover:text-[#222f30] hover:bg-white/60"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          <span>مستوى التحقق (Proof of Work Tier {currentTier})</span>
        </button>
      </nav>

      {/* Section 1: Academic Profile Editor */}
      {activeSection === "academic" && (
        <div className="space-y-6">
          <form
            onSubmit={handleSaveAcademic}
            className={`${cardClass} p-5 sm:p-6 space-y-6`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e4e3e3]">
              <div className="flex items-start gap-3">
                <IconChip accent="lime" size="lg">
                  <Edit3 className="w-5 h-5" />
                </IconChip>
                <div>
                  <h2 className="text-lg font-bold font-kufi text-[#222f30]">
                    <span>تعديل الهوية البحثية والأكاديمية</span>
                  </h2>
                  <p className="text-xs text-[#55696a] mt-0.5">
                    هذه البيانات تظهر على أوراقك المنشورة وسجل استشهاداتك داخل المنظومة
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className={`${primaryBtnClass} self-start sm:self-center shrink-0`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تم حفظ التغييرات بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#bef264]" />
                    <span>حفظ التعديلات</span>
                  </>
                )}
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#222f30] mb-1.5">الاسم الأكاديمي الكامل</label>
                <input
                  type="text"
                  required
                  value={academicData.name}
                  onChange={(e) => setAcademicData({ ...academicData, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-bold text-[#222f30] mb-1.5">المسمى والدور العلمي</label>
                <input
                  type="text"
                  value={academicData.role}
                  onChange={(e) => setAcademicData({ ...academicData, role: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-bold text-[#222f30] mb-1.5">مجال البحث والتخصص الدقيق</label>
                <input
                  type="text"
                  value={academicData.domain}
                  onChange={(e) => setAcademicData({ ...academicData, domain: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-bold text-[#222f30] mb-1.5">المؤسسة الأكاديمية / المختبر</label>
                <input
                  type="text"
                  value={academicData.institution}
                  onChange={(e) => setAcademicData({ ...academicData, institution: e.target.value })}
                  placeholder="مثال: جامعة بغداد، أو مستقل (Independent)"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#222f30] mb-1.5">النبذة العلمية (Bio)</label>
              <textarea
                rows={3}
                value={academicData.bio}
                onChange={(e) => setAcademicData({ ...academicData, bio: e.target.value })}
                placeholder="صف مجالات اهتمامك العلمي ومشاريعك الحالية..."
                className={textareaClass}
              />
            </div>

            {/* Academic Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#e4e3e3] text-xs">
              <div>
                <label className="block font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-[#222f30]" />
                  <span>رابط مستودع GitHub</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={academicData.githubHandle}
                  onChange={(e) => setAcademicData({ ...academicData, githubHandle: e.target.value })}
                  placeholder="https://github.com/username"
                  className={`${inputClass} font-mono`}
                />
              </div>

              <div>
                <label className="block font-bold text-[#222f30] mb-1.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>معرف ORCID الأكاديمي</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={academicData.orcidId}
                  onChange={(e) => setAcademicData({ ...academicData, orcidId: e.target.value })}
                  placeholder="0000-0002-1825-0097"
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          </form>

          {/* Identity Preview Card */}
          <div className="p-6 rounded-3xl bg-[#fcfdfc] border border-[#e4e3e3] space-y-3.5">
            <span className="text-[11px] font-mono text-[#738284] block">معاينة بطاقة الباحث في الأرشيف:</span>
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-[#e4e3e3]/70 shadow-xs max-w-md">
              <div className="w-12 h-12 rounded-xl bg-[#222f30] text-[#bef264] flex items-center justify-center font-bold font-mono text-base border-2 border-[#cef79e] shrink-0">
                {academicData.name.slice(0, 2) || "J"}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm font-kufi text-[#222f30]">{academicData.name || "اسم الباحث"}</span>
                  <span className="text-xs font-mono text-[#55696a]">{profile.handle}</span>
                </div>
                <div className="text-xs text-[#55696a]">
                  {academicData.role || "باحث مستقل"} · <span className="text-[#222f30] font-semibold">{academicData.domain || "العلوم والذكاء"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Clerk Account & Security Suite */}
      {activeSection === "account" && (
        <div className="space-y-6">
          <SectionHeader
            icon={<Lock className="w-5 h-5" />}
            accent="dark"
            title="جناح أمان الحساب وإدارة الجلسات"
            en="Clerk Account Suite"
            desc="يمكنك هنا إدارة وتعديل كافة بياناتك الأساسية: تغيير وتحديث الصورة الشخصية، إدارة البريد الإلكتروني، كلمات المرور، المصادقة الثنائية (2FA)، وتتبع الأجهزة والجلسات النشطة."
          />

          <Show when="signed-in">
            <div className="w-full" dir="ltr">
              <UserProfile
                routing="hash"
                appearance={clerkUserProfileAppearance}
              />
            </div>
          </Show>

          {profile.isDemo && (
            <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-center space-y-3">
              <h3 className="text-sm font-bold font-kufi text-amber-900">
                أنت تستخدم حساباً تجريبياً (Demo Mode: {profile.name})
              </h3>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                لإدارة كلمات المرور والمصادقة الثنائية وتغيير البريد الإلكتروني الفعلي، سجّل حساب باحث حقيقي عبر Clerk لحفظ كافة أبحاثك بشكل دائم.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Section 3: Proof of Work Tier System */}
      {activeSection === "tier" && (
        <div className={`${cardClass} p-5 sm:p-6 space-y-6`}>
          <div className="flex items-center justify-between pb-4 border-b border-[#e4e3e3]">
            <div className="flex items-center gap-2.5">
              <IconChip accent="emerald" size="lg">
                <Award className="w-5 h-5" />
              </IconChip>
              <div>
                <h2 className="text-lg font-bold font-kufi text-[#222f30] flex flex-wrap items-center gap-2">
                  <span>مستويات التحقق البشري الصارم</span>
                  <span className="text-xs font-mono text-[#738284] px-2.5 py-0.5 rounded-md bg-[#f0f2f0] border border-[#e4e3e3]/60">
                    <bdi>Proof of Work Tiers</bdi>
                  </span>
                </h2>
                <p className="text-xs text-[#55696a] mt-0.5">
                  معيار الأمان الأكاديمي لضمان عدم قبول الأبحاث غير القابلة للتكرار
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-mono text-xs font-bold">
              مستواك الحالي: Tier {currentTier}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className={`p-5 rounded-2xl border transition-all ${
              currentTier >= 1 ? "bg-emerald-50/50 border-emerald-300" : "bg-[#fcfdfc] border-[#e4e3e3]"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold font-kufi text-sm text-[#222f30]">Tier 1: باحث معتمد</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-[#55696a] text-[11px] leading-relaxed">
                توثيق ونشر كائنات بحثية، استخراج اقتباسات BibTeX، والوصول إلى مفاتيح الـ API.
              </p>
            </div>

            <div className={`p-5 rounded-2xl border transition-all ${
              currentTier >= 2 ? "bg-emerald-50/50 border-emerald-300" : "bg-[#fcfdfc] border-[#e4e3e3]"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold font-kufi text-sm text-[#222f30]">Tier 2: مدقق نظير (Auditor)</span>
                {currentTier >= 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <span className="text-[10px] font-mono text-[#738284]">قيد الإنجاز</span>}
              </div>
              <p className="text-[#55696a] text-[11px] leading-relaxed">
                إنجاز 5 إعادات تجارب محققة، القدرة على مراجعة ونقد مساهمات الباحثين الآخرين، وإصدار شارات التدقيق.
              </p>
            </div>

            <div className="p-5 rounded-2xl border bg-[#fcfdfc] border-[#e4e3e3]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold font-kufi text-sm text-[#222f30]">Tier 3: زميل أبحاث رائد</span>
                <span className="text-[10px] font-mono text-[#738284]">مستوى متقدم</span>
              </div>
              <p className="text-[#55696a] text-[11px] leading-relaxed">
                قيادة مختبر أبحاث سيادي في JEMO LABS، وإشراف على ميزانيات الدعم التشغيلي للأجهزة والمختبرات.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#738284]">
              <span>التقدم نحو ترقية المستوى:</span>
              <span>{profile.stats.replicationsCount || 0} من أصل 5 إعادات محققة ({progressToNextTier}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#f0f2f0] overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextTier}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
