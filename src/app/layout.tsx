import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KhonKaen Youth&Pride 2026",
  description: "กิจกรรมฐานประลองความรู้ ความเข้าใจในประเด็นความหลากหลายทางเพศ สิทธิทางเพศ สุขภาวะทางเพศ และอื่นๆที่เกี่ยวข้อง",
};

import { LiffProvider } from "@/providers/LiffProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning={true}>
        <LiffProvider>
          {children}
        </LiffProvider>
      </body>
    </html>
  );
}
