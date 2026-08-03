# MorrusPOS Frontend

Frontend untuk **MorrusPOS**, sistem POS dan manajemen operasional UMKM yang mencakup:

- transaksi kasir
- stok dan transfer cabang
- supplier dan purchase order
- utang usaha
- konsinyasi
- dashboard operasional

Saat ini frontend masih dalam tahap transformasi dari template **TailAdmin React** menjadi aplikasi MorrusPOS yang terintegrasi dengan backend ASP.NET Core.

![MorrusPOS Frontend Preview](./banner.png)

## Status Project

Kondisi saat ini:

- basis UI masih menggunakan template TailAdmin
- struktur frontend baru berbasis feature mulai disiapkan
- backend aktif sudah tersedia sampai **Fase 6**
- frontend sedang disiapkan untuk mengikuti roadmap MorrusPOS

Artinya, project ini belum final sebagai produk operasional penuh, tetapi pondasi untuk migrasi modul sudah mulai dibangun.

## Target Fitur

Frontend ini ditujukan untuk mendukung roadmap MorrusPOS berikut:

1. autentikasi, role, dan hak akses
2. master produk dan kategori
3. POS kasir dan sesi kasir
4. stok, stok opname, dan transfer cabang
5. supplier, purchase order, dan utang usaha
6. konsinyasi dan settlement supplier
7. integrasi online order
8. dashboard bisnis dan laporan

Untuk tahap sekarang, fokus implementasi frontend diprioritaskan sampai **Fase 6**, mengikuti kesiapan backend.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- ApexCharts
- FullCalendar

## Struktur Project

Struktur lama TailAdmin masih ada untuk referensi dan migrasi bertahap. Struktur baru MorrusPOS yang sedang dipakai:

```text
frontend/
├── docs/
├── public/
├── src/
│   ├── app/
│   │   ├── guards/
│   │   ├── providers/
│   │   └── router/
│   ├── api/
│   │   ├── client/
│   │   ├── modules/
│   │   └── types/
│   ├── components/
│   │   ├── forms/
│   │   ├── layout/
│   │   ├── tables/
│   │   └── ui/
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── pos/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── inventory/
│   │   ├── suppliers/
│   │   ├── purchase-orders/
│   │   ├── debts/
│   │   ├── consignments/
│   │   ├── users/
│   │   └── outlets/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── utils/
├── package.json
└── vite.config.ts
```

Referensi tambahan:

- [docs/frontend_roadmap.md](./docs/frontend_roadmap.md)
- [src/structure.md](./src/structure.md)

## Setup Development

### Prasyarat

- Node.js 18 atau lebih baru
- npm

### Install dependency

```bash
npm install
```

### Jalankan development server

```bash
npm run dev
```

Secara default aplikasi akan berjalan di:

```text
http://localhost:5173
```

### Build production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Integrasi Backend

Frontend ini akan terhubung ke backend MorrusPOS berbasis ASP.NET Core.

Rencana integrasi utamanya:

- login dan refresh token
- request API terpusat
- context user, role, dan outlet
- proteksi route berbasis auth dan permission
- checkout POS
- update stok real-time via SignalR

Untuk demo awal, target minimum yang harus bisa berjalan:

1. membuat order manual tanpa integrasi GrabFood/GoFood/ShopeeFood
2. stok berkurang secara real-time setelah checkout

Backend untuk kebutuhan demo tersebut sudah tersedia.

## Roadmap Implementasi Frontend

Urutan kerja yang direkomendasikan:

1. fondasi app, router, providers, API client
2. auth flow dan route guard
3. produk dan kategori
4. POS kasir dan sesi kasir
5. inventory, opname, dan transfer
6. supplier, PO, utang
7. konsinyasi
8. dashboard dan integrasi online order

Roadmap lengkap ada di:

- [docs/frontend_roadmap.md](./docs/frontend_roadmap.md)

## Catatan Migrasi dari TailAdmin

Template TailAdmin dipakai sebagai starting point visual, tetapi:

- route demo generik akan dibersihkan bertahap
- halaman bisnis MorrusPOS akan menggantikan halaman demo template
- komponen lama hanya dipertahankan selama masih berguna

Jadi repo ini bukan lagi template umum, melainkan sedang diarahkan menjadi frontend khusus MorrusPOS.

## Git Workflow Singkat

Jika repo frontend ini berdiri sendiri:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin <url-repository>
git push -u origin main
```

Jika `git push` gagal dengan pesan `src refspec main does not match any`, biasanya penyebabnya karena belum ada commit pertama.

## License

Project ini mengikuti lisensi yang berlaku pada file [LICENSE.md](./LICENSE.md).
