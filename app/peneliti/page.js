"use client";

import { usePenelitiAhli } from "@/hooks/use-peneliti-ahli";
import { useState, useEffect } from "react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Loader2, Plus, Trash, Calculator, Printer, LogOut, UserPlus, PieChart as PieChartIcon } from "lucide-react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend
} from "recharts";

export default function PenelitiPage() {
    const {
        isMounted, isLoading, error,
        users, data, results,
        addUser, deleteUser,
        addData, deleteData,
        calculateKNN, calculateFuzzy,
        printout, logout
    } = usePenelitiAhli();

    const [newUser, setNewUser] = useState({ name: '', role: 'user' });
    const [newData, setNewData] = useState({ label: '', f1: '', f2: '', f3: '' });
    const [testPoint, setTestPoint] = useState({ f1: '', f2: '', f3: '' });

    // Chart Data Preparation
    const chartData = Object.entries(
        data.reduce((acc, curr) => {
            acc[curr.label] = (acc[curr.label] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

    if (!isMounted) return null;

    const handleAddUser = () => {
        if (newUser.name) {
            addUser({ name: newUser.name, role: newUser.role });
            setNewUser({ name: '', role: 'user' });
        }
    };

    const handleAddData = () => {
        if (newData.f1 && newData.f2 && newData.f3 && newData.label) {
            addData({
                features: [Number(newData.f1), Number(newData.f2), Number(newData.f3)],
                label: newData.label
            });
            setNewData({ label: '', f1: '', f2: '', f3: '' });
        }
    };

    const handleKNN = () => {
        if (testPoint.f1 && testPoint.f2 && testPoint.f3) {
            calculateKNN([Number(testPoint.f1), Number(testPoint.f2), Number(testPoint.f3)]);
        }
    };

    const handleFuzzy = () => {
        if (testPoint.f1 && testPoint.f2 && testPoint.f3) {
            calculateFuzzy([Number(testPoint.f1), Number(testPoint.f2), Number(testPoint.f3)]);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
            <header className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">Panel Peneliti Ahli</h1>
                    <p className="text-muted-foreground italic">KNN & Fuzzy Logic Implementation</p>
                </div>
                <div className="flex gap-2">
                    <ThemeToggle />
                    <Button variant="outline" size="icon" onClick={logout} title="Reset Data">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {error && (
                <Badge variant="destructive" className="w-full text-center py-2 text-sm justify-center">
                    ⚠️ Error: {error} (Pastikan Python Backend di port 5000 aktif)
                </Badge>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribusi Data (Donut Chart) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChartIcon className="h-5 w-5 text-indigo-600" /> Distribusi Data
                        </CardTitle>
                        <CardDescription>Visualisasi penyebaran label pada dataset training.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {data.length > 0 ? (
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
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic gap-2">
                                <PieChartIcon className="h-10 w-10 opacity-10" />
                                <p className="text-sm">Belum ada data untuk dianalisis</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dataset Training */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dataset Training (KNN)</CardTitle>
                        <CardDescription>Input data untuk referensi klasifikasi KNN.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-5 gap-2">
                            <Input placeholder="F1" value={newData.f1} onChange={e => setNewData({ ...newData, f1: e.target.value })} />
                            <Input placeholder="F2" value={newData.f2} onChange={e => setNewData({ ...newData, f2: e.target.value })} />
                            <Input placeholder="F3" value={newData.f3} onChange={e => setNewData({ ...newData, f3: e.target.value })} />
                            <Input placeholder="Label" value={newData.label} onChange={e => setNewData({ ...newData, label: e.target.value })} />
                            <Button onClick={handleAddData} disabled={!newData.label}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="max-h-[200px] overflow-auto border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Fitur [F1, F2, F3]</TableHead>
                                        <TableHead>Label</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.map(d => (
                                        <TableRow key={d.id}>
                                            <TableCell>{JSON.stringify(d.features)}</TableCell>
                                            <TableCell><Badge>{d.label}</Badge></TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => deleteData(d.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {data.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground">Dataset kosong</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Kalkulasi */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" /> Kalkulasi & Prediksi
                        </CardTitle>
                        <CardDescription>Uji data baru dengan metode KNN atau Fuzzy Logic.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold border-b pb-2">Input Data Uji</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs">Fitur 1</label>
                                    <Input type="number" value={testPoint.f1} onChange={e => setTestPoint({ ...testPoint, f1: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs">Fitur 2</label>
                                    <Input type="number" value={testPoint.f2} onChange={e => setTestPoint({ ...testPoint, f2: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs">Fitur 3</label>
                                    <Input type="number" value={testPoint.f3} onChange={e => setTestPoint({ ...testPoint, f3: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button className="flex-1" onClick={handleKNN} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                                    Hitung KNN
                                </Button>
                                <Button className="flex-1 variant-secondary" variant="secondary" onClick={handleFuzzy} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Calculator className="mr-2 h-4 w-4" />}
                                    Hitung Fuzzy
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                            <h3 className="font-semibold border-b pb-2 flex justify-between">
                                Hasil Perhitungan
                                {data.length > 0 && (
                                    <Button variant="ghost" size="sm" onClick={() => printout(data, "Laporan Hasil Penelitian", "Lampiran data training sistem R-Count", "Dicetak otomatis oleh sistem", new Date().toLocaleDateString('id-ID'), "Admin Peneliti")}>
                                        <Printer className="h-4 w-4" />
                                    </Button>
                                )}
                            </h3>

                            <div className="space-y-4">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-md border shadow-sm">
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Hasil KNN (Klasifikasi)</p>
                                    {results.knn ? (
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-mono">Label: {results.knn.prediction}</span>
                                            <Badge variant="success" className="bg-emerald-500 text-white">Confidence: {(results.knn.confidence * 100).toFixed(1)}%</Badge>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Belum ada hasil KNN</p>
                                    )}
                                </div>

                                <div className="p-3 bg-white dark:bg-slate-900 rounded-md border shadow-sm">
                                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-bold">Hasil Fuzzy Logic (Skoring)</p>
                                    {results.fuzzy ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-mono">Nilai: {results.fuzzy.data.value.toFixed(2)}</span>
                                                <Badge variant="outline" className="capitalize">{results.fuzzy.data.category}</Badge>
                                            </div>
                                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-indigo-500 h-full transition-all duration-500"
                                                    style={{ width: `${results.fuzzy.data.value}%` }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Belum ada hasil Fuzzy</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
