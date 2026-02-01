"use client";

import { useState } from "react";
import { 
  ChevronRight, Users, Settings2, ShieldCheck, TrendingUp, 
  MessageSquare, Globe, BarChart3, CheckCircle2, X 
} from "lucide-react";

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState("config"); // config, community
  const [marketType, setMarketType] = useState("crypto"); // tw, us, crypto
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);

  // 模擬詳細設定狀態
  const [configs, setConfigs] = useState({
    market: ["RSI 強弱", "MACD 趨勢"],
    social: ["X (Twitter)", "Reddit"],
    news: ["路透社", "幣圈日報"],
    fundamental: ["市值分析"]
  });

  const modules = [
    { id: 'market', label: '市場分析', sub: '技術指標與趨勢', icon: <BarChart3 />, color: 'text-blue-500' },
    { id: 'social', label: '社群情緒', sub: '輿論與熱度監控', icon: <MessageSquare />, color: 'text-pink-500' },
    { id: 'news', label: '新聞分析', sub: '即時事件與政策', icon: <Globe />, color: 'text-emerald-500' },
    { id: 'fundamental', label: '基本面', sub: '財務與內在價值', icon: <ShieldCheck />, color: 'text-purple-500' },
  ];

  return (
    <div className="app-container bg-[#FAFAFA] min-h-screen pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-gray-100">
        <h1 className="text-2xl font-black italic tracking-tighter text-black">STRATEGY HUB</h1>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">策略工坊 & 社群廣塲</p>
      </header>

      {/* Tabs */}
      <div className="flex px-6 bg-white border-b border-gray-100">
        <button 
          onClick={() => setActiveTab("config")}
          className={`py-4 px-4 text-sm font-black transition-all border-b-2 ${activeTab === "config" ? "border-orange-500 text-black" : "border-transparent text-gray-400"}`}
        >
          自訂配置
        </button>
        <button 
          onClick={() => setActiveTab("community")}
          className={`py-4 px-4 text-sm font-black transition-all border-b-2 ${activeTab === "community" ? "border-orange-500 text-black" : "border-transparent text-gray-400"}`}
        >
          專家社群
        </button>
      </div>

      <div className="p-6">
        {activeTab === "config" ? (
          /* 自訂配置分頁：兩步驟進化版 */
          <div className="space-y-8 animate-in">
            {/* Step 1: 標的選擇 */}
            <section>
              <label className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-4 block">Step 1. 選擇投資領域</label>
              <div className="grid grid-cols-3 gap-2">
                {["台股", "美股", "虛擬貨幣"].map((t, i) => {
                  const types = ["tw", "us", "crypto"];
                  const active = marketType === types[i];
                  return (
                    <button 
                      key={t}
                      onClick={() => setMarketType(types[i])}
                      className={`py-3 rounded-xl font-black text-sm transition-all border-2 ${
                        active ? "bg-black border-black text-white shadow-lg" : "bg-white border-gray-100 text-gray-400"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2: 模組設定 */}
            <section className="space-y-4">
              <label className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2 block">Step 2. 自定義 Agent 策略</label>
              <div className="grid gap-3">
                {modules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setIsModalOpen(m.id)}
                    className="flex items-center justify-between p-5 bg-white rounded-3xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${m.color} bg-gray-50 p-3 rounded-2xl`}>{m.icon}</div>
                      <div>
                        <h3 className="font-black text-black">{m.label}</h3>
                        <p className="text-[10px] text-gray-400 font-bold">{m.sub}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                        {configs[m.id as keyof typeof configs].length} 項設定
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <button className="w-full py-4 bg-black text-white rounded-2xl font-black italic uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              儲存並套用配置
            </button>
          </div>
        ) : (
          /* 專家社群區：保留原本的高級感 */
          <div className="space-y-4 animate-in">
            {[
              { name: "Crypto Whale", winRate: "82%", followers: "1.2k", strategy: "激進市場優先", tags: ["#HighRisk", "#BTC"] },
              { name: "定投大師", winRate: "65%", followers: "3.8k", strategy: "基本面價值投資", tags: ["#Value", "#LongTerm"] },
              { name: "情緒捕手", winRate: "74%", followers: "850", strategy: "社群情緒權重 80%", tags: ["#Social", "#Meme"] },
            ].map((expert, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-yellow-200 rounded-full flex items-center justify-center text-white font-black">
                      {expert.name[0]}
                    </div>
                    <div>
                      <h3 className="font-black text-black">{expert.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                        <Users className="w-3 h-3" /> {expert.followers} 跟隨者
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-orange-500 uppercase">勝率預測</div>
                    <div className="text-xl font-black italic text-black">{expert.winRate}</div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-bold text-gray-600">使用策略：{expert.strategy}</p>
                  <div className="flex gap-2 mt-2">
                    {expert.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-3 border-2 border-black rounded-xl font-black text-xs uppercase hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                  一鍵複製策略 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 下彈式詳細設定視窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black italic tracking-tighter">
                {modules.find(m => m.id === isModalOpen)?.label} 配置
              </h2>
              <button onClick={() => setIsModalOpen(null)} className="p-2 bg-gray-100 rounded-full">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-3 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
              {/* 這裡之後可根據 ID 渲染不同內容 */}
              {["指標自動權重", "深度情緒過濾", "歷史數據校正", "AI 代理人辯論模式"].map((opt) => (
                <div key={opt} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 active:bg-gray-100 transition-all">
                  <span className="font-bold text-gray-700">{opt}</span>
                  <CheckCircle2 className="text-orange-500 w-5 h-5" />
                </div>
              ))}
            </div>

            <button 
              onClick={() => setIsModalOpen(null)}
              className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest italic"
            >
              確認並更新模組
            </button>
          </div>
        </div>
      )}
    </div>
  );
}