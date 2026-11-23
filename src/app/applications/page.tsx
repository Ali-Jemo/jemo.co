import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicationsClient from "./ApplicationsClient";

export const metadata: Metadata = {
  title: "القبولات والطلبات",
  description: "مؤشرات شفافة حول طلبات الانضمام إلى فرع jemo البحثي — أرقام فقط دون بيانات شخصية.",
};

export default function ApplicationsPage() {
  return (
    <>
      <Header />
      <main>
        <ApplicationsClient />
      </main>
      <Footer />
    </>
  );
}
