import Link from "next/link";
import { recordStatusLabel } from "@/lib/record-status";

export interface HomeRecord {
  slug: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  codeUrl?: string;
  humanVerification?: { confidence?: string };
}

const STEPS = [
  { title: "السؤال", line: "ما المشكلة التي حاولت حلّها؟" },
  { title: "المسار مع الذكاء الاصطناعي", line: "أي نماذج استخدمت، وماذا اقترحت، وأين أخطأت؟" },
  { title: "التحقق البشري", line: "الكود والاختبارات والقياسات التي تثبت النتيجة." },
  { title: "الأثر", line: "رابط دائم باسمك يمكن لأي شخص أن يعيد التجربة منه." },
];

const PROJECTS = [
  {
    name: "ZiqaKernel / YOU OS",
    line: "نواة تجريبية بـ Rust و Zig.",
    href: "https://github.com/Ali-Jemo/ziqa-kernal",
  },
  {
    name: "Axiq-IQ",
    line: "تصميم نظام تشغيل بثلاث طبقات.",
    href: "https://github.com/Ali-Jemo/axiq-os",
  },
  {
    name: "فريق Axiq التطوعي",
    line: "فريق شبابي لتعلّم الذكاء الاصطناعي وتطبيقه.",
    href: "https://github.com/Ali-Jemo",
  },
];

function PrimaryLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1c2829] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#12191a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2829]"
    >
      {children}
    </Link>
  );
}

function TextLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center text-sm font-bold text-[#1c2829] underline decoration-[#1c2829]/40 underline-offset-4 hover:decoration-[#1c2829] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2829]"
    >
      {children}
    </Link>
  );
}

export default function HomeView({ papers }: { papers: HomeRecord[] }) {
  return (
    <div className="home-page bg-[#f7f7f5] text-[#1c2829]" dir="rtl">
      <section className="border-b border-[#e4e3e3] px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-kufi text-balance text-[1.7rem] font-extrabold leading-snug tracking-tight text-[#1c2829] sm:text-5xl sm:leading-tight">
            وثّق ما اكتشفته مع الذكاء الاصطناعي — قبل أن يضيع في المحادثة.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#243233] sm:text-lg">
            JEMO سجلّ عربي مفتوح لأبحاث النظم والبرمجة وتقييم النماذج. تكتب السؤال، وما فعله الذكاء الاصطناعي، وما تحققت منه بنفسك بالكود والاختبارات — فيصبح مرجعاً دائماً باسمك.
          </p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <PrimaryLink href="/publish">انشر أول سجل</PrimaryLink>
            <TextLink href="/research/ai-assisted-rafidain-calendar">شاهد مثالاً حقيقياً ←</TextLink>
          </div>
          <p className="mt-4 text-sm text-[#334244]">مجاني · بالعربية · كل سجل يوضّح حدوده بصراحة</p>
        </div>
      </section>

      <section className="border-b border-[#e4e3e3] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="how-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="how-heading" className="font-kufi text-2xl font-extrabold leading-snug sm:text-3xl">
            أربع خطوات تفصل اكتشافك عن «كلام الذكاء الاصطناعي»
          </h2>
          <p className="mt-4 text-base leading-8 text-[#243233]">
            كل سجل في JEMO يتبع قالب «إثبات العمل» (Proof of Work): نفصل بوضوح بين ما اقترحه النموذج وما تحققت منه أنت.
          </p>
          <ol className="mt-8 space-y-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-[#e4e3e3] bg-white p-4 sm:p-5">
                <p className="text-base font-bold">
                  <span className="ms-2 font-mono text-sm text-[#334244]">{index + 1}.</span>
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-7 text-[#243233]">{step.line}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <PrimaryLink href="/publish">انشر أول سجل</PrimaryLink>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e4e3e3] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="records-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="records-heading" className="font-kufi text-2xl font-extrabold sm:text-3xl">
            سجلات منشورة
          </h2>
          <p className="mt-3 text-base leading-8 text-[#243233]">أمثلة حقيقية: ماذا نجح، وماذا لم يُحسم بعد.</p>
          <ul className="mt-8 space-y-4">
            {papers.map((paper) => (
              <li key={paper.slug}>
                <Link
                  href={`/research/${paper.slug}`}
                  className="block rounded-2xl border border-[#e4e3e3] bg-white p-4 hover:border-[#1c2829] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c2829] sm:p-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#334244]">
                    <span className="rounded-full border border-[#d5d8d2] bg-[#f7f7f5] px-2.5 py-1 font-bold text-[#1c2829]">
                      {recordStatusLabel(paper)}
                    </span>
                    <span>{paper.author}</span>
                    <time dateTime={paper.publishDate} dir="ltr">
                      {paper.publishDate}
                    </time>
                  </div>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{paper.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#243233]">{paper.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <TextLink href="/research">تصفّح كل السجلات ←</TextLink>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e4e3e3] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="audience-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="audience-heading" className="font-kufi text-2xl font-extrabold sm:text-3xl">
            لمن هذه المنصة؟
          </h2>
          <p className="mt-4 text-base leading-8 text-[#243233]">
            للمطوّرين والطلاب والباحثين الذين يعملون مع الذكاء الاصطناعي في:
          </p>
          <p className="mt-3 text-base font-bold leading-8">
            أنظمة التشغيل والأنوية · البرمجة وحل الأعطال المعقدة · تقييم النماذج وكشف أخطائها
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#e4e3e3] bg-white p-4">
              <p className="text-sm font-bold">نقبل</p>
              <p className="mt-2 text-sm leading-7 text-[#243233]">نتيجة لها دليل — كود، أو اختبار، أو مصدر يمكن فحصه.</p>
            </div>
            <div className="rounded-2xl border border-[#e4e3e3] bg-white p-4">
              <p className="text-sm font-bold">لا نقبل</p>
              <p className="mt-2 text-sm leading-7 text-[#243233]">نصوصاً منسوخة من الذكاء الاصطناعي بلا تحقق.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e4e3e3] px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="founder-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="founder-heading" className="font-kufi text-2xl font-extrabold sm:text-3xl">
            مختبر بدأ بشخص واحد
          </h2>
          <p className="mt-4 text-base leading-8 text-[#243233]">
            أسّس JEMO علي حسين هادي (Jemo)، مهندس أنظمة من العراق، ليوثّق أبحاثه علناً أولاً ثم يفتح السجل للجميع. مشاريعه الحالية:
          </p>
          <ul className="mt-6 space-y-3">
            {PROJECTS.map((project) => (
              <li key={project.name} className="text-sm leading-7 sm:text-base">
                <a
                  href={project.href}
                  className="font-bold underline decoration-[#1c2829]/30 underline-offset-4 hover:decoration-[#1c2829]"
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.name}
                </a>
                <span className="text-[#243233]">: {project.line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-base leading-8 text-[#243233]">
            نبحث عن أول شركائنا من الجامعات والمراكز البحثية، وعن مساهمين يراجعون السجلات.
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <TextLink href="/researchers/ali-jemo">تعرّف على المؤسس</TextLink>
            <TextLink href="mailto:contact@jemo.dev">تواصل معنا</TextLink>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="close-heading">
        <div className="mx-auto max-w-3xl">
          <h2 id="close-heading" className="font-kufi text-2xl font-extrabold sm:text-3xl">
            عندك محادثة انتهت بحلّ مفيد؟
          </h2>
          <p className="mt-4 text-base leading-8 text-[#243233]">لا تتركها تضيع. حوّلها إلى سجل موثّق خلال دقائق.</p>
          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <PrimaryLink href="/publish">انشر أول سجل</PrimaryLink>
            <TextLink href="/research">تصفّح السجلات</TextLink>
          </div>
        </div>
      </section>
    </div>
  );
}
