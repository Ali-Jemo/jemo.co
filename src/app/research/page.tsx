import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchSearchFilter from "@/components/ResearchSearchFilter";
import OpenQuestionsView from "@/components/OpenQuestionsView";
import { getLiveOpenQuestions, getLiveResearchPapers } from "@/lib/live-content";

export const metadata: Metadata = {
  title: "السجلات",
  description: "سجلات منشورة في النظم والبرمجة وتقييم النماذج، مع تبويب للأسئلة التي لم تُحسم بعد.",
};

export default async function ResearchIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const showQuestions = tab === "questions";
  const [papers, questions] = await Promise.all([getLiveResearchPapers(), getLiveOpenQuestions()]);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f7f7f5] pb-16 pt-24 text-[#1c2829] sm:pt-28" dir="rtl">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-16">
          <h1 className="font-kufi text-3xl font-extrabold leading-tight sm:text-5xl">السجلات</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#243233]">
            ما نُشر هنا يوضّح السؤال، وما فعله الذكاء الاصطناعي، وما فحصه الكاتب. الأسئلة التي لم تُحسم بعد في التبويب الثاني.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="محتوى السجلات">
            <Link
              href="/research"
              role="tab"
              aria-selected={!showQuestions}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ${
                showQuestions ? "border border-[#e4e3e3] bg-white" : "bg-[#1c2829] text-white"
              }`}
            >
              السجلات
            </Link>
            <Link
              href="/research?tab=questions"
              role="tab"
              aria-selected={showQuestions}
              className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm font-bold ${
                showQuestions ? "bg-[#1c2829] text-white" : "border border-[#e4e3e3] bg-white"
              }`}
            >
              أسئلة مفتوحة
            </Link>
          </div>
        </div>
        <div className="mt-8">
          {showQuestions ? (
            <OpenQuestionsView initialQuestions={questions} embedded />
          ) : (
            <div className="mx-auto max-w-[1440px] px-4 sm:px-10 lg:px-16">
              <ResearchSearchFilter papers={papers} questions={questions} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
