import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpLeft,
  Bot,
  Code2,
  Cpu,
  Database,
  FileText,
  FlaskConical,
  Gamepad2,
  Menu,
  Microscope,
  Palette,
  ScrollText,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import heroLab from "@/assets/hero-lab.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "jemo labs — الفرع البحثي لشركة LXD" },
      { name: "description", content: "منظومة بحثية وتقنية غير ربحية. من أرضِ كُتب فيها أول سطر، نكتب السطر التالي." },
      { property: "og:title", content: "jemo labs — الفرع البحثي لشركة LXD" },
      { property: "og:description", content: "منظومة بحثية وتقنية غير ربحية. من أرضِ كُتب فيها أول سطر، نكتب السطر التالي." },
    ],
  }),
  component: Index,
});

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    el.querySelectorAll("[data-reveal]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return ref;
}

const NAV = [
  { href: "#top", label: "الرئيسية" },
  { href: "#innovations", label: "دليل المخرجات" },
  { href: "#about", label: "من نحن" },
  { href: "#works", label: "الأعمال" },
  { href: "#applications", label: "القبولات" },
  { href: "#faq", label: "الأسئلة" },
];

const DEPARTMENTS = [
  { icon: Microscope, code: "01", title: "أبحاث علمية", desc: "تحليل بيانات، أوراق بحثية منشورة، ودراسات ميدانية معمّقة." },
  { icon: Code2, code: "02", title: "ابتكار برمجي", desc: "بناء منصات ويب، بوتات، وأدوات أتمتة مفتوحة المصدر." },
  { icon: Palette, code: "03", title: "التصميم والهوية", desc: "تصميم واجهات وهويات بصرية متكاملة للمشاريع التقنية." },
  { icon: Gamepad2, code: "04", title: "المحتوى والألعاب", desc: "إنتاج محتوى تحليلي تحريري وأعمال رقمية تعليمية." },
];

const INNOVATIONS = [
  { tag: "بحث مفتوح", type: "ورقة بحثية", icon: FileText, title: "دراسة سلوك البوتات في بيئات التليجرام", desc: "دراسة ميدانية تحليلية تغطي أنماط استجابة البوتات ومعالجة الأحداث البرمجية الضخمة.", meta: "تحليل بيانات" },
  { tag: "مكتبة برمجة", type: "استجابة < 50ms", icon: Bot, title: "إطار عمل الأتمتة المفتوح — Jemo Bot Core", desc: "أدوات ومكتبات بناء بوتات سريعة جداً خفيفة الوزن تعتمد على المعالجة اللحظية.", meta: "أداء فائق" },
  { tag: "نظام تصميم", type: "React + Tailwind", icon: Palette, title: "دليل الهوية ونظام التصميم الرقمي", desc: "مجموعة مكونات واجهات مستخدم مخصصة للمؤسسات والمشاريع البحثية والتقنية.", meta: "مكونات جاهزة" },
  { tag: "لعبة تعليمية", type: "تفاعلي 100%", icon: Gamepad2, title: "محاكي الشبكات التعليمي التفاعلي", desc: "تجربة تفاعلية بالمتصفح تبسط مفاهيم بروتوكولات الشبكات والتحويلات الرقمية.", meta: "منصة ويب" },
  { tag: "بيانات مفتوحة", type: "متاح مجاناً", icon: Database, title: "مستودع البيانات المفتوحة للباحثين", desc: "بيانات ضخمة منظمة ومحصاة لتغذية تجارب الذكاء الاصطناعي والدراسات التكنولوجية.", meta: "مستودع بيانات" },
  { tag: "أداة شفافة", type: "تحديث لحظي", icon: Cpu, title: "نظام المتابعة التلقائية للقبولات العامة", desc: "سجل برلماني عام ومفتوح يعرض حالة المتقدمين والقبولات بشفافية كاملة.", meta: "أتمتة شفافة" },
];

const CARAVAN = [
  { n: "01", stage: "STAGE 01", title: "قدّم طلبك", desc: "املأ الاستمارة بأساسياتك وخبرتك واستلم رقم مرجعي لمتابعة الحالة." },
  { n: "02", stage: "STAGE 02", title: "المراجعة والتقييم", desc: "نراجع مهاراتك ومدى توافقها مع القسم المطلوب وفق معايير شفافة." },
  { n: "03", stage: "STAGE 03", title: "استلام القرار", desc: "تنبيه مباشر بقبولك أو الرد بالملاحظات لتحسين الطلب عند الحاجة." },
  { n: "04", stage: "STAGE 04", title: "الانضمام للفريق", desc: "تصل لقنوات قسمك وتشرع بمشاريع حقيقية ضمن فرق عمل متخصصة." },
];

const FAQ = [
  { q: "هل الانضمام إلى jemo labs يتطلب رسوماً؟", a: "لا، نحن مؤسسة غير ربحية. لا توجد أي رسوم، اشتراكات، أو تكاليف على المتقدمين والمنضمين." },
  { q: "هل أحتاج إلى شهادة جامعية للتقديم؟", a: "لا نشترط الشهادة. ما يهمنا هو الشغف الحقيقي والمهارة والقدرة على إنجاز مشاريع حقيقية." },
  { q: "كم تستغرق مدة المراجعة؟", a: "عادة بين 7 إلى 14 يوماً. تتلقى تنبيهاً مباشراً فور صدور القرار." },
  { q: "هل يمكنني اختيار أكثر من قسم؟", a: "نعم، يمكنك اختيار قسم رئيسي ومجالات اهتمام ثانوية عند التقديم." },
  { q: "ما هي طبيعة العمل داخل الفرق؟", a: "عمل تعاوني عن بُعد بأدوات مفتوحة وشفافة، بجدول مرن حسب طبيعة المشروع." },
];

const STATS = [
  { value: "+50", label: "عضو مبدع" },
  { value: "+12", label: "مشروع منشور" },
  { value: "04", label: "أقسام تخصصية" },
  { value: "100%", label: "شفافية مفتوحة" },
];

const MARQUEE_WORDS = [
  "العلم", "البرمجة", "التصميم", "المحتوى", "أبحاث",
  "ابتكار", "هوية", "ألعاب", "بيانات مفتوحة", "مصدر مفتوح",
];

function Index() {
  const rootRef = useReveal<HTMLDivElement>();
  const [time, setTime] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "UTC",
        }) + " UTC",
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">
      <a href="#top" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:right-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-3 focus:py-1.5 focus:text-primary-foreground">
        تخطي إلى المحتوى
      </a>

      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 text-lg font-kufi font-bold">
            <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <FlaskConical className="h-3.5 w-3.5" />
              <span className="absolute inset-0 rounded-sm animate-pulse-soft ring-1 ring-primary/40" />
            </span>
            <span className="text-gradient">jemo</span>
            <span className="font-mono text-muted-foreground text-sm">labs</span>
            <span className="ms-1 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#contract"
              className="group hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              انضم إلينا
              <ArrowUpLeft className="h-3.5 w-3.5 transition-transform group-hover:-rotate-45" />
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
              aria-label="القائمة"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in">
            <nav className="mx-auto max-w-7xl px-6 py-4 flex flex-col gap-3 text-sm">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-1 text-muted-foreground hover:text-foreground"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroLab}
            alt="jemo labs — بيت الحكمة"
            width={1920}
            height={1280}
            className="w-full h-full object-cover opacity-40 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="absolute inset-0 bg-grid opacity-40 animate-grid" />
          <div
            className="absolute inset-0"
            style={{ background: "var(--gradient-radial)" }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24 w-full">
          <div className="max-w-4xl">
            <div
              data-reveal
              className="reveal inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs font-mono text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
              <span dir="ltr">est. 762 — present</span>
              <span className="text-border">/</span>
              <span dir="ltr">{time || "—"}</span>
            </div>

            <h1
              data-reveal
              className="reveal mt-6 font-kufi text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.05]"
            >
              <span className="text-gradient">JEMO</span>{" "}
              <span className="font-mono text-primary/90">LABS</span>
            </h1>

            <p data-reveal className="reveal mt-6 max-w-2xl text-xl md:text-2xl font-kufi text-foreground/90 leading-relaxed">
              من أرضِ كُتب فيها أول سطر،
              <br />
              <span className="text-gradient">نكتب السطر التالي.</span>
            </p>

            <p
              data-reveal
              className="reveal mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed"
            >
              منظومة بحثية وتقنية يمارس فيها الشباب حرية الابتكار، لبناء الأبحاث العلمية،
              المنصات البرمجية، والهويات الرقمية.
            </p>

            <div data-reveal className="reveal mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#contract"
                className="group relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                <span className="relative z-10">أختم الميثاق</span>
                <ScrollText className="relative z-10 h-4 w-4" />
                <span className="absolute inset-0 shine opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 backdrop-blur px-6 py-3 text-sm font-medium hover:bg-card transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                ادخل بيت الحكمة
              </a>
            </div>

            {/* stats strip */}
            <div
              data-reveal
              className="reveal mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-border bg-border"
            >
              {STATS.map((m) => (
                <div key={m.label} className="bg-card/70 backdrop-blur p-5">
                  <div className="font-kufi text-3xl font-bold text-gradient">
                    {m.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* floating seal */}
        <div className="pointer-events-none absolute left-8 top-1/3 hidden lg:block">
          <div className="relative h-40 w-40 animate-float">
            <div className="absolute inset-0 rounded-full border border-border" />
            <div className="absolute inset-3 rounded-full border border-border animate-pulse-soft" />
            <div className="absolute inset-8 rounded-full bg-primary/10 blur-2xl" />
            <FlaskConical className="absolute inset-0 m-auto h-8 w-8 text-primary" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-muted-foreground whitespace-nowrap">
              House of Wisdom · بيت الحكمة
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border py-6 overflow-hidden bg-card/30">
        <div className="flex gap-12 animate-marquee whitespace-nowrap text-sm text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0 items-center">
              {MARQUEE_WORDS.map((w, j) => (
                <span key={`${i}-${j}`} className="flex items-center gap-12">
                  <span className="font-kufi">{w}</span>
                  <span className="text-primary/60">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT / DEPARTMENTS */}
      <section id="about" className="relative py-24 md:py-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="reveal max-w-2xl">
            <div className="font-mono text-xs tracking-widest text-muted-foreground">
              § 01 — بيت الحكمة · House of Wisdom
            </div>
            <h2 className="mt-3 font-kufi text-4xl md:text-5xl font-bold tracking-tight">
              الأقسام التخصصية الأربعة
            </h2>
            <p className="mt-4 text-muted-foreground">
              منظومة متكاملة تنطلق من أركان معرفية تدمج بين البحث، البرمجة، التصميم،
              والإعلام الرقمي.
            </p>
          </div>

          <div className="mt-16 grid gap-px bg-border rounded-2xl overflow-hidden border border-border md:grid-cols-2">
            {DEPARTMENTS.map(({ icon: Icon, code, title, desc }, i) => (
              <div
                key={code}
                data-reveal
                className="reveal group relative bg-card p-8 md:p-10 transition-colors hover:bg-accent"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="font-mono text-xs text-muted-foreground">{code}</div>
                  <ArrowUpLeft className="h-4 w-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:-translate-x-0.5" />
                </div>
                <div className="mt-8 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-kufi text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground">{desc}</p>

                {/* corner accents */}
                <span className="absolute top-3 right-3 h-2 w-2 border-r border-t border-border opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-3 left-3 h-2 w-2 border-l border-b border-border opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INNOVATIONS DIRECTORY */}
      <section id="innovations" className="relative py-24 md:py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="reveal flex flex-wrap items-end justify-between gap-6 max-w-full">
            <div className="max-w-2xl">
              <div className="font-mono text-xs tracking-widest text-muted-foreground">
                § 02 — jemohub · INNOVATIONS DIRECTORY
              </div>
              <h2 className="mt-3 font-kufi text-4xl md:text-5xl font-bold tracking-tight">
                مشاريع ومخرجات المعرفة المفتوحة
              </h2>
              <p className="mt-4 text-muted-foreground">
                استكشف أحدث مخرجات مختبر جيل الأفكار من برمجيات حرة، دراسات علمية،
                وأنظمة تصميم موجهة للمجتمع التقني.
              </p>
            </div>
            <a href="#works" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              معرض المخرجات
              <ArrowUpLeft className="h-4 w-4" />
            </a>
          </div>

          <div id="works" className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {INNOVATIONS.map(({ icon: Icon, tag, type, title, desc, meta }, i) => (
              <article
                key={title}
                data-reveal
                className="reveal group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40"
                style={{ transitionDelay: `${i * 60}ms`, boxShadow: "var(--shadow-elevated)" }}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-muted-foreground">
                    {tag}
                  </span>
                  <span className="font-mono text-muted-foreground">{type}</span>
                </div>
                <div className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-kufi text-xl font-bold leading-snug">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-mono text-muted-foreground">{meta}</span>
                  <span className="inline-flex items-center gap-1 text-sm text-foreground group-hover:text-primary transition-colors">
                    استعرض
                    <ArrowUpLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-l from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </article>
            ))}
          </div>

          <div data-reveal className="reveal mt-14 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-border bg-card/60 backdrop-blur p-8">
            <div className="text-center md:text-right">
              <h3 className="font-kufi text-xl md:text-2xl font-bold">
                هل لديك فكرة مشروع أو بحث تريد المساهمة فيه؟
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                نفتح أبواب الانضمام والمشاركة لكافة المبدعين والمطورين والباحثين.
              </p>
            </div>
            <a
              href="#contract"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:scale-105 transition-transform"
            >
              قدّم طلب انضمام
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* CARAVAN ROAD */}
      <section id="applications" className="relative py-24 md:py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="reveal max-w-2xl">
            <div className="font-mono text-xs tracking-widest text-muted-foreground">
              § 03 — CARAVAN ROAD · طريق القافلة
            </div>
            <h2 className="mt-3 font-kufi text-4xl md:text-5xl font-bold tracking-tight">
              آلية التقديم والعمل
            </h2>
            <p className="mt-4 text-muted-foreground">
              مسار شفاف من أربع محطات ينقلك من فكرة التقديم إلى مشاركة الفريق.
            </p>
          </div>

          <div className="mt-16 relative">
            <div className="hidden md:block absolute inset-x-0 top-9 h-px bg-gradient-to-l from-transparent via-border to-transparent" />
            <div className="grid gap-8 md:grid-cols-4">
              {CARAVAN.map((c, i) => (
                <div
                  key={c.n}
                  data-reveal
                  className="reveal group relative"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card font-kufi text-2xl font-bold text-gradient">
                    {c.n}
                    <span className="absolute inset-0 rounded-2xl ring-1 ring-primary/0 group-hover:ring-primary/40 transition-all" />
                  </div>
                  <div className="mt-5 font-mono text-[10px] tracking-widest text-muted-foreground">
                    {c.stage}
                  </div>
                  <h3 className="mt-2 font-kufi text-xl font-bold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative py-24 md:py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-4xl">
          <div data-reveal className="reveal text-center">
            <div className="font-mono text-xs tracking-widest text-muted-foreground">
              § 04 — الديوان · The Diwan
            </div>
            <h2 className="mt-3 font-kufi text-4xl md:text-5xl font-bold tracking-tight">
              الأسئلة الشائعة
            </h2>
            <p className="mt-4 text-muted-foreground">
              إجابات مباشرة حول الانضمام، المراجعة، والعمل داخل منظومة jemo labs.
            </p>
          </div>

          <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-card/60 backdrop-blur overflow-hidden">
            {FAQ.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={f.q} data-reveal className="reveal">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-right hover:bg-accent transition-colors"
                  >
                    <span className="font-kufi text-base md:text-lg font-semibold">{f.q}</span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition-transform ${isOpen ? "rotate-45" : ""}`}>
                      <span className="block h-3 w-px bg-foreground" />
                      <span className="block h-px w-3 bg-foreground -translate-x-1.5" />
                    </span>
                  </button>
                  <div
                    className="grid transition-all duration-500 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTRACT / CTA */}
      <section id="contract" className="relative py-24 md:py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-5xl">
          <div
            data-reveal
            className="reveal relative overflow-hidden rounded-3xl border border-border p-8 md:p-14"
            style={{ background: "var(--gradient-surface)", boxShadow: "var(--shadow-glow)" }}
          >
            <div className="absolute inset-0 bg-grid opacity-20 animate-grid" />
            <div className="relative grid gap-10 md:grid-cols-[1.1fr_1fr] items-center">
              <div>
                <div className="font-mono text-xs tracking-widest text-muted-foreground">
                  الميثاق · System Contract #762
                </div>
                <h2 className="mt-4 font-kufi text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                  جاهز تبدأ <span className="text-gradient">السطر التالي؟</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                  قدّم طلبك الآن — يستغرق أقل من 3 دقائق. لا شهادة مطلوبة، لا رسوم،
                  فقط شغف ومهارة حقيقية.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
                    STATUS: OPEN
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
                    MEMBERSHIP: FREE & OPEN
                  </span>
                </div>
                <a
                  href="mailto:hello@jemo.co"
                  className="mt-8 group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
                >
                  أختم الميثاق
                  <ScrollText className="h-4 w-4" />
                </a>
              </div>

              <ul className="grid gap-3 text-sm">
                {[
                  "الالتزام بالشغف، الشفافية، ونشر المعرفة المفتوحة المصدر.",
                  "الحرية الكاملة في اختيار القسم والمشاريع البحثية أو البرمجية.",
                  "الانضمام المباشر لبيئة عمل مستقلة تابعة لشبكة LXD Co.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 backdrop-blur"
                  >
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
                    <span className="text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE LAB PANEL */}
      <section className="relative py-24 md:py-32 px-6 border-t border-border">
        <div className="mx-auto max-w-7xl grid gap-16 md:grid-cols-[1fr_1.2fr] items-center">
          <div data-reveal className="reveal">
            <div className="font-mono text-xs tracking-widest text-muted-foreground">
              § 05 — Live Lab Signal
            </div>
            <h2 className="mt-3 font-kufi text-4xl md:text-5xl font-bold tracking-tight">
              دفتر مختبر منشور مباشرة
            </h2>
            <p className="mt-4 text-muted-foreground">
              كل تجربة تُسجّل بشفافية — الملاحظات الخام، التجارب الفاشلة، وخيوط
              الكود التي أنتجتها.
            </p>
          </div>

          <div data-reveal className="reveal relative">
            <div className="relative rounded-3xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-elevated)" }}>
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border">
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="ms-3 font-mono text-xs text-muted-foreground" dir="ltr">jemo://runtime/observer</span>
              </div>
              <div dir="ltr" className="p-6 font-mono text-xs leading-relaxed text-left">
                <div className="text-muted-foreground">// stream: lattice-resonance-14</div>
                <div className="mt-2">
                  <span className="text-muted-foreground">›</span> init(<span className="text-gradient">"observer"</span>)
                </div>
                <div>
                  <span className="text-muted-foreground">›</span> sampling <span className="text-foreground">44.1kHz</span>
                </div>
                <div className="mt-3 grid gap-[2px] h-24 items-end" style={{ gridTemplateColumns: "repeat(48, minmax(0, 1fr))" }}>
                  {Array.from({ length: 48 }).map((_, i) => (
                    <span
                      key={i}
                      className="bg-primary/70 rounded-sm animate-pulse-soft"
                      style={{
                        height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%`,
                        animationDelay: `${i * 40}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" />
                  streaming · Δ 0.0021
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card/40 backdrop-blur py-16 px-6">
        <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-kufi font-bold text-xl">
              <span className="text-gradient">jemo</span>
              <span className="font-mono text-muted-foreground text-sm">labs</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              مؤسسة بحثية وتقنية غير ربحية تابعة لـ LXD Co. نجمع العقول المبدعة ونبني الأبحاث
              والمنصات المفتوحة.
            </p>
          </div>
          <FooterCol
            title="الأقسام التخصصية"
            items={["الأبحاث العلمية", "التقنية والبرمجة", "التصميم والهوية", "المحتوى والألعاب"]}
          />
          <FooterCol
            title="المنظومة"
            items={["معرض الأعمال", "سجل القبولات الشفاف", "تقديم طلب جديد", "الأسئلة الشائعة"]}
          />
          <FooterCol
            title="التواصل والقنوات"
            items={["قناة التليجرام الرسمية", "LXD Co. الرئيسي", "hello@jemo.co"]}
          />
        </div>
        <div className="mx-auto max-w-7xl mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span className="font-mono">© {new Date().getFullYear()} jemo labs · جميع الحقوق محفوظة.</span>
          <span className="font-kufi italic">من أرضِ كُتب فيها أول سطر، نكتب السطر التالي.</span>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="font-kufi font-bold text-sm mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="hover:text-foreground transition-colors">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
