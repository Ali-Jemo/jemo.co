import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeView, { type HomeRecord } from "@/components/home/HomeView";
import { getLiveResearchPapers } from "@/lib/live-content";
import { FEATURED_RECORD_SLUGS } from "@/lib/record-status";

const CARD_COPY: Record<string, { title: string; summary: string }> = {
  "ai-assisted-rafidain-calendar": {
    title: "التقويم الرافديني",
    summary: "ما نجح في الكود، وما لم يُحسم فلكياً.",
  },
  "ai-assisted-arabic-texts-analysis": {
    title: "مقارنة نماذج على نصوص تراثية",
    summary: "أين اختلقت النماذج مصادر.",
  },
  "ai-debug-memory-leak-investigation": {
    title: "تسريب ذاكرة في Node.js",
    summary: "ما ثبّته الاختبار.",
  },
};

function authorName(paper: { authors?: unknown }): string {
  const authors = Array.isArray(paper.authors) ? paper.authors : [];
  const first = authors[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "name" in first && typeof first.name === "string") {
    return first.name;
  }
  return "علي حسين هادي";
}

export default async function Home() {
  const papers = await getLiveResearchPapers();
  const featured: HomeRecord[] = FEATURED_RECORD_SLUGS.flatMap((slug) => {
    const paper = papers.find((item) => item.slug === slug);
    if (!paper) return [];
    return [
      {
        slug: paper.slug,
        title: CARD_COPY[slug]?.title ?? paper.title,
        summary: CARD_COPY[slug]?.summary ?? paper.abstract,
        author: authorName(paper),
        publishDate: paper.publishDate,
        codeUrl: paper.codeUrl,
        humanVerification: paper.humanVerification,
      },
    ];
  });

  return (
    <>
      <Header />
      <main className="flex-1">
        <HomeView papers={featured} />
      </main>
      <Footer />
    </>
  );
}
