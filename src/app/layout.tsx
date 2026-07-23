import type { Metadata } from "next";
import { Noto_Kufi_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import LenisProvider from "@/lib/lenis-provider";
import ScrollProgress from "@/components/ScrollProgress";



const noto = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-kufi",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jemo.co"),
  title: {
    default: "jemo labs — الفرع البحثي لشركة LXD",
    template: "%s | jemo labs",
  },
  description: "منظومة بحثية وتقنية غير ربحية تابعة لـ LXD Co. نجمع العقول المبدعة ونبني الأبحاث والمنصات المفتوحة.",
  keywords: ["jemo", "jemo labs", "labs", "lxd", "أبحاث", "استقطاب", "برمجة", "تصميم", "العراق"],
  authors: [{ name: "jemo labs", url: "https://jemo.co" }],
  publisher: "LXD Co",
  icons: {
    icon: "/jemo-logo.svg",
    shortcut: "/jemo-logo.svg",
    apple: "/jemo-logo.svg",
  },
  openGraph: {
    title: "jemo labs — الفرع البحثي لشركة LXD",
    description: "أبحاث متقدمة، استقطاب نوعي، ابتكار برمجي وتصميم هوية.",
    url: "https://jemo.co",
    siteName: "jemo labs",
    locale: "ar_IQ",
    type: "website",
    images: [{ url: "/jemo-logo.svg", width: 800, height: 600, alt: "jemo labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "jemo labs — الفرع البحثي لشركة LXD",
    description: "أبحاث متقدمة، استقطاب نوعي، ابتكار برمجي وتصميم هوية.",
    images: ["/jemo-logo.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ResearchOrganization",
      "@id": "https://jemo.co/#organization",
      "name": "jemo labs",
      "alternateName": "جيمو لابس",
      "url": "https://jemo.co",
      "logo": "https://jemo.co/jemo-logo.svg",
      "parentOrganization": {
        "@type": "Organization",
        "name": "LXD Co",
        "url": "https://lxds.org"
      },
      "description": "مؤسسة بحثية وتقنية غير ربحية تابعة لـ LXD Co. نجمع العقول المبدعة ونبني الأبحاث والمنصات المفتوحة."
    },
    {
      "@type": "WebSite",
      "@id": "https://jemo.co/#website",
      "url": "https://jemo.co",
      "name": "jemo labs",
      "inLanguage": "ar",
      "publisher": { "@id": "https://jemo.co/#organization" }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${noto.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col relative bg-[var(--bg)] text-[var(--ink)]" suppressHydrationWarning>
        {/* Background Assets */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <ScrollProgress />
        <AnalyticsTracker />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
