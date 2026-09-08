import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/lib/lenis-provider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08090d",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://jemo.co"),
  title: {
    default: "JEMO LABS — بيت الحكمة الرقمي",
    template: "%s | JEMO LABS",
  },
  description: "مؤسسة بحثية سيادية غير ربحية تعنى ببناء المعرفة المفتوحة، النواة التشغيلية الميكروية، وتطوير أبحاث الذكاء الاصطناعي العربي في العراق.",
  keywords: ["JEMO LABS", "بيت الحكمة الرقمي", "أبحاث الذكاء الاصطناعي", "Ziqa Kernel", "أنظمة التشغيل", "المصادر المفتوحة", "العراق", "بغداد"],
  authors: [{ name: "JEMO LABS Research Team", url: "https://jemo.co" }],
  publisher: "JEMO LABS",
  icons: {
    icon: "/jemo-logo.svg",
    shortcut: "/jemo-logo.svg",
    apple: "/jemo-logo.svg",
  },
  openGraph: {
    title: "JEMO LABS — بيت الحكمة الرقمي",
    description: "مؤسسة بحثية مستقلة لبناء المعرفة المفتوحة والأبحاث الرقمية السيادية.",
    url: "https://jemo.co",
    siteName: "JEMO LABS",
    locale: "ar_IQ",
    type: "website",
    images: [{ url: "/jemo-logo.svg", width: 800, height: 600, alt: "JEMO LABS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JEMO LABS — بيت الحكمة الرقمي",
    description: "مؤسسة بحثية مستقلة لبناء المعرفة المفتوحة والأبحاث الرقمية السيادية.",
    images: ["/jemo-logo.svg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ResearchOrganization",
      "@id": "https://jemo.co/#organization",
      "name": "JEMO LABS",
      "alternateName": ["بيت الحكمة الرقمي", "جيمو لابس"],
      "url": "https://jemo.co",
      "logo": "https://jemo.co/jemo-logo.svg",
      "description": "مؤسسة بحثية سيادية غير ربحية تعنى ببناء المعرفة المفتوحة، النواة التشغيلية الميكروية، وتطوير أبحاث الذكاء الاصطناعي العربي في العراق."
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
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden transform-gpu will-change-transform" style={{ contain: 'strict' }}>
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
