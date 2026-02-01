"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "首頁",
    icon: (active: boolean) => (
      <svg className="w-6 h-6 md:w-5 md:h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/new",
    label: "新增",
    icon: (active: boolean) => (
      <svg className="w-6 h-6 md:w-5 md:h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/history",
    label: "歷史",
    icon: (active: boolean) => (
      <svg className="w-6 h-6 md:w-5 md:h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    // 修改：改為固定在底部的白底導航列，並加上極細的上邊框
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="max-w-2xl mx-auto">
        {/* 移動端與桌面端統一配色：白、黑、橘 */}
        <div className="flex items-center justify-around h-[72px] md:h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                  md:flex-row md:gap-2 md:px-6 md:py-2
                  ${isActive
                    ? "text-orange-500 scale-105" // 選中時顯示橘色並微調放大
                    : "text-gray-400 hover:text-black" // 未選中時灰色，Hover 變黑
                  }
                `}
              >
                <div className={`${isActive ? "text-orange-500" : "text-gray-400"}`}>
                  {item.icon(isActive)}
                </div>
                <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest ${isActive ? "text-black" : "text-gray-400"}`}>
                  {item.label}
                </span>
                
                {/* 選中時底部的橘色小圓點指標 */}
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full md:hidden" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}