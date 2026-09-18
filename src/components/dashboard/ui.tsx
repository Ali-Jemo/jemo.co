"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Shared dashboard design tokens. Every dashboard surface composes these so
 * cards, headers, buttons, inputs, pills and empty states look like one UI.
 */

export const cardClass =
  "rounded-3xl bg-white border border-[#e4e3e3] shadow-xs";

export const primaryBtnClass =
  "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#222f30] text-white text-xs font-bold hover:bg-[#162224] transition-all shadow-xs cursor-pointer";

export const outlineBtnClass =
  "inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#e4e3e3] bg-white text-xs font-bold text-[#222f30] hover:bg-[#f5f8f7] transition-all shadow-xs cursor-pointer";

export const dangerGhostBtnClass =
  "inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-[#e4e3e3] bg-white text-xs font-mono text-[#55696a] hover:text-red-700 hover:border-red-200 hover:bg-red-50/50 transition-all shadow-xs cursor-pointer";

/** Buttons for use on the dark dashboard hero panel. */
export const heroPrimaryBtnClass =
  "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#cef79e] text-[#162224] text-xs font-bold hover:bg-[#a7e26e] transition-all shadow-xs cursor-pointer";

export const heroGhostBtnClass =
  "inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-white text-xs font-bold hover:bg-white/10 transition-all cursor-pointer";

export const heroDangerBtnClass =
  "inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-white/15 bg-transparent text-white/60 text-xs font-mono hover:text-red-300 hover:border-red-400/40 transition-all cursor-pointer";

export const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs text-[#222f30] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/25 transition-all";

export const textareaClass =
  "w-full px-3.5 py-2 rounded-xl border border-[#e4e3e3] bg-[#fcfdfc] text-xs text-[#222f30] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#a7e26e] focus:ring-2 focus:ring-[#a7e26e]/25 transition-all leading-relaxed";

export const pillActiveClass =
  "bg-[#222f30] text-white font-bold shadow-xs";

export const pillIdleClass =
  "bg-white border border-[#e4e3e3] text-[#55696a] hover:text-[#222f30] hover:bg-[#f5f8f7]";

export const enBadgeClass =
  "text-xs font-mono text-[#738284] px-2.5 py-0.5 rounded-md bg-[#f0f2f0] border border-[#e4e3e3]/60";

export const modalOverlayClass =
  "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs";

export const modalPanelClass =
  "relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-[#e4e3e3] shadow-2xl p-6 sm:p-8 space-y-5 text-[#222f30]";

type Accent = "lime" | "purple" | "blue" | "amber" | "emerald" | "dark";

const accentChipClass: Record<Accent, string> = {
  lime: "bg-[#cef79e]/40 text-[#222f30] border-[#cef79e]",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  dark: "bg-[#222f30] text-[#cef79e] border-[#222f30]",
};

const chipSizeClass = {
  md: "w-8 h-8 rounded-xl",
  lg: "w-10 h-10 rounded-xl",
  xl: "w-14 h-14 rounded-2xl",
} as const;

export function IconChip({
  accent,
  size = "md",
  children,
  className = "",
}: {
  accent: Accent;
  size?: keyof typeof chipSizeClass;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`${chipSizeClass[size]} ${accentChipClass[accent]} flex items-center justify-center border shrink-0 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  icon,
  accent,
  title,
  en,
  desc,
  action,
  footer,
}: {
  icon: ReactNode;
  accent: Accent;
  title: string;
  en?: string;
  desc?: string;
  action?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={`${cardClass} p-5 sm:p-6 space-y-4`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <IconChip accent={accent} size="lg">
            {icon}
          </IconChip>
          <div>
            <h2 className="text-lg font-bold font-kufi text-[#222f30] flex flex-wrap items-center gap-2">
              <span>{title}</span>
              {en && (
                <span className={enBadgeClass}>
                  <bdi>{en}</bdi>
                </span>
              )}
            </h2>
            {desc && (
              <p className="text-xs text-[#55696a] mt-1 max-w-xl leading-relaxed">
                {desc}
              </p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0 self-start sm:self-center">{action}</div>}
      </div>
      {footer && (
        <div className="pt-4 border-t border-[#e4e3e3]">
          {footer}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  icon,
  accent,
  title,
  desc,
  action,
}: {
  icon: ReactNode;
  accent: Accent;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className={`${cardClass} p-8 sm:p-10 text-center space-y-4`}>
      <IconChip accent={accent} size="xl" className="mx-auto">
        {icon}
      </IconChip>
      <div>
        <h3 className="text-base font-bold font-kufi text-[#222f30]">{title}</h3>
        {desc && (
          <p className="text-xs text-[#55696a] mt-1 max-w-md mx-auto leading-relaxed">
            {desc}
          </p>
        )}
      </div>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}

export function ModalShell({
  titleId,
  icon,
  accent,
  title,
  desc,
  onClose,
  children,
}: {
  titleId: string;
  icon: ReactNode;
  accent: Accent;
  title: string;
  desc?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId} className={modalOverlayClass}>
      <div className={modalPanelClass} dir="rtl">
        <div className="flex items-center justify-between pb-4 border-b border-[#e4e3e3]">
          <div className="flex items-center gap-2.5">
            <IconChip accent={accent} size="lg">
              {icon}
            </IconChip>
            <div>
              <h3 id={titleId} className="text-lg font-bold font-kufi text-[#222f30]">
                {title}
              </h3>
              {desc && <p className="text-xs text-[#55696a]">{desc}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-[#738284] hover:text-[#222f30] hover:bg-[#f0f2f0] transition-colors cursor-pointer"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block font-bold text-[#222f30] mb-1.5 text-xs">
        {label}
      </label>
      {children}
    </div>
  );
}
