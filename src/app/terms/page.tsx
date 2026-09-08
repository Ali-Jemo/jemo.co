import { Metadata } from "next";

const DESCRIPTION =
  "الشروط والأحكام المنظمة لمنصة jemo labs: الخصوصية وحماية البيانات، قواعد السلوك المجتمعي، الملكية الفكرية، مستوى الخدمة، الاشتراكات وحل النزاعات.";

export const metadata: Metadata = {
  title: "الشروط والأحكام | jemo labs",
  description: DESCRIPTION,
  openGraph: {
    title: "الشروط والأحكام | jemo labs",
    description: DESCRIPTION,
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "الشروط والأحكام | jemo labs",
    description: DESCRIPTION,
  },
};

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TermsClient from "./TermsClient";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "هل يمكنني طلب حذف كامل بياناتي من jemo labs؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نعم، يمكنك في أي وقت تقديم طلب وسيتم مسح جميع بياناتك وحسابك نهائياً خلال 72 ساعة وفق سياسة GDPR.",
      },
    },
    {
      "@type": "Question",
      name: "كيف يتم إبلاغي في حال تعديل الشروط والأحكام؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نقوم بإرسال إشعار مباشر عبر البريد الإلكتروني بالإضافة إلى إعلان بارز أعلى المنصة قبل بدء تطبيق الشروط الجديدة بـ 14 يوماً.",
      },
    },
    {
      "@type": "Question",
      name: "هل المشاريع المطورة عبر jemo labs مملوكة لي؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "بالتأكيد، كل ما تقوم بابتكاره وبنائه هو ملكك الخاص بنسبة 100% ما لم يخضع لتراخيص مفتوحة المصدر تم التوافق عليها مسبقاً.",
      },
    },
    {
      "@type": "Question",
      name: "ما هي سياسة استرجاع الأموال للاشتراكات؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "نقدم ضمان استرجاع كامل للمبلغ خلال 14 يوماً من تفعيل الاشتراك دون أي أسئلة معقدة.",
      },
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <main>
        <TermsClient />
      </main>
      <Footer />
    </>
  );
}
