"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X, ArrowRight, Target, Compass, Sparkles, 
  ChevronLeft, Zap, TrendingUp, Anchor, 
  Shield, Crown, Rabbit, Gem, BrainCircuit, Loader2,
  Clock, Wallet, LineChart, Search, Coins, AlertTriangle,
  HeartPulse, Briefcase, Landmark, Percent
} from "lucide-react";

type FlowState = "ENTRY" | "DISCOVERY";

export default function MarketPage() {
  const router = useRouter();
  const [flowState, setFlowState] = useState<FlowState>("ENTRY");
  const [discoveryStep, setDiscoveryStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const quizSteps = [
    { id: 1, q: "投資的初心是？", key: "goal", opts: [
      { id: "A", t: "🏦 緊急預備金/存錢", d: "比銀行利息高一點就好", icon: <Anchor className="text-blue-600"/> },
      { id: "B", t: "🚀 長期積累財富", d: "為了買車買房或創業基金", icon: <Briefcase className="text-orange-600"/> },
      { id: "C", t: "🌅 退休規劃", d: "追求數十年的長期穩定成長", icon: <Crown className="text-amber-600"/> },
      { id: "D", t: "💰 賺取被動收入", d: "每個月或每季領取現金花用", icon: <Coins className="text-emerald-600"/> }
    ]},
    { id: 2, q: "若帳戶突然縮水 10%？", key: "risk", opts: [
      { id: "A", t: "😱 非常焦慮", d: "想趕快把錢領出來", icon: <AlertTriangle className="text-red-600"/> },
      { id: "B", t: "🧐 有點擔心", d: "能忍受，只要長期漲回來", icon: <Search className="text-blue-500"/> },
      { id: "C", t: "⚖️ 理性看待", d: "考慮趁低價多買一點", icon: <Shield className="text-zinc-600"/> },
      { id: "D", t: "🧊 毫無感覺", d: "放著不動等它翻倍", icon: <Zap className="text-orange-500"/> }
    ]},
    { id: 3, q: "預計採取的投入方式？", key: "method", opts: [
      { id: "A", t: "📅 定期定額", d: "每月固定撥出小額資金", icon: <Clock className="text-orange-500"/> },
      { id: "B", t: "💵 單筆投入", d: "手邊大筆存款一次性投入", icon: <Wallet className="text-zinc-700"/> },
      { id: "C", t: "🔄 混合式", d: "先投大筆，後續每月持續加碼", icon: <TrendingUp className="text-orange-600"/> }
    ]},
    { id: 4, q: "資金多久「絕對不」動用？", key: "horizon", opts: [
      { id: "A", t: "🕐 極短期 (1年內)", d: "需要極高流動性的資產", icon: <Zap className="text-orange-500"/> },
      { id: "B", t: "⏳ 中期 (1-3年)", d: "可忍受波動換取更高報酬", icon: <LineChart className="text-blue-600"/> },
      { id: "C", t: "💎 長期 (3年以上)", d: "讓時間發揮複利效果", icon: <Gem className="text-emerald-600"/> }
    ]},
    { id: 5, q: "你更看重標的的什麼？", key: "feature", opts: [
      { id: "A", t: "📝 簡單透明", d: "不需要研究，保本為主", icon: <Shield className="text-zinc-500"/> },
      { id: "B", t: "🌍 跟隨大盤", d: "買入 ETF 跟著經濟成長", icon: <Landmark className="text-blue-700"/> },
      { id: "C", t: "🧧 領息回扣", d: "定期看到錢撥入帳戶的感覺", icon: <Percent className="text-orange-600"/> }
    ]},
    { id: 6, q: "願意花多少時間管理？", key: "management", opts: [
      { id: "A", t: "🛌 完全不想管", d: "買了就放著，一年看一次", icon: <HeartPulse className="text-red-400"/> },
      { id: "B", t: "☕ 偶爾關心", d: "每月看財經新聞或損益", icon: <Search className="text-zinc-500"/> },
      { id: "C", t: "🧠 很有興趣", d: "願意學習分析尋找買點", icon: <BrainCircuit className="text-orange-500"/> }
    ]},
    { id: 7, q: "偏好的存放方式？", key: "storage", opts: [
      { id: "A", t: "🏦 高利活存", d: "靈活性最高，隨存隨領", icon: <Landmark className="text-blue-600"/> },
      { id: "B", t: "🔒 短期定存", d: "安全保本，強迫鎖住資金", icon: <Shield className="text-zinc-700"/> },
      { id: "C", t: "📈 貨幣基金", d: "風險極低，適合資金待命", icon: <Coins className="text-emerald-600"/> }
    ]},
    { id: 8, q: "目前常用的金融帳戶？", key: "account", opts: [
      { id: "A", t: "📈 已經有證券戶", d: "直接在 App 操作即可", icon: <LineChart className="text-orange-500"/> },
      { id: "B", t: "🏦 只有銀行帳戶", d: "習慣用銀行 App", icon: <Landmark className="text-zinc-600"/> },
      { id: "C", t: "🆕 都沒有/願意開戶", d: "追求 0 手續費平台", icon: <Zap className="text-orange-400"/> }
    ]},
    { id: 9, q: "關於「領錢」的預期？", key: "payout", opts: [
      { id: "A", t: "🔄 累積型", d: "利息滾入，一年後一次領回", icon: <TrendingUp className="text-blue-600"/> },
      { id: "B", t: "💵 配息型", d: "每季或每月領到利息", icon: <Percent className="text-orange-600"/> }
    ]}
  ];

  useEffect(() => {
    if (discoveryStep > quizSteps.length) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [discoveryStep, quizSteps.length]);

  const handleSelect = (val: string) => {
    setAnswers(prev => ({ ...prev, [discoveryStep]: val }));
    setDiscoveryStep(prev => prev + 1);
  };

  const getRecommendations = () => {
    const isConservative = answers[2] === "A" || answers[4] === "A";
    const wantsIncome = answers[1] === "D" || answers[9] === "B";

    if (isConservative) {
      return [
        { t: "00719B", label: "低波動美債", reason: "適合 1 年內動用且極度避險的資金", color: "border-l-orange-500" },
        { t: "MMF", label: "貨幣基金", reason: "優於定存的靈活性，適合儲蓄替代", color: "border-l-zinc-300" }
      ];
    }
    if (wantsIncome) {
      return [
        { t: "00919", label: "高股息強者", reason: "符合配息需求，穩定發放現金流", color: "border-l-orange-500" },
        { t: "JEPI", label: "主動型抵補", reason: "美股高息選擇，波動相對大盤小", color: "border-l-zinc-800" }
      ];
    }
    return [
      { t: "NVDA", label: "AI 領航員", reason: "高成長潛力，適合長期累積財富", color: "border-l-orange-600" },
      { t: "VOO", label: "標普 500", reason: "最穩健的長期配置建議", color: "border-l-zinc-900" }
    ];
  };

  if (flowState === "ENTRY") {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700">
        <div className="mb-10 w-24 h-24 bg-orange-500 rounded-[32px] flex items-center justify-center shadow-xl shadow-orange-200">
          <BrainCircuit size={48} className="text-white" />
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter mb-4 text-zinc-900 dark:text-white">做好投資準備了嗎？</h1>
        <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm mb-16 max-w-[280px] leading-relaxed">
          透過 9 個核心問題，為您匹配最佳建議。
        </p>
        <div className="grid gap-5 w-full max-w-sm">
          <button onClick={() => setFlowState("DISCOVERY")} className="p-7 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-[28px] font-black italic text-xl flex items-center justify-center gap-3 shadow-2xl hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 transition-all active:scale-95">
            開始旅程 <ArrowRight />
          </button>
          <button onClick={() => router.push("/new")} className="py-4 text-zinc-400 font-black text-xs uppercase tracking-[0.2em] hover:text-orange-600 transition-colors">
            已經有明確目標，直接去分析
          </button>
        </div>
      </div>
    );
  }

  const currentQuiz = quizSteps.find(s => s.id === discoveryStep);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A] p-6 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12 pt-10">
          {quizSteps.map(s => (
            <div key={s.id} className={`h-2 flex-1 rounded-full transition-all duration-500 ${discoveryStep >= s.id ? "bg-orange-500 shadow-sm" : "bg-zinc-100 dark:bg-zinc-800"}`} />
          ))}
        </div>

        {currentQuiz ? (
          <div className="animate-in slide-in-from-right-4 duration-500 flex-1">
            <div className="flex items-center gap-2 mb-4">
               <span className="w-8 h-[2px] bg-orange-500"></span>
               <p className="text-orange-500 font-black text-[12px] uppercase tracking-widest">Question {currentQuiz.id}/09</p>
            </div>
            <h2 className="text-3xl font-black italic leading-tight mb-10 text-zinc-900 dark:text-white">
              {currentQuiz.q}
            </h2>
            <div className="grid gap-4">
              {currentQuiz.opts.map(opt => (
                <button key={opt.id} onClick={() => handleSelect(opt.id)} className="group p-5 bg-white dark:bg-zinc-900 rounded-[24px] border-2 border-zinc-100 dark:border-zinc-800 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-100 dark:hover:shadow-none flex items-center gap-5 transition-all text-left">
                  <div className="p-4 bg-zinc-50 dark:bg-black rounded-2xl group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 transition-colors text-zinc-900 dark:text-white">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="font-black text-lg text-zinc-900 dark:text-white">{opt.t}</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-bold mt-1 uppercase tracking-tight">{opt.d}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 flex-1 flex flex-col items-center justify-center">
            {isAnalyzing ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-8">
                  <Loader2 size={64} className="animate-spin text-orange-500 relative z-10"/>
                  <div className="absolute inset-0 bg-orange-200 blur-2xl opacity-30 animate-pulse"></div>
                </div>
                <p className="font-black italic tracking-tighter text-2xl text-zinc-900 dark:text-white uppercase">AI 分析中</p>
                <p className="text-[10px] text-zinc-400 mt-4 font-black uppercase tracking-[0.3em]">交叉檢索 9 項財務維度...</p>
              </div>
            ) : (
              <div className="animate-in zoom-in-95 duration-700 w-full">
                <div className="w-24 h-24 bg-zinc-900 dark:bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Sparkles size={40} className="text-orange-500" />
                </div>
                <h2 className="text-4xl font-black italic mb-2 text-zinc-900 dark:text-white">匹配成功！</h2>
                <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-12">Your Investment DNA</p>
                
                <div className="grid gap-4 mb-12">
                  {getRecommendations().map(item => (
                    <div key={item.t} className={`p-6 bg-white dark:bg-zinc-900 rounded-[32px] border-l-[12px] shadow-xl shadow-zinc-100 dark:shadow-none text-left ${item.color} border-y border-r border-zinc-100 dark:border-zinc-800`}>
                       <span className="font-black text-3xl italic tracking-tighter text-zinc-900 dark:text-white">{item.t}</span>
                       <p className="text-[12px] font-bold text-zinc-500 dark:text-zinc-400 uppercase mt-2 leading-relaxed">{item.reason}</p>
                       <button onClick={() => router.push(`/new?ticker=${item.t}`)} className="mt-6 w-full py-4 bg-zinc-900 dark:bg-orange-500 text-white rounded-2xl font-black text-sm hover:scale-[1.02] transition-transform active:scale-95 shadow-lg">
                         查看完整 AI 報告
                       </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setDiscoveryStep(1)} className="text-zinc-400 font-black text-[11px] uppercase tracking-[0.2em] hover:text-orange-600 transition-colors">
                  RETAKE DIAGNOSIS
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="py-10">
           <button onClick={() => setFlowState("ENTRY")} className="flex items-center gap-2 text-[11px] font-black text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors uppercase tracking-[0.2em] mx-auto">
             <ChevronLeft size={16}/> BACK TO START
           </button>
        </div>
      </div>
    </div>
  );
}