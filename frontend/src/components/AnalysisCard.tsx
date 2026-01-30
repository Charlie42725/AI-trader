import Link from "next/link";
import { JobSummary } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const signalLabels: Record<string, { text: string; color: string }> = {
  BUY: { text: "買入", color: "text-[var(--success)]" },
  SELL: { text: "賣出", color: "text-[var(--danger)]" },
  HOLD: { text: "持有", color: "text-[var(--warning)]" },
};

export default function AnalysisCard({ job }: { job: JobSummary }) {
  const signal = job.signal?.toUpperCase();
  const signalInfo = signal ? signalLabels[signal] : null;

  return (
    <Link href={`/analysis/${job.id}`} className="card block p-4 active:bg-[var(--bg-card)] transition-colors">
      <div className="flex items-center gap-4">
        {/* 股票代碼 */}
        <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold font-mono text-[var(--primary)]">
            {job.ticker.slice(0, 2)}
          </span>
        </div>

        {/* 資訊 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{job.ticker}</span>
            <StatusBadge status={job.status} />
          </div>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">{job.date}</p>
        </div>

        {/* 訊號 / 箭頭 */}
        <div className="flex-shrink-0">
          {signalInfo ? (
            <span className={`text-lg font-bold ${signalInfo.color}`}>
              {signalInfo.text}
            </span>
          ) : (
            <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>
    </Link>
  );
}
