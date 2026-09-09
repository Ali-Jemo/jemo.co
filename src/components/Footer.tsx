import Image from "next/image";
import Link from "next/link";
import { GithubIcon, TelegramIcon, XIcon } from "@/components/Icons";

const FOOTER_LINKS = [
  {
    title: "الأبحاث والنتائج",
    items: [
      { label: "انشر بحثك واكتشافك", href: "/publish" },
      { label: "سجلات الاكتشاف المنشورة", href: "/research" },
      { label: "التسلسل الزمني", href: "/timeline" },
      { label: "المعرض", href: "/gallery" },
    ],
  },
  {
    title: "المؤسسة والمجتمع",
    items: [
      { label: "من نحن", href: "/about" },
      { label: "تواصل معنا", href: "/contact" },
      { label: "الأسئلة الشائعة", href: "/faq" },
    ],
  },
  {
    title: "النشر والتواصل",
    items: [
      { label: "نشرة الشركة", href: "/newsletter" },
      { label: "المبادرات", href: "/initiatives" },
      { label: "التقديم", href: "/apply" },
    ],
  },
];

const SOCIAL_LINKS = [
  { href: "https://t.me/jemolabs", label: "Telegram", icon: "TelegramIcon" },
  { href: "https://x.com/jemolabs", label: "X", icon: "XIcon" },
  { href: "https://github.com/jemo-labs", label: "GitHub", icon: "GithubIcon" },
] as const;

const ICONS_MAP = {
  TelegramIcon,
  XIcon,
  GithubIcon,
};

const FOOTER_STATS = [
  { label: "2024", value: "1,243" },
  { label: "2023", value: "987" },
  { label: "2022", value: "765" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] pt-16 pb-10 mt-auto relative overflow-hidden atmo">
      <div className="container relative z-10">
        <nav aria-label="روابط التذييل" className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-14">
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
              سجل مفتوح لتوثيق ومشاركة أبحاث واكتشافات عصر الذكاء الاصطناعي — لا تضيع معرفتك بعد انتهاء المحادثة. كل سؤال يمكن أن يصبح بحثًا، وكل بحث يمكن أن يصبح معرفة.
            </p>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = ICONS_MAP[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="text-[var(--ink-2)] hover:text-[var(--gold)] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm text-[var(--ink-1)] mb-4 font-mono uppercase tracking-wider">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs text-[var(--ink-2)]">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-[var(--ink-2)] hover:text-[var(--gold)] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Status Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 py-5 mb-6 border-y border-[var(--line)]/50">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            التشغيل ممتاز
          </div>
          {FOOTER_STATS.map((s) => (
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
          <div className="font-mono text-xs flex items-center gap-3">
            <Link href="/privacy" className="text-[var(--ink-2)] hover:text-[var(--gold)] transition-colors">سياسة الخصوصية</Link>
            <Link href="/terms" className="text-[var(--ink-2)] hover:text-[var(--gold)] transition-colors">الشروط والأحكام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}