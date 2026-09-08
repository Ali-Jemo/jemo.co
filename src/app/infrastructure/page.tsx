import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import ComputeRequestModal from "@/components/ComputeRequestModal";
import { INFRASTRUCTURE } from "@/lib/data/research-data";
import { Cpu, Server, MapPin, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "البنية التحتية والخوادم (Infrastructure) | JEMO LABS",
  description: "مجموعات الحوسبة فائقة الأداء، خوادم H100، ومنصات اختبار معالجات RISC-V.",
};

export default function InfrastructurePage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-24 sm:pt-28 pb-20 bg-[#f7f7f5]" dir="rtl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-4xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#e4e3e3] bg-white font-mono text-xs uppercase tracking-widest text-[#445e5f] mb-4 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#a7e26e]" />
              <span>العتاد الحوسبي الفائق · SOVEREIGN INFRASTRUCTURE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#222f30] mb-4 tracking-tight leading-tight font-kufi">
              البنية التحتية والتجهيزات الحوسبية.
            </h1>
            <p className="text-base sm:text-xl text-[#445e5f] leading-relaxed max-w-2xl">
              عناقيد حوسبة فائقة، خوادم H100، ومنصات اختبار معالجات RISC-V المجهزة لدعم الباحثين والمؤسسات السيادية.
            </p>
          </div>
          <div className="text-center mb-12">
            <ComputeRequestModal />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {INFRASTRUCTURE.map((item) => (
              <div
                key={item.id}
                className="group p-8 rounded-3xl bg-white border border-[#e4e3e3] shadow-xs hover:border-[#a7e26e] hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e3e3] pb-5 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-[#222f30] flex items-center justify-center group-hover:bg-[#cef79e] transition-colors">
                        <Cpu className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#cef79e] text-[#222f30] mb-1">
                          {item.category}
                        </span>
                        <h2 className="text-xl font-bold text-[#222f30]">{item.name}</h2>
                      </div>
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5" />
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-xs font-mono text-[#445e5f] font-bold">المواصفات العتادية (Specifications):</div>
                    <div className="p-4 rounded-2xl bg-[#f5f8f7] border border-[#e4e3e3] text-xs font-mono text-[#222f30] dir-ltr text-right">
                      {item.specs}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#e4e3e3] text-xs">
                  <div className="text-[#445e5f]">
                    الغرض البحثي: <span className="text-[#222f30] font-bold">{item.purpose}</span>
                  </div>
                  <div className="font-mono flex items-center gap-1 text-[#728825] font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
