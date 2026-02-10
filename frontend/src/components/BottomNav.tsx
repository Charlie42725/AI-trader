"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// 定義導覽列項目
const navItems = [
  {
    href: "/", label: "首頁", icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    href: "/market", label: "策略", icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    href: "/new", label: "分析", icon: (active: boolean) => (
      <div className={`p-2.5 md:p-3 rounded-full -translate-y-3 md:-translate-y-4 shadow-lg transition-all ${active ? "bg-orange-500 text-white" : "bg-black text-white"}`}>
        <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
    )
  },
  {
    href: "/wallet", label: "交易", icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    href: "/profile", label: "我的", icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/analysis/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#0d0d0d]/90 backdrop-blur-lg border-t border-gray-100 dark:border-white/10 z-50 pb-safe transition-colors duration-300">
      <div className="max-w-2xl mx-auto flex items-end justify-around h-[60px] md:h-[72px]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const isCenter = item.href === "/new";

          return (
            <Link key={item.href} href={item.href} className="relative flex flex-col items-center flex-1 py-2">
              <div className={`${isActive ? "text-orange-500" : "text-gray-400 dark:text-gray-500"} transition-colors`}>
                {item.icon(isActive)}
              </div>
              {!isCenter && (
                <span className={`text-[10px] font-black mt-1 ${isActive ? "text-black dark:text-white" : "text-gray-400 dark:text-gray-600"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}