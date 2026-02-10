"use client";

import {
    UserCircleIcon,
    QuestionMarkCircleIcon,
    ArrowRightOnRectangleIcon,
    ChevronRightIcon,
    BellIcon,
    LanguageIcon,
    ShieldCheckIcon,
    MoonIcon,
    SunIcon,
    CheckIcon,
    SparklesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock User Data
    const user = {
        name: "交易用戶",
        id: "888888",
        plan: "專業版",
        avatar: null, // null will show initials
        stats: {
            analysesThisMonth: 82,
            creditsRemaining: 18,
        }
    };

    const menuGroups = [
        {
            title: "一般設定",
            items: [
                { icon: BellIcon, label: "通知設定", href: "#" },
                {
                    icon: LanguageIcon,
                    label: "語言",
                    value: "繁體中文",
                    href: "#"
                },
            ]
        },
        {
            title: "支援與關於",
            items: [
                { icon: QuestionMarkCircleIcon, label: "幫助中心", href: "#" },
                { icon: ShieldCheckIcon, label: "隱私權與條款", href: "#" },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-32 transition-colors duration-300">
            {/* 1. Header */}
            <header className="container-padding pt-6 pb-4 max-w-2xl mx-auto border-b border-gray-50 dark:border-white/10">
                <h1 className="text-2xl font-black text-black dark:text-white tracking-tight italic uppercase px-4">我的帳戶</h1>
            </header>

            <div className="container-padding max-w-2xl mx-auto px-4 mt-6">

                {/* 2. User Profile Card */}
                <div className="bg-orange-500 rounded-2xl p-6 shadow-lg shadow-orange-100 dark:shadow-none mb-8 relative overflow-hidden group">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-white/10 dark:bg-black/20 border-4 border-white/20 flex items-center justify-center shadow-sm backdrop-blur-sm">
                            <UserCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white leading-tight">{user.name}</h2>
                            <p className="text-orange-100 text-xs font-mono font-medium mt-1">ID: {user.id}</p>
                            <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-black/20 text-white text-[10px] font-bold border border-white/10 backdrop-blur-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                                {user.plan}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">本月分析次數</p>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-black dark:text-white">{user.stats.analysesThisMonth}</span>
                            <span className="text-xs text-gray-400 font-bold mb-1.5">次</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                        <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1">剩餘額度</p>
                        <div className="flex items-end gap-1">
                            <span className="text-2xl font-black text-orange-600">{user.stats.creditsRemaining}</span>
                            <span className="text-xs text-gray-400 font-bold mb-1.5">點</span>
                        </div>
                    </div>
                </div>

                {/* 3.5 Subscription Plans */}
                <div className="mb-8">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">訂閱方案</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {/* Free Plan */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 p-4 flex flex-col">
                            <p className="text-sm font-black text-black dark:text-white">Free</p>
                            <div className="mt-2 mb-3">
                                <span className="text-2xl font-black text-black dark:text-white">免費</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 pt-3 mb-4 flex-1">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">Gemini 模型</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">基本額度</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">基本分析</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-2 rounded-lg text-xs font-bold border border-gray-200 dark:border-white/10 text-gray-400 bg-white dark:bg-white/5 hover:border-gray-300 transition-colors">
                                選擇方案
                            </button>
                        </div>

                        {/* PRO Plan */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 p-4 flex flex-col relative">
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-black tracking-wide">
                                目前方案
                            </div>
                            <p className="text-sm font-black text-black dark:text-white">PRO</p>
                            <div className="mt-2 mb-3">
                                <span className="text-2xl font-black text-black dark:text-white">$99</span>
                                <span className="text-[10px] text-gray-400 font-bold">/月</span>
                            </div>
                            <div className="border-t border-gray-100 dark:border-white/10 pt-3 mb-4 flex-1">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">GPT 模型</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">有限額度</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">進階分析</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">優先處理</span>
                                    </li>
                                </ul>
                            </div>
                            <button disabled className="w-full py-2 rounded-lg text-xs font-bold border border-orange-200 dark:border-orange-500/30 text-orange-400 bg-orange-50 dark:bg-orange-500/10 cursor-not-allowed opacity-60">
                                目前方案
                            </button>
                        </div>

                        {/* PRO MAX Plan */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl border-2 border-orange-500 p-4 flex flex-col relative shadow-sm shadow-orange-100 dark:shadow-none">
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-black tracking-wide">
                                <SparklesIcon className="w-2.5 h-2.5" />
                                推薦
                            </div>
                            <p className="text-sm font-black text-orange-600 dark:text-orange-400">PRO MAX</p>
                            <div className="mt-2 mb-3">
                                <span className="text-2xl font-black text-black dark:text-white">$199</span>
                                <span className="text-[10px] text-gray-400 font-bold">/月</span>
                            </div>
                            <div className="border-t border-orange-200 dark:border-orange-500/20 pt-3 mb-4 flex-1">
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">GPT 模型</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">大量額度</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">無限制分析</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <CheckIcon className="w-3.5 h-3.5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400">最高優先處理</span>
                                    </li>
                                </ul>
                            </div>
                            <button className="w-full py-2 rounded-lg text-xs font-black bg-orange-500 hover:bg-orange-600 text-white transition-colors active:scale-[0.97]">
                                升級方案
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Menu Lists */}
                <div className="space-y-6">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">{group.title}</h3>
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                                {/* Dark Mode Toggle (Insert in First Group) */}
                                {groupIndex === 0 && mounted && (
                                    <button className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 group-hover:border-orange-200 dark:group-hover:border-orange-500/50 transition-colors">
                                                {resolvedTheme === 'dark' ?
                                                    <MoonIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors" /> :
                                                    <SunIcon className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                                                }
                                            </div>
                                            <span className="text-sm font-bold text-black dark:text-white">深色模式</span>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-gray-200 dark:bg-orange-600">
                                            <span className={`${resolvedTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                        </div>
                                    </button>
                                )}

                                {group.items.map((item, i) => (
                                    <Link
                                        key={i}
                                        href={item.href}
                                        className={`flex items-center justify-between p-4 hover:bg-white dark:hover:bg-white/5 transition-colors group ${i < group.items.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 group-hover:border-orange-200 dark:group-hover:border-orange-500/50 transition-colors">
                                                <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors" />
                                            </div>
                                            <span className="text-sm font-bold text-black dark:text-white">{item.label}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {item.value && (
                                                <span className="text-xs text-gray-400 font-bold">{item.value}</span>
                                            )}
                                            <ChevronRightIcon className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-orange-400 transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Logout Button */}
                    <div className="pt-2">
                        <button className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-rose-600 font-bold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:border-rose-200 transition-all active:scale-[0.98]">
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            登出帳戶
                        </button>
                        <p className="text-center text-[10px] text-gray-300 dark:text-gray-600 mt-4 font-mono">v1.0.2 build 20240320</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
