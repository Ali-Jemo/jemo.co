"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, Send, Building2, Cpu, DollarSign, MessageSquare, Loader2 } from "lucide-react";
export interface SupportInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export default function SupportInquiryModal({
  isOpen,
  onClose,
  defaultCategory = "institutional",
}: SupportInquiryModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState(defaultCategory);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    amountOrOffer: "",
    message: "",
  });
  useEffect(() => {
    setCategory(defaultCategory);
  }, [defaultCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "support",
          name: form.name,
          email: form.email,
          category,
          organization: form.organization,
          amountOrOffer: form.amountOrOffer,
          message: form.message,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "fail");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error && err.message !== "fail" ? err.message : "حدث خطأ غير متوقع — أعد المحاولة");
    } finally {
      setSubmitting(false);
    }
  };
  const handleResetAndClose = () => {
    setSubmitted(false);
    setForm({
      name: "",
      email: "",
      organization: "",
      amountOrOffer: "",
      message: "",
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={handleResetAndClose}
    >
      <div
        className="relative bg-[var(--surface)] border border-[var(--line)] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-right"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#cef79e] text-[#222f30] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="font-kufi font-bold text-lg text-[var(--ink-1)]">
                تواصل الرعاية والدعم العلمي
              </h3>
              <p className="text-xs text-[var(--ink-2)] font-mono">PARTNERSHIP & GRANTS INQUIRY</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            aria-label="إغلاق النافذة"
            className="p-2 rounded-xl text-[var(--ink-2)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#cef79e] text-[#222f30] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-kufi font-bold text-xl text-[var(--ink-1)]">
              تم استلام مقترحك بنجاح!
            </h4>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed max-w-sm mx-auto">
              تم استلام طلبك بنجاح — سنراجعه ونعاود التواصل عبر البريد.
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-full bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-all"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--ink-1)] mb-2">
                نوع الرعاية أو المساهمة *
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setCategory("institutional")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    category === "institutional"
                      ? "border-[#728825] bg-[#cef79e]/30 font-bold text-[#222f30]"
                      : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-2)]"
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1" />
                  رعاية مؤسسية / جامعة
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("compute")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    category === "compute"
                      ? "border-[#728825] bg-[#cef79e]/30 font-bold text-[#222f30]"
                      : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-2)]"
                  }`}
                >
                  <Cpu className="w-4 h-4 mx-auto mb-1" />
                  تبرع بحوسبة أو عتاد
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("grant")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    category === "grant"
                      ? "border-[#728825] bg-[#cef79e]/30 font-bold text-[#222f30]"
                      : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-2)]"
                  }`}
                >
                  <DollarSign className="w-4 h-4 mx-auto mb-1" />
                  منحة مالية / تحويل بنكي
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("custom")}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    category === "custom"
                      ? "border-[#728825] bg-[#cef79e]/30 font-bold text-[#222f30]"
                      : "border-[var(--line)] bg-[var(--surface-2)] text-[var(--ink-2)]"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 mx-auto mb-1" />
                  استفسار أو تعاون آخر
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink-1)] mb-1">
                  الاسم الكامل / جهة الاتصال *
                </label>
                <input
                  required
                  type="text"
                  placeholder="مثال: د. أحمد التميمي"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[#728825] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink-1)] mb-1">
                  البريد الإلكتروني الرسمي *
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@institution.edu"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[#728825] focus:outline-none transition-colors dir-ltr text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--ink-1)] mb-1">
                  المؤسسة / الشركة / الجامعة
                </label>
                <input
                  type="text"
                  placeholder="جامعة بغداد، شركة تقنية..."
                  value={form.organization}
                  onChange={(e) => setForm({ ...form, organization: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[#728825] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--ink-1)] mb-1">
                  حجم التبرع المقترح / الموارد
                </label>
                <input
                  type="text"
                  placeholder="مثال: 500$، أو ساعات سحابية، أو دعم برمجي..."
                  value={form.amountOrOffer}
                  onChange={(e) => setForm({ ...form, amountOrOffer: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[#728825] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--ink-1)] mb-1">
                تفاصيل المقترح أو رغبة الرعاية *
              </label>
              <textarea
                required
                rows={3}
                placeholder="وضح كيف ترغب في المساهمة، وما هي المجالات أو الأوراق التي تود دعمها..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[#728825] focus:outline-none transition-colors resize-none"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 font-bold text-center">{error}</p>
            )}
            <div className="pt-2 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2.5 rounded-xl border border-[var(--line)] text-xs font-bold text-[var(--ink-2)] hover:bg-[var(--surface-hover)] transition-colors"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-bold shadow-md hover:opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال مقترح الرعاية</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
