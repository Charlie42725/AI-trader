"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 1. 引入 Router
import {
  ShieldCheck, MessageSquare, Globe,
  BarChart3, CheckCircle2, X, RotateCcw, Settings2,
  Users, Layers, Zap, Loader2, Sparkles, Heart, Eye,
  ArrowUpRight // 引入新圖標
} from "lucide-react";
import { STRATEGY_DATABASE, DEFAULT_CONFIGS } from "@/data/strategy-data";
import { Category, Option } from "@/lib/types";

export default function MarketPage() {
  const router = useRouter(); // 2. 初始化 Router
  const [activeTab, setActiveTab] = useState<"config" | "community">("config");
  const [isModalOpen, setIsModalOpen] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);

  const [selections, setSelections] = useState<Record<string, string[]>>(DEFAULT_CONFIGS);
  const [prompts, setPrompts] = useState<Record<string, string>>({
    market: "", social: "", news: "", fundamental: ""
  });

  const [tempSelections, setTempSelections] = useState<string[]>([]);
  const [tempPrompt, setTempPrompt] = useState("");

  const modules = [
    { id: 'market', label: '市場分析', sub: '技術指標', icon: <BarChart3 size={18} />, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'social', label: '社群情緒', sub: '輿論監控', icon: <MessageSquare size={18} />, color: 'text-pink-600 dark:text-pink-400' },
    { id: 'news', label: '新聞分析', sub: '即時事件', icon: <Globe size={18} />, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'fundamental', label: '基本面', sub: '內在價值', icon: <ShieldCheck size={18} />, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const communityStrategies = [
    { id: 1, user: "Whale_Tracker", title: "比特幣大戶背離策略", likes: 1204, tags: ["技術", "鏈上"], active: true },
    { id: 2, user: "Alpha_Seeker", title: "美聯儲新聞情緒對沖", likes: 856, tags: ["新聞", "宏觀"], active: false },
    { id: 3, user: "RideX_Dev", title: "高頻震盪自動套利", likes: 2431, tags: ["AI", "量化"], active: true },
  ];

  const handleOpenModal = (id: string) => {
    const data = STRATEGY_DATABASE[id];
    if (!data) return;
    setIsModalOpen(id);
    setActiveSubTab(data.categories[0].id);
    setTempSelections(selections[id] || []);
    setTempPrompt(prompts[id] || "");
  };

  // 3. 新增進入 Library 的函數
  const handleGoToLibrary = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 防止觸發父層的 Modal 開啟
    router.push(`/market/library/${id}`);
  };

  const handleSave = () => {
    if (!isModalOpen) return;
    setSelections((prev) => ({ ...prev, [isModalOpen]: tempSelections }));
    setPrompts((prev) => ({ ...prev, [isModalOpen]: tempPrompt }));
    setIsModalOpen(null);
  };

  const handleMasterSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsSuccessOpen(true);
      setTimeout(() => setIsSuccessOpen(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#0A0A0A] transition-colors duration-500 pb-36 md:pb-40 text-slate-900 dark:text-slate-100 font-sans">
      <header className="px-4 md:px-6 pt-6 md:pt-12 pb-4 md:pb-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 dark:text-white">策略中心</h1>
            <p className="text-[9px] md:text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest mt-0.5 md:mt-1">V1.0 引擎</p>
          </div>
          {/* 三段式導航控制列 - 全動態伸縮版 */}
<div className="bg-slate-100 dark:bg-white/5 p-1 rounded-2xl flex border border-slate-200 dark:border-white/10 w-fit mx-auto relative h-[48px] gap-1 items-center">
  
  {/* 1. 我的配置 - Tab 選項 */}
  <button
    onClick={() => setActiveTab("config")}
    className={`flex items-center justify-center gap-2 rounded-xl h-full px-3 transition-all duration-300 ease-in-out ${
      activeTab === "config" 
      ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-orange-400" 
      : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
    }`}
  >
    <Layers size={18} className="flex-shrink-0" /> 
    <span className={`text-[11px] font-black whitespace-nowrap overflow-hidden transition-all duration-300 ${
      activeTab === "config" ? "max-w-[80px] opacity-100 ml-1" : "max-w-0 opacity-0"
    }`}>
      我的配置
    </span>
  </button>

  {/* 2. 資料庫 - 跳轉入口 (移除底色、透明伸縮版) */}
<button
  onClick={() => router.push('/market/library/market')}
  className={`flex items-center justify-center gap-2 rounded-xl h-full px-3 transition-all duration-300 ease-in-out ${
    activeTab !== "config" && activeTab !== "community"
      ? "bg-white dark:bg-zinc-800 shadow-sm text-orange-500" // 被選中/激活時的樣式
      : "text-slate-500 hover:text-orange-500 dark:text-slate-400" // 平時樣式
  }`}
>
  <Zap 
    size={18} 
    className={`flex-shrink-0 transition-transform ${
      activeTab !== "config" && activeTab !== "community" ? "fill-orange-500" : ""
    }`} 
  />
  <span className={`text-[11px] font-black italic uppercase tracking-tighter whitespace-nowrap overflow-hidden transition-all duration-300 ${
    activeTab !== "config" && activeTab !== "community" 
      ? "max-w-[80px] opacity-100 ml-1" 
      : "max-w-0 opacity-0"
  }`}>
    資料庫
  </span>
</button>

  {/* 3. 社群 - Tab 選項 */}
  <button
    onClick={() => setActiveTab("community")}
    className={`flex items-center justify-center gap-2 rounded-xl h-full px-3 transition-all duration-300 ease-in-out ${
      activeTab === "community" 
      ? "bg-white dark:bg-zinc-800 shadow-sm text-black dark:text-orange-400" 
      : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
    }`}
  >
    <Users size={18} className="flex-shrink-0" /> 
    <span className={`text-[11px] font-black whitespace-nowrap overflow-hidden transition-all duration-300 ${
      activeTab === "community" ? "max-w-[80px] opacity-100 ml-1" : "max-w-0 opacity-0"
    }`}>
      社群
    </span>
  </button>

</div>
  </div>
</header>

      <div className="p-4 md:p-6 max-w-2xl mx-auto">
        {activeTab === "config" ? (
          <div className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <section className="grid gap-3 md:gap-4">
              {modules.map((m) => (
                <div key={m.id} className="relative group">
                  <button
                    onClick={() => handleOpenModal(m.id)}
                    className="w-full flex items-center justify-between p-4 md:p-6 bg-slate-200/50 dark:bg-zinc-900/50 rounded-2xl md:rounded-[32px] border-4 border-transparent hover:border-black dark:hover:border-orange-500 transition-all text-left active:scale-[0.98] shadow-sm"
                  >
                    <div className="flex items-center gap-3 md:gap-5">
                      <div className={`${m.color} bg-white dark:bg-white/10 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform shadow-sm`}>
                        {m.icon}
                      </div>
                      <div>
                        <h3 className="font-black text-base md:text-lg leading-none text-slate-900 dark:text-white">{m.label}</h3>
                        <p className="text-[9px] md:text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-1 md:mt-2">
                          {selections[m.id]?.length || 0} 個組件已啟用
                        </p>
                      </div>
                    </div>
                    
                    {/* 4. 新增的進入詳細庫存按鈕 */}
                    <div className="flex items-center gap-2">
                        <div 
                          onClick={(e) => handleGoToLibrary(e, m.id)}
                          className="p-2 md:p-3 bg-white dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-white/10 hover:bg-orange-500 hover:text-white transition-all shadow-sm group/btn"
                        >
                            <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </div>
                        <Settings2 className="w-4 h-4 md:w-5 md:h-5 text-slate-400" />
                    </div>
                  </button>
                </div>
              ))}
            </section>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            {communityStrategies.map((s) => (
              <div key={s.id} className="p-4 md:p-6 bg-white dark:bg-zinc-900/50 rounded-2xl md:rounded-[32px] border-2 border-slate-200 dark:border-white/10 hover:border-orange-500/50 transition-colors relative overflow-hidden group shadow-sm">
                {s.active && <div className="absolute top-0 right-0 bg-orange-600 text-[7px] md:text-[8px] font-black text-white px-3 md:px-4 py-0.5 md:py-1 rounded-bl-xl shadow-sm">熱門</div>}
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center font-black text-[9px] md:text-[10px] text-orange-600">
                      {s.user[0]}
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">@{s.user}</span>
                  </div>
                  <button className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Heart size={13} className={s.active ? "fill-red-500 text-red-500" : ""} />
                    <span className="text-[9px] md:text-[10px] font-bold font-mono text-slate-700 dark:text-slate-300">{s.likes}</span>
                  </button>
                </div>
                <h4 className="font-black text-base md:text-lg mb-3 md:mb-4 italic tracking-tight leading-tight text-slate-900 dark:text-white">
                  {s.title}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="flex gap-1.5 md:gap-2">
                    {s.tags.map(t => <span key={t} className="text-[8px] md:text-[9px] bg-slate-100 dark:bg-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-slate-600 dark:text-slate-400 font-black uppercase tracking-tighter">#{t}</span>)}
                  </div>
                  <button className="flex items-center gap-1 text-[9px] md:text-[10px] font-black text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    查看 <Eye size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === "config" && (
        <div className="fixed bottom-24 md:bottom-28 left-0 right-0 px-4 md:px-6 flex justify-center z-[50]">
          <button
            onClick={handleMasterSync}
            disabled={isSyncing}
            className="w-full max-w-2xl bg-black dark:bg-white text-white dark:text-black py-4 md:py-5 rounded-2xl md:rounded-[28px] font-black text-xs md:text-sm uppercase italic tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 border-4 border-white dark:border-black group"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={18} /> : <Zap className="fill-current group-hover:animate-pulse" size={18} />}
            {isSyncing ? "同步中..." : "統整並存入我的分析"}
          </button>
        </div>
      )}

      {/* 配置 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0F0F0F] rounded-t-[32px] md:rounded-[48px] p-5 md:p-8 shadow-2xl border-t-4 md:border-t-8 border-orange-600 max-h-[85vh] md:max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-8 md:zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <div>
                <h2 className="text-xl md:text-3xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  {modules.find(m => m.id === isModalOpen)?.label}
                </h2>
                <div className="flex items-center gap-3 mt-2 md:mt-3">
                    <p className="text-[9px] md:text-[10px] text-orange-600 dark:text-orange-500 font-black tracking-widest">個人化代理設定</p>
                    {/* Modal 內也放一個進入 Library 的連結 */}
                    <button 
                      onClick={(e) => handleGoToLibrary(e, isModalOpen)}
                      className="text-[9px] text-slate-400 hover:text-orange-500 underline font-bold"
                    >
                      開啟高級庫存詳細設定
                    </button>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(null)} className="p-2 md:p-3 bg-slate-100 dark:bg-white/10 rounded-xl md:rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 group transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6 group-hover:text-red-600 text-slate-600 dark:text-white" />
              </button>
            </div>

            <div className="flex gap-1.5 md:gap-2 mb-4 md:mb-6 overflow-x-auto no-scrollbar pb-2">
              {STRATEGY_DATABASE[isModalOpen]?.categories.map((cat: Category) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveSubTab(cat.id)}
                  className={`px-4 py-2 md:px-6 md:py-3 rounded-full text-[10px] md:text-[11px] font-black transition-all border-2 whitespace-nowrap ${
                    activeSubTab === cat.id
                    ? "bg-black text-white border-black dark:bg-orange-500 dark:border-orange-500"
                    : "bg-slate-100 text-slate-600 border-transparent dark:bg-white/5 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2 md:gap-3 mb-4 md:mb-6 max-h-[30vh] md:max-h-[35vh] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
              {STRATEGY_DATABASE[isModalOpen]?.categories
                .find((c: Category) => c.id === activeSubTab)?.options.map((opt: Option) => {
                  const active = tempSelections.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTempSelections((prev: string[]) =>
                        prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id]
                      )}
                      className={`flex items-center justify-between p-3.5 md:p-5 rounded-xl md:rounded-[26px] border-2 transition-all text-left ${
                        active
                        ? "border-black dark:border-orange-500 bg-slate-50 dark:bg-orange-500/10 shadow-[3px_3px_0px_0px_#000] md:shadow-[4px_4px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#f97316] md:dark:shadow-[4px_4px_0px_0px_#f97316]"
                        : "border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${active ? "bg-black dark:bg-orange-500 border-transparent text-white" : "border-slate-400 dark:border-slate-600"}`}>
                          {active && <CheckCircle2 className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                        </div>
                        <div>
                          <span className={`font-black text-xs md:text-sm tracking-tight ${active ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-400"}`}>{opt.label}</span>
                          <p className={`text-[8px] md:text-[9px] font-bold mt-0.5 uppercase tracking-tighter ${active ? "text-slate-600 dark:text-orange-400" : "text-slate-500 dark:text-slate-500"}`}>{opt.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="pt-4 md:pt-6 border-t border-slate-200 dark:border-white/10 mb-4 md:mb-6">
              <label className="text-[9px] md:text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase mb-2 md:mb-3 block tracking-widest">自定義戰術指令 (AI PROMPT)</label>
              <textarea
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                placeholder={STRATEGY_DATABASE[isModalOpen]?.placeholder}
                className="w-full h-20 md:h-28 p-3 md:p-5 bg-slate-100 dark:bg-white/5 rounded-xl md:rounded-[26px] text-[11px] md:text-xs font-bold border-2 border-slate-200 dark:border-transparent focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <button onClick={() => { setTempSelections([]); setTempPrompt(""); }} className="py-3 md:py-4 rounded-xl md:rounded-[22px] border-2 border-slate-300 dark:border-white font-black text-[9px] md:text-[10px] tracking-widest flex items-center justify-center gap-1.5 md:gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white">
                <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> 重置
              </button>
              <button onClick={handleSave} className="py-3 md:py-4 bg-black dark:bg-orange-600 text-white rounded-xl md:rounded-[22px] font-black uppercase text-[9px] md:text-[10px] tracking-widest italic shadow-xl active:scale-95 transition-all">
                儲存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功彈窗 */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSuccessOpen(false)} />
          <div className="relative bg-white dark:bg-[#1A1A1A] p-8 md:p-10 rounded-3xl md:rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-[280px] md:max-w-[320px] w-full animate-in zoom-in-75 duration-500 border border-white/10">
            <div className="relative mb-5 md:mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_10px_40px_rgba(34,197,94,0.5)]">
                <CheckCircle2 size={40} className="text-white md:hidden" />
                <CheckCircle2 size={48} className="text-white hidden md:block" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1.5 md:mb-2 tracking-tighter">同步完成！</h3>
            <p className="text-[10px] md:text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
              戰術指令已成功存入分析頁面
            </p>
            <button
              onClick={() => setIsSuccessOpen(false)}
              className="mt-6 md:mt-8 px-8 md:px-10 py-2.5 md:py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[9px] md:text-[10px] tracking-widest active:scale-90 transition-all shadow-lg"
            >
              好的
            </button>
          </div>
        </div>
      )}
    </div>
  );
}