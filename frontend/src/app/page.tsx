"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { listAnalyses } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import AnalysisCard from "@/components/AnalysisCard";
import {
  RocketLaunchIcon,
  CpuChipIcon,
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

  // 統一色調為橘色系
  const steps = [
    {
      icon: GlobeAltIcon,
      label: "市場關鍵追蹤",
      color: "text-orange-600",
      desc: "自動捕捉關鍵波動，確保不錯過任何行情。"
    },
    {
      icon: NewspaperIcon,
      label: "萬篇新聞精煉",
      color: "text-orange-600",
      desc: "AI 提取真實情緒反應，避開假消息誤導。"
    },
    {
      icon: CpuChipIcon,
      label: "多方邏輯審查",
      color: "text-orange-600",
      desc: "多位專家模擬辯論，強制過濾主觀偏見。"
    },
    {
      icon: ArrowTrendingUpIcon,
      label: "數據信心導出",
      color: "text-orange-600",
      desc: "量化策略信心指數，提供科學決策輔助。"
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-gray-100 pb-32 transition-colors duration-300">
      {/* 1. 頂部即時市場跑馬燈 (改為白底黑字) */}
      <div className="bg-gray-50 dark:bg-white/5 py-2 overflow-hidden border-b border-gray-100 dark:border-white/5 flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          {["BTC/USDT +1.2%", "ETH/USDT -0.5%", "NVDA/USD +2.3%", "XAU/USD +0.1%", "SOL/USDT +4.5%"].map((ticker, i) => (
            <span key={i} className="mx-6 text-[10px] font-mono tracking-tighter">
              <span className="text-gray-500 font-bold">{ticker.split(' ')[0]}</span>
              <span className={ticker.includes('+') ? "text-emerald-600 ml-1 font-bold" : "text-rose-600 ml-1 font-bold"}>
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
            <h1 className="text-2xl font-black text-black dark:text-white tracking-tight italic uppercase">TRADING AGENT</h1>
            <p className="text-gray-500 text-xs mt-1 font-bold">AI模組專家集群自動化決策</p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="inline-flex items-center px-2 py-1 rounded bg-black text-[10px] text-orange-500 font-bold border border-black">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              AGENTS ONLINE
            </span>
          </div>
        </header>

        {/* 3. 核心功能區 (改為橘黑配色) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/new" className="group relative bg-orange-500 hover:bg-orange-600 p-4 rounded-xl flex flex-col justify-between transition-all overflow-hidden h-32 shadow-lg shadow-orange-100">
            <RocketLaunchIcon className="w-8 h-8 text-black/10 self-end transition-transform group-hover:scale-110" />
            <div>
              <h3 className="text-black font-black text-lg italic leading-none">分析</h3>
              <p className="text-black/60 text-[10px] font-bold uppercase mt-1 tracking-wider">今天想了解哪個投資標的呢</p>
            </div>
          </Link>

          <Link href="/history" className="bg-white dark:bg-white/5 border-2 border-black dark:border-white p-4 rounded-xl flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-white/10 transition-all h-32">
            <HistoryIcon className="w-8 h-8 text-black dark:text-white self-end" />
            <div>
              <h3 className="text-black dark:text-white font-black text-lg italic leading-none">歷史紀錄</h3>
              <p className="text-gray-500 text-[10px] font-bold uppercase mt-1 tracking-wider">過去報表</p>
            </div>
          </Link>
        </div>

        {/* 4. AI 處理流程圖 (亮色卡片) */}
        <div
          onClick={() => setIsDrawerOpen(true)}
          className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 mb-6 cursor-pointer hover:border-orange-500 transition-colors group shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center">
              <CpuChipIcon className="w-3 h-3 mr-1 text-orange-600" />
              運作流程 (點擊查看)
            </h2>
            <InformationCircleIcon className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-6 items-center">
            {steps.map((step, i) => (
              <div key={i} className="flex-none flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-1 border border-gray-200 dark:border-white/5 group-hover:border-orange-500 transition-colors shadow-sm">
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold whitespace-nowrap">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="ml-6 h-[1px] w-4 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 5. 抽屜面板 (改為白底黑橘) */}
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
            <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl p-6 pb-28 shadow-2xl border-t border-gray-100 dark:border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-300">
              <div className="w-12 h-1 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-6 px-1">
                <div>
                  <h3 className="text-xl font-black text-black dark:text-white uppercase italic">智能分析模組流程</h3>
                  <p className="text-gray-500 text-xs mt-1 font-bold">點擊下方模組了解各項邏輯</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <XMarkIcon className="w-6 h-6 text-black dark:text-white" />
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
                    className="w-full flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-orange-500 hover:bg-white dark:hover:bg-white/10 transition-all text-left group active:scale-[0.98]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-black text-black dark:text-white group-hover:text-orange-600 transition-colors">{step.label}</h4>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed font-medium line-clamp-1">{step.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. 統計數據條 (改為橘色裝飾) */}
        {/* 6. 統計數據條 (改為橘色裝飾) */}
        {stats && stats.total > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-8 px-2 border-l-4 border-orange-500">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">觀察數量</p>
              <p className="text-xl font-black text-black dark:text-white">{stats.total}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">已完成</p>
              <p className="text-xl font-black text-emerald-600">{stats.completed}</p>
            </div>
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">運行中</p>
              <p className="text-xl font-black text-orange-600">{stats.running}</p>
            </div>
          </div>
        )}

        {/* 7. 最近分析清單 (亮色列表) */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-black text-sm text-black dark:text-white uppercase tracking-widest italic">觀察列表</h2>
            <Link href="/history" className="text-xs text-orange-600 font-bold hover:underline transition-all">檢視所有 &rarr;</Link>
          </div>

          <div className="space-y-2">
            {loading && !jobs ? (
              <div className="py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : jobs?.length === 0 ? (
              <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-2xl text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                <p className="text-gray-400 text-sm font-bold italic uppercase tracking-widest">Waiting for orders...</p>
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
          animation: marquee 40s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}