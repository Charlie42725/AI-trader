"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAnalysis } from "@/lib/api";
import { AnalystType } from "@/lib/types";

const analysts: { value: AnalystType; label: string; desc: string }[] = [
  { value: "market", label: "市場分析", desc: "技術指標" },
  { value: "social", label: "社群情緒", desc: "輿情分析" },
  { value: "news", label: "新聞分析", desc: "即時新聞" },
  { value: "fundamentals", label: "基本面", desc: "財務數據" },
];

const depthOptions = [
  { value: 1, label: "快速", desc: "基礎" },
  { value: 2, label: "標準", desc: "均衡" },
  { value: 3, label: "深度", desc: "完整" },
];

export default function NewAnalysisPage() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selected, setSelected] = useState<AnalystType[]>(["market", "social", "news", "fundamentals"]);
  const [depth, setDepth] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (a: AnalystType) => {
    setSelected((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const submit = async () => {
    if (!ticker.trim() || selected.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const { id } = await startAnalysis({
        ticker: ticker.trim().toUpperCase(),
        date,
        analysts: selected,
        max_debate_rounds: depth,
        max_risk_discuss_rounds: depth,
      });
      router.push(`/analysis/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤");
      setLoading(false);
    }
  };

  return (
    <div className="px-4 pt-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">新增分析</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">設定分析參數</p>
      </header>

      <div className="space-y-6">
        {/* 股票代碼 */}
        <div>
          <label className="block text-sm font-medium mb-2">股票代碼</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="例如：NVDA"
            className="w-full px-4 py-3 font-mono text-lg uppercase"
          />
        </div>

        {/* 日期 */}
        <div>
          <label className="block text-sm font-medium mb-2">分析日期</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3"
          />
        </div>

        {/* 分析團隊 */}
        <div>
          <label className="block text-sm font-medium mb-2">分析團隊</label>
          <div className="grid grid-cols-2 gap-2">
            {analysts.map((a) => {
              const active = selected.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggle(a.value)}
                  className={`p-3 rounded-xl text-left transition-colors ${
                    active
                      ? "bg-[var(--primary)]/20 border border-[var(--primary)]/50"
                      : "bg-[var(--bg-surface)] border border-[var(--border)]"
                  }`}
                >
                  <p className={`font-medium text-sm ${active ? "text-[var(--primary)]" : ""}`}>
                    {a.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{a.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 研究深度 */}
        <div>
          <label className="block text-sm font-medium mb-2">研究深度</label>
          <div className="grid grid-cols-3 gap-2">
            {depthOptions.map((d) => {
              const active = depth === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDepth(d.value)}
                  className={`p-3 rounded-xl text-center transition-colors ${
                    active
                      ? "bg-[var(--primary)]/20 border border-[var(--primary)]/50"
                      : "bg-[var(--bg-surface)] border border-[var(--border)]"
                  }`}
                >
                  <p className={`font-medium text-sm ${active ? "text-[var(--primary)]" : ""}`}>
                    {d.label}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{d.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="p-3 rounded-xl bg-[var(--danger)]/20 text-[var(--danger)] text-sm">
            {error}
          </div>
        )}

        {/* 提交按鈕 */}
        <button
          onClick={submit}
          disabled={loading || !ticker.trim() || selected.length === 0}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              啟動中...
            </>
          ) : (
            "啟動 AI 分析"
          )}
        </button>
      </div>
    </div>
  );
}
