# Roadmap Frontend MorrusPOS

Dokumen ini menjadi acuan pengembangan frontend **MorrusPOS** dari kondisi saat ini yang masih berupa template **TailAdmin React** menjadi aplikasi operasional POS yang sesuai dengan slide presentasi MorrusPOS dan sinkron dengan backend yang saat ini sudah berjalan sampai **Fase 6**.

---

## Kondisi Saat Ini

Frontend saat ini masih berada pada tahap awal:

- Masih menggunakan struktur bawaan TailAdmin
- Routing masih generik dan belum mewakili alur bisnis MorrusPOS
- Belum ada integrasi API ke backend ASP.NET Core
- Belum ada state management untuk auth, outlet, session kasir, transaksi, stok, supplier, atau konsinyasi
- Belum ada halaman dashboard MorrusPOS, POS kasir, inventory, purchasing, atau settlement

Artinya, roadmap frontend perlu dimulai dari **fondasi aplikasi**, bukan langsung ke polishing UI.

---

## Tujuan Frontend

Frontend MorrusPOS harus mendukung narasi slide:

1. Satu sistem untuk operasional UMKM
2. Mudah dipakai oleh beberapa role
3. Real-time untuk stok dan aktivitas kasir
4. Mendukung multi-cabang
5. Mendukung supplier, pembelian, dan utang
6. Mendukung konsinyasi
7. Siap dikembangkan ke integrasi online order dan dashboard bisnis

Karena backend aktif baru sampai Fase 6, maka target frontend utama juga dibatasi sampai **fitur backend yang memang sudah tersedia**.

---

## Prinsip Implementasi

Saat mengubah TailAdmin menjadi MorrusPOS, pegang prinsip ini:

- Pertahankan komponen layout yang berguna dari template, tetapi buang halaman demo generik
- Bangun struktur halaman berdasarkan proses bisnis, bukan berdasarkan widget template
- Dahulukan alur operasional inti: login, dashboard, kasir, produk, stok, supplier, konsinyasi
- Gunakan integrasi API yang konsisten dan typed
- Siapkan fondasi reusable untuk role-based UI, tenant outlet, dan real-time updates
- Fokus mobile-responsiveness terutama untuk halaman kasir dan dashboard operasional

---

## Arsitektur Frontend yang Disarankan

### 1. Struktur Folder

Struktur yang disarankan:

```text
frontend/src/
├── app/
│   ├── router/
│   ├── providers/
│   └── guards/
├── api/
│   ├── client/
│   ├── modules/
│   └── types/
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── pos/
│   ├── products/
│   ├── categories/
│   ├── inventory/
│   ├── suppliers/
│   ├── purchase-orders/
│   ├── debts/
│   ├── consignments/
│   ├── users/
│   └── outlets/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── tables/
│   └── layout/
├── hooks/
├── lib/
├── utils/
└── styles/
```

### 2. Lapisan Frontend

- `api/`: wrapper request ke backend
- `features/`: logic dan UI per domain bisnis
- `components/`: komponen reusable lintas fitur
- `app/router/`: route tree, auth guard, permission guard
- `app/providers/`: theme, auth session, query client, realtime provider

### 3. Integrasi API

Disarankan membuat:

- `axios` atau `fetch wrapper` dengan interceptor token
- auto-attach JWT
- auto-handle `401` untuk refresh token
- error normalizer agar toast/message konsisten

### 4. State Management

Minimal butuh:

- `Auth state`
- `Current user + role + outlet`
- `Current cashier session`
- `Selected outlet context`
- `Notification / realtime state`

Pendekatan yang cukup aman:

- React Context untuk state global kecil
- data fetching per halaman dengan library query jika nanti ditambahkan
- form state lokal di masing-masing feature

### 5. Real-Time

Karena backend sudah punya SignalR untuk update stok, frontend perlu menyiapkan:

- koneksi ke `/hub/notifications`
- join ke group outlet aktif
- handler event `ReceiveStockUpdate`
- invalidasi/refetch data stok dan produk saat event masuk

---

## Fase Roadmap Frontend

Roadmap ini dibagi menjadi 8 fase. Fase 1-6 diselaraskan dengan backend aktif. Fase 7-8 adalah fase lanjutan setelah backend siap.

---

## Fase 0: Fondasi Aplikasi MorrusPOS

Tujuan: mengubah template TailAdmin menjadi shell aplikasi MorrusPOS.

### Pekerjaan

- Bersihkan route demo TailAdmin yang tidak relevan
- Tetapkan routing aplikasi MorrusPOS
- Ganti branding, title, logo, dan meta
- Buat layout utama:
  - `AuthLayout`
  - `DashboardLayout`
  - `CashierLayout`
- Buat navigasi berdasarkan menu bisnis:
  - Dashboard
  - POS Kasir
  - Produk
  - Kategori
  - Stok
  - Transfer Stok
  - Supplier
  - Purchase Order
  - Utang Supplier
  - Konsinyasi
  - Settlement Konsinyasi
  - Pengguna
  - Cabang
- Siapkan `.env` frontend untuk `VITE_API_BASE_URL` dan `VITE_SIGNALR_URL`
- Buat HTTP client dasar
- Buat komponen global:
  - loading screen
  - empty state
  - error state
  - confirm dialog
  - toast notification

### Output

- Frontend punya struktur MorrusPOS, bukan template demo
- Semua halaman utama sudah punya skeleton route

---

## Fase 1: Autentikasi, Hak Akses, dan Konteks User

Selaras dengan backend Fase 1.

### Tujuan

Mengaktifkan login, session user, role-based menu, dan proteksi route.

### Pekerjaan

- Integrasi `POST /api/auth/login`
- Simpan `accessToken` dan `refreshToken`
- Siapkan auto-refresh token
- Tampilkan profil user aktif
- Tampilkan outlet aktif user
- Buat route guards:
  - unauthenticated redirect ke login
  - permission-based guard
- Sidebar dinamis berdasarkan permission
- Buat halaman:
  - login
  - daftar user
  - create/update user
  - change password
- Tampilkan error `403` dan `401` dengan UX yang jelas

### Halaman Prioritas

- `/signin`
- `/users`
- `/users/create`
- `/users/:id/edit`
- `/profile/change-password`

### Output

- User bisa login ke sistem
- Menu dan halaman menyesuaikan role
- Frontend siap dipakai multi-role

---

## Fase 2: Master Produk & Kategori

Selaras dengan backend Fase 2.

### Tujuan

Menghadirkan halaman master data produk dan kategori yang usable untuk operasional.

### Pekerjaan

- Integrasi endpoint kategori
- Integrasi endpoint produk
- Tampilkan stok per outlet pada listing produk
- Form create/edit produk
- Validasi field wajib:
  - kategori
  - SKU
  - nama
  - harga jual
  - HPP
  - unit
- Filter dan pencarian produk
- Status aktif/nonaktif
- Konfirmasi delete / deactivate
- Tampilkan info audit sederhana di UI bila nanti endpoint tersedia

### Halaman Prioritas

- `/products`
- `/products/create`
- `/products/:id/edit`
- `/categories`

### Output

- Admin bisa mengelola master produk dan kategori dari UI

---

## Fase 3: POS Kasir & Sesi Kasir

Selaras dengan backend Fase 3.

### Tujuan

Membuat halaman POS yang benar-benar mendukung transaksi kasir harian.

### Pekerjaan

- Integrasi buka sesi kasir
- Integrasi cek sesi aktif
- Integrasi tutup sesi kasir
- Bangun halaman POS:
  - pencarian produk
  - keranjang
  - ubah qty
  - diskon item
  - ringkasan subtotal/discount/tax/grand total
  - metode pembayaran
  - submit checkout
- Tampilkan validasi stok tidak cukup
- Tampilkan hasil transaksi sukses
- Siapkan halaman histori transaksi dasar
- Tambahkan idempotency client untuk submit checkout
- Integrasi SignalR stock update agar kasir lain melihat perubahan stok

### UX Penting

- Navigasi cepat keyboard-friendly
- Fokus input pencarian produk
- Tombol checkout besar dan jelas
- Loading state saat submit pembayaran

### Halaman Prioritas

- `/cashier/session`
- `/pos`
- `/transactions/:id`

### Output

- Kasir bisa buka shift, jual barang, dan tutup shift dari UI

---

## Fase 4: Stok, Opname, dan Transfer Cabang

Selaras dengan backend Fase 4.

### Tujuan

Menjadikan modul stok benar-benar operasional untuk admin gudang dan kepala cabang.

### Pekerjaan

- Listing stok per outlet
- Filter stok minimum / stok rendah
- Form stok opname
- Halaman histori stok opname
- Form buat transfer stok antar cabang
- Halaman incoming/outgoing transfer
- Aksi approve/reject transfer
- Tampilkan perubahan stok real-time jika ada event SignalR

### Halaman Prioritas

- `/inventory`
- `/stock-opnames`
- `/stock-opnames/create`
- `/stock-transfers/outgoing`
- `/stock-transfers/incoming`

### Output

- Operasional stok bisa dikelola dari frontend tanpa Swagger

---

## Fase 5: Supplier, Purchase Order, dan Utang Usaha

Selaras dengan backend Fase 5.

### Tujuan

Membuat alur pembelian barang dan pelacakan utang supplier usable untuk operasional.

### Pekerjaan

- CRUD supplier
- Listing purchase order per outlet
- Form create PO
- Ubah status PO
- Tampilkan due date untuk PO tempo
- Listing utang supplier
- Filter unpaid / partially paid / paid
- Halaman detail utang per PO
- Form pembayaran utang
- Histori pembayaran supplier

### Halaman Prioritas

- `/suppliers`
- `/purchase-orders`
- `/purchase-orders/create`
- `/purchase-orders/:id`
- `/supplier-debts`
- `/supplier-debts/payments`

### Output

- Admin pembelian dan keuangan bisa menjalankan alur supplier end-to-end

---

## Fase 6: Konsinyasi & Settlement Supplier

Selaras dengan backend Fase 6.

### Tujuan

Menghadirkan fitur pembeda MorrusPOS di frontend: barang titipan/konsinyasi.

### Pekerjaan

- Form penerimaan barang konsinyasi
- Listing tanda terima konsinyasi
- Ubah status draft ke received
- Halaman unpaid consignment sales per supplier
- Form create settlement
- Aksi settled / cancelled
- Tampilkan hubungan antara:
  - barang titipan diterima
  - barang terjual di POS
  - hak supplier tercatat
  - settlement dilakukan

### Halaman Prioritas

- `/consignments`
- `/consignments/create`
- `/consignments/:id`
- `/consignment-settlements`
- `/consignment-settlements/:id`

### Output

- Fitur konsinyasi bisa dipresentasikan penuh dari frontend

---

## Fase 7: Integrasi Online Order

Fase ini dikerjakan setelah backend Fase 7 siap.

### Tujuan

Menyambungkan pesanan online ke layar operasional outlet.

### Pekerjaan

- Dashboard incoming online orders
- Realtime notification panel
- Audio alert untuk order baru
- Status order online
- Rekap settlement platform
- Tampilan komparasi kanal penjualan

### Halaman Kandidat

- `/online-orders`
- `/channel-settlements`

---

## Fase 8: Dashboard Bisnis & Laporan

Fase ini dikerjakan setelah backend Fase 8 siap.

### Tujuan

Mewujudkan slide “pantau kondisi usaha secara real-time” dan “semua operasional dalam satu dashboard”.

### Pekerjaan

- Dashboard owner/admin
- Ringkasan omzet harian/bulanan
- Online vs offline sales
- Metode pembayaran
- Produk terlaris
- Grafik tren penjualan
- Per outlet comparison
- Cashflow summary
- Export report trigger jika backend siap

### Halaman Kandidat

- `/dashboard`
- `/reports/sales`
- `/reports/profit-loss`

---

## Mapping Slide ke Modul Frontend

### Slide Tantangan Operasional UMKM

Frontend perlu menjawab dengan:

- dashboard ringkas
- alur kasir cepat
- stok real-time
- modul supplier
- konsinyasi

### Slide Semua Operasional dalam Satu Sistem

Di frontend diterjemahkan menjadi:

- satu sidebar aplikasi
- satu auth system
- satu konteks outlet
- satu dashboard lintas modul

### Slide Fitur Utama Sistem POS

Perlu halaman:

- POS checkout
- produk
- kategori
- pembayaran
- riwayat transaksi

### Slide Penjualan Online dalam Satu Dashboard

Ditahan dulu untuk fase frontend lanjutan setelah backend fase 7 siap.

### Slide Stok Terhubung dengan Seluruh Transaksi

Perlu:

- inventory page
- realtime refresh
- stock opname
- transfer stock

### Slide Pengelolaan Supplier dan Pembelian

Perlu:

- supplier page
- PO page
- debt tracking

### Slide Manajemen Barang Titipan / Konsinyasi

Perlu:

- consignment receiving
- consignment sales visibility
- settlement page

### Slide Pantau Kondisi Usaha Secara Real-Time

Bisa dimulai dari dashboard sederhana di fase awal, lalu disempurnakan penuh setelah backend fase 8 siap.

### Slide Kelola Banyak Cabang dari Satu Dashboard

Perlu:

- outlet context selector
- role-aware data visibility
- transfer stock UI
- outlet-aware dashboard

---

## Urutan Eksekusi yang Disarankan

Jika dikerjakan bertahap, urutan paling aman:

1. Fase 0: fondasi frontend MorrusPOS
2. Fase 1: auth, role, permission, layout
3. Fase 2: produk dan kategori
4. Fase 3: sesi kasir dan POS
5. Fase 4: inventory, opname, transfer
6. Fase 5: supplier, PO, utang
7. Fase 6: konsinyasi
8. Fase 7-8: online order dan dashboard bisnis

Urutan ini penting karena:

- POS tidak layak dibangun sebelum auth dan produk siap
- stok bergantung pada produk dan transaksi
- supplier dan konsinyasi lebih mudah dikerjakan setelah inventory stabil

---

## Milestone Deliverables

### Milestone A

- Layout MorrusPOS selesai
- Login berjalan
- Sidebar berbasis role berjalan

### Milestone B

- Produk dan kategori berjalan penuh
- CRUD dasar pindah dari Swagger ke UI

### Milestone C

- POS kasir usable
- Sesi kasir usable
- Transaksi dasar selesai

### Milestone D

- Inventory, opname, transfer usable

### Milestone E

- Supplier, PO, utang usable

### Milestone F

- Konsinyasi usable
- Demo end-to-end Fase 1-6 bisa dilakukan penuh dari frontend

---

## Definisi Selesai untuk Frontend Fase 1-6

Frontend dianggap siap untuk mendukung backend Fase 1-6 jika:

- Semua endpoint utama Fase 1-6 sudah punya halaman UI
- Tidak ada operasional inti yang masih bergantung ke Swagger
- Login, permission, dan outlet context stabil
- POS dapat dipakai untuk simulasi transaksi penuh
- Inventory dan supplier flow dapat diuji end-to-end
- Konsinyasi dapat dipresentasikan end-to-end
- UI responsif minimal untuk desktop dan tablet

---

## Rekomendasi Langkah Berikutnya

Setelah dokumen ini dibuat, langkah implementasi yang paling masuk akal adalah:

1. Rapikan struktur project frontend dari template menjadi struktur feature-based
2. Bangun auth flow dan route guard
3. Buat API client terpusat
4. Mulai dari modul produk dan kategori
5. Lanjut ke POS karena itu nilai demo terbesar

Dengan urutan ini, frontend akan cepat berubah dari “template admin” menjadi “produk MorrusPOS” yang benar-benar terasa sesuai slide.
