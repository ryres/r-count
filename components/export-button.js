"use client"

import React from 'react'
import {
    Download,
    ChevronDown,
    FileText,
    Table as TableIcon,
    Database,
    Code,
    FileJson,
    FileCode,
    FileSpreadsheet,
    FileBox
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { toJpeg, toPng } from 'html-to-image'

export function ExportButton({ data, filename = "data-penelitian", targetId }) {

    const generateData = () => {
        return data.map((item, idx) => ({
            ID: idx + 1,
            Fitur_1: item.features[0],
            Fitur_2: item.features[1],
            Fitur_3: item.features[2],
            Label: item.label
        }))
    }

    const downloadFile = (content, fileName, contentType) => {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    const exportActions = {
        csv: () => {
            const worksheet = XLSX.utils.json_to_sheet(generateData());
            const csvContent = XLSX.utils.sheet_to_csv(worksheet);
            downloadFile(csvContent, `${filename}.csv`, "text/csv");
        },
        xlsx: () => {
            const worksheet = XLSX.utils.json_to_sheet(generateData());
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            XLSX.writeFile(workbook, `${filename}.xlsx`);
        },
        json: () => {
            const content = JSON.stringify(data, null, 2);
            downloadFile(content, `${filename}.json`, "application/json");
        },
        xml: () => {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<dataset>\n';
            data.forEach((item, i) => {
                xml += `  <item id="${i + 1}">\n`;
                xml += `    <features>${item.features.join(',')}</features>\n`;
                xml += `    <label>${item.label}</label>\n`;
                xml += `  </item>\n`;
            });
            xml += '</dataset>';
            downloadFile(xml, `${filename}.xml`, "application/xml");
        },
        sql: () => {
            let sql = "CREATE TABLE IF NOT EXISTS penelitian (id INT, f1 FLOAT, f2 FLOAT, f3 FLOAT, label VARCHAR(50));\n";
            data.forEach((item, i) => {
                sql += `INSERT INTO penelitian VALUES (${i + 1}, ${item.features[0]}, ${item.features[1]}, ${item.features[2]}, '${item.label}');\n`;
            });
            downloadFile(sql, `${filename}.sql`, "text/plain");
        },
        pdf: () => {
            const doc = new jsPDF()
            doc.text("Data Penelitian R-Count", 14, 15)
            const tableData = generateData().map(row => Object.values(row))
            doc.autoTable({
                head: [['ID', 'Fitur 1', 'Fitur 2', 'Fitur 3', 'Label']],
                body: tableData,
                startY: 20,
            })
            doc.save(`${filename}.pdf`)
        },
        txt: () => {
            let txt = "ID\tF1\tF2\tF3\tLabel\n";
            generateData().forEach(row => {
                txt += `${row.ID}\t${row.Fitur_1}\t${row.Fitur_2}\t${row.Fitur_3}\t${row.Label}\n`;
            });
            downloadFile(txt, `${filename}.txt`, "text/plain");
        },
        tsv: () => {
            const worksheet = XLSX.utils.json_to_sheet(generateData());
            const tsvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: "\t" });
            downloadFile(tsvContent, `${filename}.tsv`, "text/tab-separated-values");
        },
        tab: () => exportActions.tsv(),
        rtf: () => {
            let rtf = "{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Calibri;}}\n";
            rtf += "{\\b Data Penelitian R-Count}\\par\\par\n";
            generateData().forEach(row => {
                rtf += `${row.ID}. F1:${row.Fitur_1}, F2:${row.Fitur_2}, F3:${row.Fitur_3} -> Label:${row.Label}\\par\n`;
            });
            rtf += "}";
            downloadFile(rtf, `${filename}.rtf`, "application/rtf");
        },
        docx: () => {
            // Simplified DOCX as plain text with line breaks (Word can open it)
            let docx = "DATA PENELITIAN R-COUNT\n\n";
            generateData().forEach(row => {
                docx += `${row.ID}. Fitur: [${row.Fitur_1}, ${row.Fitur_2}, ${row.Fitur_3}] | Label: ${row.Label}\n`;
            });
            downloadFile(docx, `${filename}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        },
        odt: () => {
            let odt = "DATA PENELITIAN R-COUNT\n\n";
            generateData().forEach(row => {
                odt += `${row.ID}. Fitur: [${row.Fitur_1}, ${row.Fitur_2}, ${row.Fitur_3}] | Label: ${row.Label}\n`;
            });
            downloadFile(odt, `${filename}.odt`, "application/vnd.oasis.opendocument.text");
        },
        data: () => {
            const content = btoa(JSON.stringify(data));
            downloadFile(content, `${filename}.data`, "application/octet-stream");
        },
        png: async () => {
            const node = document.getElementById(targetId);
            if (!node) return;
            const dataUrl = await toPng(node, { backgroundColor: '#ffffff', quality: 1 });
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = dataUrl;
            link.click();
        },
        jpg: async () => {
            const node = document.getElementById(targetId);
            if (!node) return;
            const dataUrl = await toJpeg(node, { backgroundColor: '#ffffff', quality: 0.95 });
            const link = document.createElement('a');
            link.download = `${filename}.jpg`;
            link.href = dataUrl;
            link.click();
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 font-bold border-indigo-600/20 text-indigo-600 hover:bg-indigo-50">
                    <Download className="mr-2 h-4 w-4" /> Export Data <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Format Populer</DropdownMenuLabel>
                <DropdownMenuItem onClick={exportActions.csv} className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4 text-emerald-500" /> CSV (Comma Separated)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportActions.xlsx} className="cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" /> Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportActions.pdf} className="cursor-pointer">
                    <FileBox className="mr-2 h-4 w-4 text-red-500" /> PDF Document
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportActions.png} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4 text-indigo-500" /> Image (PNG)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportActions.jpg} className="cursor-pointer">
                    <Download className="mr-2 h-4 w-4 text-sky-500" /> Image (JPG)
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Technical / Dev</DropdownMenuLabel>
                <DropdownMenuItem onClick={exportActions.json} className="cursor-pointer">
                    <FileJson className="mr-2 h-4 w-4 text-amber-500" /> JSON Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportActions.xml} className="cursor-pointer">
                    <Code className="mr-2 h-4 w-4 text-blue-500" /> XML Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportActions.sql} className="cursor-pointer">
                    <Database className="mr-2 h-4 w-4 text-slate-600" /> SQL Script
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground">Lainnya (Teks & Dokumen)</DropdownMenuLabel>
                <div className="grid grid-cols-2">
                    <DropdownMenuItem onClick={exportActions.txt} className="cursor-pointer text-[10px]">TXT</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportActions.tsv} className="cursor-pointer text-[10px]">TSV / TAB</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportActions.rtf} className="cursor-pointer text-[10px]">RTF</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportActions.docx} className="cursor-pointer text-[10px]">DOCX</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportActions.odt} className="cursor-pointer text-[10px]">ODT</DropdownMenuItem>
                    <DropdownMenuItem onClick={exportActions.data} className="cursor-pointer text-[10px]">DATA BIN</DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
