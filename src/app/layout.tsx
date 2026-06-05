import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Youth Pride Project 2026",
  description: "Join our journey and celebrate pride together!",
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
