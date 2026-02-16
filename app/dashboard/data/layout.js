"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calculator, Upload } from "lucide-react";

export default function DataLayout({ children }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const tabs = [
        { name: "Hitung Data", path: "/dashboard/data/hitung", icon: Calculator },
        { name: "Upload Data", path: "/dashboard/data/upload", icon: Upload },
    ];

    if (!isMounted) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-4 gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-extrabold tracking-tight">Eksplorasi Data</h2>
                    <p className="text-muted-foreground italic">Lakukan pengolahan dan perhitungan data menggunakan algoritma hybrid.</p>
                </div>

                <div className="flex p-1 bg-muted/50 rounded-lg w-fit border">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path;
                        return (
                            <Link key={tab.path} href={tab.path}>
                                <button
                                    className={cn(
                                        "px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2",
                                        isActive
                                            ? "bg-background shadow-sm text-indigo-600"
                                            : "text-muted-foreground hover:text-indigo-600"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.name}
                                </button>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                {children}
            </div>
        </div>
    );
}
