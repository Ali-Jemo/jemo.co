import type { Metadata } from "next";
import { Outfit, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const noto = Noto_Kufi_Arabic({ subsets: ["arabic"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "jemo — مجموعة",
  description: "نجمع. ننظّم. نبني.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${outfit.variable} ${noto.variable} font-sans antialiased bg-black text-off min-h-screen flex flex-col overflow-x-hidden selection:bg-olive selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
