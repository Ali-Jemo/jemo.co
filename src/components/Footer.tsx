import Link from "next/link";
import AnimatedUnderline from "@/components/AnimatedUnderline";
import { GithubIcon } from "@/components/Icons";
import { Send, Mail, MessageSquare, ShieldCheck, HeartHandshake, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] pt-16 pb-10 mt-auto relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-mono font-bold text-xl mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--brand)] animate-pulse" />
              <span className="text-[var(--brand)]">JEMO</span>
              <span className="text-[var(--ink-1)]">LABS</span>
            </Link>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4 max-w-md font-sans">
              بيت الحكمة الرقمي — مؤسسة بحثية مستقلة تهدف لبناء المعرفة المفتوحة، النواة التشغيلية السيادية، وتطوير أبحاث الذكاء الاصطناعي في العراق.
            </p>
            <blockquote className="text-xs italic text-[var(--brand)] border-r-2 border-[var(--brand)] pr-3 py-1 mb-6 bg-[var(--bg)]/50 rounded-r">
              "نؤمن أن المعرفة يجب أن تكون مفتوحة، وأن العراق قادر على إنتاج العلم لا استهلاكه فقط."
            </blockquote>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Ali-Jemo/ziqa-kernal"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/jemo_research"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors"
                aria-label="Telegram"
              >
                <Send size={18} />
              </a>
              <a
                href="mailto:contact@jemo.co"
                className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--brand)] hover:border-[var(--brand)] transition-colors"
                aria-label="Discord"
              >
                <MessageSquare size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">الأبحاث والنتائج</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
              <li><Link href="/research"><AnimatedUnderline>الأوراق البحثية</AnimatedUnderline></Link></li>
              <li><Link href="/benchmarks"><AnimatedUnderline className="text-[var(--brand)] font-bold">لوحة النتائج (Benchmarks)</AnimatedUnderline></Link></li>
              <li><Link href="/projects"><AnimatedUnderline>المشاريع المفتوحة</AnimatedUnderline></Link></li>
              <li><Link href="/labs"><AnimatedUnderline>المختبرات المتخصصة</AnimatedUnderline></Link></li>
              <li><Link href="/infrastructure"><AnimatedUnderline>البنية التحتية والخوادم</AnimatedUnderline></Link></li>
              <li><Link href="/publications"><AnimatedUnderline>مستودع المنشورات</AnimatedUnderline></Link></li>
              <li><Link href="/open-source"><AnimatedUnderline>المصادر المفتوحة</AnimatedUnderline></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">المؤسسة والمجتمع</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
              <li><Link href="/about"><AnimatedUnderline>عن المؤسسة ورؤيتها</AnimatedUnderline></Link></li>
              <li><Link href="/researchers"><AnimatedUnderline>دليل الباحثين</AnimatedUnderline></Link></li>
              <li><Link href="/initiatives"><AnimatedUnderline>المبادرات الوطنية</AnimatedUnderline></Link></li>
              <li><Link href="/timeline"><AnimatedUnderline>الخط الزمني (بيت الحكمة)</AnimatedUnderline></Link></li>
              <li><Link href="/news"><AnimatedUnderline>الأخبار والأحداث</AnimatedUnderline></Link></li>
              <li><Link href="/events"><AnimatedUnderline>المؤتمرات والفعاليات</AnimatedUnderline></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">الشفافية والحوكمة</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
              <li><Link href="/transparency"><AnimatedUnderline className="flex items-center gap-1"><ShieldCheck size={12} /> الشفافية والتقارير</AnimatedUnderline></Link></li>
              <li><Link href="/peer-review"><AnimatedUnderline>سياسات النشر والتحكيم</AnimatedUnderline></Link></li>
              <li><Link href="/support"><AnimatedUnderline className="flex items-center gap-1"><HeartHandshake size={12} /> دعم البحث العلمي</AnimatedUnderline></Link></li>
              <li><Link href="/partners"><AnimatedUnderline>الشركاء والجامعات</AnimatedUnderline></Link></li>
              <li><Link href="/media"><AnimatedUnderline>مكتبة الوسائط</AnimatedUnderline></Link></li>
              <li><Link href="/faq"><AnimatedUnderline>الأسئلة الشائعة</AnimatedUnderline></Link></li>
              <li><Link href="/contact"><AnimatedUnderline>تواصل معنا</AnimatedUnderline></Link></li>
              <li><Link href="/join"><AnimatedUnderline className="text-[var(--brand)] font-bold">الانضمام إلينا</AnimatedUnderline></Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--line)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[var(--ink-2)]">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-[var(--brand)]" />
            <p>© {new Date().getFullYear()} JEMO LABS — Digital House of Wisdom. جميع الحقوق والأبحاث مفتوحة المصدر.</p>
          </div>
          <div className="font-mono text-xs text-[var(--brand)] flex items-center gap-3">
            <Link href="/terms" className="hover:underline">الشروط والأحكام</Link>
            <span>•</span>
            <span>Baghdad • Iraq</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
