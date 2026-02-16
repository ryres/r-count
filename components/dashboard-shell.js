"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
    Users,
    Database,
    LogOut,
    LayoutDashboard,
    Menu,
    X,
    Calculator,
    Upload,
    BarChart3,
    User as UserIcon,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Toaster } from "@/components/ui/custom-toaster";

export function DashboardShell({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userRole, setUserRole] = useState("user");
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
        const role = sessionStorage.getItem("userRole") || "user";
        setUserRole(role);
    }, []);

    if (!isMounted) return null;

    const menuItems = [
        { name: "Overview", icon: LayoutDashboard, path: "/dashboard", role: ["user", "admin"] },
        { name: "Pengguna", icon: Users, path: "/dashboard/pengguna", role: ["admin"] },
        {
            name: "Data",
            icon: Database,
            path: "/dashboard/data",
            subItems: [
                { name: "Hitung Data", icon: Calculator, path: "/dashboard/data/hitung" },
                { name: "Upload Data", icon: Upload, path: "/dashboard/data/upload" },
            ]
        },
    ];

    const handleLogout = () => {
        sessionStorage.removeItem("userRole");
        router.push("/login");
    };

    const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Sidebar Overlay (Mobile) */}
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 bg-card",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-8 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                        <Link href="/" className="flex items-center gap-3 group/logo">
                            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/30 group-hover/logo:scale-110 transition-transform">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">R-COUNT</span>
                        </Link>
                    </div>

                    {/* User Profile */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-800/20">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center border-2 border-indigo-500/20 shadow-inner">
                                <UserIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-slate-900 dark:text-white truncate">Researcher Pro</p>
                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{userRole}</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                        {menuItems.map((item) => (
                            <div key={item.path} className="space-y-1">
                                <Link href={item.path}>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3 h-12 font-bold transition-all px-4 rounded-xl",
                                            isActive(item.path)
                                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:text-white"
                                                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5", isActive(item.path) ? "text-white" : "opacity-60")} />
                                        {item.name}
                                        {item.subItems && <ChevronRight className={cn("h-3 w-3 ml-auto opacity-40 transition-transform", isActive(item.path) && "rotate-90")} />}
                                    </Button>
                                </Link>

                                {item.subItems && isActive(item.path) && (
                                    <div className="mt-1 ml-4 border-l-2 border-slate-100 dark:border-slate-800 pl-4 space-y-1 flex flex-col">
                                        {item.subItems.map((sub) => (
                                            <Link key={sub.path} href={sub.path}>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start h-10 text-xs font-bold rounded-lg px-3",
                                                        pathname === sub.path ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                    )}
                                                >
                                                    <sub.icon className="h-3.5 w-3.5 mr-2 opacity-60" />
                                                    {sub.name}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between px-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Live</span>
                            </div>
                            <ThemeToggle />
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-3 h-12 font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl px-4 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all font-inter"
                        >
                            <LogOut className="h-5 w-5" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header Mobile */}
                <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-indigo-600" />
                        <span className="text-xl font-black tracking-tighter">R-COUNT</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <X /> : <Menu />}
                    </Button>
                </header>

                {/* Content Page */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-10 bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Dynamic Page Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                            <div className="space-y-1">
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                    {pathname.split('/').pop().charAt(0).toUpperCase() + pathname.split('/').pop().slice(1) || "Dashboard"}
                                </h1>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                                    <ChevronRight className="h-3 w-3" /> Dashboard / {pathname.split('/').slice(2).join(' / ')}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 px-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[9px] font-black uppercase text-slate-400">Terakhir Update</p>
                                    <p className="text-[10px] font-bold">Baru saja</p>
                                </div>
                                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block mx-1" />
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">AZ</div>
                                </div>
                            </div>
                        </div>

                        {/* The Page Content */}
                        {children}
                    </div>
                </main>
            </div>

            {/* Toaster for global notifications */}
            <Toaster />
        </div>
    );
}
