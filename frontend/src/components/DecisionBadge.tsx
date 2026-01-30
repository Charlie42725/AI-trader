const config: Record<string, { bg: string; text: string; label: string; glow: string }> = {
  BUY: {
    bg: "bg-[var(--success)]/20",
    text: "text-[var(--success)]",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]",
    label: "買入",
  },
  SELL: {
    bg: "bg-[var(--danger)]/20",
    text: "text-[var(--danger)]",
    glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
    label: "賣出",
  },
  HOLD: {
    bg: "bg-[var(--warning)]/20",
    text: "text-[var(--warning)]",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
    label: "持有",
  },
};

export default function DecisionBadge({ signal }: { signal: string }) {
  const key = signal?.toUpperCase().trim() || "HOLD";
  const c = config[key] ?? {
    bg: "bg-[var(--bg-elevated)]",
    text: "text-[var(--text-muted)]",
    glow: "",
    label: key,
  };

  return (
    <div className={`
      inline-flex items-center gap-3 md:gap-4
      px-6 py-4 md:px-8 md:py-5
      rounded-2xl md:rounded-3xl
      transition-all duration-500
      ${c.bg} ${c.glow}
      border border-white/5
    `}>
      <div className="relative">
        {/* 呼吸燈效果的小圓點 */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 md:h-3 md:w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.text} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 ${c.bg.split('/')[0]}`}></span>
        </span>

        <svg className={`w-8 h-8 md:w-10 md:h-10 ${c.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <div>
        <p className={`text-2xl md:text-3xl font-black tracking-wider ${c.text}`}>{c.label}</p>
        <p className="text-[10px] md:text-xs text-[var(--text-muted)] font-medium tracking-widest opacity-80">TRADE SIGNAL</p>
      </div>
    </div>
  );
}
