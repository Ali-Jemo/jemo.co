import Image from "next/image";
import Link from "next/link";
import AnimatedUnderline from "@/components/AnimatedUnderline";
import { GithubIcon } from "@/components/Icons";
import { Send, Mail, MessageSquare, ShieldCheck, HeartHandshake, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pt-16 pb-10 mt-auto relative overflow-hidden atmo">
      {/* Atmospheric orbs */}
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-[var(--brand)]/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[var(--gold)]/[0.03] blur-3xl pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-14">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-mono font-bold text-xl mb-4">
              <Image
                src="/jemo-logo.svg"
                alt="JEMO LABS"
                className="h-8 w-auto"
                width={40}
                height={40}
              />
            </Link>

            <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4 max-w-md font-sans">
              بيت الحكمة الرقمي — مؤسسة مستقلة لجميع العلوم: الشرعية والإسلامية، الذكاء الاصطناعي والحاسوب، الطبيعية والطبية، والإنسانية — معرفة مفتوحة للجميع.
            </p>

            <div className="flex items-center gap-3">
              <a href="https://t.me/jemolabs" target="_blank" rel="noopener noreferrer" className="text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors">
                <Send className="w-4 h-4" />
              </a>
              <a href="https://x.com/jemolabs" target="_blank" rel="noopener noreferrer" className="text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="https://github.com/jemo-labs" target="_blank" rel="noopener noreferrer" className="text-[var(--ink-2)] hover:text-[var(--brand)] transition-colors">
                <GithubIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">الأبحاث والنتائج</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
              <li>
                <a href="/research" className="hover:text-[var(--brand)] transition-colors">أبحاث منشورة</a>
              </li>
              <li>
                <a href="/timeline" className="hover:text-[var(--brand)] transition-colors">التسلسل الزمني</a>
              </li>
              <li>
                <a href="/gallery" className="hover:text-[var(--brand)] transition-colors">المعرض</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">المؤسسة والمجتمع</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
              <li>
                <a href="/about" className="hover:text-[var(--brand)] transition-colors">من نحن</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[var(--brand)] transition-colors">تواصل معنا</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-[var(--brand)] transition-colors">الأسئلة الشائعة</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">النشر والتواصل</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
              <li>
                <a href="/newsletter" className="hover:text-[var(--brand)] transition-colors">نشرة الشركة</a>
              </li>
              <li>
                <a href="/initiatives" className="hover:text-[var(--brand)] transition-colors">المبادرات</a>
              </li>
              <li>
                <a href="/apply" className="hover:text-[var(--brand)] transition-colors">التقديم</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Status Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-5 mb-6 border-y border-[var(--line)]/50">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path className="stroke-2" d="M12 2v7l5 5" />
            </svg>
            التشغيل ممتاز
          </div>
          {[
            { label: "2024", value: "1,243" },
            { label: "2023", value: "987" },
            { label: "2022", value: "765" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-[10px] font-mono text-[var(--ink-2)]">
              {s.label}: {s.value}
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--line)] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-2)]">
          <div className="flex items-center gap-2">
            © {new Date().getFullYear()} JEMO LABS — بيت الحكمة الرقمي
          </div>
          <div className="font-mono text-xs text-[var(--brand)] flex items-center gap-3">
            <a href="/privacy" className="hover:text-[var(--brand)] transition-colors">سياسة الخصوصية</a>
            <a href="/terms" className="hover:text-[var(--brand)] transition-color">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  );
}