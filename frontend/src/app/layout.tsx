import type { Metadata, Viewport } from "next";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/ThemeProvider";
import BottomNav from "@/components/BottomNav";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "TradingAgents",
  description: "AI 智能交易分析",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192x192.png",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TradingAgents",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0d" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class">
          <Onboarding />
          <BottomNav />
          <main className="app-container">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
