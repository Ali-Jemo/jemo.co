"use client";

import Link from "next/link";
import { useState } from "react";

interface BioButtonProps {
  href: string;
  label: string;
  secondaryLabel?: string;
  variant?: "primary" | "secondary" | "stone" | "dark-glass";
  iconType?: "arrow-right" | "arrow-up-right";
  className?: string;
  dir?: "ltr" | "rtl";
  target?: string;
  onClick?: () => void;
}

/**
 * BioButton — Pixel-identical compound button from Integrated Biosciences (integratedbio.com).
 * Features:
 * 1. Slanted trailing corner SVG seamlessly extending the main label pill.
 * 2. Detached organic squircle SVG blob with complementary angle.
 * 3. Color inversion on hover (Pine #222F30 ⇄ Bio-Lime #CEF79E).
 * 4. Dual-arrow conveyor slide animation (Arrow 1 slides out, Arrow 2 slides in).
 * 5. Magnetic gap contraction on hover (from 16px to 12px).
 * 6. Responsive scaling with full LTR and RTL support.
 */
export default function BioButton({
  href,
  label,
  secondaryLabel,
  variant = "primary",
  className = "",
  dir = "ltr",
  target,
  onClick,
}: BioButtonProps) {
  const [hovered, setHovered] = useState(false);

  const isRtl = dir === "rtl";
  const isArabic = /[\u0600-\u06FF]/.test(label);

  // Palette definitions based on variant and hover state
  let labelBg = "#222F30";
  let labelColor = "#FFFFFF";
  let blobBg = "#CEF79E";
  let arrowColor = "#222F30";
  let labelBorder = "transparent";

  if (variant === "primary") {
    // Exact Image #1 (Resting) ⇄ Image #2 (Hover)
    labelBg = hovered ? "#CEF79E" : "#222F30";
    labelColor = hovered ? "#222F30" : "#FFFFFF";
    blobBg = hovered ? "#222F30" : "#CEF79E";
    arrowColor = hovered ? "#FFFFFF" : "#222F30";
  } else if (variant === "secondary") {
    labelBg = hovered ? "#222F30" : "#FFFFFF";
    labelColor = hovered ? "#FFFFFF" : "#222F30";
    blobBg = hovered ? "#CEF79E" : "#E4E3E3";
    arrowColor = hovered ? "#222F30" : "#222F30";
    labelBorder = hovered ? "transparent" : "#E4E3E3";
  } else if (variant === "stone") {
    labelBg = hovered ? "#222F30" : "#C9CBBE";
    labelColor = hovered ? "#FFFFFF" : "#222F30";
    blobBg = hovered ? "#CEF79E" : "#222F30";
    arrowColor = hovered ? "#222F30" : "#FFFFFF";
  } else if (variant === "dark-glass") {
    labelBg = hovered ? "#CEF79E" : "rgba(22, 34, 36, 0.9)";
    labelColor = hovered ? "#222F30" : "#FFFFFF";
    blobBg = hovered ? "#222F30" : "#CEF79E";
    arrowColor = hovered ? "#FFFFFF" : "#222F30";
    labelBorder = hovered ? "transparent" : "rgba(255, 255, 255, 0.18)";
  }

  return (
    <Link
      href={href}
      target={target}
      onClick={onClick}
      dir={dir}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`u-btn--1 bio-btn-compound inline-flex items-center select-none cursor-pointer group no-underline transition-transform duration-300 active:scale-[0.98] ${className}`}
      style={{
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div className="relative inline-flex items-center h-12">
        {/* ================= 1. MAIN LABEL PILL ================= */}
        <span
          className="relative inline-flex items-center h-12 text-xs sm:text-sm font-mono uppercase tracking-[0.06em] font-medium transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
          style={{
            backgroundColor: labelBg,
            color: labelColor,
            borderRadius: isRtl ? "0 12px 12px 0" : "12px 0 0 12px",
            paddingLeft: isRtl ? "12px" : "22px",
            paddingRight: isRtl ? "22px" : (hovered ? "13px" : "16px"),
            marginRight: isRtl ? "0px" : (hovered ? "12px" : "16px"),
            marginLeft: isRtl ? (hovered ? "12px" : "16px") : "0px",
            borderTop: labelBorder !== "transparent" ? `1px solid ${labelBorder}` : "none",
            borderBottom: labelBorder !== "transparent" ? `1px solid ${labelBorder}` : "none",
            borderLeft: !isRtl && labelBorder !== "transparent" ? `1px solid ${labelBorder}` : "none",
            borderRight: isRtl && labelBorder !== "transparent" ? `1px solid ${labelBorder}` : "none",
            boxShadow: hovered && (variant === "primary" || variant === "dark-glass")
              ? "0 10px 28px -4px rgba(206, 247, 158, 0.45)"
              : "0 2px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <span className={`whitespace-nowrap select-none ${isArabic ? "font-kufi tracking-normal font-semibold text-sm" : ""}`}>
            {label}
          </span>
          {secondaryLabel && (
            <span className="opacity-75 text-[10px] ml-1.5 font-normal font-kufi hidden md:inline">
              ({secondaryLabel})
            </span>
          )}

          {/* Slanted Trailing Corner Cutout SVG */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              [isRtl ? "left" : "right"]: "-16px",
              width: "18px",
              height: "48px",
              transform: isRtl ? "scaleX(-1)" : "none",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="48"
              fill="none"
              viewBox="0 0 18 48"
              className="w-full h-full block"
            >
              {/* IntegratedBio exact slanted corner geometry */}
              <path
                d="M-0.5 0 h6.13 c7.808 0 13.536 7.337 11.642 14.91 l-6.09 24.359 A11.527 11.527 0 0 1 -0.5 48 V0 Z"
                fill={labelBg}
                className="transition-colors duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            </svg>
          </div>
        </span>

        {/* ================= 2. DETACHED SQUIRCLE BLOB ================= */}
        <span
          className="relative inline-flex items-center justify-center w-[51px] h-12 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shrink-0"
          style={{
            transform: hovered ? "scale(0.875)" : "scale(1)",
            transformOrigin: isRtl ? "center left" : "center right",
          }}
        >
          {/* Organic Asymmetrical Squircle Background SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="51"
            height="48"
            fill="none"
            viewBox="0 0 51 48"
            className="absolute inset-0 w-full h-full block"
            style={{
              transform: isRtl ? "scaleX(-1)" : "none",
            }}
          >
            <path
              d="M6.728 9.09A12 12 0 0 1 18.369 0H39c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H12.37C4.561 48-1.167 40.663.727 33.09l6-24Z"
              fill={blobBg}
              className="transition-colors duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            />
          </svg>

          {/* ================= 3. CONVEYOR SLIDING ARROW ================= */}
          <div
            className="relative z-10 w-4 h-4 overflow-hidden flex items-center justify-center pointer-events-none"
            style={{
              transform: isRtl ? "scaleX(-1)" : "none",
            }}
          >
            {/* Arrow 1: Centered at rest, slides out to the right on hover */}
            <span
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: hovered ? "translateX(160%)" : "translateX(0%)",
                opacity: hovered ? 0 : 1,
                color: arrowColor,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                fill="none"
                viewBox="0 0 10 10"
                className="w-2.5 h-2.5"
              >
                <path
                  fill="currentColor"
                  d="M7.703 5.8H.398V4.6h7.305l-3.36-3.36.855-.84 4.8 4.8-4.8 4.8-.855-.84 3.36-3.36Z"
                />
              </svg>
            </span>

            {/* Arrow 2: Offscreen to the left at rest, slides into center on hover */}
            <span
              className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: hovered ? "translateX(0%)" : "translateX(-160%)",
                opacity: hovered ? 1 : 0,
                color: arrowColor,
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                fill="none"
                viewBox="0 0 10 10"
                className="w-2.5 h-2.5"
              >
                <path
                  fill="currentColor"
                  d="M7.703 5.8H.398V4.6h7.305l-3.36-3.36.855-.84 4.8 4.8-4.8 4.8-.855-.84 3.36-3.36Z"
                />
              </svg>
            </span>
          </div>
        </span>
      </div>
    </Link>
  );
}
