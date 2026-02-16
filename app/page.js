import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Layers,
  LineChart,
  ShieldCheck,
  Zap,
  Users,
  Database,
  Calculator
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">R-Count</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#fitur" className="hover:text-primary transition-colors">Fitur</a>
            <a href="#metode" className="hover:text-primary transition-colors">Metode</a>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button size="sm" className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700">
                Masuk Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-violet-500 blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 text-xs font-semibold mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              V1.0 Peneliti Ahli Edition
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
              Analisis Data Lebih Cerdas dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">R-Count</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Platform perhitungan canggih menggunakan metode K-Nearest Neighbors dan Fuzzy Logic untuk pengambilan keputusan yang presisi dan akurat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25">
                  Mulai Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/peneliti">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2">
                  Lihat Demo Hook
                </Button>
              </Link>
            </div>

            {/* Hero Visualization Mockup */}
            <div className="mt-20 relative max-w-5xl mx-auto rounded-xl border bg-card shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-violet-500/10 pointer-events-none" />
              <div className="p-4 border-b bg-muted/30 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 text-center">
                  <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded border bg-background text-[10px] text-muted-foreground">
                    dashboard.rcount.app
                  </div>
                </div>
              </div>
              <div className="aspect-[16/9] bg-background p-8 grid grid-cols-12 gap-6">
                <div className="col-span-8 flex flex-col gap-6">
                  <div className="h-32 rounded-lg bg-muted animate-pulse" />
                  <div className="flex-1 rounded-lg bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground text-sm italic">
                    Visualisasi Data Statis Terintegrasi
                  </div>
                </div>
                <div className="col-span-4 flex flex-col gap-6">
                  <div className="h-full rounded-lg bg-slate-900 flex flex-col p-6 text-white">
                    <span className="text-sm font-medium opacity-70">Total Data Terproses</span>
                    <span className="text-4xl font-bold mt-2">1,284</span>
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between">
                      <span className="text-xs text-emerald-400">↑ 12.5%</span>
                      <span className="text-xs opacity-50">Bulan ini</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="fitur" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Fitur Utama</h2>
              <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-amber-500" />,
                  title: "Akses Cepat",
                  desc: "Kecepatan eksekusi algoritma dioptimalkan dengan backend Python yang tangguh."
                },
                {
                  icon: <Layers className="h-8 w-8 text-indigo-500" />,
                  title: "Multi-Metode",
                  desc: "Dukungan penuh untuk KNN dan Fuzzy Logic dalam satu ekosistem terpadu."
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-emerald-500" />,
                  title: "Keamanan Data",
                  desc: "Enkripsi di LocalStorage dan keamanan bertingkat untuk data network."
                },
                {
                  icon: <LineChart className="h-8 w-8 text-violet-500" />,
                  title: "Visualisasi Insight",
                  desc: "Tampilkan data kompleks Anda menjadi grafik yang mudah dipahami."
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-card border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed italic text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Methods Section */}
        <section id="metode" className="py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-8">
                <div className="inline-flex px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">
                  Metodologi
                </div>
                <h2 className="text-4xl font-bold leading-tight">Hybrid Logic System Untuk Hasil Maksimal</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  R-Count tidak hanya memberikan satu perspektif. Kami menggabungkan klasifikasi klasikal (KNN) dengan logika samar (Fuzzy) untuk memastikan setiap keputusan memiliki dasar data yang kuat.
                </p>
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div className="bg-indigo-600/10 p-3 rounded-lg h-fit">
                      <Calculator className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">K-Nearest Neighbors</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        Klasifikasi berbasis kedekatan data untuk akurasi pengenalan pola yang intuitif.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-colors">
                    <div className="bg-violet-600/10 p-3 rounded-lg h-fit">
                      <Layers className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Fuzzy Logic System</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        Pemodelan variabel samar untuk pengambilan keputusan dalam kondisi yang tidak pasti.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-square rounded-3xl bg-indigo-600 flex items-center justify-center p-8 text-white shadow-2xl shadow-indigo-600/20">
                    <Users className="h-full w-full opacity-20 absolute" />
                    <span className="text-4xl font-bold">98%</span>
                    <p className="absolute bottom-6 text-[10px] uppercase font-bold tracking-widest opacity-60">Akurasi KNN</p>
                  </div>
                  <div className="aspect-square rounded-3xl bg-muted border p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <Database className="h-6 w-6 text-muted-foreground" />
                      <div className="h-2 w-10 bg-indigo-600 rounded-full" />
                    </div>
                    <div>
                      <span className="text-2xl font-bold italic">Big Data</span>
                      <p className="text-[10px] text-muted-foreground mt-1">Scale up ready system</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-3xl bg-slate-900 p-8 flex flex-col justify-end relative overflow-hidden text-white shadow-2xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px]" />
                    <span className="text-4xl font-bold italic">Real-time</span>
                    <p className="text-xs opacity-50 mt-2 leading-relaxed italic">Logika cerdas yang bekerja secara instan di setiap kalkulasi.</p>
                  </div>
                  <div className="aspect-square rounded-3xl bg-indigo-50 border p-8 dark:bg-indigo-900/10">
                    <Zap className="h-full w-full text-indigo-600 opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-600/40">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[150%] rotate-45 border-r-[100px] border-white/20" />
              </div>
              <h2 className="text-4xl font-bold mb-6">Siap Mengoptimalkan Data Anda?</h2>
              <p className="text-lg opacity-80 max-w-xl mx-auto mb-10 italic font-medium">
                "Data adalah minyak baru, tapi tanpa alat yang tepat, Anda hanya memiliki tumpukan lumpur."
              </p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold">
                  Buka Dashboard R-Count
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold">R-Count</span>
            </div>
            <div className="flex gap-8 text-sm text-muted-foreground italic">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground border-t pt-8">
            <p>© 2026 R-Count System. All rights reserved. Bangga menggunakan Next.js & Python.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
