import type { ReactNode } from "react";

/**
 * Homepage editorial spine primitives.
 *
 * Every major homepage section speaks the same language: an ordinal, a hairline,
 * a status dot, and an AR · EN kicker, followed by a two-tone headline. These two
 * primitives are the single source of truth for that markup so a section can never
 * drift from its neighbours.
 */

const TONES = {
  light: {
    wrap: "text-[#55696a]",
    num: "text-[#222f30]",
    rule: "bg-[#c9cbbe]",
    dot: "bg-[#a7e26e]",
    kicker: "text-[#738284]",
  },
  dark: {
    wrap: "text-white/70",
    num: "text-[#a7e26e]",
    rule: "bg-white/30",
    dot: "bg-[#a7e26e]",
    kicker: "text-white/80",
  },
} as const;

interface EditorialEyebrowProps {
  /** Ordinal in the page's numbered spine, e.g. "03". */
  num: string;
  kickerAr: string;
  /** Latin half of the kicker, rendered uppercase after a separator. */
  kickerEn?: string;
  tone?: keyof typeof TONES;
  className?: string;
}

export function EditorialEyebrow({
  num,
  kickerAr,
  kickerEn,
  tone = "light",
  className = "",
}: EditorialEyebrowProps) {
  const t = TONES[tone];
  return (
    <div className={`flex items-center gap-2.5 text-xs font-mono ${t.wrap} ${className}`}>
      <span className={`font-bold text-sm tracking-normal ${t.num}`}>{num}</span>
      <span className={`w-5 h-px ${t.rule}`} aria-hidden />
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} aria-hidden />
      <span className={`tracking-widest uppercase text-[11px] font-semibold ${t.kicker}`}>
        {kickerAr}
        {kickerEn ? ` · ${kickerEn}` : ""}
      </span>
    </div>
  );
}

interface EditorialSectionHeaderProps {
  num: string;
  kickerAr: string;
  kickerEn?: string;
  title: string;
  /** Trailing half of the headline, rendered in the muted ink tone. */
  titleAccent?: string;
  /** Body copy for the header rail — accepts inline markup for LTR/bidi runs. */
  lede?: ReactNode;
  /** Optional action (e.g. a BioButton) rendered under the lede. */
  cta?: ReactNode;
}

export default function EditorialSectionHeader({
  num,
  kickerAr,
  kickerEn,
  title,
  titleAccent,
  lede,
  cta,
}: EditorialSectionHeaderProps) {
  return (
    <div className="mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-[#e4e3e3]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 lg:gap-12">
        <div className="space-y-3 max-w-3xl">
          <EditorialEyebrow num={num} kickerAr={kickerAr} kickerEn={kickerEn} />
          <h2 className="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.2] text-[#222f30] font-kufi">
            {title}
            {titleAccent ? (
              <>
                {" "}
                <span className="text-[#738284] font-normal">{titleAccent}</span>
              </>
            ) : null}
          </h2>
        </div>

        {(lede || cta) && (
          <div className="flex flex-col gap-4 shrink-0 lg:max-w-md w-full lg:w-auto">
            {lede ? (
              <p className="text-sm sm:text-base text-[#55696a] leading-relaxed">{lede}</p>
            ) : null}
            {cta}
          </div>
        )}
      </div>
    </div>
  );
}
