"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAnalysis } from "@/lib/api";
import { AnalystType } from "@/lib/types";

const analysts: { value: AnalystType; label: string; desc: string; icon: string }[] = [
  { value: "market", label: "市場分析", desc: "技術指標", icon: "📈" },
  { value: "social", label: "社群情緒", desc: "輿情分析", icon: "💬" },
  { value: "news", label: "新聞分析", desc: "即時新聞", icon: "🗞️" },
  { value: "fundamentals", label: "基本面", desc: "財務數據", icon: "📊" },
];

const depthOptions = [
  { value: 1, label: "快速", desc: "基礎掃描" },
  { value: 2, label: "標準", desc: "平衡權重" },
  { value: 3, label: "深度", desc: "完整辯論" },
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
    <div className="min-h-screen bg-[#FAFAFA] pb-24 text-black selection:bg-orange-100">
      {/* 頂部極細裝飾線 - 增加精緻感 */}
      <div className="h-[2px] bg-gray-100 w-full flex">
        <div className="w-1/3 h-full bg-orange-500" />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 pt-16 md:pt-20">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] flex-1 bg-gray-200" />
          </div>
          <h1 className="text-3xl md:text-7xl font-black text-black italic uppercase tracking-tighter leading-[0.85]">
            開始你的分析
          </h1>
          <p className="text-gray-400 font-bold text-sm mt-6 tracking-tight uppercase">
            部屬並設置你的分析工具
          </p>
        </header>

        <div className="space-y-16">
          {/* 第一區塊：輸入框 - 已修改為 gray-200 (水泥灰) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="group">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-orange-500">
                輸入股票代號或投資標的
              </label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="NVDA"
                className="w-full bg-transparent border-b-4 border-gray-300 focus:border-orange-500 transition-all px-1 py-4 font-mono text-4xl font-black uppercase outline-none placeholder:text-gray-200"
              />
            </div>

            <div className="group">
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1 transition-colors group-focus-within:text-orange-500">
                選擇研究日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent border-b-4 border-gray-200 focus:border-orange-500 transition-all px-1 py-4 font-mono text-2xl font-bold outline-none"
              />
            </div>
          </div>

          {/* 第二區塊：分析團隊 */}
          <div>
            <label className="block text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6 px-1">
              設置並選取您的團隊以及分析項目
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        ? "bg-white border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1"
                        : "bg-white border-gray-100 text-gray-300 hover:border-gray-300 grayscale"
                      }
                    `}
                  >
                    {active && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
                    <div className="text-3xl mb-5">{a.icon}</div>
                    <p className={`font-black text-base tracking-tighter ${active ? "text-black" : "text-gray-300"}`}>
                      {a.label}
                    </p>
                    <p className={`text-[10px] font-bold mt-1 ${active ? "text-orange-500" : "text-gray-200"}`}>
                      {a.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 第三區塊：研究深度 */}
          <div>
            <label className="block text-[11px] font-black text-orange-500 uppercase tracking-widest mb-6 px-1">
              Scanning Intensity
            </label>
            <div className="flex flex-wrap gap-3">
              {depthOptions.map((d) => {
                const active = depth === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDepth(d.value)}
                    className={`
                      px-8 py-4 rounded-full transition-all border-2 font-black text-sm uppercase italic tracking-wider
                      ${active
                        ? "bg-orange-500 border-orange-500 text-white shadow-[0_8px_20px_-6px_rgba(249,115,22,0.4)]"
                        : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                      }
                    `}
                  >
                    {d.label} <span className="ml-2 text-[10px] opacity-70 font-bold not-italic">{d.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 錯誤處理 */}
          {error && (
            <div className="p-5 rounded-2xl bg-white border-2 border-red-500 text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-3">
              <span className="bg-red-500 text-white px-1">Error</span>
              {error}
            </div>
          )}

          {/* 提交按鈕 */}
          <div className="pt-8">
            <button
              onClick={submit}
              disabled={loading || !ticker.trim() || selected.length === 0}
              className={`
                group relative w-full md:w-auto md:min-w-[320px] h-20 rounded-2xl font-black text-xl tracking-[0.2em] uppercase italic transition-all duration-300
                ${loading || !ticker.trim() || selected.length === 0
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed border-2 border-gray-100"
                  : "bg-black text-white hover:bg-orange-500 hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.3)] active:scale-95"
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