"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import { useState } from "react";
import { GithubIcon } from "@/components/Icons";
import { Mail, Send, MessageSquare, Check, ArrowUpLeft } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-[var(--bg)]">
        <div className="container max-w-4xl">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] text-xs font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>التواصل المباشر</span>
            </div>
            <h1 className="text-4xl font-extrabold text-[var(--ink-1)]">تواصل مع JEMO LABS</h1>
            <p className="text-[var(--ink-2)] text-base leading-relaxed">
              يسعدنا استلام استفسارات الباحثين، اقتراحات التمويل، وطلبات التعاون الأكاديمي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Direct Channels */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6">قنوات التواصل الرسمية</h2>

              <a
                href="mailto:contact@jemo.co"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">البريد الإلكتروني</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">contact@jemo.co</div>
                </div>
              </a>

              <a
                href="https://t.me/jemo_research"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">قناة Telegram الأكاديمية</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">t.me/jemo_research</div>
                </div>
              </a>

              <a
                href="https://github.com/Ali-Jemo/ziqa-kernal"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 text-[var(--ink-1)] flex items-center justify-center">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">مستودعات GitHub</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">github.com/Ali-Jemo</div>
                </div>
              </a>

              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">مجتمع Discord العلمي</div>
                  <div className="font-bold text-[var(--ink-1)]">JEMO LABS Community</div>
                </div>
              </a>
            </div>

            {/* Message Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6">نموذج الرسائل المباشرة</h2>

              {submitted ? (
                <div className="p-8 text-center bg-[var(--brand)]/10 rounded-2xl border border-[var(--brand)]/30 space-y-4">
                  <Check className="w-8 h-8 text-[var(--brand)] mx-auto" />
                  <h3 className="text-xl font-bold text-[var(--ink-1)]">تم إرسال رسالتك!</h3>
                  <p className="text-xs text-[var(--ink-2)]">سيرد عليك أحد باحثي المؤسسة خلال 24 ساعة.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">الاسم *</label>
                    <input
                      required
                      type="text"
                      placeholder="اسمك الكريم"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">البريد الإلكتروني *</label>
                    <input
                      required
                      type="email"
                      placeholder="name@domain.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none dir-ltr text-right"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">موضوع الرسالة *</label>
                    <input
                      required
                      type="text"
                      placeholder="عنوان الاستفسار"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-[var(--ink-1)] mb-1">الرسالة *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="اكتب رسالتك تفصيلاً هنا..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink-1)] focus:border-[var(--brand)] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[var(--brand)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <span>إرسال الرسالة</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
