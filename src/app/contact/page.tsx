import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GithubIcon } from "@/components/Icons";
import { Mail, Send, Globe, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "تواصل معنا | JEMO LABS",
  description: "قنوات التواصل المباشرة والبريد الإلكتروني لمؤسسة JEMO LABS للأبحاث والأنظمة السيادية.",
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
              يسعدنا استلام استفسارات المطورين والباحثين، طلبات التعاون التقني، والمساهمة في النظم المفتوحة.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[var(--ink-1)] mb-6 text-center">قنوات التواصل المباشرة</h2>

              <a
                href="mailto:ali.jemo1.9@gmail.com"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">البريد الإلكتروني المباشر</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">ali.jemo1.9@gmail.com</div>
                </div>
              </a>

              <a
                href="https://t.me/alijemo"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">حساب Telegram</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">t.me/alijemo (@alijemo)</div>
                </div>
              </a>

              <a
                href="tel:+9647709763396"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">الهاتف المباشر</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">+964 770 976 3396</div>
                </div>
              </a>

              <a
                href="https://ali.lxds.org/"
                target="_blank"
                rel="noreferrer"
                className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] transition-all flex items-center gap-4 block"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-[var(--ink-2)] font-mono">الموقع الشخصي للمؤسس</div>
                  <div className="font-bold text-[var(--ink-1)] dir-ltr text-right">ali.lxds.org</div>
                </div>
              </a>

              <a
                href="https://github.com/Ali-Jemo"
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
