"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Calculator,
    User,
    ShieldCheck,
    ArrowRight,
    Lock,
    Mail,
    Loader2
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeRole, setActiveRole] = useState("user");

    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Mock validation against requested IDs
        const validUsers = [
            { email: "ryan@nibs.sch.id", password: "12345", role: "administrator" },
            { email: "op@nibs.sch.id", password: "12345", role: "user" }
        ];

        const user = validUsers.find(u => u.email === credentials.email && u.password === credentials.password);

        setTimeout(() => {
            setIsLoading(true);
            if (user) {
                if (user.role !== activeRole) {
                    setError(`ID ini terdaftar sebagai ${user.role === 'administrator' ? 'Admin' : 'Pengguna'}. Silakan ganti tab.`);
                    setIsLoading(false);
                    return;
                }
                sessionStorage.setItem("userRole", user.role);
                router.push("/dashboard");
            } else {
                setError("Email atau kata sandi salah. Gunakan ryan@nibs.sch.id / 12345 atau op@nibs.sch.id / 12345.");
                setIsLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-background selection:bg-indigo-500/30">
            {/* Background Ornaments */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/5" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-500/5" />
            </div>

            {/* Header Info */}
            <div className="absolute top-8 left-8 flex items-center gap-2">
                <div className="bg-indigo-600 p-1 rounded-lg">
                    <Calculator className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold tracking-tight text-lg">R-Count</span>
            </div>

            <div className="absolute top-8 right-8">
                <ThemeToggle />
            </div>

            <main className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                <Card className="border-2 shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full w-fit mb-4">
                            <ShieldCheck className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <CardTitle className="text-3xl font-extrabold tracking-tight">Selamat Datang</CardTitle>
                        <CardDescription className="text-sm font-medium italic">
                            Masuk ke sistem R-Count untuk memulai analisis
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Tabs
                            defaultValue="user"
                            className="w-full mb-6"
                            onValueChange={setActiveRole}
                        >
                            <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50">
                                <TabsTrigger value="user" className="data-[state=active]:bg-background transition-all">
                                    <User className="h-4 w-4 mr-2" /> Pengguna
                                </TabsTrigger>
                                <TabsTrigger value="administrator" className="data-[state=active]:bg-background transition-all">
                                    <ShieldCheck className="h-4 w-4 mr-2" /> Admin
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider opacity-70">
                                    Email / Username
                                </Label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-indigo-600" />
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="nama@email.com"
                                        className="pl-10 h-11 transition-all border-muted group-focus-within:border-indigo-600"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" alt="label" className="text-xs font-bold uppercase tracking-wider opacity-70">
                                        Kata Sandi
                                    </Label>
                                    <a href="#" className="text-[10px] font-bold text-indigo-600 hover:underline">Lupa sandi?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-indigo-600" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 h-11 transition-all border-muted group-focus-within:border-indigo-600"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-600 text-[10px] font-bold text-center animate-in fade-in slide-in-from-top-2">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 text-base bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all font-bold group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Masuk Sebagai {activeRole === "administrator" ? "Admin" : "Pengguna"}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 border-t bg-muted/20 p-6 rounded-b-xl">
                        <p className="text-xs text-center text-muted-foreground italic font-medium">
                            Akses khusus untuk personil peneliti resmi sistem R-Count.
                        </p>
                    </CardFooter>
                </Card>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                    © 2026 R-Count System. Keamanan data adalah prioritas kami.
                </p>
            </main>
        </div>
    );
}
