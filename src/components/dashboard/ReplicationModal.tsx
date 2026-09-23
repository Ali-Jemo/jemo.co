"use client";

import React, { useState } from "react";
import { Check, Repeat, ShieldCheck, AlertTriangle, GitFork } from "lucide-react";
import { RESEARCH_PAPERS } from "@/lib/data/research-data";
import { isSafeHttpUrl } from "@/lib/security-client";
import type { UserReplication } from "@/lib/replications";
import {
  primaryBtnClass,
  outlineBtnClass,
  inputClass,
  textareaClass,
  ModalShell,
  Field,
} from "@/components/dashboard/ui";

interface ReplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<UserReplication, "id" | "date">) => void;
}

const REP_TYPES = [
  { id: "verified", label: "إثبات التجربة", icon: ShieldCheck, iconClass: "text-emerald-600", activeClass: "bg-emerald-50 border-emerald-500 text-emerald-800" },
  { id: "challenge", label: "تحدي / نقد", icon: AlertTriangle, iconClass: "text-amber-600", activeClass: "bg-amber-50 border-amber-500 text-amber-900" },
  { id: "extension", label: "توسيع منهجية", icon: GitFork, iconClass: "text-purple-600", activeClass: "bg-purple-50 border-purple-500 text-purple-900" },
] as const;

export default function ReplicationModal({
  isOpen,
  onClose,
  onSubmit,
}: ReplicationModalProps) {
  const [paperSlug, setPaperSlug] = useState(RESEARCH_PAPERS[0]?.slug || "");
  const [repType, setRepType] = useState<"verified" | "challenge" | "extension">("verified");
  const [findings, setFindings] = useState("");
  const [methodology, setMethodology] = useState("");
  const [confidence, setConfidence] = useState<"high" | "medium" | "exploratory">("high");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedPaper = RESEARCH_PAPERS.find((p) => p.slug === paperSlug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!findings.trim()) return;
    if (evidenceUrl.trim() && !isSafeHttpUrl(evidenceUrl.trim())) {
      setError("رابط غير صالح — يرجى إدخال رابط http(s)");
      return;
    }
    onSubmit({
      paperSlug,
      paperTitle: selectedPaper?.title || "كائن بحث مخصص",
      type: repType,
      findings: findings.trim(),
      methodology: methodology.trim(),
      confidence,
      evidenceUrl: evidenceUrl.trim(),
      reproducedAccuracy: repType === "verified" ? 95 : repType === "challenge" ? 82 : 90,
    });

    setTimeout(() => {
      setSubmitting(false);
      setFindings("");
      setMethodology("");
      onClose();
    }, 250);
  };

  return (
    <ModalShell
      titleId="replication-modal-title"
      icon={<Repeat className="w-5 h-5" />}
      accent="purple"
      title="توثيق إعادة تجربة أو مراجعة نظيرة"
      desc="سجل نتائج تدقيقك المنهجي لدعم التحقق البشري الصارم"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Field label="اختر كائن البحث المستهدف بالتدقيق">
          <select
            value={paperSlug}
            onChange={(e) => setPaperSlug(e.target.value)}
            className={inputClass}
          >
            {RESEARCH_PAPERS.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title.slice(0, 60)}... ({p.field})
              </option>
            ))}
          </select>
        </Field>

        <div>
          <span className="block font-bold text-[#222f30] mb-1.5 text-xs">نوع المراجعة / النتيجة</span>
          <div className="grid grid-cols-3 gap-2">
            {REP_TYPES.map(({ id, label, icon: Icon, iconClass, activeClass }) => (
              <button
                key={id}
                type="button"
                onClick={() => setRepType(id)}
                className={`p-2.5 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  repType === id
                    ? activeClass
                    : "bg-[#fcfdfc] border-[#e4e3e3] text-[#55696a]"
                }`}
              >
                <Icon className={`w-4 h-4 ${iconClass}`} />
                <span className="text-[11px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Field label="الملاحظات والنتائج التجريبية المستخلصة">
          <textarea
            required
            rows={3}
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            placeholder="صف ما حدث أثناء إعادة التجربة: هل تكررت النتائج؟ هل ظهرت هلوسات أو أخطاء في الذاكرة؟"
            className={textareaClass}
          />
        </Field>

        <Field label="المنهجية والأدوات المستخدمة في التدقيق">
          <input
            type="text"
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            placeholder="مثال: بيئة اختبار محلية، vLLM، eBPF، أو نصوص مقارنة جديدة"
            className={inputClass}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="مستوى الثقة في التكرار">
            <select
              value={confidence}
              onChange={(e) => setConfidence(e.target.value as "high" | "medium" | "exploratory")}
              className={inputClass}
            >
              <option value="high">مرتفعة (High Confidence)</option>
              <option value="medium">متوسطة (Medium)</option>
              <option value="exploratory">استكشافية (Exploratory)</option>
            </select>
          </Field>

          <Field label="رابط مستودع الأدلة / الكود">
            <input
              type="text"
              dir="ltr"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://github.com/..."
              className={`${inputClass} font-mono`}
            />
          </Field>
        </div>
        {error && (
          <p className="text-xs text-rose-600 font-bold text-center">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#e4e3e3]">
          <button
            type="button"
            onClick={onClose}
            className={outlineBtnClass}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={primaryBtnClass}
          >
            <Check className="w-4 h-4 text-[#bef264]" />
            <span>{submitting ? "جارٍ التوثيق..." : "توثيق النتيجة"}</span>
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
