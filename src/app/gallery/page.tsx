import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "معرض الأعمال",
  description: "مستودع الإنجازات والأبحاث لجهاز jemo البحثي.",
};

function first(value: string | string[] | undefined) {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string | string[]; q?: string | string[]; item?: string | string[] }>;
}) {
  const params = await searchParams;
  return (
    <>
      <Header />
      <main>
        <GalleryClient
          initialCat={first(params.cat)}
          initialQuery={first(params.q)}
          initialItem={first(params.item)}
        />
      </main>
      <Footer />
    </>
  );
}
