import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import { GithubIcon } from "@/components/Icons";
import { Mail, MessageSquare, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "تواصل معنا | JEMO LABS",
  description: "قنوات التواصل المباشرة والبريد الإلكتروني لمؤسسة JEMO LABS للأبحاث.",
};

export default function ContactPage() {
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

          <div className="max-w-2xl mx-auto mb-16">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 text-center">قنوات التواصل الرسمية</h2>

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
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
