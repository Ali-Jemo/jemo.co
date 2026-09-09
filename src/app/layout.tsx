import type { Metadata, Viewport } from "next";
import { Noto_Kufi_Arabic, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/lib/lenis-provider";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import ScrollProgress from "@/components/ScrollProgress";
import { AuthProvider } from "@/lib/auth-context";
import MobileBottomNav from "@/components/MobileBottomNav";

const noto = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-kufi",
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
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
    default: "JEMO — سجل الاكتشافات بالذكاء الاصطناعي",
    template: "%s | JEMO",
  },
  description: "بوابة مفتوحة لتوثيق ومشاركة الأبحاث والاستقصاءات التي يجريها الناس بمساعدة الذكاء الاصطناعي — المكان الذي لا تضيع فيه معرفتك بعد انتهاء المحادثة.",
  keywords: ["JEMO", "سجل الاكتشافات", "أبحاث الذكاء الاصطناعي", "بحث المواطن", "Citizen Research", "توثيق الأبحاث", "المعرفة المفتوحة", "العراق", "بغداد"],
  authors: [{ name: "JEMO LABS Research Team", url: "https://jemo.co" }],
  publisher: "JEMO LABS",
  icons: {
    icon: "/jemo-logo.svg",
    shortcut: "/jemo-logo.svg",
    apple: "/jemo-logo.svg",
  },
  openGraph: {
    title: "JEMO — سجل الاكتشافات بالذكاء الاصطناعي",
    description: "بوابة مفتوحة لتوثيق ومشاركة الأبحاث والاستقصاءات بمساعدة الذكاء الاصطناعي — المكان الذي لا تضيع فيه المعرفة.",
    url: "https://jemo.co",
    siteName: "JEMO LABS",
    locale: "ar_IQ",
    type: "website",
    images: [{ url: "/jemo-logo.svg", width: 800, height: 600, alt: "JEMO LABS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "JEMO — سجل الاكتشافات بالذكاء الاصطناعي",
    description: "بوابة مفتوحة لتوثيق ومشاركة الأبحاث والاستقصاءات بمساعدة الذكاء الاصطناعي — المكان الذي لا تضيع فيه المعرفة.",
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
      "description": "مؤسسة بحثية مستقلة غير ربحية لجميع العلوم: العلوم الشرعية والإسلامية، الذكاء الاصطناعي، العلوم الطبيعية والطبية والهندسية والإنسانية — معرفة مفتوحة من العراق إلى العالم."
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
          <AuthProvider>
            <div className="flex-1 flex flex-col pb-16 md:pb-0">
              {children}
            </div>
            <MobileBottomNav />
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
