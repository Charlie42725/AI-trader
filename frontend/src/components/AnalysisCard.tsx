"use client";

import Link from "next/link";
import { JobSummary } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const signalLabels: Record<string, { text: string; color: string; bg: string }> = {
  BUY: { text: "買入", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-500/10" },
  SELL: { text: "賣出", color: "text-black dark:text-white", bg: "bg-gray-100 dark:bg-white/10" },
  HOLD: { text: "持有", color: "text-gray-500 dark:text-gray-400", bg: "bg-gray-50 dark:bg-white/5" },
};

export default function AnalysisCard({ job }: { job: JobSummary }) {
  const signal = job.signal?.toUpperCase();
  const signalInfo = signal ? signalLabels[signal] : null;

  return (
    <Link
      href={`/analysis/${job.id}`}
      className="block p-4 md:p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-orange-500 transition-all cursor-pointer active:scale-[0.98] shadow-sm mb-2"
    >
      <div className="flex items-center gap-4">
        {/* 股票代碼圖標 - 改為黑底橘字，增加硬派感 */}
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-black dark:bg-black/50 border border-transparent dark:border-white/20 flex items-center justify-center flex-shrink-0">
          <span className="text-lg md:text-xl font-black font-mono text-orange-500">
            {job.ticker.slice(0, 2)}
          </span>
        </div>

        {/* 資訊區 - 純黑文字與灰色副標 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-black text-black dark:text-white md:text-lg tracking-tight uppercase">
              {job.ticker}
            </span>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">
              {job.date}
            </p>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-400 uppercase tracking-wider">
              {job.llm_provider === "google" ? "Gemini" : "GPT"}
            </span>
          </div>
        </div>

        {/* 訊號 / 箭頭 - 橘色強化 */}
        <div className="flex-shrink-0">
          {signalInfo ? (
            <div className={`px-3 py-1 rounded-sm ${signalInfo.bg} border border-transparent`}>
              <span className={`text-sm md:text-base font-black ${signalInfo.color}`}>
                {signalInfo.text}
              </span>
            </div>
          ) : (
            <div className="p-2 bg-gray-50 dark:bg-white/10 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}