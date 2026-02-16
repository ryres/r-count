"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

let toastCount = 0;
let observers = [];

export const toast = (message, type = "success") => {
    const id = toastCount++;
    const newToast = { id, message, type };
    observers.forEach((cb) => cb(newToast));
};

export function Toaster() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const addToast = (newToast) => {
            setToasts((prev) => [...prev, newToast]);
            setTimeout(() => {
                removeToast(newToast.id);
            }, 4000);
        };

        observers.push(addToast);
        return () => {
            observers = observers.filter((cb) => cb !== addToast);
        };
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-[320px]">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={cn(
                        "p-4 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300",
                        t.type === "success" ? "bg-emerald-500 text-white border-emerald-400" :
                            t.type === "error" ? "bg-red-500 text-white border-red-400" :
                                "bg-slate-900 text-white border-slate-700"
                    )}
                >
                    <div className="flex items-center gap-3">
                        {t.type === "success" ? <CheckCircle className="h-5 w-5" /> :
                            t.type === "error" ? <AlertCircle className="h-5 w-5" /> :
                                <Info className="h-5 w-5" />}
                        <p className="text-xs font-bold leading-tight">{t.message}</p>
                    </div>
                    <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
