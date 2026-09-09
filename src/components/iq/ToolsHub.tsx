"use client";

import Link from "next/link";
import { Wrench, ExternalLink, MapPin, BookOpen, Car, Globe, Shield, Coins } from "lucide-react";

interface ToolCard {
  id: string;
  title: string;
  badge: string;
  badgeClass: string;
  desc: string;
  href: string;
  isExternal: boolean;
  icon: React.ComponentType<{ className?: string }>;
  partnerNote?: string;
}

const TOOLS: ToolCard[] = [
  {
    id: "friend-dollar",
    title: "آيا نصير — متابعة الدولار",
    badge: "شراكة وتكامل",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    desc: "منصة صديقنا لمتابعة سعر السوق المحلي، حركة الـ 7 أيام، ودفتر المعاملات اليومية.",
    href: "https://ayanadollar-dhkgohtw.manus.space/dashboard",
    isExternal: true,
    icon: Coins,
    partnerNote: "أنت الصباح، وهو العمق — شريكنا ومصدر أرقام الصرف",
  },
  {
    id: "ur-gov",
    title: "بوابة أور الحكومية",
    badge: "بوابة رسمية",
    badgeClass: "bg-[#f0f2f0] text-[#222f30] border-[#e4e3e3]",
    desc: "حجز الجواز الإلكتروني، البطاقة الوطنية، رخص القيادة، وصحة الصدور بدون معقبين.",
    href: "https://ur.gov.iq",
    isExternal: true,
    icon: Globe,
  },
  {
    id: "traffic-fines",
    title: "فحص غرامات المرور",
    badge: "خدمة فورية",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    desc: "استعلام مباشر عن الغرامات المسجلة على المركبة برقم اللوحة والحرف والمحافظة.",
    href: "https://itp.gov.iq",
    isExternal: true,
    icon: Car,
  },
  {
    id: "local-map",
    title: "خريطة محلات المحلة",
    badge: "داخل هسه",
    badgeClass: "bg-sky-50 text-sky-800 border-sky-200",
    desc: "محلات وأفران ومصلحين غير مسجلين على جوجل ماب، بأرقام واتساب وتقييمات الجيران.",
    href: "/iq/map",
    isExternal: false,
    icon: MapPin,
  },
  {
    id: "intel-guides",
    title: "دليل المعاملات والتجارب",
    badge: "داخل هسه",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200",
    desc: "تجارب حقيقية لإنجاز المعاملات وتقييمات حيادية للشركات والمستشفيات.",
    href: "/iq/intel",
    isExternal: false,
    icon: BookOpen,
  },
  {
    id: "salary-calc",
    title: "حاسبة الراتب والتقاعد",
    badge: "أداة مدمجة",
    badgeClass: "bg-[#cef79e]/40 text-[#222f30] border-[#a7e26e]",
    desc: "حساب الراتب الاسمي والمخصصات بعد الاستقطاعات والتقاعد ومكافأة نهاية الخدمة.",
    href: "/iq#calculator",
    isExternal: false,
    icon: Shield,
  },
];

export default function ToolsHub() {
  return (
    <div className="space-y-4 rounded-2xl border border-[#e4e3e3] bg-white p-4 shadow-xs sm:p-5">
      <div className="flex items-center justify-between gap-2 border-b border-[#e4e3e3] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#222f30]">
            <Wrench className="h-4 w-4 text-[#cef79e]" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-kufi text-sm font-bold text-[#222f30]">
              دليل الأدوات والمنصات العراقية
            </h2>
            <p className="text-[11px] text-[#55696a]">
              كل المنصات المفيدة بمكان واحد — رسمية ومجتمعية
            </p>
          </div>
        </div>

        <span className="hidden shrink-0 rounded-full bg-[#f0f2f0] px-2.5 py-1 text-[10px] font-bold text-[#55696a] sm:inline">
          6 أدوات مختارة
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;

          const CardContent = (
            <div className="group flex h-full cursor-pointer flex-col justify-between gap-3 rounded-xl border border-[#e4e3e3] bg-[#f7f7f5] p-4 transition-all hover:-translate-y-0.5 hover:border-[#a7e26e] hover:bg-white hover:shadow-sm focus-within:border-[#a7e26e]">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e3e3] bg-white text-[#222f30] transition-colors group-hover:border-[#a7e26e]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${tool.badgeClass}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                <h3 className="flex items-center gap-1.5 font-kufi text-sm font-bold text-[#222f30]">
                  <span>{tool.title}</span>
                  {tool.isExternal && (
                    <ExternalLink
                      className="h-3 w-3 shrink-0 text-[#55696a] transition-colors group-hover:text-[#222f30]"
                      aria-hidden="true"
                    />
                  )}
                </h3>

                <p className="text-xs leading-relaxed text-[#55696a]">{tool.desc}</p>
              </div>

              {tool.partnerNote ? (
                <div className="flex items-center gap-1 border-t border-[#e4e3e3] pt-2.5 text-[10px] font-bold text-[#728825]">
                  <span aria-hidden="true">↳</span>
                  <span>{tool.partnerNote}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between border-t border-[#e4e3e3] pt-2.5 text-[11px] font-bold text-[#55696a] transition-colors group-hover:text-[#222f30]">
                  <span>انتقل للأداة</span>
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                </div>
              )}
            </div>
          );

          if (tool.isExternal) {
            return (
              <a
                key={tool.id}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${tool.title} (رابط خارجي)`}
                className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
              >
                {CardContent}
              </a>
            );
          }

          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#222f30]"
            >
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
