import React from "react";
import Image from "next/image";

interface AuthCardSkeletonProps {
  type?: "sign-in" | "sign-up";
}

export default function AuthCardSkeleton({ type = "sign-in" }: AuthCardSkeletonProps) {
  const isSignIn = type === "sign-in";

  return (
    <div
      className="w-full max-w-[420px] rounded-2xl bg-white border border-[#e4e3e3] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8 animate-pulse select-none transition-all duration-300"
      aria-hidden="true"
      dir="rtl"
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#f0f2f0] border border-[#e4e3e3] flex items-center justify-center mb-3">
          <Image
            src="/jemo-logo.svg"
            alt="JEMO"
            width={22}
            height={22}
            className="opacity-70 grayscale"
            priority
          />
        </div>
        <div className="h-5 w-44 bg-[#e9ebe9] rounded-md mb-2"></div>
        <div className="h-3.5 w-56 bg-[#f2f3f2] rounded-md"></div>
      </div>

      {/* Social Button Skeleton */}
      <div className="space-y-2.5 mb-5">
        <div className="h-10 w-full rounded-xl border border-[#e4e3e3] bg-[#f8f9f8] flex items-center justify-center gap-2 px-4">
          <div className="w-4 h-4 rounded-full bg-[#e4e6e4]"></div>
          <div className="h-3.5 w-32 bg-[#e4e6e4] rounded"></div>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-[1px] bg-[#e4e3e3]"></div>
        <div className="h-3 w-8 bg-[#f0f2f0] rounded text-[10px] font-mono"></div>
        <div className="flex-1 h-[1px] bg-[#e4e3e3]"></div>
      </div>

      {/* Form Fields Skeleton */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="h-3.5 w-24 bg-[#e9ebe9] rounded mb-1.5"></div>
          <div className="h-10 w-full rounded-xl border border-[#e4e3e3] bg-[#fbfcfb]"></div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="h-3.5 w-20 bg-[#e9ebe9] rounded"></div>
            {isSignIn && <div className="h-3 w-16 bg-[#f0f2f0] rounded"></div>}
          </div>
          <div className="h-10 w-full rounded-xl border border-[#e4e3e3] bg-[#fbfcfb]"></div>
        </div>

        {!isSignIn && (
          <div>
            <div className="h-3.5 w-28 bg-[#e9ebe9] rounded mb-1.5"></div>
            <div className="h-10 w-full rounded-xl border border-[#e4e3e3] bg-[#fbfcfb]"></div>
          </div>
        )}
      </div>

      {/* Primary Button Skeleton */}
      <div className="h-10 w-full rounded-xl bg-[#222f30]/80 shadow-xs flex items-center justify-center mb-5">
        <div className="h-3.5 w-24 bg-white/40 rounded"></div>
      </div>

      {/* Footer Action Skeleton */}
      <div className="pt-4 border-t border-[#f0f2f0] flex items-center justify-center gap-2">
        <div className="h-3 w-28 bg-[#f0f2f0] rounded"></div>
        <div className="h-3 w-16 bg-[#e4e6e4] rounded"></div>
      </div>
    </div>
  );
}
