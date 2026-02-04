"use client";

import { useState } from "react";
import { 
  ShieldCheck, MessageSquare, Globe, 
  BarChart3, CheckCircle2, X, RotateCcw, Settings2,
  Users, Layers, Zap, Loader2, Sparkles, Heart, Eye
} from "lucide-react";
import { STRATEGY_DATABASE, DEFAULT_CONFIGS, Category, Option } from "@/data/strategy-data";

export default function MarketPage() {
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
    { id: 'market', label: '市場分析', sub: '技術指標', icon: <BarChart3 />, color: 'text-blue-600 dark:text-blue-400' },
    { id: 'social', label: '社群情緒', sub: '輿論監控', icon: <MessageSquare />, color: 'text-pink-600 dark:text-pink-400' },
    { id: 'news', label: '新聞分析', sub: '即時事件', icon: <Globe />, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'fundamental', label: '基本面', sub: '內在價值', icon: <ShieldCheck />, color: 'text-purple-600 dark:text-purple-400' },
  ];

  const communityStrategies = [
    { id: 1, user: "Whale_Tracker", title: "比特幣大戶背離策略", likes: 1204, tags: ["技術", "鏈上"], active: true },
    { id: 2, user: "Alpha_Seeker", title: "美聯儲新聞情緒對沖", likes: 856, tags: ["新聞", "宏觀"], active: false },
    { id: 3, user: "RideX_Dev", title: "高頻震盪自動套利", likes: 2431, tags: ["AI", "量化"], active: true },
  ];

  const handleOpenModal = (id: string) => {
    if (!STRATEGY_DATABASE[id]) return;
    setIsModalOpen(id);
    setActiveSubTab(STRATEGY_DATABASE[id].categories[0].id);
    setTempSelections(selections[id] || []);
    setTempPrompt(prompts[id] || "");
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
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#0A0A0A] transition-colors duration-500 pb-40 text-slate-900 dark:text-slate-100 font-sans">
      <header className="px-6 pt-12 pb-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tighter">策略中心</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest mt-1">V1.0 引擎</p>
          </div>
          <div className="bg-slate-100 dark:bg-white/10 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-white/5">
            <button
              onClick={() => setActiveTab("config")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === "config" ? "bg-white dark:bg-orange-500 shadow-md text-black dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
            >
              <Layers size={14} /> 我的配置
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeTab === "community" ? "bg-white dark:bg-orange-500 shadow-md text-black dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
            >
              <Users size={14} /> 社群
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto">
        {activeTab === "config" ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <section className="grid gap-4">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleOpenModal(m.id)}
                  className="flex items-center justify-between p-6 bg-slate-200/50 dark:bg-zinc-900/50 rounded-[32px] border-4 border-transparent hover:border-black dark:hover:border-orange-500 transition-all text-left group active:scale-95 shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className={`${m.color} bg-white dark:bg-white/10 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm`}>
                      {m.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-lg leading-none text-slate-900 dark:text-white">{m.label}</h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold mt-2">
                        {selections[m.id]?.length || 0} 個組件已啟用
                      </p>
                    </div>
                  </div>
                  <Settings2 className="w-5 h-5 text-slate-400 group-hover:text-black dark:group-hover:text-orange-500 transition-colors" />
                </button>
              ))}
            </section>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            {communityStrategies.map((s) => (
              <div key={s.id} className="p-6 bg-white dark:bg-zinc-900/50 rounded-[32px] border-2 border-slate-200 dark:border-white/10 hover:border-orange-500/50 transition-colors relative overflow-hidden group shadow-sm">
                {s.active && <div className="absolute top-0 right-0 bg-orange-600 text-[8px] font-black text-white px-4 py-1 rounded-bl-xl shadow-sm">熱門</div>}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center font-black text-[10px] text-orange-600">
                      {s.user[0]}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">@{s.user}</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors">
                    <Heart size={14} className={s.active ? "fill-red-500 text-red-500" : ""} />
                    <span className="text-[10px] font-bold font-mono text-slate-700 dark:text-slate-300">{s.likes}</span>
                  </button>
                </div>
                <h4 className="font-black text-lg mb-4 italic tracking-tight leading-tight text-slate-900 dark:text-white">
                  {s.title}
                </h4>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {s.tags.map(t => <span key={t} className="text-[9px] bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-full text-slate-600 dark:text-slate-400 font-black uppercase tracking-tighter">#{t}</span>)}
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black text-orange-600 dark:text-orange-400 group-hover:translate-x-1 transition-transform">
                    查看 <Eye size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeTab === "config" && (
        <div className="fixed bottom-28 left-0 right-0 px-6 flex justify-center z-[50]">
          <button 
            onClick={handleMasterSync}
            disabled={isSyncing}
            className="w-full max-w-2xl bg-black dark:bg-white text-white dark:text-black py-5 rounded-[28px] font-black uppercase italic tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-4 border-white dark:border-black group"
          >
            {isSyncing ? <Loader2 className="animate-spin" size={20} /> : <Zap className="fill-current group-hover:animate-pulse" size={20} />}
            {isSyncing ? "同步中..." : "統整並存入我的分析"}
          </button>
        </div>
      )}

      {/* 配置 Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0F0F0F] rounded-[48px] p-8 shadow-2xl border-t-8 border-orange-600 max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-black italic text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                  {modules.find(m => m.id === isModalOpen)?.label}
                </h2>
                <p className="text-[10px] text-orange-600 dark:text-orange-500 font-black mt-3 tracking-widest">個人化代理設定</p>
              </div>
              <button onClick={() => setIsModalOpen(null)} className="p-3 bg-slate-100 dark:bg-white/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/40 group transition-colors">
                <X className="w-6 h-6 group-hover:text-red-600 text-slate-600 dark:text-white" />
              </button>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
              {STRATEGY_DATABASE[isModalOpen]?.categories.map((cat: Category) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveSubTab(cat.id)}
                  className={`px-6 py-3 rounded-full text-[11px] font-black transition-all border-2 whitespace-nowrap ${
                    activeSubTab === cat.id 
                    ? "bg-black text-white border-black dark:bg-orange-500 dark:border-orange-500" 
                    : "bg-slate-100 text-slate-600 border-transparent dark:bg-white/5 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
              {STRATEGY_DATABASE[isModalOpen]?.categories
                .find((c: Category) => c.id === activeSubTab)?.options.map((opt: Option) => {
                  const active = tempSelections.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTempSelections((prev: string[]) => 
                        prev.includes(opt.id) ? prev.filter(x => x !== opt.id) : [...prev, opt.id]
                      )}
                      className={`flex items-center justify-between p-5 rounded-[26px] border-2 transition-all text-left ${
                        active 
                        ? "border-black dark:border-orange-500 bg-slate-50 dark:bg-orange-500/10 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#f97316]" 
                        : "border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${active ? "bg-black dark:bg-orange-500 border-transparent text-white" : "border-slate-400 dark:border-slate-600"}`}>
                          {active && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <div>
                          <span className={`font-black text-sm tracking-tight ${active ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-400"}`}>{opt.label}</span>
                          <p className={`text-[9px] font-bold mt-0.5 uppercase tracking-tighter ${active ? "text-slate-600 dark:text-orange-400" : "text-slate-500 dark:text-slate-500"}`}>{opt.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/10 mb-6">
              <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase mb-3 block tracking-widest">自定義戰術指令 (AI PROMPT)</label>
              <textarea
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                placeholder={STRATEGY_DATABASE[isModalOpen]?.placeholder}
                className="w-full h-28 p-5 bg-slate-100 dark:bg-white/5 rounded-[26px] text-xs font-bold border-2 border-slate-200 dark:border-transparent focus:border-orange-500 dark:focus:border-orange-500 outline-none transition-all dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setTempSelections([]); setTempPrompt(""); }} className="py-4 rounded-[22px] border-2 border-slate-300 dark:border-white font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-white">
                <RotateCcw className="w-4 h-4" /> 重置
              </button>
              <button onClick={handleSave} className="py-4 bg-black dark:bg-orange-600 text-white rounded-[22px] font-black uppercase text-[10px] tracking-widest italic shadow-xl active:scale-95 transition-all">
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
          <div className="relative bg-white dark:bg-[#1A1A1A] p-10 rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-[320px] w-full animate-in zoom-in-75 cubic-bezier(0.34, 1.56, 0.64, 1) duration-500 border border-white/10">
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-[0_10px_40px_rgba(34,197,94,0.5)]">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">同步完成！</h3>
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
              戰術指令已成功存入分析頁面
            </p>
            <button
              onClick={() => setIsSuccessOpen(false)}
              className="mt-8 px-10 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[10px] tracking-widest active:scale-90 transition-all shadow-lg"
            >
              好的
            </button>
          </div>
        </div>
      )}
    </div>
  );
}