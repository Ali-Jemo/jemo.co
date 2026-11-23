"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GalleryError({ reset }: { reset: () => void }) {
  return (
    <>
      <Header />
      <main className="bg-[var(--bg)] min-h-screen px-6 pt-40 pb-24">
        <div className="max-w-xl mx-auto rounded-3xl border border-red-200 bg-red-50 p-8 text-center" role="alert">
          <h1 className="text-2xl font-bold text-red-900">تعذّر عرض المعرض</h1>
          <p className="mt-3 text-sm text-red-900 leading-relaxed">
            حدث خطأ أثناء تجهيز الأعمال. أعد المحاولة.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 px-6 py-2 rounded-lg bg-red-800 text-white hover:bg-red-900"
          >
            إعادة المحاولة
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
