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
    SunIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mock User Data
    const user = {
        name: "Trader User",
        id: "888888",
        plan: "PRO Plan",
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
        <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-24 transition-colors duration-300">
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

                {/* 4. Menu Lists */}
                <div className="space-y-6">
                    {menuGroups.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pl-2">{group.title}</h3>
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden">
                                {/* Dark Mode Toggle (Insert in First Group) */}
                                {groupIndex === 0 && mounted && (
                                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 rounded bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 group-hover:border-orange-200 dark:group-hover:border-orange-500/50 transition-colors">
                                                {theme === 'dark' ?
                                                    <MoonIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-orange-500 transition-colors" /> :
                                                    <SunIcon className="w-5 h-5 text-gray-500 group-hover:text-orange-500 transition-colors" />
                                                }
                                            </div>
                                            <span className="text-sm font-bold text-black dark:text-white">深色模式</span>
                                        </div>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-gray-200 dark:bg-orange-600">
                                            <span className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                        </div>
                                    </div>
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
        </main>
    );
}
