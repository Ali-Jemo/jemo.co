import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  title: "عن JEMO",
  description: "قصة JEMO: سجل عربي مفتوح لأبحاث النظم والبرمجة وتقييم النماذج، بدأه مهندس أنظمة من العراق.",
};

export default function AboutPage() {
  const inbox = contactEmail();

  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f7f7f5] px-4 pb-20 pt-24 text-[#1c2829] sm:px-8 sm:pt-28" dir="rtl">
        <article className="mx-auto max-w-3xl space-y-10">
          <header className="space-y-4">
            <h1 className="font-kufi text-3xl font-extrabold leading-tight sm:text-5xl">عن JEMO</h1>
            <p className="text-base leading-8 text-[#243233]">
              JEMO سجلّ عربي مفتوح. يوثّق ما يكتشفه شخص مع الذكاء الاصطناعي في النظم والبرمجة وتقييم النماذج، بعد أن يفحصه بنفسه.
            </p>
          </header>

          <section className="space-y-3" aria-labelledby="story-heading">
            <h2 id="story-heading" className="font-kufi text-2xl font-extrabold">القصة</h2>
            <p className="text-base leading-8">
              أسّس JEMO علي حسين هادي (Jemo)، مهندس أنظمة من العراق، ليوثّق أبحاثه علناً أولاً ثم يفتح السجل للجميع. الفريق اليوم شخص واحد، والباب مفتوح لمساهمين يراجعون السجلات.
            </p>
            <p>
              <Link href="/explain#dialect" className="font-bold underline underline-offset-4">
                القصة باللهجة العراقية ←
              </Link>
            </p>
          </section>

          <section className="space-y-3" aria-labelledby="focus-heading">
            <h2 id="focus-heading" className="font-kufi text-2xl font-extrabold">على ماذا نركز</h2>
            <p className="text-base leading-8">
              أنظمة التشغيل والأنوية، والبرمجة وحل الأعطال المعقدة، وتقييم النماذج وكشف أخطائها. لا نقدم المنصة على أنها تغطي كل العلوم.
            </p>
          </section>

          <section id="partners" className="space-y-3" aria-labelledby="partners-heading">
            <h2 id="partners-heading" className="font-kufi text-2xl font-extrabold">شراكات نبحث عنها</h2>
            <p className="text-base leading-8">
              نبحث عن أول شركائنا من الجامعات والمراكز البحثية، وعن مساهمين يراجعون السجلات.
            </p>
            <p>
              <a href={`mailto:${inbox}`} className="font-bold underline underline-offset-4">
                {inbox}
              </a>
            </p>
          </section>

          <section className="flex flex-col gap-3 sm:flex-row">
            <Link href="/researchers/ali-jemo" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1c2829] px-5 text-sm font-bold text-white">
              تعرّف على المؤسس
            </Link>
            <Link href="/projects" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#e4e3e3] bg-white px-5 text-sm font-bold">
              المشاريع
            </Link>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
