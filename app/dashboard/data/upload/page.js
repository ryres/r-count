"use client";

import { usePenelitiAhli } from "@/hooks/use-peneliti-ahli";
import { useState } from "react";
import { toast } from "@/components/ui/custom-toaster";
import { ExportButton } from "@/components/export-button";
import * as XLSX from 'xlsx';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Upload,
    FileText,
    CheckCircle2,
    XCircle,
    Loader2,
    Database,
    Table as TableIcon,
    Trash2
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export default function UploadDataPage() {
    const { data, addData, deleteData, isMounted } = usePenelitiAhli();
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileUpload = (e) => {
        const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
        if (files && files.length > 0) {
            const file = files[0];
            const extension = file.name.split('.').pop().toLowerCase();
            const reader = new FileReader();

            setIsUploading(true);

            reader.onload = (event) => {
                const result = event.target.result;
                let importedData = [];

                try {
                    if (['xlsx', 'xls', 'csv', 'tsv', 'tab'].includes(extension)) {
                        const workbook = XLSX.read(result, { type: 'binary' });
                        const sheetName = workbook.SheetNames[0];
                        const sheet = workbook.Sheets[sheetName];
                        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                        // Detect data rows
                        json.forEach(row => {
                            if (row.length >= 4 && !isNaN(row[0])) {
                                importedData.push({
                                    features: [Number(row[1]), Number(row[2]), Number(row[3])],
                                    label: String(row[4] || "A")
                                });
                            }
                        });
                    }
                    else if (extension === 'json') {
                        const parsed = JSON.parse(result);
                        importedData = Array.isArray(parsed) ? parsed : [parsed];
                    }
                    else if (['sql', 'txt', 'rtf', 'xml', 'docx', 'odt'].includes(extension)) {
                        // Extract patterns like "10, 20, 30, Label" or similar
                        const text = typeof result === 'string' ? result : new TextDecoder().decode(result);
                        const lines = text.split('\n');
                        lines.forEach(line => {
                            const match = line.match(/(\d+[\.\d]*)\D+(\d+[\.\d]*)\D+(\d+[\.\d]*)\D+([A-Za-z0-9]+)/);
                            if (match) {
                                importedData.push({
                                    features: [Number(match[1]), Number(match[2]), Number(match[3])],
                                    label: match[4]
                                });
                            }
                        });
                    }
                    else if (extension === 'data') {
                        const decoded = atob(result);
                        const parsed = JSON.parse(decoded);
                        importedData = Array.isArray(parsed) ? parsed : [parsed];
                    }

                    if (importedData.length > 0) {
                        importedData.forEach(item => addData(item));
                        toast(`Berhasil mengimpor ${importedData.length} baris data dari ${file.name}`, "success");
                    } else {
                        toast(`Tidak ditemukan format data yang valid di ${file.name}`, "error");
                    }
                } catch (err) {
                    console.error("Upload Error:", err);
                    toast(`Gagal memproses file: ${err.message}`, "error");
                }

                setIsUploading(false);
            };

            if (['xlsx', 'xls', 'pdf', 'docx', 'odt'].includes(extension)) {
                reader.readAsBinaryString(file);
            } else {
                reader.readAsText(file);
            }
        }
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upload Zone */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                <Upload className="h-4 w-4 text-indigo-600" /> Impor Dataset
                            </CardTitle>
                            <CardDescription className="text-xs italic">Dukung format .csv, .xlsx, atau .json</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all",
                                    dragActive ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20" : "border-muted-foreground/20 hover:border-indigo-500/50"
                                )}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFileUpload(e); }}
                            >
                                <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center">
                                    {isUploading ? (
                                        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                                    ) : (
                                        <FileText className="h-8 w-8 text-indigo-600" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-bold tracking-tight">Klik atau seret file ke sini</p>
                                    <p className="text-[10px] text-muted-foreground italic mt-1">Maksimum ukuran file: 5MB</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={handleFileUpload}
                                    accept=".csv,.json,.xlsx"
                                />
                                <Button
                                    variant="outline"
                                    className="font-bold border-2"
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    Pilih File
                                </Button>
                            </div>

                            <div className="mt-8 space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60">Status Sinkronisasi</h4>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-medium">LocalStorage</span>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] bg-emerald-500/5 text-emerald-600 border-emerald-500/10">AKTIF</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-medium">Cloud Network</span>
                                    </div>
                                    <Badge variant="outline" className="text-[8px] bg-emerald-500/5 text-emerald-600 border-emerald-500/10">TERHUBUNG</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Dataset Preview */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between shrink-0">
                            <div>
                                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                    <TableIcon className="h-4 w-4 text-indigo-600" /> Preview Dataset
                                </CardTitle>
                                <CardDescription className="text-xs italic">Total {data.length} baris data tersedia.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <ExportButton data={data} targetId="dataset-preview" />
                                <Button variant="ghost" size="sm" className="text-xs font-bold text-red-500 hover:text-red-600" onClick={() => data.forEach(d => deleteData(d.id))}>
                                    Kosongkan Dataset
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent id="dataset-preview" className="flex-1 overflow-auto bg-white dark:bg-slate-900 rounded-b-xl">
                            {data.length > 0 ? (
                                <div className="border rounded-xl">
                                    <Table>
                                        <TableHeader className="bg-muted/50">
                                            <TableRow>
                                                <TableHead className="font-bold text-xs">ID DATA</TableHead>
                                                <TableHead className="font-bold text-xs text-center">FITUR (F1, F2, F3)</TableHead>
                                                <TableHead className="font-bold text-xs text-center">LABEL</TableHead>
                                                <TableHead className="text-right font-bold text-xs">AKSI</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.map((item, idx) => (
                                                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                                    <TableCell className="text-xs font-mono opacity-60">#{idx + 1}</TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex justify-center gap-2">
                                                            {item.features.map((f, i) => (
                                                                <Badge key={i} variant="outline" className="text-[10px] font-mono">{f}</Badge>
                                                            ))}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold">
                                                        <Badge className="bg-indigo-600">{item.label}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteData(item.id)}>
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4 border-2 border-dashed rounded-2xl py-20">
                                    <Database className="h-12 w-12 opacity-10" />
                                    <div className="text-center">
                                        <p className="text-sm font-bold tracking-tight">Dataset Kosong</p>
                                        <p className="text-xs italic">Silakan impor file untuk melihat data di sini.</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Global utility helper if needed
function cn(...inputs) {
    return inputs.filter(Boolean).join(" ");
}
