"use client";

import { useState } from "react";
import SupportHero from "./SupportHero";
import SupportTiers from "./SupportTiers";
import SupportPaymentMethods from "./SupportPaymentMethods";
import NonFinancialSupport from "./NonFinancialSupport";
import SupportAllocation from "./SupportAllocation";
import SupportCommitments from "./SupportCommitments";
import SupportFAQ from "./SupportFAQ";
import SupportWall from "./SupportWall";
import SupportInquiryModal from "./SupportInquiryModal";
import type { FinancialSupports } from "@/lib/live-content";
import { Mail, ArrowUpLeft, HeartHandshake } from "lucide-react";
import Link from "next/link";

export interface SupportPageClientProps {
  supports: FinancialSupports;
}

export default function SupportPageClient({ supports }: SupportPageClientProps) {
  const [selectedTier, setSelectedTier] = useState<{ name: string; amount: number } | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryCategory, setInquiryCategory] = useState<string>("institutional");

  const handleOpenInquiry = (category: string = "institutional") => {
    setInquiryCategory(category);
    setInquiryModalOpen(true);
  };

  const handleSelectTier = (name: string, amount: number) => {
    setSelectedTier({ name, amount });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <SupportHero
        quote={supports.quote}
        onOpenInquiry={handleOpenInquiry}
      />

      {/* 2. Sponsorship Tiers & Interactive Impact Calculator */}
      <SupportTiers
        onSelectTier={handleSelectTier}
        onOpenInquiry={handleOpenInquiry}
      />

      {/* 3. Multi-Channel Payment Methods (Crypto, Local Iraqi, Global, Wire) */}
      <SupportPaymentMethods
        selectedTier={selectedTier}
        onOpenInquiry={handleOpenInquiry}
      />

      {/* 4. Non-Financial Ways to Support (Compute, Code, Hardware, Peer Review) */}
      <NonFinancialSupport onOpenInquiry={handleOpenInquiry} />

      {/* 5. Financial Breakdown & Visual Allocation Bar */}
      <SupportAllocation breakdown={supports.breakdown} />

      {/* 6. Transparency Commitments & Ethics Charter */}
      <SupportCommitments commitments={supports.commitments} />

      {/* 7. Wall of Recognition & Patron Honor Roll */}
      <SupportWall onOpenInquiry={handleOpenInquiry} />

      {/* 8. Frequently Asked Questions */}
      <SupportFAQ />

      {/* 9. Final Call to Action Box */}
      <section className="py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--line)] text-center space-y-6 max-w-4xl mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#cef79e]/40 text-[#222f30] flex items-center justify-center mx-auto shadow-xs">
            <HeartHandshake className="w-7 h-7 text-[#728825]" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h3 className="text-xl sm:text-3xl font-black text-[var(--ink-1)] font-kufi">
              هل لديك استفسار محدد أو ترغب في لقاء الفريق؟
            </h3>
            <p className="text-xs sm:text-sm text-[var(--ink-2)] leading-relaxed">
              يسعدنا دائماً فتح أبواب الحوار مع الرعاة والشركاء الأكاديميين لمناقشة آفاق البحث وبناء شراكات حقيقية تخدم السيادة التقنية في المنطقة.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleOpenInquiry("custom")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand)] text-white text-xs sm:text-sm font-bold shadow-md hover:bg-[#162021] transition-all"
            >
              <span>فتح محادثة رعاية مباشرة</span>
              <ArrowUpLeft className="w-4 h-4" />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ink-1)] text-xs sm:text-sm font-bold hover:bg-[var(--surface-hover)] transition-all"
            >
              <Mail className="w-4 h-4 text-[var(--ink-2)]" />
              <span>صفحة التواصل وقنوات الاتصال</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Dialog */}
      <SupportInquiryModal
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
        defaultCategory={inquiryCategory}
      />
    </div>
  );
}
