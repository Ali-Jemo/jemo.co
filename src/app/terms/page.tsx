import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | الخصوصية والشأنية",
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TermsClient from "./TermsClient";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <TermsClient />
      </main>
      <Footer />
    </>
  );
}
