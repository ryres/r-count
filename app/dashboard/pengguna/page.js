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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    Trash2,
    UserPlus,
    MoreVertical,
    Mail,
    Shield,
    Filter
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function PenggunaPage() {
    const { users, addUser, deleteUser, isMounted } = usePenelitiAhli();
    const [searchTerm, setSearchTerm] = useState("");
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        addUser(newUser);
        setNewUser({ name: "", email: "", role: "Peneliti" });
        toast(`Pengguna ${newUser.name} berhasil ditambahkan!`, "success");
    };

    const handleDelete = (id, name) => {
        deleteUser(id);
        toast(`Pengguna ${name} telah dihapus.`, "info");
    };

    if (!isMounted) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-extrabold tracking-tight">Manajemen Pengguna</h2>
                    <p className="text-muted-foreground italic">Kelola daftar personil peneliti dan hak akses sistem.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 font-bold">
                    <UserPlus className="mr-2 h-4 w-4" /> Export Data
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Form Tambah */}
                <Card className="lg:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Tambah Pengguna</CardTitle>
                        <CardDescription className="text-xs italic">Daftarkan peneliti baru ke sistem.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Nama Lengkap</label>
                                <Input
                                    placeholder="Contoh: Budi Santoso"
                                    value={newUser.name}
                                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    className="h-10"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Alamat Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="nama@email.com"
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        className="pl-10 h-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Role / Hak Akses</label>
                                <select
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-medium"
                                    value={newUser.role}
                                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="user">User (Peneliti)</option>
                                    <option value="administrator">Administrator (Admin)</option>
                                </select>
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold">
                                <Plus className="mr-2 h-4 w-4" /> Tambah User
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Tabel List */}
                <Card className="lg:col-span-3">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-0 gap-4">
                        <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest">Daftar Aktif</CardTitle>
                            <CardDescription className="text-xs italic">Total {users.length} personil terdaftar.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative group">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
                                <Input
                                    placeholder="Cari nama..."
                                    className="pl-10 h-9 w-[200px] lg:w-[300px]"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" size="icon" className="h-9 w-9">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-bold text-xs uppercase tracking-widest">Pengguna</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-widest">Role</TableHead>
                                        <TableHead className="font-bold text-xs uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="text-right font-bold text-xs uppercase tracking-widest">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((u) => (
                                        <TableRow key={u.id} className="hover:bg-muted/30 transition-colors">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center font-bold text-indigo-600">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm tracking-tight">{u.name}</p>
                                                        <p className="text-[10px] text-muted-foreground">{u.email || "Tidak ada email"}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {u.role === "administrator" ? (
                                                    <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 gap-1 font-bold">
                                                        <Shield className="h-3 w-3" /> Admin
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="gap-1 font-bold">
                                                        Peneliti
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-xs font-medium italic">Aktif</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="text-xs font-bold">Edit Detail</DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-xs font-bold text-red-500 focus:text-red-500"
                                                            onClick={() => deleteUser(u.id)}
                                                        >
                                                            Hapus Pengguna
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredUsers.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic text-sm">
                                                Tidak ada pengguna ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
