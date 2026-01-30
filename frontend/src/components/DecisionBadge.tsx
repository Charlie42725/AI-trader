const config: Record<string, { bg: string; text: string; label: string }> = {
  BUY: {
    bg: "bg-[var(--success)]/20",
    text: "text-[var(--success)]",
    label: "買入",
  },
  SELL: {
    bg: "bg-[var(--danger)]/20",
    text: "text-[var(--danger)]",
    label: "賣出",
  },
  HOLD: {
    bg: "bg-[var(--warning)]/20",
    text: "text-[var(--warning)]",
    label: "持有",
  },
};

export default function DecisionBadge({ signal }: { signal: string }) {
  const key = signal.toUpperCase().trim();
  const c = config[key] ?? {
    bg: "bg-[var(--bg-elevated)]",
    text: "text-[var(--text-muted)]",
    label: key,
  };

  return (
    <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl ${c.bg}`}>
      <svg className={`w-8 h-8 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {key === "BUY" && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        )}
        {key === "SELL" && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
        )}
        {key === "HOLD" && (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14" />
        )}
      </svg>
      <div>
        <p className={`text-2xl font-bold ${c.text}`}>{c.label}</p>
        <p className="text-xs text-[var(--text-muted)]">交易訊號</p>
      </div>
    </div>
  );
}
