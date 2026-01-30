"use client";

import { useCallback } from "react";
import { listAnalyses } from "@/lib/api";
import { usePolling } from "@/hooks/usePolling";
import AnalysisCard from "@/components/AnalysisCard";

export default function HistoryPage() {
  const fetcher = useCallback(() => listAnalyses(), []);
  const { data: jobs, loading } = usePolling(fetcher, 10_000);

  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">歷史紀錄</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">所有分析紀錄</p>
      </header>

      {loading && !jobs && (
        <div className="flex flex-col items-center py-20">
          <div className="w-10 h-10 border-3 border-[var(--border)] border-t-[var(--primary)] rounded-full animate-spin" />
          <p className="text-[var(--text-muted)] text-sm mt-4">載入中...</p>
        </div>
      )}

      {jobs && jobs.length === 0 && (
        <div className="text-center py-20 text-[var(--text-muted)]">
          尚無分析紀錄
        </div>
      )}

      {jobs && jobs.length > 0 && (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <div key={job.id} className="animate-in" style={{ animationDelay: `${i * 30}ms` }}>
              <AnalysisCard job={job} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
