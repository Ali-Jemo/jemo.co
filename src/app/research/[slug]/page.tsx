import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ResearchObjectDetail from "@/components/ResearchObjectDetail";
import { notFound } from "next/navigation";
import { getLiveResearchPapers } from "@/lib/live-content";
import { visiblePapers } from "@/lib/samples";
interface PaperPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return visiblePapers().map((paper) => ({ slug: paper.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PaperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const papers = await getLiveResearchPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) return { title: "كائن البحث غير موجود | JEMO" };
  return {
    title: `${paper.title} | سجلات الاكتشاف JEMO`,
    description: paper.abstract,
  };
};

export default async function PaperDetailPage({ params }: PaperPageProps) {
  const { slug } = await params;
  const papers = await getLiveResearchPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) notFound();

  return (
    <>
      <Header />
      <ResearchObjectDetail paper={paper} />
      <Footer />
    </>
  );
}
