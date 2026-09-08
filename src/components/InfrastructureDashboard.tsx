"use client";

import Link from "next/link";
import { Server, ArrowUpLeft, Cpu, HardDrive, Wifi, MapPin } from "lucide-react";
import { INFRASTRUCTURE } from "@/lib/data/research-data";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "AI Supercomputing": Cpu,
  "Hardware & Operating Systems": HardDrive,
  "Heritage Optics": Server,
};

const STATUS_COLORS: Record<string, string> = {
  "Online": "bg-emerald-500",
  "Expanding": "bg-amber-500",
  "Offline": "bg-red-500",
};

// ponytail: static infra cards, zero framer-motion.
export default function InfrastructureDashboard() {
  return (
    <div className="space-y-12">
      <SectionHeader
        eyebrow="البنية التحتية الحاسوبية"
        title="مراكز البيانات والمختبرات الحية"
        description="بنية تحتية حاسوبية سيادية تدعم التدريب الضخم والمعالجة المتوازية والأبحاث الميدانية."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INFRASTRUCTURE.map((infra) => {
          const Icon = CATEGORY_ICONS[infra.category] ?? Server;
          const statusColor = STATUS_COLORS[infra.status] ?? "bg-gray-400";

          return (
            <Card key={infra.id} hover className="p-6 flex flex-col justify-between border-2 border-[var(--line)] hover:border-[var(--brand)]/40 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold">
                    <span className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
                    <span className={infra.status === "Online" ? "text-emerald-500" : "text-amber-500"}>
                      {infra.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[var(--ink-1)] mb-1 leading-snug">{infra.name}</h3>
                <p className="text-[10px] font-mono text-[var(--brand)] mb-3">{infra.category}</p>
                <p className="text-xs text-[var(--ink-2)] leading-relaxed mb-4">{infra.purpose}</p>
              </div>

              <div className="space-y-2 pt-3 border-t border-[var(--line)]">
                <div className="flex items-start gap-2 text-[10px] font-mono text-[var(--ink-2)]">
                  <Cpu className="w-3 h-3 mt-0.5 shrink-0 text-[var(--brand)]" />
                  <span className="dir-ltr">{infra.specs}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--ink-2)]">
                  <MapPin className="w-3 h-3 shrink-0 text-[var(--brand)]" />
                  <span>{infra.location}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
