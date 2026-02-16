# R-Count - Sistem Perhitungan

Aplikasi sistem perhitungan menggunakan metode **KNN** dan **Fuzzy Logic** yang dibangun dengan Next.js, Tailwind CSS, dan Shadcn UI.

## 🚀 Teknologi

- **Framework:** Next.js 16 (App Router)
- **Bahasa:** JavaScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **Theme:** next-themes (Dark/Light mode)

## 📦 Komponen UI Tersedia

- ✅ Card - Container konten
- ✅ Button - Berbagai variant tombol
- ✅ Input - Form input field
- ✅ Select - Dropdown select
- ✅ Tabs - Navigasi tab
- ✅ Table - Tabel data
- ✅ Badge - Label/tag

## 🎨 Fitur

- ✅ Dark/Light mode dengan toggle Sun/Moon
- ✅ Antarmuka berbahasa Indonesia
- ✅ Responsive design
- ✅ Komponen UI siap pakai
- ✅ Tailwind CSS v4 dengan custom theme

## 🛠️ Instalasi

Proyek sudah siap digunakan. Semua dependencies sudah terinstall.

## 🏃 Menjalankan Proyek

### Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Build Production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## 📁 Struktur Folder

```
r-count/
├── app/
│   ├── layout.js          # Root layout dengan ThemeProvider
│   ├── page.js            # Halaman home (demo)
│   └── globals.css        # Tailwind CSS + Dark mode variables
├── components/
│   ├── theme-provider.js  # Next-themes provider
│   ├── theme-toggle.js    # Toggle dark/light mode
│   └── ui/                # Shadcn UI components
├── lib/
│   └── utils.js           # Utility functions
└── public/                # Static assets
```

## 🎯 Rencana Pengembangan

Sesuai design system rules, proyek ini akan dikembangkan dengan:

1. **Sistem Login**
   - 2 user roles: Administrator dan User
   - Protected routes

2. **Dashboard**
   - Tab Pengguna
   - Tab Data (Hitung Data, Upload Data)
   - Tab Logout

3. **Visualisasi Data**
   - Grafik distribusi dengan Recharts
   - PieChart/Donut untuk kelompok

4. **Styling Enhancement**
   - Kartu Saldo dengan background Slate-900
   - Indikator berwarna (Hijau/Merah)
   - Tombol Indigo/Violet

## 📚 Dokumentasi

Lihat file berikut untuk detail lebih lanjut:
- `components/` - Komponen UI siap pakai
- `.agent/rules/design-system.md` - Aturan design system
- `.agent/skills/peneliti-ahli/` - Skill KNN dan Fuzzy Logic

## 📝 Lisensi

© 2026 R-Count - Sistem Perhitungan KNN & Fuzzy Logic
>>>>>>> 8267eb4 (Initial commit: full-stack R-Count application with 13-format upload/export and premium dashboard)
