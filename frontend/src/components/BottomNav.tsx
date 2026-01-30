"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "首頁",
    icon: (active: boolean) => (
      <svg className="w-6 h-6 md:w-5 md:h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/new",
    label: "新增",
    icon: (active: boolean) => (
      <svg className="w-6 h-6 md:w-5 md:h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "歷史",
    icon: (active: boolean) => (
      <svg className="w-6 h-6 md:w-5 md:h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  // 分析詳情頁不顯示導航
  if (pathname.startsWith("/analysis/")) {
    return null;
  }

  return (
    <nav className="bottom-nav">
      {/* 桌面端：置中容器 */}
      <div className="max-w-3xl mx-auto">
        {/* 移動端：底部標籤式導航 */}
        <div className="flex items-center justify-around h-[72px] md:h-16 md:justify-center md:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-colors
                  md:flex-row md:gap-2 md:px-5 md:py-2.5
                  ${isActive
                    ? "text-[var(--primary)] md:bg-[var(--primary)]/10"
                    : "text-[var(--text-muted)] md:hover:text-[var(--text-secondary)] md:hover:bg-[var(--bg-surface)]"
                  }
                `}
              >
                {item.icon(isActive)}
                <span className="text-xs font-medium md:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
