"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DataPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/dashboard/data/hitung");
    }, [router]);

    return (
        <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
}
