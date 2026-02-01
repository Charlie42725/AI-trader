"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAnalysis } from "@/lib/api";
import { AnalysisJob } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import DecisionBadge from "@/components/DecisionBadge";
import ReportSection from "@/components/ReportSection";
import ProgressTracker from "@/components/ProgressTracker";

function isTerminal(status: string) {
  return status === "completed" || status === "failed";
}

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<AnalysisJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);

  const poll = useCallback(async () => {
    try {
      const data = await getAnalysis(id);
      setJob(data);
      setError(null);
      if (isTerminal(data.status)) {
        clearInterval(timer.current);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    poll();
    timer.current = setInterval(poll, 3_000);
    return () => clearInterval(timer.current);
  }, [poll]);

  if (loading && !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-14 h-14 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm mt-6 font-mono tracking-widest uppercase">Initializing Intelligence...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-500 font-bold mb-6 text-center text-lg">{error}</p>
        <button onClick={() => router.back()} className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all">
          返回控制台
        </button>
      </div>
    );
  }

  if (!job) return null;

  const r = job.result;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* 頂部導航 - 極簡白 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all group"
          >
            <svg className="w-6 h-6 text-black group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-0.5">ApexAlgo Terminal</span>
            <h1 className="font-black text-xl tracking-tighter text-black uppercase italic">{job.ticker}</h1>
          </div>

          <StatusBadge status={job.status} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto pb-24">
        {/* 分析中狀態 */}
        {(job.status === "pending" || job.status === "running") && (
          <div className="px-4 py-12">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-[6px] border-gray-100 rounded-3xl rotate-12" />
                <div className="absolute inset-0 border-[6px] border-transparent border-t-orange-500 rounded-3xl animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-black text-black mb-2">AI 深度運算中</h3>
              <p className="text-gray-400 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                正在調度多個分析師代理人，對 {job.ticker} 進行多維度回測與風險評估。
              </p>
            </div>
            <ProgressTracker steps={job.progress || []} />
          </div>
        )}

        {/* 失敗狀態 */}
        {job.status === "failed" && (
          <div className="px-4 py-8">
            <div className="bg-white border-2 border-red-100 rounded-3xl p-8 shadow-sm">
               <div className="flex items-center gap-4 mb-4 text-red-500">
                  <div className="p-3 bg-red-50 rounded-2xl font-black italic">ERROR_LOG</div>
                  <h4 className="font-bold">分析任務終止</h4>
               </div>
               <p className="text-gray-600 font-mono text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                  {job.error || "Unknown system failure during data fetching."}
               </p>
            </div>
          </div>
        )}

        {/* 分析結果 - 完成狀態 */}
        {job.status === "completed" && r && (
          <div className="px-4 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* 1. 核心決策看板 (Hero Card) */}
            <section className="bg-zinc-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               {/* 背景水印 */}
               <div className="absolute top-0 right-0 text-white/[0.03] text-9xl font-black italic -mr-4 -mt-4 pointer-events-none select-none">
                 {job.ticker}
               </div>
               
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Final Market Signal</p>
                      <DecisionBadge signal={r.signal} />
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest mb-1">Generated At</p>
                      <p className="text-white font-mono text-xs">{job.date}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-8">
                    <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Confidence Score</p>
                      <p className="text-2xl font-black text-orange-500">87.5<span className="text-sm ml-0.5">%</span></p>
                    </div>
                    <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
                      <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Risk Profile</p>
                      <p className="text-2xl font-black text-white italic">MODERATE</p>
                    </div>
                 </div>
               </div>
            </section>

            {/* 2. 分析師報告 - 淺灰色區塊 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-6 bg-orange-500 rounded-full" />
                <h2 className="font-black text-xl tracking-tighter uppercase italic">Analyst Intelligence</h2>
              </div>
              <div className="grid gap-3">
                <ReportSection title="市場趨勢分析" content={r.market_report} defaultOpen />
                <ReportSection title="社群/情緒掃描" content={r.sentiment_report} />
                <ReportSection title="即時新聞影響" content={r.news_report} />
                <ReportSection title="財務基本面" content={r.fundamentals_report} />
              </div>
            </section>

            {/* 3. 研究與辯論 - 加入一點專業藍色調 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-6 bg-zinc-950 rounded-full" />
                <h2 className="font-black text-xl tracking-tighter uppercase italic">Strategic Debate</h2>
              </div>
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <div className="space-y-2">
                  <ReportSection title="📈 多頭觀點 (Bull Case)" content={r.investment_debate.bull_history} />
                  <ReportSection title="📉 空頭觀點 (Bear Case)" content={r.investment_debate.bear_history} />
                  <ReportSection title="⚖️ 綜合決策摘要" content={r.investment_debate.judge_decision} />
                  <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                    <ReportSection title="🎯 執行計畫" content={r.investment_plan} />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. 風險管理 - 紅色強調 */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-2 h-6 bg-red-500 rounded-full" />
                <h2 className="font-black text-xl tracking-tighter uppercase italic text-red-500">Risk Assessment</h2>
              </div>
              <div className="bg-red-50/30 rounded-[2rem] p-2 border border-red-50">
                <div className="bg-white rounded-[1.8rem] p-4 space-y-2">
                  <ReportSection title="激進派預期" content={r.risk_debate.risky_history} />
                  <ReportSection title="保守派對策" content={r.risk_debate.safe_history} />
                  <ReportSection title="風險總結報告" content={r.risk_debate.judge_decision} defaultOpen />
                </div>
              </div>
            </section>

            {/* 5. 最終決策總結 - 巨大背景裝飾 */}
            <section className="pt-8">
              <div className="bg-orange-500 text-white rounded-[2rem] p-8 shadow-xl shadow-orange-500/20">
                <h2 className="text-3xl font-black tracking-tighter italic mb-4">FINAL THOUGHTS</h2>
                <div className="prose prose-invert max-w-none text-orange-50 leading-relaxed font-medium">
                  {r.final_trade_decision}
                </div>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}