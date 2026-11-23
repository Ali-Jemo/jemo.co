import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import LenisProvider from "@/lib/lenis-provider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ScrollProgress from "@/components/ScrollProgress";
import MobileBottomNav from "@/components/MobileBottomNav";
import CanonicalLink from "@/components/CanonicalLink";
import { AuthProvider } from "@/lib/auth-context";
import { clerkGlobalAppearance } from "@/lib/clerk-appearance";
import { clerkPublishableKey, isClerkConfigured } from "@/lib/clerk-config";
import { SITE_URL, absoluteUrl } from "@/lib/site";

import { Noto_Kufi_Arabic, IBM_Plex_Mono } from "next/font/google";

const noto = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-kufi",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090d",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JEMO — سجل الاكتشافات بالذكاء الاصطناعي",
    template: "%s | JEMO",
  },
  description: "سجلّ عربي مفتوح لأبحاث النظم والبرمجة وتقييم النماذج. وثّق ما اكتشفته مع الذكاء الاصطناعي، مع ما تحققت منه بنفسك.",
  keywords: ["JEMO", "سجل الاكتشافات", "أبحاث الذكاء الاصطناعي", "بحث المواطن", "Citizen Research", "توثيق الأبحاث", "المعرفة المفتوحة", "العراق", "بغداد"],
  authors: [{ name: "علي حسين هادي (Jemo)", url: SITE_URL }],
  publisher: "JEMO LABS",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "JEMO — سجل الاكتشافات بالذكاء الاصطناعي",
    description: "سجلّ عربي مفتوح لأبحاث النظم والبرمجة وتقييم النماذج.",
    siteName: "JEMO LABS",
    locale: "ar_IQ",
    type: "website",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "JEMO Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JEMO — سجل الاكتشافات بالذكاء الاصطناعي",
    description: "سجلّ عربي مفتوح لأبحاث النظم والبرمجة وتقييم النماذج.",
    images: ["/twitter-image.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ResearchOrganization",
      "@id": absoluteUrl("/#organization"),
      "name": "JEMO",
      "alternateName": ["JEMO Labs", "جيمو"],
      "url": SITE_URL,
      "logo": absoluteUrl("/jemo-logo.svg"),
      "description": "سجل عربي مفتوح لتوثيق أبحاث النظم والبرمجة وتقييم نماذج الذكاء الاصطناعي."
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      "url": SITE_URL,
      "name": "jemo labs",
      "inLanguage": "ar",
      "publisher": { "@id": absoluteUrl("/#organization") }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // overflow-x clamped by globals `html, body { overflow-x: clip }` — the old
  // `overflow-x-hidden` utility made <body> a scroll container and killed every
  // position:sticky (filter toolbar, research sidebar) site-wide.
  const clerkKey = clerkPublishableKey();
  const clerkOn = isClerkConfigured();
  const tree = (
    <>
      <CanonicalLink />
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden" style={{ contain: "strict", transform: "translateZ(0)" }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      </div>
      <ScrollProgress />
      <AnalyticsTracker />
      <LenisProvider>
        <AuthProvider>
          <div className="flex-1 flex flex-col pb-16 md:pb-0">
            {children}
          </div>
        </AuthProvider>
      </LenisProvider>
      <MobileBottomNav />
    </>
  );

  return (
    <html lang="ar" dir="rtl" className={`${noto.variable} ${mono.variable}`}>
      <head>
        {clerkOn ? (
          <>
            <link rel="preconnect" href="https://img.clerk.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://img.clerk.com" />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative bg-[var(--bg)] text-[var(--ink)] max-w-full" suppressHydrationWarning>
        <noscript>
          <style>{`[data-cohere-item]{opacity:1!important;transform:none!important;animation:none!important}.hero-line{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
        {clerkOn ? (
          <ClerkProvider
            publishableKey={clerkKey}
            appearance={clerkGlobalAppearance}
            afterSignOutUrl="/"
            signInUrl="/sign-in"
            signUpUrl="/sign-up"
          >
            {tree}
          </ClerkProvider>
        ) : (
          tree
        )}
      </body>
    </html>
  );
}