"use client";

import { useCallback } from "react";
import Link from "next/link";
import { listAnalyses } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import AnalysisCard from "@/components/AnalysisCard";

export default function HomePage() {
  const fetcher = useCallback(() => listAnalyses(), []);
  const { data: jobs, loading } = usePolling(fetcher, 10_000);

  const stats = jobs
    ? {
        total: jobs.length,
        completed: jobs.filter((j) => j.status === "completed").length,
        running: jobs.filter((j) => j.status === "running" || j.status === "pending").length,
      }
    : null;

  return (
    <div className="container-padding pt-6 md:pt-8">
      {/* 頂部標題 */}
      <header className="mb-6 md:mb-8">
        <h1 className="page-title">交易分析</h1>
        <p className="text-[var(--text-secondary)] text-sm md:text-base mt-1">
          AI 智能分析助手
        </p>
      </header>

      {/* 統計卡片 */}
      {stats && stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold">{stats.total}</p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">總數</p>
          </div>
          <div className="card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-[var(--success)]">{stats.completed}</p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">完成</p>
          </div>
          <div className="card p-4 md:p-6 text-center">
            <p className="text-2xl md:text-3xl font-bold text-[var(--primary)]">{stats.running}</p>
            <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">進行中</p>
          </div>
        </div>
      )}

      {/* 載入中 */}
      {loading && !jobs && (
        <div className="flex flex-col items-center py-20 md:py-28">
          <div className="w-10 h-10 md:w-12 md:h-12 border-3 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm md:text-base mt-4">載入中...</p>
        </div>
      )}

      {/* 空狀態 */}
      {jobs && jobs.length === 0 && (
        <div className="card p-8 md:p-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-[var(--bg-card)] flex items-center justify-center mb-4 md:mb-6">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg md:text-xl mb-2">尚無分析紀錄</h3>
          <p className="text-[var(--text-secondary)] text-sm md:text-base mb-6 md:mb-8">
            點擊下方按鈕開始您的第一個分析
          </p>
          <Link href="/new" className="btn btn-primary">
            開始分析
          </Link>
        </div>
      )}

      {/* 分析列表 */}
      {jobs && jobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base md:text-lg">最近分析</h2>
            <Link href="/history" className="text-sm md:text-base text-[var(--primary)] hover:underline">
              查看全部
            </Link>
          </div>
          <div className="space-y-3 md:space-y-4">
            {jobs.slice(0, 5).map((job, i) => (
              <div key={job.id} className="animate-in" style={{ animationDelay: `${i * 50}ms` }}>
                <AnalysisCard job={job} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
