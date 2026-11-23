import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "معرض الأعمال",
  description: "مستودع الإنجازات والأبحاث لجهاز jemo البحثي.",
};

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main>
        <GalleryClient />
      </main>
      <Footer />
    </>
  );
}
