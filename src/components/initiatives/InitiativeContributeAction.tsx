"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, CheckCircle2, Rocket, Loader2, ArrowLeft, Send } from "lucide-react";

interface InitiativeContributeActionProps {
  slug: string;
  title: string;
}

export default function InitiativeContributeAction({
  slug,
  title,
}: InitiativeContributeActionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setError(null);
    if (submitted) {
      setName("");
      setEmail("");
      setMessage("");
      setSubmitted(false);
    }
  }, [submitted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/initiatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          initiative: slug,
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error || "تم تجاوز الحد الأقصى للمحاولات. يرجى الانتظار والمحاولة لاحقاً.");
        } else {
          setError(data.error || "حدث خطأ أثناء إرسال طلب المساهمة. يرجى إعادة المحاولة.");
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setError("تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    "w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] placeholder-[var(--ink-2)]/50 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 outline-none transition-all";

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-5 py-3 rounded-xl bg-[var(--brand)] text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xs cursor-pointer"
      >
        <Rocket className="w-4 h-4" />
        <span>ساهم في المبادرة</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="initiative-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
          onClick={handleClose}
        >
          <div
            className="relative bg-[var(--surface)] border border-[var(--line)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-right font-kufi"
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/15 text-[var(--brand)] flex items-center justify-center shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="initiative-modal-title" className="font-kufi font-bold text-base sm:text-lg text-[var(--ink-1)]">
                    المساهمة في المبادرة
                  </h3>
                  <p className="text-xs text-[var(--ink-2)] font-mono line-clamp-1">
                    {title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="إغلاق النافذة"
                className="p-2 rounded-xl text-[var(--ink-2)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-kufi font-bold text-lg sm:text-xl text-[var(--ink-1)]">
                    تم استلام طلب مساهمتك في المبادرة بنجاح!
                  </h4>
                  <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed max-w-sm mx-auto">
                    سيتواصل معك منسق المبادرة عبر البريد لمناقشة آليات التعاون والخطوات القادمة.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-all cursor-pointer"
                  >
                    إغلاق النافذة
                  </button>
                  <Link
                    href="/join"
                    onClick={handleClose}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] hover:border-[var(--brand)] transition-colors"
                  >
                    <span>أو استكشف برامج الزمالة العامة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="contribute-name" className="block text-xs font-bold text-[var(--ink-1)] mb-1.5">
                    الاسم الكامل *
                  </label>
                  <input
                    id="contribute-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علي حسين (مهندس برمجيات)"
                    className={inputBase}
                  />
                </div>

                <div>
                  <label htmlFor="contribute-email" className="block text-xs font-bold text-[var(--ink-1)] mb-1.5">
                    البريد الإلكتروني *
                  </label>
                  <input
                    id="contribute-email"
                    type="email"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className={`${inputBase} text-right dir-ltr`}
                  />
                </div>

                <div>
                  <label htmlFor="contribute-message" className="block text-xs font-bold text-[var(--ink-1)] mb-1.5">
                    مجال المساهمة أو رسالتك *
                  </label>
                  <textarea
                    id="contribute-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اشرح خبرتك أو ما تود تقديمه (برمجة، عتاد، مراجعة، تدريب، أو تنسيق أكاديمي)..."
                    className={`${inputBase} resize-y`}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-[var(--line)] text-xs font-bold text-[var(--ink-2)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري الإرسال...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>إرسال طلب المساهمة</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
