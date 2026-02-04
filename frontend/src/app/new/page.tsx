"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAnalysis } from "@/lib/api";
import { AnalystType, LLMProvider } from "@/lib/types";

const analysts: { value: AnalystType; label: string; desc: string; sources: string[] }[] = [
  { value: "market", label: "市場分析", desc: "技術指標", sources: ["Yahoo Finance", "Binance"] },
  { value: "social", label: "社群情緒", desc: "輿情分析", sources: ["X", "Reddit"] },
  { value: "news", label: "新聞分析", desc: "即時新聞", sources: ["Google News", "CryptoPanic"] },
  { value: "fundamentals", label: "基本面", desc: "財務數據", sources: ["SEC Filings", "CoinGecko"] },
];

const providerOptions: { value: LLMProvider; label: string; desc: string }[] = [
  { value: "openai", label: "OpenAI", desc: "GPT-4o / o4-mini" },
  { value: "google", label: "Gemini", desc: "2.0 Flash (Free)" },
];

const depthOptions = [
  { value: 1, label: "快速", desc: "基礎掃描" },
  { value: 2, label: "標準", desc: "平衡權重" },
  { value: 3, label: "深度", desc: "完整辯論" },
];

const hotTickers = ["NVDA", "TSLA", "AAPL", "BTC", "ETH", "SOL"];

export default function NewAnalysisPage() {
  const router = useRouter();
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selected, setSelected] = useState<AnalystType[]>(["market", "social", "news", "fundamentals"]);
  const [depth, setDepth] = useState(2);
  const [provider, setProvider] = useState<LLMProvider>("google");
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxDateStr = new Date().toISOString().slice(0, 10);
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 30);
  const minDateStr = minDate.toISOString().slice(0, 10);

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
        date: isLiveMode ? maxDateStr : date,
        analysts: selected,
        max_debate_rounds: depth,
        max_risk_discuss_rounds: depth,
        llm_provider: provider,
      });
      router.push(`/analysis/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black pb-28 text-black dark:text-white selection:bg-orange-100 dark:selection:bg-orange-900 transition-colors duration-300">
      {/* 頂部裝飾線 */}
      <div className="h-[2px] bg-gray-100 dark:bg-white/5 w-full flex">
        <div className="w-1/3 h-full bg-orange-500" />
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-8 md:pt-20">
        <header className="mb-8 md:mb-16">
          <div className="flex items-center gap-3 mb-3 md:mb-6">
            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10" />
          </div>
          <h1 className="text-2xl md:text-7xl font-black text-black dark:text-white tracking-tighter leading-[0.85]">
            開始你的分析
          </h1>
          <p className="text-gray-400 font-bold text-xs md:text-sm mt-3 md:mt-6 tracking-tight">
            部屬並設置你的分析工具
          </p>
        </header>

        <div className="space-y-8 md:space-y-16">
          {/* ── 股票代號輸入 ── */}
          <div className="space-y-3 md:space-y-6">
            <div className="group">
              <label className="block text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2 px-1 transition-colors group-focus-within:text-orange-500">
                輸入股票代號或投資標的
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="NVDA"
                  className="w-full bg-transparent !border-b-4 !border-gray-900 dark:!border-white/50 focus:!border-orange-500 dark:focus:!border-orange-500 transition-all px-1 py-3 md:py-4 font-mono text-xl md:text-4xl font-black uppercase outline-none placeholder:text-gray-800 dark:placeholder:text-gray-600 dark:text-white"
                />
                {ticker && (
                  <div className="absolute right-0 bottom-3 md:bottom-4">
                    <span className="text-[9px] md:text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded">即時追蹤</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 md:gap-2 px-1">
              {hotTickers.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTicker(t)}
                  className="px-2.5 py-0.5 md:px-3 md:py-1 border-2 border-gray-100 dark:border-white/10 rounded-full text-[9px] md:text-[10px] font-black hover:border-black dark:hover:border-white transition-colors"
                >
                  ${t}
                </button>
              ))}
            </div>
          </div>

          {/* ── 模式切換 & 日期 ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12">
            <div className="group">
              <label className="block text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 md:mb-4 px-1 transition-colors group-focus-within:text-orange-500">
                分析模式切換
              </label>
              <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-xl md:rounded-2xl border-2 border-gray-900 dark:border-white/20 transition-all">
                <button
                  type="button"
                  onClick={() => setIsLiveMode(true)}
                  className={`flex-1 py-2.5 md:py-4 rounded-lg md:rounded-xl font-black text-xs md:text-sm transition-all duration-200 ${isLiveMode
                    ? 'bg-orange-500 text-white shadow-inner'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                  實時預測
                </button>
                <button
                  type="button"
                  onClick={() => setIsLiveMode(false)}
                  className={`flex-1 py-2.5 md:py-4 rounded-lg md:rounded-xl font-black text-xs md:text-sm transition-all duration-200 ${!isLiveMode
                    ? 'bg-orange-500 text-white shadow-inner'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                    }`}
                >
                  歷史回測
                </button>
              </div>
            </div>

            <div className={`group transition-all duration-500 ${isLiveMode ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
              <label className="block text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 md:mb-4 px-1 transition-colors group-focus-within:text-orange-500">
                選擇研究日期 (限制 30 天內)
              </label>
              <input
                type="date"
                value={date}
                min={minDateStr}
                max={maxDateStr}
                disabled={isLiveMode}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent !border-b-4 !border-gray-900 dark:!border-white/50 focus:!border-orange-500 transition-all px-1 py-2.5 md:py-4 font-mono text-lg md:text-4xl font-black uppercase outline-none text-black dark:text-white"
              />
            </div>
          </div>

          {/* ── 分析團隊 ── */}
          <div>
            <label className="block text-[10px] md:text-[11px] font-black text-orange-500 uppercase tracking-widest mb-3 md:mb-6 px-1">
              選取分析團隊
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {analysts.map((a) => {
                const active = selected.includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggle(a.value)}
                    className={`
                      relative p-3 md:p-6 rounded-xl md:rounded-2xl text-left transition-all duration-300 border-2 flex flex-col justify-center
                      ${active
                        ? "bg-white dark:bg-gray-800 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] md:dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] -translate-y-0.5 -translate-x-0.5 md:-translate-y-1 md:-translate-x-1"
                        : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-600 hover:border-gray-300 dark:hover:border-white/30 grayscale"
                      }
                    `}
                  >
                    {active && <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 animate-pulse" />}

                    <p className={`font-black text-sm md:text-base tracking-tighter ${active ? "text-black dark:text-white" : "text-gray-300 dark:text-gray-600"}`}>
                      {a.label}
                    </p>
                    <p className={`text-[9px] md:text-[10px] font-bold mt-0.5 md:mt-1 ${active ? "text-orange-500" : "text-gray-200 dark:text-gray-700"}`}>
                      {a.desc}
                    </p>
                    <div className="mt-2 md:mt-4 flex flex-wrap gap-1">
                      {a.sources.map(s => (
                        <span key={s} className={`text-[6px] md:text-[7px] px-1 border rounded ${active ? 'border-orange-500/30 text-orange-500' : 'border-gray-100 dark:border-zinc-800'}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── AI 模型 & 分析深度 (並排) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* AI 模型引擎 */}
            <div>
              <label className="block text-[10px] md:text-[11px] font-black text-orange-500 uppercase tracking-widest mb-3 md:mb-4 px-1">
                AI 模型引擎
              </label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {providerOptions.map((p) => {
                  const active = provider === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setProvider(p.value)}
                      className={`
                        relative p-3 md:p-5 rounded-xl md:rounded-2xl text-left transition-all duration-300 border-2
                        ${active
                          ? "bg-white dark:bg-gray-800 border-black dark:border-gray-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] -translate-y-0.5 -translate-x-0.5"
                          : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-600 hover:border-gray-300 dark:hover:border-white/30"
                        }
                      `}
                    >
                      {active && <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-orange-500 animate-pulse" />}
                      <p className={`font-black text-sm md:text-base tracking-tighter ${active ? "text-black dark:text-white" : "text-gray-300 dark:text-gray-600"}`}>
                        {p.label}
                      </p>
                      <p className={`text-[9px] md:text-[10px] font-bold mt-0.5 ${active ? "text-orange-500" : "text-gray-200 dark:text-gray-700"}`}>
                        {p.desc}
                      </p>
                      {p.value === "google" && (
                        <span className={`inline-block mt-1.5 md:mt-2 text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded ${active ? "bg-green-500/10 text-green-500 border border-green-500/30" : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-white/10"}`}>
                          FREE
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 分析深度 */}
            <div>
              <label className="block text-[10px] md:text-[11px] font-black text-orange-500 uppercase tracking-widest mb-3 md:mb-4 px-1">
                分析深度
              </label>
              <div className="grid grid-cols-3 gap-2">
                {depthOptions.map((d) => {
                  const active = depth === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setDepth(d.value)}
                      className={`
                        w-full py-3 md:py-4 rounded-xl transition-all border-2 font-black text-sm md:text-lg uppercase italic tracking-tighter
                        flex flex-col items-center justify-center gap-0.5
                        ${active
                          ? "bg-orange-500 border-orange-500 text-white"
                          : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-600 hover:border-gray-200 dark:hover:border-white/30"
                        }
                      `}
                    >
                      <span>{d.label}</span>
                      <span className={`text-[10px] md:text-xs opacity-80 font-bold not-italic leading-none ${active ? "text-white" : "text-gray-400"}`}>
                        {d.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 md:p-5 rounded-xl md:rounded-2xl bg-white dark:bg-white/5 border-2 border-red-500 text-red-500 text-[10px] md:text-xs font-black flex items-center gap-2 md:gap-3">
              <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-[9px] md:text-xs">錯誤</span>
              {error}
            </div>
          )}

          {/* 送出按鈕 */}
          <div className="pt-2 md:pt-8">
            <button
              onClick={submit}
              disabled={loading || !ticker.trim() || selected.length === 0}
              className={`
                group relative w-full md:w-auto md:min-w-[320px] h-14 md:h-20 rounded-xl md:rounded-2xl font-black text-base md:text-xl tracking-[0.15em] md:tracking-[0.2em] uppercase italic transition-all duration-300
                ${loading || !ticker.trim() || selected.length === 0
                  ? "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed border-2 border-gray-200 dark:border-white/5"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] active:scale-95"
                }
              `}
            >
              <div className="flex items-center justify-center gap-3 md:gap-4">
                {loading ? (
                  <div className="w-5 h-5 md:w-6 md:h-6 border-3 md:border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>開始分析</span>
                    <span className="text-xl md:text-2xl group-hover:translate-x-2 transition-transform">→</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
