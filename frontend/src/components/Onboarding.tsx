"use client";
import { useState, useRef } from "react";
import DecisionBadge from "./DecisionBadge";
import Image from "next/image";

const steps = [
  { 
    isHero: true, 
    titlePart1: "登峰", 
    titlePart2: "造極", 
    subTitle: "TRADING AGENTS", 
    description: "開啟你的智能交易時代",
    bg: "/hero-mountain.jpg"
  },
  { 
    title: "實踐攀登", 
    description: "一步一腳印，在市場波動中尋找最穩健的路徑。", 
    icon: "",
    bg: "/hero-climber.jpg"
  },
  { 
    title: "投資利器", 
    description: "頂尖 AI 辯證工具，是你征服高峰的必備裝備。", 
    element: <DecisionBadge signal="BUY" />,
    bg: "/hero-tools.jpg"
  },
  {
    isFinal: true,
    title: "著手計畫",
    description: "準備好征服屬於你的財富高峰了嗎？",
    bg: "black"
  }
];

export default function Onboarding() {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const maxScroll = scrollHeight - clientHeight;
    // 確保 ratio 在 0~1 之間
    setScrollRatio(Math.min(Math.max(scrollTop / maxScroll, 0), 1));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden font-sans select-none">
      
      {/* 1. 背景層：線性連續過渡 */}
      <div className="absolute inset-0 z-0">
        {steps.map((step, i) => {
          // 計算每張圖片的顯現區間 (0.0 -> 0.33 -> 0.66 -> 1.0)
          const range = 1 / (steps.length - 1);
          const center = i * range;
          const opacity = Math.max(0, 1 - Math.abs(scrollRatio - center) * 3);
          
          // 背景隨總進度縮放，營造推進感
          const scale = 1 + scrollRatio * -0;
          // 第二張圖進入時產生的模糊感 (鑽入包包的過渡)
          const blur = i === 1 && scrollRatio > 0.4 ? (scrollRatio - 0.4) * 20 : 0;

          if (step.bg === "black") {
            return <div key={i} className="absolute inset-0 bg-black" style={{ opacity }} />;
          }

          return (
            <div 
              key={i} 
              className="absolute inset-0 bg-transition-apple"
              style={{ 
                opacity, 
                transform: `scale(${scale})`,
                filter: `blur(${blur}px)` 
              }}
            >
              <Image 
                src={step.bg} 
                alt="bg" 
                fill 
                className="object-cover" 
                priority={i === 0} 
              />
              {/* 確保頂部清晰的漸層遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black opacity-90" />
            </div>
          );
        })}
      </div>

      {/* 2. 內容控制層：超長捲軸容器 */}
      <div 
        onScroll={handleScroll}
        className="relative z-10 h-full overflow-y-auto no-scrollbar"
      >
        {/* 高度設定為 400vh，代表有 4 個螢幕寬度的滑動距離 */}
        <div className="relative h-[600vh]">
          
          {/* 第一階段：標題左右分散 (固定在頂部) */}
          <div 
            className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none"
            style={{ 
              opacity: Math.max(0, 1 - scrollRatio * 4),
              transform: `scale(${1 - scrollRatio * 0.2})` 
            }}
          >
            <div className="flex justify-center items-center gap-6 mb-6">
              <h1 className="hero-title" style={{ transform: `translateX(${-scrollRatio * 600}px)` }}>登峰</h1>
              <h1 className="hero-title" style={{ transform: `translateX(${scrollRatio * 600}px)` }}>造極</h1>
            </div>
            <h2 className="text-2xl tracking-[0.5em] text-white/70 font-light">{steps[0].subTitle}</h2>
          </div>

          {/* 第二階段：實踐攀登 (隨滑動浮現) */}
          <div 
            className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none"
            style={{ 
              opacity: Math.max(0, 1 - Math.abs(scrollRatio - 0.33) * 6),
              transform: `translateY(${(0.33 - scrollRatio) * 100}px)`
            }}
          >
            <div className="text-8xl mb-8 drop-shadow-2xl">{steps[1].icon}</div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-white italic">{steps[1].title}</h2>
            <p className="max-w-xs text-center text-white/50 text-lg leading-tight font-medium">{steps[1].description}</p>
          </div>

          {/* 第三階段：投資利器 (鑽入包包感) */}
          <div 
            className="sticky top-0 h-screen flex flex-col items-center justify-center pointer-events-none"
            style={{ 
              opacity: Math.max(0, 1 - Math.abs(scrollRatio - 0.66) * 6),
              transform: `scale(${0.9 + scrollRatio * 0.1})`
            }}
          >
            <div className="mb-10 scale-110">{steps[2].element}</div>
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-white italic">{steps[2].title}</h2>
            <p className="max-w-xs text-center text-white/50 text-lg leading-tight font-medium">{steps[2].description}</p>
          </div>

          {/* 第四階段：著手計畫 (結尾) */}
          <div 
            className="sticky top-0 h-screen flex flex-col items-center justify-center"
            style={{ opacity: Math.max(0, (scrollRatio - 0.85) * 8) }}
          >
            <h2 className="text-3xl font-bold mb-12 text-white/90 px-10 text-center">{steps[3].description}</h2>
            <button 
              onClick={() => {
                setIsVisible(false);
                localStorage.setItem("hasSeenOnboarding", "true");
              }}
              className="px-20 py-5 rounded-full bg-white text-black font-black text-xl active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              {steps[3].title}
            </button>
          </div>

        </div>
      </div>

      {/* 3. 側邊進度條 (線性聯動) */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className="w-1 rounded-full transition-all duration-300" 
            style={{ 
              height: Math.round(scrollRatio * (steps.length - 1)) === i ? '40px' : '8px',
              backgroundColor: Math.round(scrollRatio * (steps.length - 1)) === i ? 'white' : 'rgba(255,255,255,0.2)'
            }}
          />
        ))}
      </div>
    </div>
  );
}