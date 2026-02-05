"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { STRATEGY_DATABASE } from '@/data/strategy-data';
import { Option } from '@/lib/types';
import { ArrowLeft, ShieldAlert, Zap, Save, Trash2, Cpu, Activity } from 'lucide-react';

export default function LibraryPage({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const categoryId = resolvedParams.category;
  const categoryData = STRATEGY_DATABASE[categoryId];
  
  const [activeOptionId, setActiveOptionId] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, any>>({});

  useEffect(() => {
    const saved = localStorage.getItem(`ridex_config_${categoryId}`);
    if (saved) {
      try {
        setSelections(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse config", e);
      }
    }
  }, [categoryId]);

  const activeOption = categoryData?.categories
    .flatMap(c => c.options)
    .find(o => o.id === activeOptionId);

  const handleParamChange = (optionId: string, key: string, value: any, type: string) => {
    const processedValue = type === 'number' ? parseFloat(value) : value;
    setSelections(prev => ({
      ...prev,
      [optionId]: {
        ...(prev[optionId] || {}),
        [key]: processedValue
      }
    }));
  };

  const handleRemoveModule = (optionId: string) => {
    const newSelections = { ...selections };
    delete newSelections[optionId];
    setSelections(newSelections);
  };

  const handleSave = () => {
    localStorage.setItem(`ridex_config_${categoryId}`, JSON.stringify(selections));
    router.push('/market');
  };

  if (!categoryData) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-orange-500 font-black">
        <ShieldAlert size={48} className="mb-4" />
        <p className="tracking-tighter text-2xl uppercase">Category_Not_Found: {categoryId}</p>
        <button onClick={() => router.back()} className="mt-6 text-white underline text-xs">BACK_TO_SAFETY</button>
      </div>
    );
  }

  return (
  <div className="flex h-screen bg-[#0A0A0A] text-slate-100 font-sans overflow-hidden">
    
    {/* 左側：指標導航 - 手機端隱藏 (lg:flex) */}
    <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col bg-black/40 backdrop-blur-xl z-20">
      {/* ... 原本導航代碼 ... */}
    </aside>

    {/* 中間：主配置區 - 自動填滿空間 */}
    <main className="flex-1 bg-[#050505] p-6 md:p-12 lg:p-24 overflow-y-auto relative z-10 custom-scrollbar">
      {/* 增加一個手機版返回按鈕，因為左側欄不見了 */}
      <button onClick={() => router.back()} className="lg:hidden mb-6 text-slate-500">
        <ArrowLeft size={24} />
      </button>

      {activeOption ? (
        <div className="max-w-full lg:max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
           {/* ... 原本配置內容 ... */}
           <h2 className="text-4xl md:text-7xl font-black italic uppercase text-white tracking-tighter mb-6">
            {activeOption.label}
          </h2>
          {/* ... */}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center opacity-20">
          <Zap size={64} />
          <p className="mt-4 font-black italic uppercase tracking-widest text-center">請選擇模組</p>
        </div>
      )}
    </main>

    {/* 右側：摘要欄 - 在手機端改為浮動或隱藏，這裡先設定為 lg:flex */}
    <aside className="hidden xl:flex w-80 border-l border-white/5 bg-black/80 backdrop-blur-3xl p-8 flex-col z-20">
       {/* ... 原本摘要代碼 ... */}
    </aside>

    {/* 手機版底部保存按鈕 (當 activeOption 存在時顯示) */}
    {activeOption && (
      <div className="lg:hidden fixed bottom-20 left-0 right-0 p-4 z-30">
        <button
          onClick={handleSave}
          className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black italic uppercase shadow-lg"
        >
          保存配置
        </button>
      </div>
    )}
  </div>
);
}