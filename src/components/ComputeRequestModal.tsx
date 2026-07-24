"use client";

import { useState } from "react";
import { Server, Check, X, ArrowUpLeft, Cpu } from "lucide-react";

export default function ComputeRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    institution: "",
    resource: "Baghdad-1 HPC Cluster (NVIDIA H100)",
    proposal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                <h4 className="font-bold text-lg text-[var(--ink-1)]">تم تسجيل طلب الساعات الحوسبية!</h4>
                <p className="text-xs text-[var(--ink-2)]">
                  سيتواصل معك فريق إدارة الخوادم لتقييم المقترح وتخصيص الموارد المناسبة.
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
                    <option value="Baghdad-1 HPC Cluster (NVIDIA H100)">Baghdad-1 HPC Cluster (NVIDIA H100)</option>
                    <option value="RISC-V Silicon Testbed (Ziqa OS Testing)">RISC-V Silicon Testbed (Ziqa OS Testing)</option>
                    <option value="Multispectral Scanner & Vision Pipeline">Multispectral Scanner & Vision Pipeline</option>
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

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[var(--brand)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>تقديم مقترح التخصيص</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
