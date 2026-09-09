"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  Home,
  Check,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface SlideData {
  id: string;
  step: string;
  badge: string;
  title: string;
  subtitle: string;
  story: string;
  punchline: string;
  tag: string;
}

const SLIDES: SlideData[] = [
  {
    id: "spark",
    step: "01",
    badge: "البداية والشرارة",
    title: "شايف من تگعد تسولف ويا الـ AI؟",
    subtitle: "تفتح ChatGPT أو Claude بنص الليل وتطلع بحل أسطوري...",
    story:
      "تكون واگف يم معضلة برمجية مستعصية، أو جاي تفكك خوارزمية، أو تبحث بنص تاريخي. تسأل الـ AI، تتناقشون ساعة وساعتين، وفجأة توصلون لنتيجة تخبل وحل ما مطروق من قبل!",
    punchline: "زين.. ورا ما تكمل وتسد اللابتوب، وين يروح هذا التعب كله؟",
    tag: "حوار عابر • شاشة چات",
  },
  {
    id: "problem",
    step: "02",
    badge: "المعضلة والضياع",
    title: "الشات يطير.. والـ AI مرات يهلوس!",
    subtitle: "المحادثة تنزل جوة وتندفن، وماكو إثبات لتعبك البشري.",
    story:
      "المشكلة الأولى: المحادثات تنقفل وتضيع بالسجل ومحد يستفاد منها. والمشكلة الأكبر: الذكاء الاصطناعي مو معصوم! مرات يضرب فيوزاته، ينطيك نص الجواب صح، والنص الثاني 'كلاوات وهلوسة' تعبر عليك إذا ما تدقق وراه.",
    punchline: "ماكو مكان يثبت إنك أنت اللي جربت بيدك وصححت الغلط واشتغلت صح.",
    tag: "هلوسة نماذج • ضياع التوثيق",
  },
  {
    id: "solution",
    step: "03",
    badge: "منصة JEMO",
    title: "JEMO.. المكان اللي تجي له بعد ما تبحث!",
    subtitle: "مو شات جديد.. بل الأرشيف والمرجع للأبحاث المحققة.",
    story:
      "هنا انولدت JEMO! مو علمود نسولف ويا الذكاء من جديد، لا. JEMO هي المنصة اللي تاخذ بيها عصارة وخلاصة حوارك، وتحولها من مجرد 'چات عابر' إلى مرجع تقني وبحثي نخبوي محترم وموثق للأبد.",
    punchline: "تعبك ووقتك ما يضيع بالهوا.. يتحول لمعرفة حقيقية.",
    tag: "أرشيف دائم • مرجع تقني",
  },
  {
    id: "proof-of-work",
    step: "04",
    badge: "السر والخطة",
    title: "برهان العمل (Proof of Work).. شغل بشري 100%!",
    subtitle: "ما نقبل كوبي بيست.. نريد نشوف لمستك وتجربتك الحقيقية.",
    story:
      "الشرط الأساسي بـ JEMO هو 'برهان العمل'. يعني لازم تبيّن: وين الذكاء أصاب؟ وين جاب العيد وهلوس وأنت صححته؟ وشلون شغلت الكود أو الفكرة على أجهزتك وسيرفراتك؟ الشغل البشري والتجربة العملية هي البطل الحقيقي.",
    punchline: "الذكاء أداة مساعدة.. بس أنت صاحب الاكتشاف والتوثيق.",
    tag: "فحص بشري • تصحيح الهلوسة",
  },
  {
    id: "commons",
    step: "05",
    badge: "الرصيد العام",
    title: "بحثك باسمك.. ومفتوح لكل العقول!",
    subtitle: "رصيد معرفي عام يحفظ حقك وينفع غيرك.",
    story:
      "كل بحث توثقه بـ JEMO يثبت باسمك وينربط بمصادره. يصير رصيد معرفي مفتوح (Open Commons)؛ أي مبرمج أو باحث بالعراق وبالعالم يگدر يقرأه، يختبره، يتعلم منه، ويبني فوقه بدون ما يعيد العجلة من الصفر.",
    punchline: "علم ينتفع به.. محفوظ وموثق بمعايير أكاديمية صارمة.",
    tag: "سجل مفتوح • رصيد للأجيال",
  },
  {
    id: "cta",
    step: "06",
    badge: "الخلاصة والقرار",
    title: "ها.. هسة افتهمت السالفة كلها؟",
    subtitle: "من تبحث وتلگى حل يستاهل.. لا تخليه ينام بالشات!",
    story:
      "المعادلة بسيطة: ابحث ويا الذكاء، دقق وصحح بيدك، وتعال وثق اكتشافك بـ JEMO حتى تفيد روحك وتفيد غيرك، ويكون اسمك بسجل المكتشفين الأوائل.",
    punchline: "تفضل ارجع للموقع الرئيسي واستكشف المنظومة!",
    tag: "المنظومة بانتظارك • خطوة أخيرة",
  },
];

export default function ExplainPage() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const isLast = current === SLIDES.length - 1;

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [autoPlay, nextSlide]);

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-[#0c1415] text-[#f7f7f5] flex flex-col justify-between overflow-x-hidden relative select-none"
    >
      {/* Crisp solid grid (zero blur filters, zero gradients) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ================= TOP BAR ================= */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 pt-5 pb-3 flex items-center justify-between border-b border-white/10">
        {/* Brand Logo & title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 text-white hover:text-[#bef264] transition-colors"
            title="الرجوع للرئيسية"
          >
            <div className="relative w-9 h-9 flex items-center justify-center shrink-0">
              <Image
                src="/jemo-logo.png"
                alt="JEMO LABS"
                width={36}
                height={36}
                priority
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-base font-black tracking-tight text-white group-hover:underline">
                jemo
              </span>
              <span className="text-base font-bold tracking-tight text-white/90">
                labs
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#bef264] ms-0.5" />
            </div>
            <span className="text-zinc-600 font-mono text-xs mx-1 hidden sm:inline">|</span>
            <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
              لخصلي الموقع • بالعراقي
            </span>
          </Link>
        </div>

        {/* Slide Counter & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 font-mono cursor-pointer ${
              autoPlay
                ? "bg-[#bef264]/20 border-[#bef264] text-[#bef264]"
                : "bg-white/5 border-white/15 text-zinc-400 hover:text-white"
            }`}
            title={autoPlay ? "إيقاف التشغيل التلقائي" : "تشغيل تلقائي للسلايدات"}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                autoPlay ? "bg-[#bef264]" : "bg-zinc-500"
              }`}
            />
            <span className="text-[11px]">
              {autoPlay ? "تشغيل تلقائي" : "تلقائي"}
            </span>
          </button>

          {/* Current index pill */}
          <div className="px-3 py-1 rounded-full bg-[#111a1c] border border-white/10 text-xs font-mono text-[#bef264] flex items-center gap-1.5">
            <span>{SLIDES[current].step}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">06</span>
            <span className="w-px h-3 bg-white/15 mx-0.5" />
            <span className="text-[11px] text-zinc-300 font-bold">
              {Math.round(((current + 1) / SLIDES.length) * 100)}%
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#bef264] hover:text-[#0c1415] text-xs font-kufi text-zinc-200 transition-colors cursor-pointer border border-white/15"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">رجوع للموقع</span>
          </Link>
        </div>
      </header>

      {/* Progress timeline bar at the top */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 mt-2">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden flex gap-1">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => goTo(idx)}
              className="flex-1 h-full cursor-pointer transition-colors"
              title={`انتقل إلى السلايد ${idx + 1}: ${s.title}`}
            >
              <div
                className={`w-full h-full rounded-full transition-colors duration-150 ${
                  idx === current
                    ? "bg-[#bef264]"
                    : idx < current
                    ? "bg-[#bef264]/40"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ================= MAIN SLIDER TRACK (Zero unmount lag, pure GPU translate3d) ================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-10 overflow-hidden">
        <div
          dir="ltr"
          className="flex w-full will-change-transform"
          style={{
            transform: `translate3d(-${current * 100}%, 0, 0)`,
            transition: "transform 0.26s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {SLIDES.map((s, idx) => {
            const isLastSlide = idx === SLIDES.length - 1;
            return (
              <div
                key={s.id}
                dir="rtl"
                className="w-full shrink-0 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
              >
                {/* RIGHT COLUMN: Authentic Iraqi Text (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-5 text-right">
                  {/* Badge & Step indicator */}
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-[#bef264]/15 border border-[#bef264]/30 text-[#bef264] text-xs font-mono font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#bef264]" />
                      <span>{s.step}</span>
                      <span>·</span>
                      <span className="font-kufi">{s.badge}</span>
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {s.tag}
                    </span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-kufi text-white leading-[1.25] tracking-tight">
                    {s.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg text-[#bef264] font-kufi font-medium">
                    {s.subtitle}
                  </p>

                  {/* Iraqi Story Paragraph */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-[#111b1d] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-[#bef264]" />
                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-kufi font-normal">
                      {s.story}
                    </p>
                  </div>

                  {/* Punchline Callout: only for slides 1-5 */}
                  {!isLastSlide && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-[#121c1e] border-r-2 border-[#bef264] border border-white/5 text-sm sm:text-base text-white font-kufi font-medium">
                      <Zap className="w-5 h-5 text-[#bef264] shrink-0 mt-0.5" />
                      <span>{s.punchline}</span>
                    </div>
                  )}

                  {/* Slide 6: The SINGLE clean funny callout */}
                  {isLastSlide && (
                    <div className="p-5 rounded-2xl bg-[#142224] border border-[#bef264]/40 relative overflow-hidden">
                      <div className="flex items-start gap-3.5">
                        <span className="text-3xl select-none shrink-0">🗿</span>
                        <div className="space-y-1 text-right">
                          <div className="text-[11px] font-mono text-[#bef264] font-bold">
                            رسالة من الكواليس:
                          </div>
                          <p className="font-kufi font-bold text-sm sm:text-base text-white leading-relaxed">
                            "ديله ارجع للصفحة الرئيسية سلبوح , تره تعبان بالموقع الرئيسي 🗿, ارجع شوفه على وقت فراغك"
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Slide 6 Return Buttons */}
                  {isLastSlide && (
                    <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <Link
                        href="/"
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#bef264] hover:bg-[#a7e26e] text-[#0c1415] font-bold font-kufi text-base transition-colors"
                      >
                        <span>الرجوع للموقع الرئيسي</span>
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                      </Link>
                      <button
                        onClick={() => goTo(0)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-zinc-200 text-sm font-kufi transition-colors cursor-pointer hover:text-white"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>أعد العرض من البداية ↺</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* LEFT COLUMN: Clean Visual Cards (5 cols) */}
                <div className="lg:col-span-5 flex items-center justify-center w-full">
                  <div className="w-full max-w-md aspect-square sm:aspect-[4/3.8] rounded-3xl bg-[#10191b] border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden">
                    {/* Visual card header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#bef264]" />
                      </div>
                      <span className="text-[11px] text-[#bef264]">
                        JEMO // SLIDE_{s.step}
                      </span>
                    </div>

                    {/* Visual component per slide */}
                    <div className="my-auto flex flex-col items-center justify-center py-4">
                      {idx === 0 && <Slide1Animation />}
                      {idx === 1 && <Slide2Animation />}
                      {idx === 2 && <Slide3Animation />}
                      {idx === 3 && <Slide4Animation />}
                      {idx === 4 && <Slide5Animation />}
                      {idx === 5 && <Slide6Animation />}
                    </div>

                    {/* Visual card footer stamp */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>VERIFIED INTERACTIVE</span>
                      <span className="text-zinc-400">IRAQI DIALECT V1.0</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
        {/* Keyboard hint */}
        <div className="text-xs text-zinc-400 font-mono flex items-center gap-2 order-2 sm:order-1">
          <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px]">
            ←
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px]">
            →
          </span>
          <span>استخدم مفاتيح الأسهم أو المسافة للتنقل</span>
        </div>

        {/* Prev / Next Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
          {/* Previous button */}
          <button
            onClick={prevSlide}
            disabled={current === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-kufi border transition-colors cursor-pointer ${
              current === 0
                ? "opacity-30 border-white/10 text-zinc-500 cursor-not-allowed"
                : "bg-white/5 border-white/15 text-zinc-200 hover:bg-white/15 hover:text-white"
            }`}
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>السابق</span>
          </button>

          {/* Dots quick selector */}
          <div className="flex items-center gap-1.5 px-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === current
                    ? "w-6 bg-[#bef264]"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`انتقال للسلايد ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Finish Button */}
          {isLast ? (
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#a7e26e] text-[#0c1415] font-bold text-xs font-kufi transition-colors cursor-pointer active:scale-95"
            >
              <span>الرجوع للرئيسية</span>
              <Home className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={nextSlide}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#a7e26e] text-[#0c1415] font-bold text-xs font-kufi transition-colors cursor-pointer active:scale-95"
            >
              <span>التالي</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

// ================= LIGHTWEIGHT SUB-COMPONENTS (NO BLUR, NO LAG) =================

// Slide 1: AI conversation
function Slide1Animation() {
  return (
    <div className="w-full flex flex-col gap-3 font-mono text-xs">
      <div className="self-start max-w-[85%] p-3 rounded-2xl rounded-tr-sm bg-[#bef264]/15 border border-[#bef264]/30 text-[#bef264]">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-1">
          <span>أنت (الساعة 2:40 الفجر)</span>
        </div>
        <p className="font-kufi text-xs text-white">
          "شلون أحل مشكلة تسريب الذاكرة بـ Ziqa Kernel واستخرج البنشمارك؟"
        </p>
      </div>

      <div className="self-end max-w-[88%] p-3 rounded-2xl rounded-tl-sm bg-[#0a1012] border border-white/15 text-zinc-200">
        <div className="flex items-center gap-1.5 text-[10px] text-[#bef264] mb-1">
          <Sparkles className="w-3 h-3 text-[#bef264]" />
          <span>Claude / GPT</span>
        </div>
        <p className="font-mono text-[11px] text-zinc-300">
          `atomic_exchange(&lock, 0);`
        </p>
        <p className="font-kufi text-[11px] text-zinc-400 mt-1">
          "لقينا الحل! النتيجة تحسنت بنسبة 42%..."
        </p>
      </div>

      <div className="self-center mt-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] text-zinc-300 font-kufi">
        💡 اكتشاف عظيم.. بس راح يضيع ورا ما تسد الشات!
      </div>
    </div>
  );
}

// Slide 2: Hallucination alert
function Slide2Animation() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full p-4 rounded-2xl bg-red-950/40 border border-red-500/40 relative">
        <div className="flex items-center justify-between text-xs text-red-400 font-mono mb-2">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>كشف هلوسة الذكاء الاصطناعي</span>
          </span>
          <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded">
            تحذير
          </span>
        </div>
        <p className="text-xs text-zinc-300 line-through decoration-red-400 decoration-2 font-mono">
          import non_existing_library_v5 from "imaginary";
        </p>
        <p className="text-[11px] text-red-300 font-kufi mt-1.5">
          ⚠️ الذكاء اخترع مكاتب وهمية وما تشتغل بالحقيقة!
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="font-kufi">سجل المحادثة العادية يتبخر ومحد يثق بيه</span>
      </div>
    </div>
  );
}

// Slide 3: JEMO Vault
function Slide3Animation() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="w-full p-5 rounded-2xl bg-[#142022] border border-[#bef264]/40 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              <Image
                src="/jemo-logo.png"
                alt="JEMO LABS"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-kufi font-bold text-xs text-white">
              سجل JEMO الأكاديمي
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#bef264] px-2 py-0.5 rounded bg-[#bef264]/10 border border-[#bef264]/30">
            PERMANENT ARCHIVE
          </span>
        </div>

        <div className="space-y-1.5 font-mono text-[11px] text-zinc-300">
          <div className="flex items-center justify-between py-1 border-b border-white/10">
            <span className="text-zinc-400 font-kufi">حالة التوثيق:</span>
            <span className="text-[#bef264]">محفوظ ومرقم دولياً</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-white/10">
            <span className="text-zinc-400 font-kufi">نوع السجل:</span>
            <span>Technical Discovery #0482</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-zinc-400 font-kufi">الموثوقية:</span>
            <span className="text-emerald-400">100% بدون كلاوات</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Slide 4: Proof of Work
function Slide4Animation() {
  const checks = [
    { label: "تشغيل الكود على هاردوير حقيقي", status: true },
    { label: "كشف هلوسة الذكاء وتصحيحها يدوياً", status: true },
    { label: "تحقق بشري كامل (Human Verification)", status: true },
    { label: "ممنوع الكوبي بيست الساذج", status: true },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center gap-2 pb-2 text-xs font-mono text-[#bef264]">
        <ShieldCheck className="w-4 h-4 text-[#bef264]" />
        <span className="font-kufi font-bold">معايير برهان العمل (Proof of Work)</span>
      </div>

      {checks.map((c, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-kufi text-zinc-200"
        >
          <span>{c.label}</span>
          <span className="w-5 h-5 rounded-full bg-[#bef264]/20 border border-[#bef264]/40 flex items-center justify-center text-[#bef264]">
            <Check className="w-3 h-3" />
          </span>
        </div>
      ))}
    </div>
  );
}

// Slide 5: Open Knowledge Commons Graph
function Slide5Animation() {
  return (
    <div className="w-full flex flex-col items-center gap-3">
      <div className="relative w-full h-44 flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#bef264] text-[#0c1415] font-black font-kufi text-xs flex items-center justify-center z-10 text-center border-2 border-white/20">
          بحثك الموثق
        </div>

        <div className="absolute top-2 right-4 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-kufi text-zinc-300">
          بغداد • باحث نظم
        </div>
        <div className="absolute bottom-2 left-4 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-kufi text-zinc-300">
          البصرة • مهندس خوارزميات
        </div>
        <div className="absolute top-3 left-4 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-kufi text-zinc-300">
          أربيل • مطور ذكاء
        </div>
        <div className="absolute bottom-2 right-4 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-kufi text-zinc-300">
          عالمي • ورقة بحثية
        </div>

        <div className="absolute inset-0 rounded-full border border-white/10 scale-90 pointer-events-none" />
        <div className="absolute inset-0 rounded-full border border-[#bef264]/30 scale-110 pointer-events-none" />
      </div>

      <p className="text-[11px] font-kufi text-zinc-400 text-center">
        شبكة معرفية حية مفتوحة للكل.. اسمك يبقى خالد بالبحث
      </p>
    </div>
  );
}

// Slide 6: Launch celebration
function Slide6Animation() {
  return (
    <div className="w-full flex flex-col items-center gap-4 text-center">
      <div className="relative flex items-center justify-center my-2">
        <div className="w-24 h-24 rounded-3xl bg-[#142224] border-2 border-[#bef264]/60 p-3 flex items-center justify-center">
          <Image
            src="/jemo-logo.png"
            alt="JEMO LABS"
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Subtle static 🗿 badge */}
        <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-[#0c1415] border border-[#bef264]/40 flex items-center justify-center text-lg">
          <span>🗿</span>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-kufi font-bold text-base text-white">
          أهلاً بيك بنادي النخبة
        </h4>
        <p className="font-kufi text-xs text-[#bef264]">
          المنصة جاهزة، واستكشافات الباحثين بانتظارك!
        </p>
      </div>

      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-[#bef264]" />
        <span>JEMO ECOSYSTEM • VERIFIED 2026</span>
      </div>
    </div>
  );
}
