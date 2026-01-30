import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Onboarding from "@/components/Onboarding"; // 新增導入

export const metadata: Metadata = {
  title: "TradingAgents",
  description: "AI 智能交易分析",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <Onboarding /> {/* 新增：放在最上方 */}
        <div className="app-container">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}