"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24 bg-[#f7f7f5]" dir="rtl">
      <div className="max-w-lg w-full text-center space-y-6">
        <p className="font-mono text-xs text-[#728825]">JEMO LABS</p>
        <h1 className="text-4xl sm:text-5xl font-black text-[#222f30] font-kufi">تعذّر عرض الصفحة</h1>
        <p className="text-sm leading-relaxed text-[#445e5f]">
          حدث خلل أثناء تجهيز هذه الصفحة. المحتوى المحفوظ ما زال في السجل، ويمكنك إعادة المحاولة أو العودة للرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-[#222f30] px-5 py-2.5 text-xs font-bold text-white"
          >
            إعادة المحاولة
          </button>
          <Link href="/" className="rounded-full border border-[#e4e3e3] bg-white px-5 py-2.5 text-xs font-bold text-[#222f30]">
            الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
