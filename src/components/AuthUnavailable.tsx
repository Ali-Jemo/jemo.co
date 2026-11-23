"use client";

import Link from "next/link";

export default function AuthUnavailable({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24 bg-[#f7f7f5]" dir="rtl">
      <div className="max-w-md w-full rounded-3xl border border-[#e4e3e3] bg-white p-8 text-center shadow-sm space-y-4">
        <p className="font-mono text-[11px] tracking-wider text-[#728825]">JEMO LABS</p>
        <h1 className="text-2xl font-bold text-[#222f30] font-kufi">{title}</h1>
        <p className="text-sm leading-relaxed text-[#445e5f]">{body}</p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#222f30] px-5 py-2.5 text-xs font-bold text-white"
        >
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
