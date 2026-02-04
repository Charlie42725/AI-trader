"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAnalysis } from "@/lib/api";
import { AnalystType } from "@/lib/types";

// 擴充數據來源資訊，但不改動原本的 label 和 desc
const analysts: { value: AnalystType; label: string; desc: string; icon: string; sources: string[] }[] = [
  { value: "market", label: "市場分析", desc: "技術指標", icon: "📈", sources: ["Yahoo Finance", "Binance"] },
  { value: "social", label: "社群情緒", desc: "輿情分析", icon: "💬", sources: ["X", "Reddit"] },
  { value: "news", label: "新聞分析", desc: "即時新聞", icon: "🗞️", sources: ["Google News", "CryptoPanic"] },
  { value: "fundamentals", label: "基本面", desc: "財務數據", icon: "📊", sources: ["SEC Filings", "CoinGecko"] },
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
  const [isLiveMode, setIsLiveMode] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 設置日期範圍限制：最遠追溯 30 天
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
      });
      router.push(`/analysis/${id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "發生錯誤");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black pb-32 text-black dark:text-white selection:bg-orange-100 dark:selection:bg-orange-900 transition-colors duration-300">
      {/* 頂部極細裝飾線 */}
      <div className="h-[2px] bg-gray-100 dark:bg-white/5 w-full flex">
        <div className="w-1/3 h-full bg-orange-500" />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-20">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10" />
          </div>
          <h1 className="text-3xl md:text-7xl font-black text-black dark:text-white italic uppercase tracking-tighter leading-[0.85]">
            開始你的分析
          </h1>
          <p className="text-gray-400 font-bold text-sm mt-6 tracking-tight uppercase">
            部屬並設置你的分析工具
          </p>
        </header>

        <div className="space-y-16">
          {/* 第一區塊：輸入框 */}
          <div className="space-y-6">
            <div className="group">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-orange-500">
                輸入股票代號或投資標的
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  placeholder="NVDA"
                  className="w-full bg-transparent !border-b-4 !border-gray-900 dark:!border-white/50 focus:!border-orange-500 dark:focus:!border-orange-500 transition-all px-1 py-4 font-mono text-xl md:text-4xl font-black uppercase outline-none placeholder:text-gray-800 dark:placeholder:text-gray-600 dark:text-white"
                />
                {ticker && (
                  <div className="absolute right-0 bottom-4">
                    <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded">LIVE_TRACKING</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 px-1">
              {hotTickers.map(t => (
                <button 
                  key={t}
                  type="button"
                  onClick={() => setTicker(t)}
                  className="px-3 py-1 border-2 border-gray-100 dark:border-white/10 rounded-full text-[10px] font-black hover:border-black dark:hover:border-white transition-colors"
                >
                  ${t}
                </button>
              ))}
            </div>
          </div>

          {/* 第二區塊：模式切換與日期 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1 transition-colors group-focus-within:text-orange-500">
                分析模式切換
              </label>
              <div className="flex p-1 bg-gray-100 dark:bg-white/5 rounded-2xl border-2 border-gray-900 dark:border-white/20 transition-all">
                <button 
                  type="button"
                  onClick={() => setIsLiveMode(true)}
                  className={`flex-1 py-4 rounded-xl font-black text-sm transition-all duration-200 ${
                    isLiveMode 
                    ? 'bg-orange-500 text-white shadow-inner' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  LIVE 實時預測
                </button>
                <button 
                  type="button"
                  onClick={() => setIsLiveMode(false)}
                  className={`flex-1 py-4 rounded-xl font-black text-sm transition-all duration-200 ${
                    !isLiveMode 
                    ? 'bg-orange-500 text-white shadow-inner' 
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                  }`}
                >
                  HISTORY 歷史回測
                </button>
              </div>
            </div>

            <div className={`group transition-all duration-500 ${isLiveMode ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 px-1 transition-colors group-focus-within:text-orange-500">
                選擇研究日期 (限制 30 天內)
              </label>
              <input
                type="date"
                value={date}
                min={minDateStr}
                max={maxDateStr}
                disabled={isLiveMode}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent !border-b-4 !border-gray-900 dark:!border-white/50 focus:!border-orange-500 transition-all px-1 py-4 font-mono text-xl md:text-4xl font-black uppercase outline-none text-black dark:text-white"
              />
            </div>
          </div>

          {/* 第三區塊：分析團隊 */}
          <div>
            <label className="block text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6 px-1">
              設置並選取您的團隊以及分析項目
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {analysts.map((a) => {
                const active = selected.includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggle(a.value)}
                    className={`
                      relative p-6 rounded-2xl text-left transition-all duration-300 border-2
                      ${active
                        ? "bg-white dark:bg-gray-800 border-black dark:border-gray-600 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] -translate-y-1 -translate-x-1"
                        : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-300 dark:text-gray-600 hover:border-gray-300 dark:hover:border-white/30 grayscale"
                      }
                    `}
                  >
                    {active && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    <div className="text-3xl mb-5">{a.icon}</div>
                    <p className={`font-black text-base tracking-tighter ${active ? "text-black dark:text-white" : "text-gray-300 dark:text-gray-600"}`}>
                      {a.label}
                    </p>
                    <p className={`text-[10px] font-bold mt-1 ${active ? "text-orange-500" : "text-gray-200 dark:text-gray-700"}`}>
                      {a.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1">
                      {a.sources.map(s => (
                        <span key={s} className={`text-[7px] px-1 border rounded ${active ? 'border-orange-500/30 text-orange-500' : 'border-gray-100 dark:border-zinc-800'}`}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 第四區塊：研究深度 */}
          <div className="w-full">
            <label className="block text-[20px] font-black text-orange-500 uppercase tracking-widest mb-4 px-1">
              分析方式
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {depthOptions.map((d) => {
                const active = depth === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDepth(d.value)}
                    className={`
                      w-full py-3 rounded-xl transition-all border-2 font-black text-lg md:text-[20px] uppercase italic tracking-tighter
                      flex flex-col items-center justify-center gap-1
                      ${active
                        ? "bg-orange-500 border-orange-500 text-white shadow-[0_8px-20px_-6px_rgba(249,115,22,0.4)]"
                        : "bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-400 dark:text-gray-600 hover:border-gray-200 dark:hover:border-white/30"
                      }
                    `}
                  >
                    <span>{d.label}</span>
                    <span className={`text-[15px] opacity-80 font-bold not-italic leading-none ${active ? "text-white" : "text-gray-400"}`}>
                      {d.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border-2 border-red-500 text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <span className="bg-red-500 text-white px-1">Error</span>
              {error}
            </div>
          )}

          <div className="pt-8">
            <button
              onClick={submit}
              disabled={loading || !ticker.trim() || selected.length === 0}
              className={`
                group relative w-full md:w-auto md:min-w-[320px] h-20 rounded-2xl font-black text-xl tracking-[0.2em] uppercase italic transition-all duration-300
                ${loading || !ticker.trim() || selected.length === 0
                  ? "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed border-2 border-gray-200 dark:border-white/5"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] active:scale-95"
                }
              `}
            >
              <div className="flex items-center justify-center gap-4">
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>開始分析</span>
                    <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
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