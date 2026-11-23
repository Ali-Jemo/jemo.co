import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExplainStory from "@/components/ExplainStory";
import { getLiveFaq } from "@/lib/live-content";

export const metadata: Metadata = {
  title: "كيف يعمل",
  description: "قالب السجل في JEMO، ما نقبله وما لا نقبله، وأسئلة شائعة. والقصة باللهجة العراقية في آخر الصفحة.",
};

const STEPS = [
  { title: "السؤال", line: "ما المشكلة التي حاولت حلّها؟" },
  { title: "المسار مع الذكاء الاصطناعي", line: "أي نماذج استخدمت، وماذا اقترحت، وأين أخطأت؟" },
  { title: "التحقق البشري", line: "الكود والاختبارات والقياسات التي تثبت النتيجة." },
  { title: "الأثر", line: "رابط دائم باسمك يمكن لأي شخص أن يعيد التجربة منه." },
];

export default async function ExplainPage() {
  const faq = await getLiveFaq();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f7f7f5] text-[#1c2829]" dir="rtl">
        <article className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-8 sm:pt-28">
          <h1 className="font-kufi text-3xl font-extrabold leading-tight sm:text-5xl">كيف يعمل</h1>
          <p className="mt-4 text-base leading-8 text-[#243233]">
            كل سجل في JEMO يتبع قالب «إثبات العمل» (Proof of Work): نفصل بوضوح بين ما اقترحه النموذج وما تحققت منه أنت.
          </p>
          <ol className="mt-8 space-y-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-[#e4e3e3] bg-white p-4">
                <p className="font-bold">
                  <span className="font-mono text-sm text-[#334244]">{index + 1}. </span>
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-7 text-[#243233]">{step.line}</p>
              </li>
            ))}
          </ol>

          <section id="acceptance" className="mt-12 space-y-3">
            <h2 className="font-kufi text-2xl font-extrabold">ما نقبله</h2>
            <p className="text-base leading-8">نتيجة لها دليل — كود، أو اختبار، أو مصدر يمكن فحصه.</p>
            <p className="text-base leading-8">لا نقبل نصوصاً منسوخة من الذكاء الاصطناعي بلا تحقق.</p>
            <p className="text-base leading-8">
              لا ننشر رقماً للأداء إلا إذا كان معه طريقة قياسه. ما يظهر في السجل من حدود أو أسئلة مفتوحة يبقى ظاهراً، ولا نضع عليه شارة «تم التحقق» من عندنا.
            </p>
          </section>

          <section id="faq" className="mt-12 space-y-4">
            <h2 className="font-kufi text-2xl font-extrabold">أسئلة شائعة</h2>
            <div className="space-y-4">
              {faq.map((item) => (
                <details key={item.question} className="rounded-2xl border border-[#e4e3e3] bg-white p-4">
                  <summary className="cursor-pointer text-base font-bold">{item.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-[#243233]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <p className="mt-10">
            <Link href="/publish" className="inline-flex min-h-11 items-center rounded-full bg-[#1c2829] px-5 text-sm font-bold text-white">
              انشر أول سجل
            </Link>
          </p>
        </article>

        <section id="dialect" className="border-t border-[#e4e3e3]" aria-label="القصة باللهجة العراقية">
          <ExplainStory />
        </section>
      </main>
      <Footer />
    </>
  );
}
