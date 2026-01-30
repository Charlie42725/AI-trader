import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Onboarding from "@/components/Onboarding";

export const metadata: Metadata = {
  title: "TradingAgents",
  description: "AI 智能交易分析",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">
        <Onboarding />
        <BottomNav />
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
