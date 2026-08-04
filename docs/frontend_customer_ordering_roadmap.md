# Roadmap Frontend Customer Ordering MorrusPOS

Dokumen ini menjadi acuan pengembangan **frontend customer-facing** untuk MorrusPOS, terpisah dari frontend backoffice/internal yang saat ini sudah berjalan sampai **Fase 6 backend** dan **Fase 6 frontend operasional**.

Tanggal acuan dokumen ini: **3 Agustus 2026**.

---

## 1. Latar Belakang

Frontend MorrusPOS yang sudah ada saat ini berfokus pada:

- backoffice operasional
- POS kasir internal
- inventory dan transfer stok
- supplier, purchase order, utang supplier
- konsinyasi dan settlement supplier

Namun dari sisi kebutuhan bisnis, ada target yang sangat penting:

1. customer bisa membeli **secara online**
2. order online masuk ke sistem MorrusPOS
3. stok outlet berkurang **real-time**
4. backoffice, POS, dan inventory ikut melihat dampaknya secara langsung

Artinya, kita membutuhkan frontend baru yang berbeda karakter dari dashboard internal:

- ringan
- cepat
- fokus ke conversion
- tidak memerlukan login admin
- tetap tunduk pada source of truth stok dan transaksi dari backend MorrusPOS

---

## 2. Tujuan Produk

Frontend customer ordering ini bukan marketplace besar di fase awal.

Tujuan awalnya adalah:

- memvalidasi bahwa MorrusPOS bisa menerima order online langsung
- memvalidasi stok berkurang real-time
- menyediakan jalur pembelian online sederhana yang bisa dipakai demo dan pilot internal

Tujuan bisnis jangka pendek:

- mengurangi ketergantungan pada input manual kasir untuk order online
- menyediakan channel online milik sendiri
- membuktikan integrasi order → transaksi → stok → dashboard berjalan end-to-end

Tujuan teknis jangka pendek:

- customer bisa browse produk
- customer bisa checkout
- backend memproses order
- stok outlet aktif diperbarui
- event realtime menyebar ke aplikasi internal

---

## 3. Prinsip Arsitektur

Frontend customer ordering harus dibangun dengan prinsip:

### 3.1 Satu Source of Truth

- **Backend MorrusPOS** tetap menjadi sumber kebenaran utama untuk:
  - produk
  - harga
  - stok
  - order
  - status pembayaran
  - outlet

Frontend customer tidak boleh menghitung atau mengarang stok sendiri di luar data backend.

### 3.2 Channel Online Internal Dulu

Fase awal tidak perlu langsung terhubung ke:

- GrabFood
- GoFood
- ShopeeFood
- WhatsApp commerce automation
- payment gateway kompleks

Fase awal cukup menjadi:

- **channel online milik sendiri**
- web ordering langsung ke backend MorrusPOS

### 3.3 Outlet-First

Karena stok dan transaksi MorrusPOS outlet-aware, customer ordering juga harus punya konteks outlet yang jelas.

Pilihan desain yang paling aman:

- satu storefront per outlet
- atau satu storefront multi-outlet dengan outlet dipilih di awal

Untuk MVP, opsi yang paling sederhana dan stabil adalah:

- **satu outlet aktif per sesi customer**

### 3.4 Realtime Validation Ready

Walaupun customer storefront tidak wajib memakai realtime di fase pertama, arsitektur harus siap untuk:

- stok berubah saat customer lain checkout
- backoffice update stok
- POS menghabiskan stok produk yang sama

---

## 4. Scope Besar

Roadmap ini hanya untuk **frontend customer-facing**, bukan backend.

Namun desain frontend diasumsikan membutuhkan endpoint backend pendukung seperti:

- public catalog
- public product detail
- create online order
- get order status
- optional payment callback/polling

Frontend ini **bukan pengganti POS kasir**, melainkan channel baru di atas engine transaksi MorrusPOS.

---

## 5. Outcome Akhir yang Diinginkan

Jika roadmap ini selesai minimal sampai MVP, hasil akhirnya:

- customer bisa membuka website ordering
- customer memilih outlet
- customer melihat produk yang tersedia
- customer menambahkan item ke cart
- customer checkout
- order tersimpan di backend
- stok outlet langsung berkurang
- aplikasi internal MorrusPOS melihat update stok secara real-time

---

## 6. Batas Antara Backoffice dan Customer Frontend

Supaya tim tidak bingung, pembagian peran UI perlu jelas.

### 6.1 Frontend Backoffice/Internal

Dipakai oleh:

- Owner
- Admin
- Kasir
- Gudang
- Keuangan
- KepalaCabang

Fungsinya:

- konfigurasi operasional
- POS internal
- pengelolaan stok
- transaksi
- procurement
- konsinyasi

### 6.2 Frontend Customer Ordering

Dipakai oleh:

- customer akhir
- pembeli online

Fungsinya:

- lihat katalog
- pilih produk
- checkout
- lihat status order

Customer frontend **tidak** boleh bercampur dengan dashboard internal dalam satu pengalaman UI yang membingungkan.

---

## 7. Strategi Produk yang Disarankan

Untuk mengurangi risiko, pengembangan dibagi menjadi **4 fase customer frontend**:

1. **Fase C0**: fondasi storefront
2. **Fase C1**: katalog + cart
3. **Fase C2**: checkout + order creation
4. **Fase C3**: order status + realtime stok + hardening UX

Jika nanti sukses, baru lanjut ke:

5. **Fase C4**: pembayaran online
6. **Fase C5**: akun customer, repeat order, promo

---

## 8. Arsitektur Frontend yang Disarankan

### 8.1 Repo Strategy

Ada dua opsi:

#### Opsi A: Satu repo frontend, dua app shell

- `frontend/` tetap satu repo
- ada app internal dan app customer dalam satu codebase

Contoh:

```text
frontend/src/
├── app/
├── backoffice/
├── storefront/
├── shared/
```

Kelebihan:

- reuse utils, types, formatter
- deploy bisa lebih sederhana

Kekurangan:

- boundary antar app harus disiplin
- bundle bisa cepat membesar jika tidak di-split dengan benar

#### Opsi B: Repo terpisah untuk customer frontend

- `frontend/` untuk internal MorrusPOS
- `customer-frontend/` untuk storefront

Kelebihan:

- boundary jelas
- deployment dan branding lebih fleksibel

Kekurangan:

- ada duplikasi tooling
- shared type/API contract perlu strategi sendiri

### Rekomendasi

Untuk kondisi MorrusPOS saat ini, saya merekomendasikan:

- **mulai dari Opsi A** dulu bila ingin cepat
- tetapi tetap pisahkan secara struktur:
  - `src/backoffice`
  - `src/storefront`
  - `src/shared`

Kalau nanti berkembang besar, storefront bisa dipisah ke repo sendiri.

---

## 9. Struktur Folder yang Disarankan

Jika memakai satu repo:

```text
frontend/src/
├── app/
│   ├── providers/
│   ├── router/
│   └── guards/
├── backoffice/
│   ├── features/
│   ├── layouts/
│   └── routes/
├── storefront/
│   ├── app/
│   ├── features/
│   │   ├── landing/
│   │   ├── outlets/
│   │   ├── catalog/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── payments/
│   ├── components/
│   ├── layouts/
│   ├── routes/
│   └── styles/
├── shared/
│   ├── api/
│   ├── types/
│   ├── utils/
│   ├── realtime/
│   └── components/
└── main.tsx
```

Jika nanti dipisah repo, struktur internal storefront kurang lebih tetap sama.

---

## 10. Perbedaan Desain UI

### Backoffice

- dense
- data heavy
- banyak table
- role-based
- utility first

### Storefront

- conversion oriented
- visual sederhana
- mobile first
- cepat dibaca
- minim friction

Artinya storefront tidak boleh sekadar “menampilkan halaman POS untuk customer”.

Storefront harus punya desain sendiri.

---

## 11. Domain Modul Customer Frontend

### 11.1 Landing / Outlet Entry

Tujuan:

- memilih outlet aktif
- mengenalkan toko
- memberi jalur ke katalog

Kemungkinan route:

- `/`
- `/outlet-select`
- `/o/:outletSlug`

### 11.2 Catalog

Tujuan:

- melihat daftar produk aktif
- search produk
- filter kategori
- melihat harga dan status stok

Kemungkinan route:

- `/menu`
- `/catalog`
- `/o/:outletSlug/menu`

### 11.3 Product Detail

Tujuan:

- detail produk
- qty selection
- add to cart

Kemungkinan route:

- `/products/:slug`

### 11.4 Cart

Tujuan:

- review item
- ubah qty
- hapus item
- lihat subtotal

Kemungkinan route:

- `/cart`

### 11.5 Checkout

Tujuan:

- isi data customer
- tentukan metode fulfillment
- buat order

Kemungkinan route:

- `/checkout`

### 11.6 Order Status

Tujuan:

- tampilkan nomor order
- tampilkan status pembayaran / pemrosesan
- beri feedback bahwa order sukses

Kemungkinan route:

- `/orders/:id`
- `/orders/track/:token`

---

## 12. Fase C0: Fondasi Storefront

### Tujuan

Membangun shell customer-facing yang terpisah dari backoffice.

### Pekerjaan

- tentukan arsitektur app:
  - one repo two shells
  - atau repo terpisah
- buat routing storefront
- buat layout storefront:
  - `StorefrontLayout`
  - `CheckoutLayout`
  - `OrderStatusLayout`
- set branding customer-facing
- tentukan theme token yang tidak bentrok dengan backoffice
- siapkan env:
  - `VITE_STOREFRONT_API_BASE_URL`
  - `VITE_STOREFRONT_SIGNALR_URL`
- siapkan HTTP client khusus public API
- siapkan public error boundary, loading state, empty state

### Output

- storefront app bisa dibuka
- routing customer sudah berdiri
- belum ada flow order penuh

---

## 13. Fase C1: Outlet Selection + Catalog + Cart

### Tujuan

Customer bisa masuk ke outlet tertentu lalu berbelanja secara draft.

### 13.1 Outlet Selection

Pekerjaan:

- tampilkan daftar outlet aktif untuk customer
- pilih outlet aktif
- simpan outlet context di:
  - route param
  - local storage
  - atau context

Keputusan yang direkomendasikan:

- gunakan **route param outlet slug/code**
- simpan fallback di local storage

Contoh:

- `/o/outlet-utama/menu`

### 13.2 Catalog Page

Pekerjaan:

- list produk outlet aktif
- search by:
  - nama
  - SKU
  - barcode bila perlu
- filter kategori
- badge stok:
  - tersedia
  - hampir habis
  - habis
- disable add-to-cart untuk stok 0

Kolom/data yang minimal tampil:

- nama produk
- harga
- kategori
- unit
- ketersediaan stok

### 13.3 Product Card / Product Detail

Pekerjaan:

- tombol add to cart
- quantity picker
- optional note per item di fase lanjut

### 13.4 Cart

Pekerjaan:

- add/remove item
- merge item sama
- update qty
- subtotal
- validasi qty tidak boleh > stok tampilan saat ini

### Output Fase C1

- customer bisa pilih outlet
- customer bisa browsing menu
- customer bisa isi cart
- belum checkout final

---

## 14. Fase C2: Checkout & Order Creation

### Tujuan

Customer bisa submit order online yang benar-benar masuk ke backend.

### 14.1 Checkout Form

Field minimal:

- nama customer
- nomor telepon
- catatan order opsional
- metode pemesanan:
  - pickup
  - dine-in
  - delivery internal sederhana

Jika belum ingin kompleks, MVP cukup:

- nama
- nomor telepon
- catatan

### 14.2 Order Summary

Tampilkan:

- daftar item
- qty
- subtotal
- biaya tambahan jika ada
- grand total

### 14.3 Submit Order

Frontend perlu:

- generate idempotency key
- disable tombol saat submit
- tangani retry aman
- tampilkan error stok mismatch dengan jelas

### 14.4 Backend Integration Assumption

Agar frontend ini bekerja baik, backend idealnya punya endpoint seperti:

- `GET /api/public/outlets`
- `GET /api/public/catalog?outletId=...`
- `GET /api/public/categories?outletId=...`
- `POST /api/public/orders`
- `GET /api/public/orders/{id}`

Jika backend belum punya public endpoints, frontend tetap bisa dirancang dulu, tetapi implementasi final perlu phase backend kecil khusus public ordering.

### Output Fase C2

- order online tercipta
- transaksi masuk ke sistem
- stok outlet berkurang

---

## 15. Fase C3: Realtime Stock, Order Status, dan Hardening

### Tujuan

Membuat experience customer dan sinkronisasi ke internal system lebih stabil.

### 15.1 Realtime Stock Sync

Frontend storefront sebaiknya siap menerima update stok:

- via SignalR
- atau via refetch pendek

Perilaku yang diinginkan:

- jika produk habis karena transaksi lain, product card update
- jika item di cart melebihi stok terbaru, tampil warning
- checkout diblok bila stok sudah tidak cukup

### 15.2 Order Success Page

Tampilkan:

- nomor order
- outlet
- ringkasan item
- total
- status awal order

### 15.3 Order Tracking

Minimal:

- order created
- confirmed
- processing
- completed
- cancelled

Kalau backend belum punya lifecycle lengkap, minimal tampil:

- order diterima
- order berhasil dibuat

### 15.4 Hardening UX

- network error state
- double submit protection
- graceful refresh
- persistence cart per outlet

### Output Fase C3

- customer ordering usable untuk demo real
- stok realtime tervalidasi
- backoffice dan storefront sinkron

---

## 16. Fase C4: Pembayaran Online

Fase ini opsional setelah MVP berhasil.

### Tujuan

Customer bisa membayar tanpa intervensi kasir.

### Pekerjaan

- pilih payment gateway
- payment instruction page
- pending payment state
- callback / polling status
- timeout / expired state

### Risiko

- jauh lebih kompleks
- perlu keamanan lebih tinggi
- perlu sinkronisasi order vs payment status

### Rekomendasi

Jangan masuk ke fase ini sebelum:

- flow order dasar stabil
- stok realtime sudah tervalidasi

---

## 17. Fase C5: Akun Customer, Promo, dan Repeat Order

Fase ini bukan prioritas awal.

Contoh scope:

- login customer
- order history customer
- repeat order
- voucher
- promo code
- favorite products

Ini berguna nanti, tapi bukan syarat untuk memvalidasi core value MorrusPOS.

---

## 18. Clean Architecture Frontend yang Disarankan

### 18.1 Layer

- `storefront/features/catalog/api`
- `storefront/features/catalog/types`
- `storefront/features/catalog/hooks`
- `storefront/features/catalog/components`
- `storefront/features/catalog/pages`

Polanya diulang untuk:

- outlets
- cart
- checkout
- orders

### 18.2 Rules

- page hanya menyusun flow
- fetch logic ada di `api/`
- orchestration ringan di `hooks/`
- reusable UI di `components/`
- shared type yang dipakai dua app boleh ada di `shared/types`

### 18.3 Shared Utilities

Boleh di-share dengan backoffice:

- formatter currency
- formatter date
- error normalizer
- API client base

Tidak boleh dicampur terlalu dalam:

- layout dashboard internal
- sidebar internal
- auth admin provider

---

## 19. Routing yang Direkomendasikan

Contoh route tree storefront:

```text
/
├── /
├── /outlets
├── /o/:outletCode
├── /o/:outletCode/menu
├── /o/:outletCode/products/:productId
├── /o/:outletCode/cart
├── /o/:outletCode/checkout
├── /o/:outletCode/orders/:orderId
└── /o/:outletCode/orders/track/:token
```

Kalau ingin lebih sederhana untuk MVP:

```text
/
├── /
├── /menu
├── /cart
├── /checkout
└── /orders/:orderId
```

Tetapi untuk bisnis multi-outlet, pola route dengan outlet code tetap lebih aman.

---

## 20. State Management yang Dibutuhkan

### Global storefront state

- selected outlet
- cart
- customer draft info
- order submission state

### Local page state

- search query
- category filter
- product modal state
- checkout field errors

### Rekomendasi

- Context untuk:
  - outlet context
  - cart context
- local state untuk form
- query/fetch state per page

---

## 21. Realtime Strategy

Ada dua strategi yang realistis:

### Opsi A: Refetch Only

- tiap kali checkout berhasil, data direfresh
- storefront lain poll/refetch ringan

Kelebihan:

- implementasi sederhana

Kekurangan:

- kurang real-time

### Opsi B: SignalR / Realtime Event

- storefront join ke group outlet
- terima `ReceiveStockUpdate`
- update tampilan stok lokal

Kelebihan:

- sesuai narasi real-time MorrusPOS

Kekurangan:

- lebih kompleks

### Rekomendasi

- MVP checkout boleh mulai dari **refetch + validation saat submit**
- sesudah stabil, naik ke **SignalR realtime stock**

---

## 22. Security Considerations

Karena ini frontend public, perlu perhatian khusus:

- jangan expose endpoint admin/internal
- semua public order endpoint harus divalidasi backend
- harga dan total di frontend tidak boleh dipercaya begitu saja
- stok harus dihitung ulang di server saat order submit
- rate limit atau abuse control perlu dipikirkan
- jangan simpan token admin di app customer

---

## 23. SEO dan Discovery

Untuk MVP, SEO bukan prioritas utama.

Tapi jika ingin menuju web ordering publik, nanti perlu:

- metadata outlet
- structured product data
- shareable product page
- open graph

Ini bisa masuk fase lanjut setelah core ordering stabil.

---

## 24. Mobile-First Requirement

Customer ordering hampir pasti lebih banyak dibuka dari mobile.

Maka UI storefront harus:

- one-hand friendly
- tombol besar
- sticky cart CTA
- cepat dibuka
- tidak terlalu table-heavy

Checklist minimum:

- katalog nyaman di layar 360px
- cart nyaman di mobile
- checkout form tidak melelahkan

---

## 25. Test Plan yang Harus Disiapkan

### Manual Testing

Minimal skenario:

1. pilih outlet
2. lihat katalog
3. tambah produk ke cart
4. ubah qty
5. checkout sukses
6. checkout gagal karena stok habis
7. dua browser checkout produk yang sama
8. backoffice melihat stok ikut berkurang

### Automation Testing

Kalau memakai Playwright:

- storefront landing
- add to cart
- cart update
- checkout success
- out-of-stock rejection
- order success page

### Cross-System Validation

Yang paling penting:

- customer checkout sukses
- POS/backoffice inventory ikut berubah
- histori transaksi backend tercatat

---

## 26. Urutan Implementasi yang Direkomendasikan

Kalau ingin cepat menghasilkan demo yang nyata, urutannya:

1. **C0 Fondasi storefront**
2. **C1 Outlet selection + catalog + cart**
3. **C2 Checkout submit ke backend**
4. **Validasi stok berkurang di backoffice**
5. **C3 Realtime stock sync**
6. **Manual testing lintas dua browser**
7. **Playwright untuk flow utama**

Jangan mulai dari payment gateway dulu.

---

## 27. MVP Definition of Done

Customer ordering dianggap MVP selesai jika:

- customer bisa pilih outlet
- customer bisa melihat produk aktif
- customer bisa add to cart
- customer bisa checkout
- backend mencatat order/transaksi
- stok outlet berkurang
- backoffice melihat dampaknya
- jika stok berubah, checkout tetap aman

---

## 28. Risiko Utama

### Risiko produk

- boundary antara customer app dan POS internal kabur
- storefront terlalu rumit terlalu cepat

### Risiko teknis

- backend public API belum siap
- stok race condition saat dua checkout bersamaan
- order submit terlalu percaya data frontend

### Risiko UX

- outlet selection membingungkan
- cart hilang saat refresh
- error stok tidak mudah dipahami customer

---

## 29. Rekomendasi Final

Untuk MorrusPOS sekarang, langkah paling masuk akal adalah:

- tetap pertahankan frontend internal sebagai sistem operasional utama
- bangun **customer ordering MVP** sebagai shell terpisah
- fokus pada:
  - outlet selection
  - catalog
  - cart
  - checkout
  - stock reduction validation

Jangan langsung melompat ke:

- payment gateway kompleks
- akun customer
- promo engine
- marketplace parity

Yang paling penting sekarang adalah membuktikan:

**customer bisa order online, order masuk ke MorrusPOS, dan stok outlet berkurang real-time dengan aman.**

---

## 30. Next Step yang Disarankan

Setelah dokumen ini, langkah implementasi yang paling pas adalah:

1. review backend gap untuk public ordering API
2. kunci arsitektur repo:
   - satu repo dua shell
   - atau repo terpisah
3. buat **implementasi plan fase C0-C2** secara teknis
4. mulai build storefront MVP

