"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { 
  HomeIcon, 
  GlobeAltIcon, 
  NewspaperIcon, 
  CpuChipIcon, 
  ArrowTrendingUpIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

function ProcessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeStep = parseInt(searchParams.get("step") || "0");
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const targetElement = stepRefs.current[activeStep];
    if (targetElement) {
      const timer = setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const processDetails = [
    {
      title: "市場關鍵追蹤",
      subtitle: "捕捉最有價值的波動",
      icon: GlobeAltIcon,
      color: "text-amber-600", // 明亮模式下顏色稍微調深
      glowColor: "shadow-amber-200",
      borderColor: "border-amber-200",
      bg: "bg-amber-50",
      roles: [
        { name: "異常波動偵測", task: "在關鍵支撐或壓力位突破時捕捉數據" },
        { name: "技術指標同步", task: "整合多種曲線，確保非無效雜訊" }
      ],
      description: "您不需要再守著螢幕。當市場發生具備邏輯意義的波動時，AI 會第一時間捕捉數據。"
    },
    {
      title: "萬篇新聞精煉",
      subtitle: "避開情緒化的假消息",
      icon: NewspaperIcon,
      color: "text-blue-600",
      glowColor: "shadow-blue-200",
      borderColor: "border-blue-200",
      bg: "bg-blue-50",
      roles: [
        { name: "事實過濾員", task: "自動剔除農場標題與重複資訊" },
        { name: "大眾情緒分析", task: "量化社群討論熱度，判斷市場恐懼程度" }
      ],
      description: "投資最怕被情緒牽著走。AI 提取真實的市場情緒反應，幫助您保持理性。"
    },
    {
      title: "多方邏輯審查",
      subtitle: "拒絕衝動與主觀偏見",
      icon: CpuChipIcon,
      color: "text-purple-600",
      glowColor: "shadow-purple-200",
      borderColor: "border-purple-200",
      bg: "bg-purple-50",
      roles: [
        { name: "多空模擬辯論", task: "正反方 AI 針對現狀進行邏輯對話" },
        { name: "邏輯驗證主管", task: "確保所有分析具備數據支撐而非猜測" }
      ],
      description: "單一判斷容易出錯。我們透過多個 AI 專家的模擬辯論，強制過濾掉主觀偏見。"
    },
    {
      title: "數據信心導出",
      subtitle: "量化勝率，理性決策",
      icon: ArrowTrendingUpIcon,
      color: "text-emerald-600",
      glowColor: "shadow-emerald-200",
      borderColor: "border-emerald-200",
      bg: "bg-emerald-50",
      roles: [
        { name: "策略信心評估", task: "將複雜數據轉化為 0-100 的信心值" },
        { name: "歷史相似比對", task: "對照過去相似環境，提供量化參考" }
      ],
      description: "本系統不提供買賣建議。我們將分析結果量化為信心值，作為您決策的輔助參考。"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 pt-6 pb-24">
      {/* 返回首頁 */}
      <button 
        onClick={() => router.push("/")}
        className="flex items-center text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
      >
        <HomeIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium">返回首頁</span>
      </button>

      <header className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">AI 運作流程</h1>
        <p className="text-slate-500 text-sm font-medium">科學數據分析，協助您做出明智決策</p>
      </header>

      {/* 流程時間軸 */}
      <div className="relative space-y-12">
        <div className="absolute left-[23px] top-2 bottom-0 w-[2px] bg-slate-200 hidden sm:block" />

        {processDetails.map((item, idx) => (
          <div 
            key={idx} 
            ref={(el) => { stepRefs.current[idx] = el; }}
            onClick={() => router.push(`/process?step=${idx}`, { scroll: false })}
            className={`relative transition-all duration-700 cursor-pointer ${activeStep === idx ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-50'}`}
          >
            <div className="flex gap-6">
              <div className={`flex-none w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center relative z-10 border border-white shadow-sm`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>

              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold tracking-widest ${item.color}`}>步驟 {idx + 1}</span>
                  {activeStep === idx && (
                    <span className="bg-slate-900 dark:bg-white dark:text-black text-white text-[9px] px-2 py-0.5 rounded-full font-bold">當前焦點</span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h2>
                <p className="text-slate-500 text-xs mb-4 font-medium">{item.subtitle}</p>
                
                {/* 亮色卡片修正 */}
                <div className={`
                  bg-white rounded-2xl p-5 border transition-all duration-700
                  ${activeStep === idx 
                    ? `border-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] ${item.glowColor} ring-1 ring-slate-100` 
                    : 'border-slate-100 shadow-sm'
                  }
                `}>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    "{item.description}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {item.roles.map((role, rIdx) => (
                      <div key={rIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                          <span className="text-[11px] font-bold text-slate-700">{role.name}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">{role.task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 text-center">
        <h3 className="text-slate-900 font-bold mb-3 italic tracking-tight">法律免責與聲明</h3>
        <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
          本平台分析結論僅供參考，不構成任何投資建議。金融市場具高度風險，投資前請務必獨立思考，自行承擔盈虧。
        </p>
      </footer>
    </div>
  );
}

export default function ProcessPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Suspense fallback={<div className="p-20 text-center text-slate-400">載入中...</div>}>
        <ProcessContent />
      </Suspense>
    </main>
  );
}