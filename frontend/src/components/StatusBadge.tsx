import { JobStatus } from "@/lib/types";

const config: Record<JobStatus, { bg: string; text: string; label: string }> = {
  pending: {
    bg: "bg-[var(--bg-elevated)]",
    text: "text-[var(--text-muted)]",
    label: "等待中",
  },
  running: {
    bg: "bg-[var(--primary)]/20",
    text: "text-[var(--primary)]",
    label: "分析中",
  },
  completed: {
    bg: "bg-[var(--success)]/20",
    text: "text-[var(--success)]",
    label: "完成",
  },
  failed: {
    bg: "bg-[var(--danger)]/20",
    text: "text-[var(--danger)]",
    label: "失敗",
  },
};

export default function StatusBadge({ status }: { status: JobStatus }) {
  const c = config[status];

  return (
    <span className={`badge ${c.bg} ${c.text}`}>
      {status === "running" && (
        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-current animate-pulse" />
      )}
      {c.label}
    </span>
  );
}
