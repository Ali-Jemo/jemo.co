"use client";

import Link from "next/link";
import { Wrench, ExternalLink, MapPin, BookOpen, Car, Globe, Shield, Coins } from "lucide-react";

interface ToolCard {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  desc: string;
  href: string;
  isExternal: boolean;
  icon: React.ComponentType<{ className?: string }>;
  partnerNote?: string;
}

const TOOLS: ToolCard[] = [
  {
    id: "friend-dollar",
    title: "آيا نصير — منصة متابعة الدولار",
    badge: "شراكة وتكامل",
    badgeColor: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    desc: "منصة صديقنا لمتابعة سعر السوق المحلي، حركة الـ 7 أيام، ودفتر المعاملات اليومية.",
    href: "https://ayanadollar-dhkgohtw.manus.space/dashboard",
    isExternal: true,
    icon: Coins,
    partnerNote: "أنت الصباح، وهو العمق — شريكنا ومصدر أرقام الصرف",
  },
  {
    id: "ur-gov",
    title: "بوابة أور للخدمات الحكومية",
    badge: "بوابة رسمية",
    badgeColor: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    desc: "حجز مواعيد الجواز الإلكتروني، البطاقة الوطنية، رخص القيادة، وصحة الصدور الرقمية بدون معقبين.",
    href: "https://ur.gov.iq",
    isExternal: true,
    icon: Globe,
  },
  {
    id: "traffic-fines",
    title: "فحص غرامات المرور العامة",
    badge: "خدمة فورية",
    badgeColor: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    desc: "استعلام مباشر عن الغرامات والمخالفات المسجلة على المركبة برقم اللوحة والحرف والمحافظة.",
    href: "https://itp.gov.iq",
    isExternal: true,
    icon: Car,
  },
  {
    id: "local-map",
    title: "خريطة محلات المحلة (هسه)",
    badge: "الباب الثاني",
    badgeColor: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
    desc: "محلات، أفران، كوزمتك، ومصلحين غير مسجلين على جوجل ماب، بأرقام واتساب مباشرة وتقييمات حقيقية.",
    href: "/iq/map",
    isExternal: false,
    icon: MapPin,
  },
  {
    id: "intel-guides",
    title: "دليل المعاملات الحي والتجارب",
    badge: "الباب الثالث",
    badgeColor: "bg-purple-400/15 text-purple-300 border-purple-400/30",
    desc: "تجارب حقيقية من المواطنين لإنجاز المعاملات، وتقييمات حيادية للشركات والمستشفيات والخدمات.",
    href: "/iq/intel",
    isExternal: false,
    icon: BookOpen,
  },
  {
    id: "salary-calc",
    title: "حاسبة استحقاق الراتب والتقاعد",
    badge: "أداة مدمجة",
    badgeColor: "bg-sky-400/15 text-sky-300 border-sky-400/30",
    desc: "حساب سريع للراتب الاسمي والمخصصات بعد الاستقطاعات وصندوق التقاعد ومكافأة نهاية الخدمة.",
    href: "/iq#calculator",
    isExternal: false,
    icon: Shield,
  },
];

export default function ToolsHub() {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e4e3e3] shadow-xs space-y-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e4e3e3]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#cef79e] text-[#222f30] border border-[#a7e26e] flex items-center justify-center">
            <Wrench className="w-4 h-4 text-[#222f30]" />
          </div>
          <div>
            <h3 className="font-kufi font-bold text-sm text-[#222f30]">
              دليل الأدوات والمنصات العراقية
            </h3>
            <p className="text-[10px] font-mono text-[#55696a]">
              بوابة تجمع المنصات المفيدة في مكان واحد — موجه للكل وجزء من الكل
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#55696a] hidden sm:inline">
          6 أدوات مختارة
        </span>
      </div>

      {/* Grid of 6 Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isLinkExternal = tool.isExternal;

          const CardContent = (
            <div className="h-full p-4 rounded-xl bg-[#f7f7f5] hover:bg-white border border-[#e4e3e3] hover:border-[#a7e26e] hover:shadow-sm transition-all flex flex-col justify-between space-y-3 group cursor-pointer">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#e4e3e3] flex items-center justify-center text-[#222f30] group-hover:border-[#a7e26e] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                <h4 className="font-kufi font-bold text-sm text-[#222f30] group-hover:text-[#162021] transition-colors flex items-center gap-1.5">
                  <span>{tool.title}</span>
                  {isLinkExternal && (
                    <ExternalLink className="w-3 h-3 text-[#55696a] group-hover:text-[#222f30] transition-colors shrink-0" />
                  )}
                </h4>

                <p className="text-xs text-[#55696a] leading-relaxed font-sans">
                  {tool.desc}
                </p>
              </div>

              {tool.partnerNote ? (
                <div className="text-[10px] font-mono text-[#728825] font-bold pt-2 border-t border-[#e4e3e3] flex items-center gap-1">
                  <span>↳</span>
                  <span>{tool.partnerNote}</span>
                </div>
              ) : (
                <div className="text-[10px] font-mono text-[#55696a] group-hover:text-[#222f30] pt-2 border-t border-[#e4e3e3] flex items-center justify-between">
                  <span>انتقل للأداة</span>
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                </div>
              )}
            </div>
          );

          if (isLinkExternal) {
            return (
              <a
                key={tool.id}
                href={tool.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full no-underline"
              >
                {CardContent}
              </a>
            );
          }

          return (
            <Link key={tool.id} href={tool.href} className="block h-full no-underline">
              {CardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
