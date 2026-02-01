"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 引入路由
import { listAnalyses } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import AnalysisCard from "@/components/AnalysisCard";
import { 
  RocketLaunchIcon, 
  CpuChipIcon, 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  NewspaperIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

export default function HomePage() {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fetcher = useCallback(() => listAnalyses(), []);
  const { data: jobs, loading } = usePolling(fetcher, 10_000);

  const stats = jobs
    ? {
        total: jobs.length,
        completed: jobs.filter((j) => j.status === "completed").length,
        running: jobs.filter((j) => j.status === "running" || j.status === "pending").length,
      }
    : null;

  const steps = [
    { 
      icon: GlobeAltIcon, 
      label: "多維數據抓取", 
      color: "text-yellow-400",
      desc: "整合市場與基本面分析師，即時抓取技術指標與財報數據。" 
    },
    { 
      icon: NewspaperIcon, 
      label: "Agents 深度解析", 
      color: "text-blue-400",
      desc: "新聞與社群分析師並行，解析情緒及社交媒體輿論訊號。" 
    },
    { 
      icon: CpuChipIcon, 
      label: "決策辯論權衡", 
      color: "text-purple-400",
      desc: "啟動 AI 多空辯論系統，由研究主管針對分析報告進行驗證。" 
    },
    { 
      icon: ArrowTrendingUpIcon, 
      label: "交易訊號輸出", 
      color: "text-[#02c076]",
      desc: "首席交易員根據風險辯論結果，產出精準的買賣執行建議。" 
    },
  ];

  return (
    <main className="min-h-screen bg-[#0b0e11] text-[#eaecef] pb-24">
      {/* 1. 頂部即時市場跑馬燈 */}
      <div className="bg-[#1e2329] py-2 overflow-hidden border-b border-gray-800 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          {["BTC/USDT +1.2%", "ETH/USDT -0.5%", "NVDA/USD +2.3%", "XAU/USD +0.1%", "SOL/USDT +4.5%"].map((ticker, i) => (
            <span key={i} className="mx-6 text-[10px] font-mono tracking-tighter">
              <span className="text-gray-400">{ticker.split(' ')[0]}</span>
              <span className={ticker.includes('+') ? "text-[#02c076] ml-1" : "text-[#f84960] ml-1"}>
                {ticker.split(' ')[1]}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-padding pt-6 max-w-2xl mx-auto">
        {/* 2. 標題與價值主張 */}
        <header className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight italic">TRADING AGENT</h1>
            <p className="text-gray-400 text-xs mt-1">多種 AI 專家幫你整合並自動化決策</p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-flex items-center px-2 py-1 rounded bg-gray-800 text-[10px] text-yellow-400 border border-yellow-400/30">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              AI Agents Online
            </span>
          </div>
        </header>

        {/* 3. 核心功能區 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/new" className="group relative bg-yellow-400 hover:bg-yellow-500 p-4 rounded-xl flex flex-col justify-between transition-all overflow-hidden h-32">
            <RocketLaunchIcon className="w-8 h-8 text-black/20 self-end transition-transform group-hover:scale-110" />
            <div>
              <h3 className="text-black font-black text-lg italic leading-none">START</h3>
              <p className="text-black/60 text-[10px] font-bold uppercase mt-1 tracking-wider">啟動 AI 分析</p>
            </div>
          </Link>
          
          <Link href="/history" className="bg-[#1e2329] border border-gray-800 p-4 rounded-xl flex flex-col justify-between hover:bg-[#2b3139] transition-all h-32">
            <HistoryIcon className="w-8 h-8 text-gray-700 self-end" />
            <div>
              <h3 className="text-white font-bold text-lg leading-none">HISTORY</h3>
              <p className="text-gray-400 text-[10px] uppercase mt-1 tracking-wider">過往決策報表</p>
            </div>
          </Link>
        </div>

        {/* 4. AI 數據分析流程圖 (入口) */}
        <div 
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[#1e2329] rounded-xl p-4 border border-gray-800 mb-6 cursor-pointer hover:border-gray-600 transition-colors group"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center">
              <CpuChipIcon className="w-3 h-3 mr-1 text-yellow-400" />
              AI 引擎處理流程 (點擊了解詳情)
            </h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-600 group-hover:text-yellow-400" />
          </div>
          
          <div className="flex overflow-x-auto no-scrollbar gap-6 items-center">
            {steps.map((step, i) => (
              <div key={i} className="flex-none flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-[#0b0e11] rounded-full flex items-center justify-center mb-1 border border-gray-800 group-hover:border-yellow-400/30 transition-colors">
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="ml-6 h-[1px] w-4 bg-gray-800" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. 抽屜式詳細說明 (互動按鈕化) */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
            <div className="relative bg-[#1e2329] w-full max-w-lg rounded-t-3xl p-6 pb-28 shadow-2xl border-t border-gray-700 animate-in fade-in slide-in-from-bottom-10 duration-300">
              <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />
              
              <div className="flex justify-between items-start mb-6 px-1">
                <div>
                  <h3 className="text-xl font-bold text-white">AI 決策透明中心</h3>
                  <p className="text-gray-400 text-xs mt-1">點擊下方模組深入了解各 Agent 邏輯</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                  <XMarkIcon className="w-6 h-6 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      router.push(`/process?step=${i}`);
                    }}
                    className="w-full flex items-center gap-4 p-4 bg-[#0b0e11] rounded-2xl border border-gray-800 hover:border-yellow-400/50 hover:bg-[#161a1e] transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors">{step.label}</h4>
                        <ChevronRightIcon className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-1">{step.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="w-full mt-6 py-4 bg-[#1e2329] hover:bg-[#2b3139] border border-gray-700 text-gray-400 font-bold rounded-2xl transition-colors text-sm"
              >
                關閉面板
              </button>
            </div>
          </div>
        )}

        {/* 6. 統計數據條 */}
        {stats && stats.total > 0 && (
          <div className="flex gap-6 mb-8 px-2 border-l-2 border-yellow-400/50">
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">TOTAL TASKS</p>
              <p className="text-xl font-mono">{stats.total}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">SUCCESS</p>
              <p className="text-xl font-mono text-[#02c076]">{stats.completed}</p>
            </div>
            <div>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">ACTIVE</p>
              <p className="text-xl font-mono text-yellow-400">{stats.running}</p>
            </div>
          </div>
        )}

        {/* 7. 最近分析清單 */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-bold text-sm text-gray-300 uppercase tracking-widest">最近監控標的</h2>
            <Link href="/history" className="text-xs text-yellow-400 hover:text-yellow-500 transition-colors">市場全覽 &rarr;</Link>
          </div>

          <div className="space-y-2">
            {loading && !jobs ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin" />
              </div>
            ) : jobs?.length === 0 ? (
              <div className="bg-[#1e2329] p-10 rounded-2xl text-center border border-dashed border-gray-800">
                <p className="text-gray-500 text-sm italic">等待指令中... 請輸入標的以啟動 AI</p>
              </div>
            ) : (
              jobs?.slice(0, 5).map((job) => (
                <div key={job.id} className="transition-transform active:scale-[0.98]">
                  <AnalysisCard job={job} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}