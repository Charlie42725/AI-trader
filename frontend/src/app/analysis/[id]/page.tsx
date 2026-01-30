"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getAnalysis } from "@/lib/api";
import { AnalysisJob } from "@/lib/types";
import StatusBadge from "@/components/StatusBadge";
import DecisionBadge from "@/components/DecisionBadge";
import ReportSection from "@/components/ReportSection";

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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 md:w-14 md:h-14 border-3 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
        <p className="text-[var(--text-muted)] text-sm md:text-base mt-4">載入中...</p>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen container-padding">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--danger)]/20 flex items-center justify-center mb-4 md:mb-6">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[var(--danger)] mb-4 md:mb-6 text-center">{error}</p>
        <button onClick={() => router.back()} className="btn btn-secondary">
          返回
        </button>
      </div>
    );
  }

  if (!job) return null;

  const r = job.result;

  return (
    <div className="min-h-screen">
      {/* 頂部導航 - 響應式 */}
      <header className="sticky top-0 z-10 bg-[var(--bg-app)]/95 backdrop-blur-sm border-b border-[var(--border-light)]">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 md:px-6 py-3 md:py-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-[var(--bg-surface)] flex items-center justify-center hover:bg-[var(--bg-card)] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="font-bold text-lg md:text-xl">{job.ticker}</h1>
            <p className="text-xs md:text-sm text-[var(--text-muted)]">{job.date}</p>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </header>

      {/* 內容區域 - 響應式最大寬度 */}
      <div className="max-w-3xl mx-auto">
        {/* 分析中狀態 */}
        {(job.status === "pending" || job.status === "running") && (
          <div className="container-padding py-12 md:py-16">
            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 md:mb-8">
                <div className="absolute inset-0 border-4 border-[var(--border)] rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-[var(--primary)] rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">AI 正在分析中</h3>
              <p className="text-[var(--text-secondary)] text-sm md:text-base">
                {job.status === "pending" ? "等待處理..." : "分析進行中，每 3 秒自動更新"}
              </p>
            </div>
          </div>
        )}

        {/* 失敗狀態 */}
        {job.status === "failed" && job.error && (
          <div className="container-padding py-6 md:py-8">
            <div className="card p-4 md:p-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[var(--danger)]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-[var(--danger)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium md:text-lg text-[var(--danger)] mb-1">分析失敗</p>
                  <p className="text-sm md:text-base text-[var(--text-secondary)] break-words">{job.error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 分析結果 */}
        {job.status === "completed" && r && (
          <div className="container-padding py-6 md:py-8 space-y-6 md:space-y-8 pb-12">
            {/* 交易訊號 */}
            <div className="flex justify-center">
              <DecisionBadge signal={r.signal} />
            </div>

            {/* 分析師報告 */}
            <section>
              <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 md:h-5 bg-[var(--primary)] rounded-full" />
                分析師報告
              </h2>
              <div className="space-y-2 md:space-y-3">
                <ReportSection title="市場分析" content={r.market_report} defaultOpen />
                <ReportSection title="社群情緒" content={r.sentiment_report} />
                <ReportSection title="新聞分析" content={r.news_report} />
                <ReportSection title="基本面分析" content={r.fundamentals_report} />
              </div>
            </section>

            {/* 研究團隊 */}
            <section>
              <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 md:h-5 bg-[var(--success)] rounded-full" />
                研究團隊
              </h2>
              <div className="space-y-2 md:space-y-3">
                <ReportSection title="多頭研究員" content={r.investment_debate.bull_history} />
                <ReportSection title="空頭研究員" content={r.investment_debate.bear_history} />
                <ReportSection title="研究主管決策" content={r.investment_debate.judge_decision} />
                <ReportSection title="投資計畫" content={r.investment_plan} />
              </div>
            </section>

            {/* 交易團隊 */}
            <section>
              <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 md:h-5 bg-[var(--warning)] rounded-full" />
                交易團隊
              </h2>
              <ReportSection title="交易員計畫" content={r.trader_investment_plan} />
            </section>

            {/* 風險管理 */}
            <section>
              <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 md:h-5 bg-[var(--danger)] rounded-full" />
                風險管理
              </h2>
              <div className="space-y-2 md:space-y-3">
                <ReportSection title="激進派分析" content={r.risk_debate.risky_history} />
                <ReportSection title="保守派分析" content={r.risk_debate.safe_history} />
                <ReportSection title="中立派分析" content={r.risk_debate.neutral_history} />
                <ReportSection title="風險經理決策" content={r.risk_debate.judge_decision} />
              </div>
            </section>

            {/* 最終決策 */}
            <section>
              <h2 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
                <span className="w-1.5 h-4 md:h-5 bg-purple-500 rounded-full" />
                最終決策
              </h2>
              <ReportSection title="完整決策分析" content={r.final_trade_decision} defaultOpen />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
