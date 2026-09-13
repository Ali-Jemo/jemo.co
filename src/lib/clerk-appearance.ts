/**
 * Global appearance theme passed to ClerkProvider.
 * Contains only brand tokens (colors, font, radius) and avoids restrictive
 * dimensional classes (like max-w-[420px]) so UserProfile modals, dropdowns,
 * and account dialogs render at their natural responsive widths without distortion.
 */
export const clerkGlobalAppearance = {
  variables: {
    colorPrimary: "#222f30",
    colorText: "#0c1415",
    colorTextSecondary: "#55696a",
    colorBackground: "#ffffff",
    colorInputBackground: "#fbfcfb",
    colorInputText: "#0c1415",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-kufi), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  elements: {
    userButtonAvatarBox: "w-8 h-8 rounded-full ring-2 ring-[#222f30]/10 hover:ring-[#222f30]/30 transition-all shrink-0",
    userButtonPopoverCard: "border border-[#e4e3e3] shadow-xl rounded-2xl min-w-[280px]",
    userProfileModalBackdrop: "bg-black/50 backdrop-blur-xs",
    modalBackdrop: "bg-black/50 backdrop-blur-xs",
    modalContent: "max-w-[940px] w-[94vw] rounded-2xl shadow-2xl overflow-hidden",
    userProfileModalContent: "max-w-[940px] w-[94vw] rounded-2xl shadow-2xl overflow-hidden",
  },
};

/**
 * Dedicated appearance theme for standalone <SignIn> and <SignUp> cards.
 * Tailored specifically for the authentication routes.
 */
export const clerkAuthCardAppearance = {
  ...clerkGlobalAppearance,
  elements: {
    rootBox: "w-full max-w-[420px] mx-auto transition-opacity duration-200",
    cardBox: "w-full max-w-[420px] mx-auto",
    card: "shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#e4e3e3] rounded-2xl bg-white p-6 sm:p-8",
    headerTitle: "text-lg sm:text-xl font-bold text-[#0c1415] tracking-tight text-center",
    headerSubtitle: "text-xs text-[#55696a] mt-1 leading-relaxed text-center",
    socialButtonsBlockButton: "border border-[#e4e3e3] rounded-xl hover:bg-[#f8f9f8] hover:border-[#222f30]/30 active:scale-[0.99] transition-all duration-150 text-xs font-semibold py-2.5",
    socialButtonsBlockButtonText: "text-xs font-medium text-[#222f30]",
    dividerLine: "bg-[#e4e3e3]",
    dividerText: "text-[11px] text-[#869697] uppercase tracking-wider font-mono",
    formFieldLabel: "text-xs font-bold text-[#222f30] mb-1.5",
    formFieldInput: "rounded-xl border border-[#d8dad8] bg-[#fbfcfb] focus:bg-white focus:border-[#222f30] focus:ring-2 focus:ring-[#222f30]/10 transition-all duration-150 py-2.5 px-3 text-sm text-[#0c1415]",
    formButtonPrimary: "bg-[#222f30] hover:bg-[#162224] text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl shadow-xs hover:shadow-md active:scale-[0.99] transition-all duration-150 cursor-pointer",
    footerActionLink: "text-[#222f30] font-bold hover:text-emerald-700 hover:underline transition-colors text-xs",
    footerActionText: "text-xs text-[#55696a]",
    identityPreview: "border border-[#e4e3e3] rounded-xl bg-[#f8f9f8]",
    avatarBox: "rounded-full ring-2 ring-[#222f30]/10",
  },
  layout: {
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
    shimmer: true,
  },
};

// Backwards compatibility alias
export const clerkAppearance = clerkAuthCardAppearance;
