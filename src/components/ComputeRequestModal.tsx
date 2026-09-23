"use client";

import { useState } from "react";
import { Server, Check, X, ArrowUpLeft, Cpu, Loader2 } from "lucide-react";
import { COMPUTE_RESOURCES } from "@/lib/compute-resources";
export default function ComputeRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    institution: string;
    resource: string;
    proposal: string;
  }>({
    name: "",
    email: "",
    institution: "",
    resource: COMPUTE_RESOURCES[0].id,
    proposal: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "compute",
          name: form.name,
          email: form.email,
          institution: form.institution,
          resource: form.resource,
          proposal: form.proposal,
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
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand)] text-white text-xs font-bold shadow-md hover:opacity-90 transition-all"
      >
        <Server className="w-4 h-4" />
        <span>طلب ساعات حوسبة أبحاث (Request Compute Time)</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--bg)] border border-[var(--line)] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[var(--brand)]" />
                <h3 className="font-bold text-base text-[var(--ink-1)]">طلب الوصول للبنية التحتية الحوسبية</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--surface)] text-[var(--ink-2)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-6 text-center bg-[var(--brand)]/10 rounded-2xl border border-[var(--brand)]/30 space-y-3">
                <Check className="w-8 h-8 text-[var(--brand)] mx-auto" />
                <h4 className="font-bold text-lg text-[var(--ink-1)]">تم استلام طلبك بنجاح!</h4>
                <p className="text-xs text-[var(--ink-2)]">
                  تم استلام طلبك بنجاح — سنراجعه ونعاود التواصل عبر البريد.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-right">
                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">اسم الباحث الرئيسي *</label>
                  <input
                    required
                    type="text"
                    placeholder="اسمك الكامل"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">الجامعة أو المؤسسة الأكاديمية *</label>
                  <input
                    required
                    type="text"
                    placeholder="مثال: جامعة بغداد"
                    value={form.institution}
                    onChange={(e) => setForm({ ...form, institution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">البريد الإلكتروني المؤسسي *</label>
                  <input
                    required
                    type="email"
                    placeholder="researcher@edu.iq"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">المورد الحوسبي المطلوب *</label>
                  <select
                    value={form.resource}
                    onChange={(e) => setForm({ ...form, resource: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-xs font-mono font-bold text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                  >
                    {COMPUTE_RESOURCES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">ملخص مقترح البحث والاحتياج الحوسبي *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="اشرح الهدف من التجربة والساعات الحوسبية التقديرية..."
                    value={form.proposal}
                    onChange={(e) => setForm({ ...form, proposal: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-500 font-bold text-center">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-[var(--brand)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>تقديم مقترح التخصيص</span>
                      <ArrowUpLeft className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
