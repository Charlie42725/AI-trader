"use client";

import { useState } from "react";
import { Plus, Wallet, Zap, ChevronRight, Lock, Globe } from "lucide-react";

export default function WalletPage() {
  const [selectedAsset] = useState("BTC");

  const assets = [
    { id: "1", ticker: "BTC", name: "比特幣", balance: "0.4215", value: "27,058", change: "+2.4%" },
    { id: "2", ticker: "NVDA", name: "輝達", balance: "12.00", value: "1,542", change: "-1.2%" },
  ];

  return (
    <div className="relative min-h-screen bg-white text-black pb-32">
      
      {/* 核心內容區 (被模糊) */}
      <div className="filter blur-md pointer-events-none select-none">
        {/* 淺色餘額呈現區 */}
        <header className="pt-12 pb-10 px-6 bg-zinc-50 border-b border-zinc-100">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2 text-center">總資產淨值</p>
          <h1 className="text-6xl font-black italic tracking-tighter text-black text-center">$33,800.42</h1>
        </header>

        <div className="p-6">
          {/* 下單控制台 */}
          <section className="bg-black rounded-[35px] p-7 text-white mb-10 shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2 bg-zinc-800/50 px-4 py-1.5 rounded-full border border-zinc-700">
                <Zap size={14} className="text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">快速交易</span>
              </div>
              <Wallet size={20} className="text-zinc-500" />
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
                <span className="text-5xl font-black italic text-zinc-800">0.00</span>
                <div className="bg-white text-black px-4 py-2 rounded-2xl font-black italic text-sm">{selectedAsset}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="py-5 bg-white text-black rounded-[20px] font-black italic text-center text-lg">買入</div>
                <div className="py-5 bg-zinc-900 text-white rounded-[20px] font-black italic text-center text-lg border border-zinc-800">賣出</div>
              </div>
            </div>
          </section>

          {/* 資產列表 */}
          <section>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">資產組合</h3>
            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-5 border border-zinc-100 rounded-[28px] bg-zinc-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-xs shadow-sm">{asset.ticker}</div>
                    <div>
                      <div className="font-black text-sm text-black">{asset.name}</div>
                      <div className="text-[10px] font-bold text-zinc-400">{asset.balance} {asset.ticker}</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <div className="font-black text-sm text-black">${asset.value}</div>
                      <div className="text-[10px] font-black text-orange-500">{asset.change}</div>
                    </div>
                    <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center"><Plus size={18} /></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 鎖定層 */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-white/30 backdrop-blur-[3px]">
        <div className="w-20 h-20 bg-black rounded-[28px] flex items-center justify-center shadow-2xl mb-6">
          <Globe className="text-orange-500 animate-pulse" size={32} />
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter mb-2 text-black">
          全球交易所連動
        </h2>
        <p className="text-sm font-bold text-zinc-500 mb-8 max-w-[240px] leading-relaxed">
          正在對接各大主流平台，<br />全方位資產調度功能即將啟用。
        </p>
        <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-zinc-200 shadow-sm">
          <Lock size={14} className="text-zinc-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">即將上線</span>
        </div>
      </div>

    </div>
  );
}