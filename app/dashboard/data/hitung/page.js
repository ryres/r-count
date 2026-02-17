"use client";

import { usePenelitiAhli } from "@/hooks/use-peneliti-ahli";
import { useState } from "react";
import { toast } from "@/components/ui/custom-toaster";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Activity
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function HitungDataPage() {
    const { calculateKNN, calculateFuzzy, isLoading, results, history, error, isMounted } = usePenelitiAhli();
    const [testPoint, setTestPoint] = useState({ f1: "", f2: "", f3: "" });
    const [method, setMethod] = useState("knn");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil((history?.length || 0) / itemsPerPage);
    const currentHistory = history?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) || [];

    const handleCalculate = async () => {
        if (!testPoint.f1 || !testPoint.f2 || !testPoint.f3) return;

        const features = [Number(testPoint.f1), Number(testPoint.f2), Number(testPoint.f3)];
        if (method === "knn") {
            const res = await calculateKNN(features);
            if (res) toast("Perhitungan KNN berhasil disimulasikan!", "success");
        } else {
            const res = await calculateFuzzy(features);
            if (res) toast("Inference Fuzzy Logic berhasil!", "success");
        }
    };

    if (!isMounted) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-2 border-indigo-500/10">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Settings className="h-4 w-4 text-indigo-600" /> Konfigurasi Uji
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Pilih Metode</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={method === "knn" ? "indigo" : "outline"}
                                    className={cn(
                                        "h-14 font-bold transition-all",
                                        method === "knn" ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""
                                    )}
                                    onClick={() => setMethod("knn")}
                                >
                                    KNN
                                </Button>
                                <Button
                                    variant={method === "fuzzy" ? "indigo" : "outline"}
                                    className={cn(
                                        "h-14 font-bold transition-all",
                                        method === "fuzzy" ? "bg-violet-600 hover:bg-violet-700 text-white" : ""
                                    )}
                                    onClick={() => setMethod("fuzzy")}
                                >
                                    Fuzzy Logic
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Input Fitur (Data Uji)</label>
                            <div className="grid gap-3">
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-[10px] font-bold text-muted-foreground uppercase">F1</span>
                                    <Input
                                        type="number"
                                        className="pl-10 h-11"
                                        placeholder="Nilai kriteria 1"
                                        value={testPoint.f1}
                                        onChange={e => setTestPoint({ ...testPoint, f1: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-[10px] font-bold text-muted-foreground uppercase">F2</span>
                                    <Input
                                        type="number"
                                        className="pl-10 h-11"
                                        placeholder="Nilai kriteria 2"
                                        value={testPoint.f2}
                                        onChange={e => setTestPoint({ ...testPoint, f2: e.target.value })}
                                    />
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-[10px] font-bold text-muted-foreground uppercase">F3</span>
                                    <Input
                                        type="number"
                                        className="pl-10 h-11"
                                        placeholder="Nilai kriteria 3"
                                        value={testPoint.f3}
                                        onChange={e => setTestPoint({ ...testPoint, f3: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/20"
                            onClick={handleCalculate}
                            disabled={isLoading || !testPoint.f1}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Play className="mr-2 h-4 w-4" />
                            )}
                            Jalankan Perhitungan
                        </Button>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                        <p className="text-xs font-medium text-red-600 italic leading-relaxed">
                            <strong>Error:</strong> {error}. Pastikan Python Backend aktif di port 5000.
                        </p>
                    </div>
                )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Hasil Analisis
                            </CardTitle>
                            <Badge variant="outline" className="italic text-[10px]">Real-time Output</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {results.knn || results.fuzzy ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Result Block KNN */}
                                {results.knn && (
                                    <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Calculator className="h-20 w-20" />
                                        </div>
                                        <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-4">Klasifikasi KNN</p>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground italic mb-1">Label Prediksi:</p>
                                                <p className="text-4xl font-extrabold tracking-tight">Kategori {results.knn.prediction}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold">
                                                    {(Number(results.knn.confidence || 0) * 100).toFixed(1)}% Confidence
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Result Block Fuzzy */}
                                {results.fuzzy && results.fuzzy.data && (
                                    <div className="p-6 rounded-2xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Activity className="h-20 w-20" />
                                        </div>
                                        <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">Fuzzy Inference</p>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground italic mb-1">Skor Defuzzifikasi:</p>
                                                <p className="text-4xl font-extrabold tracking-tight">
                                                    {Number(results.fuzzy.data.value || 0).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60">
                                                    <span>Interpretasi: {results.fuzzy.data.category || 'N/A'}</span>
                                                    <span>{Number(results.fuzzy.data.value || 0).toFixed(0)}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-violet-500 transition-all duration-1000"
                                                        style={{ width: `${Math.min(100, Math.max(0, results.fuzzy.data.value || 0))}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground gap-3">
                                <Calculator className="h-10 w-10 opacity-20" />
                                <p className="text-sm italic">Silakan masukkan data uji dan klik jalankan perhitungan.</p>
                            </div>
                        )}

                        {/* Riwayat Lengkap */}
                        <div className="space-y-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-60">
                                    <History className="h-3 w-3" /> Riwayat Perhitungan Terakhir
                                </div>
                                {history && history.length > 0 && (
                                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-medium italic">
                                        {history.length} Sesi Terakhir
                                    </span>
                                )}
                            </div>

                            <div className="border rounded-xl overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow>
                                            <TableHead className="text-[10px] font-bold uppercase">Waktu</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Metode</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase">Input [F1, F2, F3]</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase text-right">Hasil</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentHistory.length > 0 ? (
                                            currentHistory.map((h, i) => (
                                                <TableRow key={h.id || i} className="hover:bg-muted/20 transition-colors">
                                                    <TableCell className="text-[10px] opacity-60">
                                                        {new Date(h.timestamp).toLocaleTimeString('id-ID')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className={cn(
                                                            "text-[9px] font-bold",
                                                            h.type === 'KNN' ? "bg-indigo-500/5 text-indigo-600 border-indigo-500/20" : "bg-violet-500/5 text-violet-600 border-violet-500/20"
                                                        )}>
                                                            {h.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-[10px] font-semibold">
                                                        [{h.input.join(', ')}]
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-xs">
                                                        {h.type === 'KNN' ? `Label ${h.prediction}` : Number(h.data?.value || 0).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-20 text-center text-[10px] text-muted-foreground italic">
                                                    Belum ada riwayat perhitungan.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-[10px] text-muted-foreground">
                                        Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, history.length)} dari {history.length} data
                                    </p>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px] font-bold"
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Prev
                                        </Button>
                                        <div className="flex items-center px-2 text-[10px] font-bold bg-muted/50 rounded-md">
                                            {currentPage} / {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-[10px] font-bold"
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
