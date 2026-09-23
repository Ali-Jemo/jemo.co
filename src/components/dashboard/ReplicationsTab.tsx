"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Repeat,
  ShieldCheck,
  AlertTriangle,
  GitFork,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import type { UserReplication } from "@/lib/replications";
import { isSafeHttpUrl } from "@/lib/security-client";
import {
  cardClass,
  primaryBtnClass,
  outlineBtnClass,
  pillActiveClass,
  pillIdleClass,
  SectionHeader,
  EmptyState,
} from "@/components/dashboard/ui";

interface ReplicationsTabProps {
  replications: UserReplication[];
  onOpenNewReplication: () => void;
  onRemoveReplication: (id: string) => void;
}

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "verified", label: "إعادات محققة" },
  { id: "challenge", label: "تحديات ونقد" },
  { id: "extension", label: "تفريعات وتوسعات" },
] as const;

export default function ReplicationsTab({
  replications,
  onOpenNewReplication,
  onRemoveReplication,
}: ReplicationsTabProps) {
  const [filter, setFilter] = useState<"all" | "verified" | "challenge" | "extension">("all");

  const filteredReplications = replications.filter((r) => {
    if (filter === "all") return true;
    return r.type === filter;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Repeat className="w-5 h-5" />}
        accent="purple"
        title="مساحة إعادات التجارب والتدقيق النظير"
        en="Peer Replications"
        desc="العمود الفقري لمنظومة JEMO هو التحقق البشري الصارم (Proof of Work). كل فحص تكرره على نتائج النماذج يرفع موثوقية الأرشيف ويمنحك نقاط مساهمة بحثية معتمدة."
        action={
          <button
            type="button"
            onClick={onOpenNewReplication}
            className={primaryBtnClass}
          >
            <Plus className="w-4 h-4 text-[#bef264]" />
            <span>توثيق إعادة تجربة جديدة</span>
          </button>
        }
        footer={
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
            {FILTERS.map(({ id, label }) => {
              const isActive = filter === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive ? pillActiveClass : pillIdleClass
                  }`}
                >
                  <span>{label}</span>
                  {id === "all" && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? "bg-white/20 text-white" : "bg-[#f0f2f0] text-[#55696a]"}`}>
                      {replications.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        }
      />

      {/* Replications List */}
      {filteredReplications.length === 0 ? (
        <EmptyState
          icon={<Repeat className="w-7 h-7" />}
          accent="purple"
          title="لا توجد مراجعات مسجلة في هذا القسم"
          desc="شارك في إعادة فحص نتائج الأبحاث المنشورة، وثّق صحة الكود، واكشف الهلوسات البرمجية."
          action={
            <button
              type="button"
              onClick={onOpenNewReplication}
              className={primaryBtnClass}
            >
              <Plus className="w-4 h-4 text-[#bef264]" />
              <span>توثيق مراجعة بحث الآن</span>
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredReplications.map((rep) => (
            <div
              key={rep.id}
              className={`${cardClass} p-5 sm:p-6 space-y-4 hover:border-purple-300 hover:shadow-sm transition-all`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {rep.type === "verified" && (
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>إعادة تجربة محققة (Verified)</span>
                    </span>
                  )}
                  {rep.type === "challenge" && (
                    <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-mono text-xs font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>تحدي ونقد منهجي (Challenge)</span>
                    </span>
                  )}
                  {rep.type === "extension" && (
                    <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-mono text-xs font-bold flex items-center gap-1.5">
                      <GitFork className="w-3.5 h-3.5 text-purple-700" />
                      <span>توسيع منهجي (Extension)</span>
                    </span>
                  )}
                  <Link
                    href={`/research/${rep.paperSlug}`}
                    className="text-xs font-bold text-[#222f30] hover:text-purple-800 hover:underline transition-colors"
                  >
                    على بحث: {rep.paperTitle}
                  </Link>
                </div>

                <span className="text-xs font-mono text-[#738284]">{rep.date}</span>
              </div>

              <p className="text-xs text-[#55696a] leading-relaxed bg-[#f5f8f7] p-3.5 rounded-xl">
                <span className="font-bold text-[#222f30] ml-1">الملاحظة والنتيجة:</span>
                &ldquo;{rep.findings}&rdquo;
              </p>

              {rep.methodology && (
                <div className="p-3.5 rounded-xl bg-[#f5f8f7] text-xs text-[#55696a] flex items-start gap-2 leading-relaxed">
                  <strong className="text-[#222f30] shrink-0">المنهجية المستخدمة:</strong>
                  <span>{rep.methodology}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 border-t border-[#e4e3e3] text-xs font-mono">
                <div className="flex items-center gap-3 text-[#738284]">
                  {rep.reproducedAccuracy && (
                    <span>
                      نسبة المطابقة: <strong className="text-emerald-700 font-bold">{rep.reproducedAccuracy}%</strong>
                    </span>
                  )}
                  {rep.confidence && (
                    <span>
                      مستوى الثقة:{" "}
                      <strong className="text-[#222f30] font-semibold">
                        {rep.confidence === "high" ? "عالي" : rep.confidence === "medium" ? "متوسط" : "استكشافي"}
                      </strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {rep.evidenceUrl && isSafeHttpUrl(rep.evidenceUrl) && (
                    <a
                      href={rep.evidenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={outlineBtnClass}
                    >
                      <span>الأدلة والكود</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveReplication(rep.id)}
                    className="p-1.5 rounded-lg text-[#738284] hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    title="حذف المراجعة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
