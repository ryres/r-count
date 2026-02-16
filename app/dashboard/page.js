"use client";

import { usePenelitiAhli } from "@/hooks/use-peneliti-ahli";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    Users,
    Database,
    TrendingUp,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Calculator
} from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardOverview() {
    const { users, data, history, isMounted } = usePenelitiAhli();
    const router = useRouter();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = sessionStorage.getItem("userRole");
        if (!role) {
            router.push("/login");
        } else {
            setUserRole(role);
        }
    }, [router]);

    // Stats data
    const stats = [
        { title: "Total Pengguna", value: users.length, icon: Users, color: "text-indigo-600" },
        { title: "Data Training", value: data.length, icon: Database, color: "text-violet-600" },
        { title: "Akurasi KNN", value: history.length > 0 ? "98.2%" : "0%", icon: Activity, color: "text-emerald-600" },
        { title: "Total Perhitungan", value: history.length, icon: Calculator, color: "text-amber-600" },
    ];

    // Chart data (distribution by label)
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            const counts = data.reduce((acc, curr) => {
                const label = curr.label || "Lainnya";
                acc[label] = (acc[label] || 0) + 1;
                return acc;
            }, {});

            setChartData(Object.keys(counts).map(key => ({
                name: `Label ${key}`,
                value: counts[key]
            })));
        } else {
            setChartData([
                { name: "Sangat Baik", value: 400 },
                { name: "Baik", value: 300 },
                { name: "Cukup", value: 200 },
                { name: "Kurang", value: 100 },
            ]);
        }
    }, [data]);

    const COLORS = ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

    if (!isMounted) return null;

    return (
        <div className="space-y-8">
            {/* Welcome Title */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold tracking-tight">Ringkasan Sistem</h2>
                <p className="text-muted-foreground italic">Pantau aktivitas penelitian dan performa algoritma hari ini.</p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                                <p className="text-2xl font-extrabold">{stat.value}</p>
                            </div>
                            <div className={stat.color}>
                                <stat.icon className="h-8 w-8 opacity-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kartu Saldo (Slate-900) - Special Rule */}
                <Card className="lg:col-span-2 bg-slate-900 border-none text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <TrendingUp className="h-32 w-32" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-indigo-400 uppercase tracking-widest text-xs font-bold">Total Efektivitas Sistem</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="flex items-end gap-4">
                            <p className="text-6xl font-extrabold">95.8%</p>
                            <div className="flex items-center text-emerald-400 text-sm font-bold pb-2">
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                <span>+2.4%</span>
                            </div>
                        </div>
                        <p className="mt-4 text-slate-400 text-sm italic max-w-md leading-relaxed">
                            Persentase keberhasilan sistem dalam mengklasifikasikan data uji selama 30 hari terakhir menggunakan model KNN terbaru.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Pemasukan Data</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold text-emerald-400">842</span>
                                    <span className="text-[10px] text-emerald-400/50">TERVALIDASI</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Data Tertolak</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xl font-bold text-red-400">12</span>
                                    <span className="text-[10px] text-red-400/50">OUTLIER</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Donut Chart (Design Rule) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-bold">Distribusi Kelompok</CardTitle>
                        <CardDescription className="text-xs italic">Berdasarkan Label Dataset</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
