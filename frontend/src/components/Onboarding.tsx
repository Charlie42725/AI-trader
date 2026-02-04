"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import DecisionBadge from "./DecisionBadge";
import Image from "next/image";

const steps = [
  {
    isHero: true,
    titlePart1: "登峰",
    titlePart2: "造極",
    subTitle: "TRADING AGENTS",
    description: "開啟你的智能交易時代",
    bg: "/hero-mountain.jpg",
  },
  {
    title: "實踐攀登",
    description: "一步一腳印，在市場波動中尋找最穩健的路徑。",
    bg: "/hero-climber.jpg",
  },
  {
    title: "投資利器",
    description: "頂尖 AI 辯證工具，是你征服高峰的必備裝備。",
    element: <DecisionBadge signal="BUY" />,
    bg: "/hero-tools.jpg",
  },
  {
    isFinal: true,
    title: "著手計畫",
    description: "準備好征服屬於你的財富高峰了嗎？",
    bg: "black",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isVisible, setIsVisible] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

  // Swipe tracking
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem("hasSeenOnboarding") === "true";
    setHasSeenOnboarding(seen);
    if (seen) setIsVisible(false);
  }, []);

  const goNext = useCallback(() => {
    if (current < steps.length - 1) {
      setDirection("next");
      setCurrent((p) => p + 1);
    }
  }, [current]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection("prev");
      setCurrent((p) => p - 1);
    }
  }, [current]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("hasSeenOnboarding", "true");
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    // Only trigger if horizontal swipe is dominant and > 50px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext();  // swipe left → next
      else goPrev();          // swipe right → prev
    }
  };

  // Tap to advance (non-final pages)
  const handleTap = (e: React.MouseEvent) => {
    // Don't advance if tapping a button
    if ((e.target as HTMLElement).closest("button")) return;
    if (current < steps.length - 1) goNext();
  };

  if (hasSeenOnboarding === null) return null;
  if (!isVisible) return null;

  const step = steps[current];
  const isFirst = current === 0;
  const isFinal = current === steps.length - 1;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black overflow-hidden font-sans select-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={handleTap}
    >
      {/* 背景圖層 */}
      {steps.map((s, i) => {
        if (s.bg === "black") {
          return (
            <div
              key={i}
              className="absolute inset-0 bg-black transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            />
          );
        }
        return (
          <div
            key={i}
            className="absolute inset-0 transition-all duration-700"
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.05)",
            }}
          >
            <Image
              src={s.bg}
              alt="bg"
              fill
              className="object-cover"
              priority={i <= 1}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
          </div>
        );
      })}

      {/* 內容層 */}
      <div className="relative z-10 h-full flex flex-col">
        {/* 跳過按鈕 */}
        {!isFinal && (
          <div className="flex justify-end p-4 md:p-6">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-xs md:text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              跳過
            </button>
          </div>
        )}
        {isFinal && <div className="p-4 md:p-6" />}

        {/* 主內容 */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div
            key={current}
            className={`flex flex-col items-center text-center ${
              direction === "next"
                ? "animate-in fade-in slide-in-from-right-8 duration-500"
                : "animate-in fade-in slide-in-from-left-8 duration-500"
            }`}
          >
            {/* Hero page */}
            {isFirst && (
              <>
                <div className="flex justify-center items-center gap-3 md:gap-6 mb-4 md:mb-6">
                  <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter">
                    {step.titlePart1}
                  </h1>
                  <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter">
                    {step.titlePart2}
                  </h1>
                </div>
                <h2 className="text-sm md:text-2xl tracking-[0.3em] md:tracking-[0.5em] text-white/60 font-light">
                  {step.subTitle}
                </h2>
              </>
            )}

            {/* Middle pages */}
            {!isFirst && !isFinal && (
              <>
                {step.element && (
                  <div className="mb-8 md:mb-10">{step.element}</div>
                )}
                <h2 className="text-2xl md:text-4xl font-black mb-3 md:mb-4 tracking-tighter text-white italic">
                  {step.title}
                </h2>
                <p className="max-w-[280px] md:max-w-xs text-center text-white/50 text-sm md:text-lg leading-relaxed font-medium">
                  {step.description}
                </p>
              </>
            )}

            {/* Final page */}
            {isFinal && (
              <>
                <h2 className="text-xl md:text-3xl font-bold mb-8 md:mb-12 text-white/90 px-4 md:px-10 text-center max-w-md">
                  {step.description}
                </h2>
                <button
                  onClick={handleDismiss}
                  className="px-12 md:px-20 py-4 md:py-5 rounded-full bg-white text-black font-black text-lg md:text-xl active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  {step.title}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 底部：進度指示 + 提示 */}
        <div className="pb-10 md:pb-14 flex flex-col items-center gap-4">
          {/* 進度點 */}
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: i === current ? 24 : 8,
                  backgroundColor: i === current ? "white" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>

          {/* 點擊提示 */}
          {!isFinal && (
            <p className="text-[10px] md:text-xs text-white/30 tracking-widest font-medium animate-pulse">
              點擊繼續
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
