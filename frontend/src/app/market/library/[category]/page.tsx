"use client";

import React, { useState, useEffect, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { STRATEGY_DATABASE } from '@/data/strategy-data';
import { ArrowLeft, ShieldAlert, Zap, Save, Trash2, Cpu, Activity, Settings2, Menu, X, Terminal, CheckCircle2 } from 'lucide-react';

export default function LibraryPage({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const categoryId = resolvedParams.category;
  
  const categoryData = useMemo(() => STRATEGY_DATABASE[categoryId], [categoryId]);
  
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`ridex_config_${categoryId}`);
    if (saved) {
      try {
        setSelections(JSON.parse(saved));
      } catch (e) { console.error("Sync Error:", e); }
    }
  }, [categoryId]);

  const activeOption = useMemo(() => 
    categoryData?.categories.flatMap(c => c.options).find(o => o.id === activeOptionId),
    [categoryData, activeOptionId]
  );

  const handleParamChange = (optionId: string, key: string, value: any, type: string) => {
    const processedValue = type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    setSelections(prev => ({
      ...prev,
      [optionId]: { ...(prev[optionId] || {}), [key]: processedValue }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(`ridex_config_${categoryId}`, JSON.stringify(selections));
      setIsSaving(false);
      router.push('/market');
    }, 600);
  };

  if (!categoryData) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center text-orange-600 font-black">
      <ShieldAlert size={48} className="mb-4 animate-bounce" />
      <p className="tracking-[0.3em] text-base">DATABASE_ERROR</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999] flex h-screen bg-[#FDFDFD] text-black font-sans overflow-hidden">
      
      {/* 背景裝飾網格 - 降低對比確保不干擾黑色文字 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* 1. 左側欄：模組選擇 */}
      <aside className={`
        fixed inset-y-0 left-0 z-[1000] w-72 bg-white border-r border-black/10 transition-transform duration-300 shadow-2xl
        lg:relative lg:translate-x-0 lg:shadow-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full relative z-10">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-black mb-10 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="text-[12px] font-black uppercase tracking-[0.1em]">返回策略中心</span>
          </button>
          
          <div className="mb-8">
            <div className="w-10 h-1.5 bg-orange-500 mb-3 rounded-full" />
            <h1 className="text-2xl font-black italic uppercase tracking-tight leading-none text-black">
              {categoryData.label}
            </h1>
          </div>

          <nav className="flex-1 overflow-y-auto no-scrollbar space-y-8 pb-10">
            {categoryData.categories.map(cat => (
              <div key={cat.id} className="space-y-3">
                {/* 輔助文字優化：改為純黑 60% 透明度 */}
                <h2 className="text-[11px] font-black text-black/60 uppercase tracking-[0.2em] px-2">{cat.label}</h2>
                <div className="space-y-1.5">
                  {cat.options.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => { setActiveOptionId(opt.id); setIsSidebarOpen(false); }}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-xs uppercase tracking-wide transition-all relative group ${
                        activeOptionId === opt.id 
                          ? 'bg-black text-white font-bold shadow-lg' 
                          : 'text-black hover:bg-black/5 font-medium'
                      }`}
                    >
                      {opt.label}
                      {selections[opt.id] && activeOptionId !== opt.id && (
                        <CheckCircle2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* 2. 中間：主編輯區 */}
      <main className="flex-1 overflow-y-auto relative z-10 custom-scrollbar pb-32 lg:pb-12 bg-white lg:bg-transparent">
        {/* 手機版頂部 Header */}
        <div className="lg:hidden flex justify-between items-center p-5 border-b border-black/5 bg-white/95 sticky top-0 backdrop-blur-md z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-black text-white rounded-xl active:scale-90 transition-transform">
            <Menu size={20} />
          </button>
          <span className="font-black italic text-[12px] tracking-[0.2em] uppercase text-black">{categoryData.label}</span>
          <div className="w-10" />
        </div>

        <div className="p-6 md:p-12 lg:p-20 max-w-3xl mx-auto">
          {activeOption ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Terminal size={16} className="text-orange-600" />
                </div>
                <span className="text-orange-600 font-mono text-[11px] tracking-[0.2em] uppercase font-black">System Protocol // Active</span>
              </div>
              
              <h1 className="text-4xl md:text-7xl font-black italic uppercase text-black tracking-tighter mb-6 leading-[1.1] md:leading-[0.9]">
                {activeOption.label}
              </h1>
              
              {/* 輔助文字優化：原本為灰色，現在改為純黑 80% 透明度 */}
              <p className="text-black/80 text-sm md:text-base mb-12 md:mb-16 leading-relaxed font-bold">
                {activeOption.desc}
              </p>

              <div className="space-y-10">
                <div className="flex items-center gap-4">
                  <span className="text-[12px] font-black text-black/30 uppercase tracking-[0.4em] whitespace-nowrap">參數配置區域</span>
                  <div className="w-full h-[1px] bg-black/10" />
                </div>

                <div className="grid gap-8">
                  {activeOption.configSchema?.map(cfg => (
                    <div key={cfg.key} className="group">
                      <div className="flex justify-between items-end mb-2.5 px-1">
                        <label className="text-xs font-black text-black uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">
                          {cfg.label}
                        </label>
                        {/* Type 標籤優化為黑底白字或高對比 */}
                        <span className="font-mono text-[10px] text-white bg-black px-2 py-0.5 rounded uppercase italic">TYPE: {cfg.type}</span>
                      </div>
                      <input
                        type={cfg.type === 'number' ? 'number' : 'text'}
                        placeholder={`預設值: ${cfg.default}`}
                        value={selections[activeOption.id]?.[cfg.key] ?? ''}
                        onChange={(e) => handleParamChange(activeOption.id, cfg.key, e.target.value, cfg.type)}
                        className="w-full bg-white border-2 border-black/5 rounded-2xl p-4 md:p-5 text-black font-mono text-base md:text-lg focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all placeholder:text-black/20 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[65vh] flex flex-col items-center justify-center text-black/10">
              <Zap size={80} className="mb-6 animate-pulse text-black" />
              <p className="font-black italic uppercase text-sm tracking-[0.6em] ml-[0.6em] text-black/20">請從左側選擇模組</p>
            </div>
          )}
        </div>
      </main>

      {/* 3. 右側：戰術面板 (桌面端) */}
      <aside className="hidden xl:flex w-[400px] border-l border-black/5 bg-[#F9F9F9] p-10 flex-col z-20">
        <div className="mb-10 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-black text-orange-600 uppercase italic tracking-widest mb-1">Configuration</h3>
            <p className="text-[10px] text-black font-mono font-bold">LIVE_TACTICS_BUFFER</p>
          </div>
          <Activity size={20} className="text-orange-500 animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pr-2">
          {Object.entries(selections).length > 0 ? (
            Object.entries(selections).map(([id, params]) => (
              <div key={id} className="bg-white border-2 border-black/5 rounded-2xl p-6 shadow-sm hover:border-orange-500/50 transition-all group">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-black rounded uppercase tracking-tighter">已啟用</span>
                  <span className="text-[11px] font-mono text-black font-bold group-hover:text-orange-600 transition-colors">ID: {id.slice(0,8)}</span>
                </div>
                <h4 className="text-[14px] font-black text-black uppercase mb-4 tracking-tight border-b-2 border-black/5 pb-2">{id}</h4>
                <div className="space-y-2.5">
                  {Object.entries(params).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-[11px] font-mono border-b border-black/[0.03] pb-1">
                      <span className="text-black font-medium italic">{k}</span>
                      <span className="text-black font-black bg-black/5 px-2 rounded">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-black/10 rounded-3xl">
              <p className="text-[11px] font-black uppercase tracking-widest text-black/30">尚無配置數據</p>
            </div>
          )}
        </div>

        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="mt-10 bg-black text-white py-6 rounded-2xl font-black italic uppercase text-[13px] tracking-[0.2em] hover:bg-orange-600 active:bg-orange-700 shadow-xl shadow-black/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>DEPLOYING...</span>
            </div>
          ) : (
            <>
              <Save size={18} className="group-hover:rotate-12 transition-transform" />
              <span>DEPLOY_TACTICS</span>
            </>
          )}
        </button>
      </aside>

      {/* 4. 手機版底部保存列 */}
      {activeOption && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-black text-white py-5 rounded-2xl font-black italic uppercase text-sm shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-3 border-2 border-orange-500/20"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Save size={18} className="text-orange-500" /> 保存戰術配置</>
            )}
          </button>
        </div>
      )}

      {/* 手機版遮罩 */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] lg:hidden animate-in fade-in duration-300" 
        />
      )}
    </div>
  );
}