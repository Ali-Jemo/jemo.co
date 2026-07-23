import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApplicationsClient from "./ApplicationsClient";

export const metadata: Metadata = {
  title: "القبولات والطلبات",
  description: "سجل القبولات الشفاف لطلبات الانضمام لفرع jemo البحثي.",
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
