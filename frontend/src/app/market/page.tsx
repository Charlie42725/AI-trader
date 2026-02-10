"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  X, ArrowRight, Target, Compass, Sparkles, 
  BarChart3, Rocket, ChevronLeft, CheckCircle2,
  Zap, TrendingUp, Anchor, Cpu, Coins, Shield,
  Factory, Beaker, Crown, Rabbit, Gem
} from "lucide-react";

type FlowState = "ENTRY" | "DISCOVERY";

export default function MarketPage() {
  const router = useRouter();
  const [flowState, setFlowState] = useState<FlowState>("ENTRY");
  const [discoveryStep, setDiscoveryStep] = useState(1);

  // --- ENTRY 階段 (保持不變) ---
  if (flowState === "ENTRY") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0A0A0A] flex flex-col animate-in fade-in duration-500">
        <div className="pt-20 pb-12 px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-black dark:text-white mb-4 whitespace-nowrap">
            已經做好投資準備了嗎？
          </h1>
          <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full mb-4 shadow-[0_4px_10px_rgba(249,115,22,0.3)]" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
            選擇並繼續
          </p>
        </div>

        <div className="flex-1 px-6 max-w-2xl mx-auto w-full flex flex-col gap-6 justify-start">
          <button 
            onClick={() => router.push("/new")}
            className="group relative overflow-hidden flex flex-col items-start p-8 bg-white dark:bg-zinc-900 rounded-[40px] border-[3px] border-slate-100 dark:border-white/5 hover:border-black dark:hover:border-orange-500 transition-all shadow-sm active:scale-[0.98]"
          >
            <div className="bg-black dark:bg-orange-600 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Target size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white mb-2 italic whitespace-nowrap">確定，我已有目標標的</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">直接輸入代碼，進行 AI 診斷</p>
            <div className="absolute top-8 right-8 text-slate-200 dark:text-zinc-800 group-hover:text-orange-500 transition-colors">
              <ArrowRight size={40} />
            </div>
          </button>

          <button 
            onClick={() => setFlowState("DISCOVERY")}
            className="group relative overflow-hidden flex flex-col items-start p-8 bg-white dark:bg-zinc-900 rounded-[40px] border-[3px] border-slate-100 dark:border-white/5 hover:border-orange-500 transition-all shadow-sm active:scale-[0.98]"
          >
            <div className="bg-orange-500 p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Compass size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white mb-2 italic whitespace-nowrap">不，我還沒找到目標</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">讓 AI 幫我找找有什麼好機會</p>
            <div className="absolute top-8 right-8 text-slate-200 dark:text-zinc-800 group-hover:text-orange-500 transition-colors">
              <ArrowRight size={40} />
            </div>
          </button>
        </div>

        <div className="py-12 text-center">
            <button onClick={() => router.back()} className="text-[10px] font-black text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto uppercase tracking-widest whitespace-nowrap">
               <ChevronLeft size={14} /> Back to dashboard
            </button>
        </div>
      </div>
    );
  }

  // --- DISCOVERY 階段 (聊天白話版) ---
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-black dark:text-white p-8 flex flex-col animate-in slide-in-from-right duration-700 ease-out">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-12 pt-10">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                discoveryStep === i ? "w-12 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]" : discoveryStep > i ? "w-6 bg-black dark:bg-white" : "w-6 bg-slate-100 dark:bg-white/10"
              }`} />
            ))}
          </div>
          <button onClick={() => setFlowState("ENTRY")} className="p-3 bg-slate-50 dark:bg-white/5 rounded-full hover:bg-red-50 transition-colors group">
            <X size={20} className="group-hover:text-red-500" />
          </button>
        </div>

        <div className="flex-1">
          {/* STEP 1: 策略 (Strategy) - 白話版 */}
          {discoveryStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-10">
                <p className="text-orange-500 font-black tracking-[0.4em] text-[10px] uppercase mb-2 whitespace-nowrap">Step 01: Strategy</p>
                <h2 className="text-4xl font-black italic tracking-tighter leading-none whitespace-nowrap">你喜歡哪種方式？</h2>
                <p className="text-slate-400 text-xs font-bold mt-2 whitespace-nowrap">How do you want to play today?</p>
              </div>
              <div className="grid gap-4">
                {[
                  { title: "🚀 追正在漲的", desc: "現在誰強我就買誰，賺快錢", icon: <Zap size={20} className="text-yellow-500" /> },
                  { title: "🦅 跟著大戶走", desc: "大戶買什麼我買什麼，搭順風車", icon: <TrendingUp size={20} className="text-blue-500" /> },
                  { title: "⚓ 撿被錯殺的", desc: "跌深了總是會彈，撿個便宜", icon: <Anchor size={20} className="text-green-500" /> }
                ].map((opt) => (
                  <button 
                    key={opt.title} 
                    onClick={() => setDiscoveryStep(2)} 
                    className="p-6 bg-white dark:bg-zinc-900 rounded-[30px] border-2 border-slate-100 dark:border-white/5 shadow-sm hover:border-black dark:hover:border-orange-500 text-left transition-all flex justify-between items-center group active:scale-95 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="font-black text-xl mb-1 italic whitespace-nowrap flex items-center gap-2">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase whitespace-nowrap">{opt.desc}</div>
                    </div>
                    <div className="ml-4 bg-slate-50 dark:bg-white/5 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                      <ArrowRight size={18} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: 戰場 (Sector) - 白話版 */}
          {discoveryStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-10">
                <p className="text-orange-500 font-black tracking-[0.4em] text-[10px] uppercase mb-2 whitespace-nowrap">Step 02: Sector</p>
                <h2 className="text-4xl font-black italic tracking-tighter leading-none whitespace-nowrap">哪個領域讓你想了解？</h2>
                <p className="text-slate-400 text-xs font-bold mt-2 whitespace-nowrap">Where do you think the money is?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "AI 機器人", sub: "Chips & Tech", icon: <Cpu /> },
                  { label: "虛擬貨幣", sub: "Crypto & Web3", icon: <Coins /> },
                  { label: "避險資產", sub: "Safe Haven", icon: <Shield /> },
                  { label: "能源軍工", sub: "Energy & War", icon: <Factory /> },
                  { label: "生技醫療", sub: "Bio-Tech", icon: <Beaker /> },
                  { label: "吃喝玩樂", sub: "Consumer", icon: <BarChart3 /> },
                ].map((opt) => (
                  <button 
                    key={opt.label} 
                    onClick={() => setDiscoveryStep(3)} 
                    className="aspect-square bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-white/5 rounded-[40px] shadow-sm hover:border-orange-500 flex flex-col items-center justify-center font-black transition-all group active:scale-95"
                  >
                    <div className="mb-3 text-slate-300 group-hover:text-orange-500 group-hover:scale-110 transition-all">
                      {opt.icon}
                    </div>
                    <span className="italic text-xl tracking-tight whitespace-nowrap">{opt.label}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1 whitespace-nowrap">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: 標的量級 (Weight Class) - 白話版 */}
          {discoveryStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-10">
                <p className="text-orange-500 font-black tracking-[0.4em] text-[10px] uppercase mb-2 whitespace-nowrap">Step 03: Risk</p>
                <h2 className="text-4xl font-black italic tracking-tighter leading-none whitespace-nowrap">想要穩一點還是衝一點？</h2>
                <p className="text-slate-400 text-xs font-bold mt-2 whitespace-nowrap">Pick your risk appetite</p>
              </div>
              <div className="grid gap-4">
                {[
                  { title: "🦍 大家都知道的大公司", desc: "穩穩賺，晚上睡得著 (Mega Cap)", icon: <Crown size={20} className="text-purple-500" /> },
                  { title: "🐆 正在長大的潛力股", desc: "有點波動，但賺得比較多 (Growth)", icon: <Rabbit size={20} className="text-orange-500" /> },
                  { title: "🦄 賭一個翻倍的機會", desc: "心臟要大顆，要嘛大賺要嘛歸零 (Small Cap)", icon: <Gem size={20} className="text-pink-500" /> }
                ].map((opt) => (
                  <button 
                    key={opt.title} 
                    onClick={() => setDiscoveryStep(4)} 
                    className="p-6 bg-white dark:bg-zinc-900 rounded-[30px] border-2 border-slate-100 dark:border-white/5 shadow-sm hover:border-black dark:hover:border-orange-500 text-left transition-all flex justify-between items-center group active:scale-95 relative overflow-hidden"
                  >
                    <div className="relative z-10">
                      <div className="font-black text-xl mb-1 italic whitespace-nowrap flex items-center gap-2">
                        {opt.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase whitespace-nowrap">{opt.desc}</div>
                    </div>
                    <div className="ml-4 bg-slate-50 dark:bg-white/5 p-3 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-all shrink-0">
                      {opt.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: 結果 (Results) */}
          {discoveryStep === 4 && (
            <div className="animate-in zoom-in-95 duration-700 text-center">
              <div className="w-20 h-20 bg-white dark:bg-zinc-900 border-[6px] border-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                <Sparkles size={32} className="text-orange-500" />
              </div>
              <h2 className="text-4xl font-black italic mb-2 tracking-tighter whitespace-nowrap">AI 幫你找到了！</h2>
              <p className="text-slate-400 font-bold mb-10 uppercase tracking-widest text-[10px] whitespace-nowrap">
                Here are the best matches for you
              </p>
              
              <div className="grid gap-3 mb-10">
                {[
                  { t: "NVDA", signal: "Strong Buy", reason: "大家都說好，大戶還在買" },
                  { t: "MSTR", signal: "Accumulate", reason: "比特幣漲它就漲，很瘋" },
                  { t: "AMD", signal: "Watch", reason: "雖然跌了點，但技術面剛轉強" }
                ].map((item) => (
                  <div key={item.t} className="p-5 bg-slate-50 dark:bg-zinc-900 rounded-[28px] border border-slate-100 dark:border-white/5 flex justify-between items-center group hover:bg-white dark:hover:bg-zinc-800 hover:shadow-xl transition-all border-l-8 border-l-orange-500">
                    <div className="text-left pl-2">
                      <span className="font-black text-2xl block tracking-tighter italic leading-none">{item.t}</span>
                      <div className="flex items-center gap-1 text-[9px] text-slate-500 font-bold mt-1 whitespace-nowrap">
                         {item.reason}
                      </div>
                    </div>
                    <button 
                      onClick={() => router.push(`/new?ticker=${item.t}`)}
                      className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-2xl font-black text-xs hover:bg-orange-500 hover:text-white transition-all shadow-md active:scale-90 whitespace-nowrap"
                    >
                      看分析
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => setFlowState("ENTRY")} 
                className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] hover:text-orange-500 transition-colors whitespace-nowrap"
              >
                Reset Search Criteria
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}