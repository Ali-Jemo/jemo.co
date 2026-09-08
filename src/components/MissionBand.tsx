import { ABOUT_INFO } from "@/lib/data/research-data";

// Mission / manifesto band — storytelling beat right after the hero.
// Server component: zero JS. Depth via glass cards + geometric motif.
export default function MissionBand() {
  return (
    <div className="relative">
      <div className="absolute inset-0 geo-pattern opacity-[0.04] pointer-events-none" />
      <div className="container relative max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[var(--ink)] bg-[var(--ink-1)] text-white text-xs font-mono font-bold uppercase tracking-widest mb-6">
          {">"} MANIFESTO_
        </div>

        <p className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tighter text-[var(--ink-1)] mb-6">
          “{ABOUT_INFO.coreQuote}”
        </p>

        <p className="text-base md:text-lg text-[var(--ink-2)] leading-relaxed max-w-2xl mx-auto">
          {ABOUT_INFO.mission}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {ABOUT_INFO.values.map((v) => (
            <div key={v.title} className="border-2 border-[var(--ink)] bg-white p-5 text-right shadow-[6px_6px_0_0_var(--ink)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_0_var(--ink)] transition-all duration-200">
              <h3 className="text-sm font-black text-[var(--ink-1)] mb-2 font-mono uppercase tracking-tight">
                {v.title}
              </h3>
              <p className="text-xs text-[var(--ink-2)] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
