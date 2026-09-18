"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Coins,
  Smartphone,
  Globe2,
  Building,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";

export interface SupportPaymentMethodsProps {
  selectedTier?: { name: string; amount: number } | null;
  onOpenInquiry: (category?: string) => void;
}

export default function SupportPaymentMethods({
  selectedTier,
  onOpenInquiry,
}: SupportPaymentMethodsProps) {
  const [activeTab, setActiveTab] = useState<"crypto" | "local" | "global" | "wire">("crypto");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeQr, setActiveQr] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const cryptoWallets = [
    {
      id: "usdt-trc20",
      coin: "USDT",
      network: "TRC-20 (Tron)",
      recommended: true,
      address: "TX9jemoLabsResearchTRC20TronNetworkSovereign84",
      note: "الشبكة الأقل رسوماً والأسرع عالمياً وداخل العراق.",
    },
    {
      id: "usdt-erc20",
      coin: "USDT / USDC",
      network: "ERC-20 (Ethereum & Arbitrum)",
      recommended: false,
      address: "0x71C8F4e86e7DeF34eFA62D7a44BFe10a2947a16E",
      note: "تدعم شبكات Ethereum Mainnet, Arbitrum One, و Base.",
    },
    {
      id: "btc",
      coin: "Bitcoin (BTC)",
      network: "Bitcoin Native SegWit",
      recommended: false,
      address: "bc1qjemo99labsresearchethicsovereign2026btc",
      note: "الشبكة الرئيسية للبيتكوين للتبرعات المباشرة والمحفوظة.",
    },
    {
      id: "eth",
      coin: "Ethereum (ETH)",
      network: "Ethereum Mainnet",
      recommended: false,
      address: "0x71C8F4e86e7DeF34eFA62D7a44BFe10a2947a16E",
      note: "دعم أبحاث النظم الموزعة والعقود الذكية غير الربحية.",
    },
    {
      id: "sol",
      coin: "Solana (SOL)",
      network: "Solana Network",
      recommended: false,
      address: "JemoLabs7vXx24R7Y6Z8h9aBcDeFgHiJkLmNoPqRsTuVw",
      note: "تحويل فوري وسريع عبر محفظة فانتوم أو أي محفظة سولانا.",
    },
  ];

  return (
    <section id="payment-methods" className="py-16">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cef79e]/30 text-[#222f30] text-xs font-mono font-bold">
          <Coins className="w-3.5 h-3.5 text-[#728825]" />
          <span>قنوات التبرع المباشر</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink-1)] font-kufi">
          طرق ووسائل الدعم المتاحة
        </h2>
        <p className="text-sm sm:text-base text-[var(--ink-2)]">
          وفرنا خيارات دفع متعددة تناسب الداعمين في العراق والمغتربين والمؤسسات الدولية حول العالم.
        </p>

        {selectedTier && (
          <div className="mt-4 p-3 rounded-2xl bg-[#cef79e]/20 border border-[#728825]/40 inline-flex items-center gap-2 text-xs font-mono text-[#222f30]">
            <Check className="w-4 h-4 text-[#728825]" />
            <span>
              الفئة المحددة: <strong>{selectedTier.name}</strong> (${selectedTier.amount})
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "crypto"}
          onClick={() => setActiveTab("crypto")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "crypto"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>العملات المشفرة (Crypto)</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "local"}
          onClick={() => setActiveTab("local")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "local"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>الدفع المحلي (العراق)</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "global"}
          onClick={() => setActiveTab("global")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "global"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          <Globe2 className="w-4 h-4" />
          <span>المنصات العالمية والمطورين</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "wire"}
          onClick={() => setActiveTab("wire")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === "wire"
              ? "bg-[var(--brand)] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--ink-2)] border border-[var(--line)] hover:bg-[var(--surface-hover)]"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>حوالة بنكية ومنح مؤسسية</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="max-w-4xl mx-auto">
        {/* 1. Crypto Panel */}
        {activeTab === "crypto" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#cef79e]/15 border border-[#a7e26e]/30 flex items-start gap-3 text-xs text-[var(--ink-1)]">
              <ShieldCheck className="w-5 h-5 text-[#728825] flex-shrink-0 mt-0.5" />
              <div>
                <strong>تبرع آمن وبلا وسيط:</strong> التبرعات بالعملات الرقمية تتيح لأي باحث أو متبرع حول العالم دعم المؤسسة مباشرة بدون عراقيل التحويل الدولية. كافة التحويلات تُسجل وتُوثق في تقرير التدقيق السنوي.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cryptoWallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] hover:border-[#a7e26e] transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center font-bold text-xs font-mono">
                        {wallet.coin.slice(0, 3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[var(--ink-1)]">{wallet.coin}</h4>
                          {wallet.recommended && (
                            <span className="px-2 py-0.5 rounded-full bg-[#cef79e] text-[#222f30] text-[10px] font-bold font-mono">
                              موصى به
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--ink-2)] font-mono">{wallet.network}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveQr(activeQr === wallet.id ? null : wallet.id)}
                        className="p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--ink-2)] hover:text-[var(--ink-1)] text-xs flex items-center gap-1.5 transition-colors"
                        title="عرض رمز الاستجابة السريعة (QR)"
                      >
                        <QrCode className="w-4 h-4" />
                        <span className="text-xs font-mono">QR</span>
                      </button>

                      <button
                        onClick={() => copyToClipboard(wallet.address, wallet.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${
                          copiedKey === wallet.id
                            ? "bg-[#cef79e] text-[#222f30]"
                            : "bg-[var(--brand)] text-white hover:bg-[#162021]"
                        }`}
                      >
                        {copiedKey === wallet.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ العنوان</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] font-mono text-xs text-[var(--ink-1)] break-all dir-ltr text-left select-all">
                    {wallet.address}
                  </div>

                  {activeQr === wallet.id && (
                    <div className="p-6 rounded-xl bg-white border border-[#a7e26e] flex flex-col items-center justify-center space-y-3 animate-fadeIn">
                      <div className="w-36 h-36 border-2 border-[var(--ink-1)] p-2 rounded-xl bg-white flex flex-col items-center justify-center">
                        <QrCode className="w-28 h-28 text-[var(--ink-1)] stroke-[1.2]" />
                        <span className="text-[9px] font-mono text-[var(--ink-2)] mt-1">{wallet.coin}</span>
                      </div>
                      <p className="text-[11px] font-mono text-[var(--ink-2)] text-center max-w-xs">
                        امسح الرمز عبر تطبيق محفظتك للإرسال مباشرة إلى شبكة {wallet.network}
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-[var(--ink-2)]">{wallet.note}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[var(--ink-2)]">
                هل قمت بتحويل كريبتو وترغب بإدراج اسمك أو الحصول على إشعار رسمي؟
              </span>
              <button
                onClick={() => onOpenInquiry("grant")}
                className="text-[#728825] font-bold hover:underline"
              >
                إرسال إشعار بالتحويل ←
              </button>
            </div>
          </div>
        )}

        {/* 2. Local Iraq Panel */}
        {activeTab === "local" && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] space-y-6">
              {/* ZainCash */}
              <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#a7e26e]/20 text-[#222f30] flex items-center justify-center font-bold text-sm">
                    زين
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[var(--ink-1)]">محفظة زين كاش (ZainCash)</h4>
                    <p className="text-xs text-[var(--ink-2)]">التحويل الفوري داخل العراق عبر تطبيق محفظة زين كاش</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-bold text-[var(--ink-1)] px-3 py-1.5 rounded-xl bg-white border border-[var(--line)] dir-ltr">
                    +964 770 976 3396
                  </span>
                  <button
                    onClick={() => copyToClipboard("+9647709763396", "zaincash")}
                    className="p-2.5 rounded-xl bg-[var(--brand)] text-white text-xs font-bold hover:opacity-90 transition-all"
                  >
                    {copiedKey === "zaincash" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* FIB (First Iraqi Bank) */}
              <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#cef79e] text-[#222f30] flex items-center justify-center font-bold text-sm">
                    FIB
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[var(--ink-1)]">مصرف العراق الأول (First Iraqi Bank)</h4>
                    <p className="text-xs text-[var(--ink-2)]">تحويل مصرفي رقمي فوري داخل العراق عبر تطبيق FIB</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenInquiry("grant")}
                  className="px-4 py-2 rounded-xl bg-white border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] hover:bg-[var(--surface-hover)] transition-all"
                >
                  طلب معرف FIB للتحويل
                </button>
              </div>

              {/* Qi Card */}
              <div className="p-5 rounded-2xl bg-[var(--surface-2)] border border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-sm">
                    Qi
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[var(--ink-1)]">كي كارد / الماستر كارد الوطنية (Qi Card)</h4>
                    <p className="text-xs text-[var(--ink-2)]">التحويل عبر خدمات بطاقة كي كارد أو الإيداع المباشر</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenInquiry("grant")}
                  className="px-4 py-2 rounded-xl bg-white border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] hover:bg-[var(--surface-hover)] transition-all"
                >
                  طلب تفاصيل الحساب
                </button>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700" />
                <div>
                  <strong>ملاحظة للمتبرعين من داخل العراق:</strong> يرجى إرسال رسالة نصية أو واتساب/تليغرام إلى الرقم <code>07709763396</code> بعد إتمام التحويل متضمنة اسمك ورغبتك في إدراج الاسم في قائمة الشرف أو البقاء متبرعاً مجهولاً.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Global Platforms Panel */}
        {activeTab === "global" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://github.com/Ali-Jemo"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] hover:border-[#a7e26e] transition-all space-y-4 group block"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface-2)] text-[var(--ink-1)] flex items-center justify-center">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--ink-2)] group-hover:text-[var(--brand)]" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[var(--ink-1)]">GitHub Sponsors</h4>
                <p className="text-xs text-[var(--ink-2)] mt-1 leading-relaxed">
                  رعاية مباشرة لمستودعات الأبحاث والأنظمة السيادية عبر منصة GitHub الرسمية للمطورين.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-[#728825] flex items-center gap-1">
                <span>github.com/sponsors/Ali-Jemo</span>
                <span>←</span>
              </div>
            </a>

            <a
              href="https://ali.lxds.org/"
              target="_blank"
              rel="noreferrer"
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--line)] hover:border-[#a7e26e] transition-all space-y-4 group block"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#cef79e]/40 text-[#222f30] flex items-center justify-center">
                  <Globe2 className="w-6 h-6 text-[#728825]" />
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--ink-2)] group-hover:text-[var(--brand)]" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[var(--ink-1)]">بوابة الباحث والمؤسس الرسمية</h4>
                <p className="text-xs text-[var(--ink-2)] mt-1 leading-relaxed">
                  الاطلاع على مبادرات الباحث ومستجدات البرمجيات الحرة والأبحاث غير الربحية.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-[#728825] flex items-center gap-1">
                <span>ali.lxds.org</span>
                <span>←</span>
              </div>
            </a>
          </div>
        )}

        {/* 4. Bank Wire / Grants Panel */}
        {activeTab === "wire" && (
          <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--line)] space-y-6">
            <div className="flex items-center gap-3 border-b border-[var(--line)] pb-5">
              <div className="w-12 h-12 rounded-2xl bg-[#cef79e]/30 text-[#222f30] flex items-center justify-center">
                <Building className="w-6 h-6 text-[#728825]" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-[var(--ink-1)] font-kufi">
                  التحويل المصرفي المباشر والمنح المؤسسية
                </h4>
                <p className="text-xs text-[var(--ink-2)] font-mono">
                  INSTITUTIONAL WIRE TRANSFER & RESEARCH GRANTS
                </p>
              </div>
            </div>

            <p className="text-sm text-[var(--ink-2)] leading-relaxed">
              ترحب JEMO LABS بالمنح الأكاديمية والرعايات المؤسسية المقدمة من الجامعات، مراكز الأبحاث، والمؤسسات التكنولوجية التي تشاركنا رؤية السيادة المعرفية والبرمجيات المفتوحة. نوفر عقود رعاية موثقة وفواتير رسمية وتقارير أثر دورية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
                <div className="font-bold text-[var(--ink-1)]">الوثائق المتوفرة:</div>
                <div className="text-[var(--ink-2)]">مذكرة تفاهم (MOU)، اتفاقية رعاية غير مشروطة، تقرير تدقيق مالي، وفواتير رسمية.</div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-1">
                <div className="font-bold text-[var(--ink-1)]">العملات المدعومة:</div>
                <div className="text-[var(--ink-2)]">الدولار الأمريكي (USD)، الدينار العراقي (IQD)، واليورو (EUR).</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenInquiry("grant")}
                className="px-6 py-3 rounded-full bg-[var(--brand)] text-white text-xs font-bold shadow-md hover:bg-[#162021] transition-all"
              >
                طلب تفاصيل الحساب المصرفي ومذكرة التفاهم
              </button>

              <a
                href="mailto:ali.jemo1.9@gmail.com?subject=Institutional%20Grant%20Inquiry%20-%20JEMO%20LABS"
                className="px-6 py-3 rounded-full bg-[var(--surface-2)] border border-[var(--line)] text-xs font-bold text-[var(--ink-1)] hover:bg-[var(--surface-hover)] transition-all"
              >
                مراسلة الشؤون المالية عبر البريد
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
