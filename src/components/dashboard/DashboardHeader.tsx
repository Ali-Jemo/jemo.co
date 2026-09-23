"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Plus,
  LogOut,
  Edit3,
  ShieldCheck,
  Building,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { isSafeHttpUrl } from "@/lib/security-client";
import type { ResearcherProfile } from "@/lib/auth-context";
import {
  heroDangerBtnClass,
  heroGhostBtnClass,
  heroPrimaryBtnClass,
} from "@/components/dashboard/ui";

interface DashboardHeaderProps {
  profile: ResearcherProfile;
  onEditProfile: () => void;
  onLogout: () => void;
  onManageAccount?: () => void;
}

export default function DashboardHeader({
  profile,
  onEditProfile,
  onLogout,
  onManageAccount,
}: DashboardHeaderProps) {
  const avatarIsImage =
    profile.avatar.startsWith("http") || profile.avatar.startsWith("/");
  const isClerkAvatar = profile.avatar.startsWith("http");
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#222f30] text-white shadow-xs">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#cef79e]/10 blur-3xl" />
        <div className="absolute -bottom-28 right-1/4 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative p-6 sm:p-8 space-y-6">
        {/* Slim pathway */}
        <nav aria-label="مسار الباحث الأكاديمي" className="flex items-center gap-2 text-[11px] font-mono text-white/50">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-[#cef79e] text-[#162224] flex items-center justify-center text-[9px] font-bold">✓</span>
            <span className="text-white/80">هوية الباحث: {profile.name}</span>
          </span>
          <span aria-hidden="true" className="text-white/25">/</span>
          <span>توثيق بحث جديد</span>
          <span aria-hidden="true" className="text-white/25">/</span>
          <span className="text-[#cef79e] font-bold">لوحة التحكم والمحفظة</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Info */}
          <div className="flex items-start sm:items-center gap-4">
            {avatarIsImage ? (
              <Image
                src={profile.avatar}
                alt={profile.name}
                width={64}
                height={64}
                unoptimized={isClerkAvatar}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#cef79e]/70 shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/10 text-[#cef79e] flex items-center justify-center font-bold font-mono text-xl border-2 border-[#cef79e]/70 shrink-0">
                {profile.name.slice(0, 2)}
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-kufi text-white">
                  {profile.name}
                </h1>
                <span className="text-xs font-mono text-white/50 dir-ltr text-right">
                  {profile.handle}
                </span>

                {profile.isDemo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-200 border border-amber-300/20 font-mono text-[10px] font-bold">
                    حساب تجريبي (Demo Mode)
                  </span>
                )}

                {profile.isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#cef79e] text-[#162224] font-mono text-[10px] font-bold">
                    JEMO FOUNDER & CORE
                  </span>
                )}
              </div>

              <p className="text-xs text-white/70 font-medium">
                {profile.role} · <span className="text-white font-semibold">{profile.domain}</span>
              </p>

              {profile.institution && (
                <div className="flex items-center gap-1 text-xs text-white/60">
                  <Building className="w-3.5 h-3.5" />
                  <span>{profile.institution}</span>
                </div>
              )}

              {/* Badges & Meta */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[#cef79e] font-bold border border-white/10">
                  {profile.researchId}
                </span>
                <span className="bg-[#cef79e]/10 border border-[#cef79e]/25 text-[#cef79e] px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>باحث معتمد (Proof of Work Tier 1)</span>
                </span>

                {profile.orcidId && (
                  <a
                    href={`https://orcid.org/${profile.orcidId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-all flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3 h-3 text-[#cef79e]" />
                    <span>ORCID</span>
                  </a>
                )}

                {profile.githubHandle && (
                  <a
                    href={
                      isSafeHttpUrl(profile.githubHandle)
                        ? profile.githubHandle
                        : `https://github.com/${encodeURIComponent(profile.githubHandle.replace(/^@/, "").trim())}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/25 transition-all flex items-center gap-1.5"
                  >
                    <GithubIcon className="w-3 h-3 text-white" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/publish"
              className={heroPrimaryBtnClass}
            >
              <Plus className="w-4 h-4" />
              <span>وثّق كائن بحث جديد</span>
            </Link>

            <button
              type="button"
              onClick={onEditProfile}
              className={heroGhostBtnClass}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#cef79e]" />
              <span>تعديل الملف</span>
            </button>

            {onManageAccount && !profile.isDemo && (
              <button
                type="button"
                onClick={onManageAccount}
                className={heroGhostBtnClass}
                title="إدارة الحساب والأمان عبر Clerk"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#cef79e]" />
                <span>إدارة الحساب والأمان</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className={heroDangerBtnClass}
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>

        {profile.bio && (
          <div className="pt-4 border-t border-white/10">
            <p className="max-w-3xl text-xs text-white/70 leading-relaxed">
              <span className="font-bold text-[#cef79e] ml-1.5">النبذة العلمية:</span>
              {profile.bio}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
