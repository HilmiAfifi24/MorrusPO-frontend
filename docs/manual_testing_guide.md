# MorrusPOS Frontend Manual Testing Guide

Dokumen ini dipakai sebagai panduan manual testing untuk QA dan developer pada frontend **MorrusPOS** yang saat ini aktif sampai:

- shell aplikasi dan autentikasi
- manajemen pengguna
- manajemen cabang
- master kategori dan produk
- inventory, stock opname, dan transfer stok
- supplier, purchase order, dan utang supplier
- sesi kasir
- POS kasir
- histori transaksi
- void, refund dasar, dan print struk

Dokumen ini disusun untuk kondisi project per **3 Agustus 2026**.

---

## 1. Tujuan

Tujuan manual testing ini:

- memastikan fitur frontend aktif berjalan sesuai flow bisnis saat ini
- membedakan error nyata vs modul yang memang masih placeholder
- memberi checklist regresi cepat sebelum demo atau merge besar
- menyamakan ekspektasi QA dan developer saat verifikasi fitur

---

## 2. Scope Saat Ini

### Fitur aktif yang wajib diuji

- login dan logout
- auth guard dan redirect
- dashboard shell
- users
- outlets
- categories
- products
- inventory
- stock opnames
- stock transfers
- suppliers
- purchase orders
- supplier debts
- cashier session
- POS kasir
- histori transaksi
- detail transaksi
- void transaksi
- refund dasar
- print struk browser

### Modul yang masih placeholder

Modul berikut sudah ada di menu, tetapi **belum dianggap bug** jika hanya menampilkan placeholder:

- konsinyasi

QA perlu menandai modul ini sebagai:

- `Expected Placeholder`

bukan sebagai defect fungsional.

---

## 3. Prasyarat Environment

Sebelum testing, pastikan:

- backend API berjalan di `https://localhost:7100`
- frontend Vite berjalan di `http://localhost:5173`
- database backend sudah termigrasi dan seed dasar sudah tersedia
- browser desktop modern tersedia
- popup print browser tidak diblokir

Perintah umum:

```bash
# backend
dotnet run --project src/MorrusPOS.Api
```

```bash
# frontend
npm run dev
```

Opsional verifikasi build:

```bash
npm run build
```

```bash
dotnet build
```

---

## 4. Akun Uji

### Akun default yang tersedia dari seed

- Role: `Owner`
- Email: `owner@morruspos.com`
- Password: `owner123`

### Akun tambahan untuk testing role

Jika akun `Admin` dan `Kasir` belum ada di database, buat dari UI dengan login sebagai `Owner`:

1. buka menu `Pengguna`
2. buat user baru dengan role `Admin`
3. buat user baru dengan role `Kasir`
4. assign outlet aktif sesuai kebutuhan test

Disarankan minimal ada:

- 1 akun `Admin` terikat ke outlet aktif
- 1 akun `Kasir` terikat ke outlet aktif

---

## 5. Data Uji Minimum

Sebelum mulai regression penuh, siapkan data berikut:

- minimal 1 outlet aktif
- minimal 1 kategori
- minimal 2 produk aktif
- minimal 1 produk dengan stok `> 0`
- minimal 1 produk dengan stok `0` atau sangat kecil
- minimal 1 user `Admin`
- minimal 1 user `Kasir`

Disarankan menyiapkan produk seperti:

- `SKU-001 / Nasi Goreng / stok 10`
- `SKU-002 / Es Teh / stok 0`

Ini akan memudahkan verifikasi POS, stok habis, dan transaksi.

---

## 6. Test Strategy

### Smoke test

Dipakai untuk validasi cepat setelah pull/update:

- login
- buka dashboard
- buka products
- buka categories
- buka users
- buka outlets
- buka cashier session
- buka POS
- checkout 1 transaksi
- buka histori transaksi

### Regression test

Dipakai sebelum demo, release internal, atau merge besar:

- seluruh smoke test
- create/edit/delete kategori
- create/edit/delete produk
- create/edit user
- create/edit outlet
- inventory filter dan owner outlet switching
- create stock opname
- create/approve/reject stock transfer
- open session
- close session
- mixed payment
- refund dasar
- void transaksi
- print struk
- role testing Owner/Admin/Kasir

---

## 7. Test Matrix Per Role

| Role | Dashboard | Sesi Kasir | POS | Transaksi | Produk | Kategori | Stok | Transfer | Supplier | PO | Utang Supplier | Konsinyasi | Users | Outlets | Void | Refund |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Owner | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Placeholder | Ya | Ya | Ya | Ya |
| Admin | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Placeholder | Ya | Ya | Ya | Ya |
| Kasir | Ya | Ya | Ya | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |
| Gudang | Ya | Tidak | Tidak | Tidak | Ya | Ya | Ya | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Keuangan | Ya | Tidak | Tidak | Ya | Tidak | Tidak | Tidak | Tidak | Ya | Ya | Ya | Placeholder | Tidak | Tidak | Tidak | Tidak |
| KepalaCabang | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Ya | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak | Ya |

Catatan:

- Modul placeholder bukan bug bila hanya menampilkan status `Coming soon` atau placeholder setara.
- `Void` saat ini dibatasi untuk `Owner/Admin` melalui permission backend `transaction.void`.
- `Refund dasar` saat ini tersedia untuk role operasional yang memang masuk flow transaksi.
- Referensi policy lengkap ada di [role_access_matrix.md](./role_access_matrix.md).
- Panduan khusus fase 4 ada di [manual_testing_phase_4.md](./manual_testing_phase_4.md).
- Panduan khusus fase 5 ada di [manual_testing_phase_5.md](./manual_testing_phase_5.md).

---

## 8. Checklist Manual Testing

## 8.1 Auth dan Shell

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| AUTH-01 | Guest buka dashboard | Buka `/dashboard` tanpa login | Redirect ke `/signin` |
| AUTH-02 | Login sukses owner | Login dengan akun owner | Masuk ke `/dashboard` |
| AUTH-03 | Login gagal | Masukkan password salah | Muncul error login |
| AUTH-04 | Persist session | Login lalu refresh browser | Tetap login |
| AUTH-05 | Logout | Klik `Akun` lalu `Logout` | Session dibersihkan dan kembali ke `/signin` |
| AUTH-06 | Sidebar role owner | Login sebagai owner | Semua menu owner/admin tampil |
| AUTH-07 | Sidebar role kasir | Login sebagai kasir | Hanya menu operasional tampil |

## 8.2 Dashboard

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| DASH-01 | Dashboard load | Login lalu buka `/dashboard` | Halaman tampil tanpa crash |
| DASH-02 | Info user | Periksa kartu current user | Nama user benar |
| DASH-03 | Info role | Periksa kartu current role | Role benar |
| DASH-04 | Info outlet | Periksa kartu current outlet | Owner bisa tampil `Semua outlet`, user outlet-bound tampil outlet terkait |

## 8.3 Users

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| USER-01 | List user | Buka `/users` sebagai owner/admin | Tabel user tampil |
| USER-02 | Create admin | Tambah user role Admin | User tersimpan dan muncul di list |
| USER-03 | Create kasir | Tambah user role Kasir dengan outlet aktif | User tersimpan dan muncul di list |
| USER-04 | Edit user | Edit nama atau role user | Perubahan tersimpan |
| USER-05 | Change password | Buka `/profile/change-password` | Form tampil dan submit berhasil jika input valid |
| USER-06 | Outlet nonaktif validation | Coba assign user ke outlet nonaktif jika data ada | UI atau backend menolak sesuai validasi |

## 8.4 Outlets

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| OUTLET-01 | List outlets | Buka `/outlets` | Daftar cabang tampil |
| OUTLET-02 | Create outlet | Tambah cabang baru | Cabang tersimpan |
| OUTLET-03 | Edit outlet | Edit nama/alamat/telepon cabang | Data berubah |
| OUTLET-04 | Nonaktif outlet | Set `isActive` ke false | Outlet tampil sebagai nonaktif |
| OUTLET-05 | Admin restriction | Login sebagai admin | Halaman bisa dibuka, tetapi create/edit mengikuti pembatasan UI saat ini |

## 8.5 Categories

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CAT-01 | List categories | Buka `/categories` | Tabel kategori tampil |
| CAT-02 | Create root category | Tambah kategori tanpa parent | Kategori tersimpan |
| CAT-03 | Create child category | Tambah kategori dengan parent | Parent tampil benar |
| CAT-04 | Edit category | Ubah nama kategori | Perubahan tersimpan |
| CAT-05 | Self-parent prevention | Edit kategori dan cek pilihan parent | Kategori tidak bisa memilih dirinya sendiri |
| CAT-06 | Delete category unused | Hapus kategori yang tidak dipakai | Kategori terhapus |
| CAT-07 | Delete category in use | Hapus kategori yang dipakai produk | Backend menolak dan error tampil rapi |

## 8.6 Products

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROD-01 | Owner buka products tanpa outlet | Login owner, buka `/products` tanpa memilih outlet | Muncul state `Pilih outlet terlebih dahulu` |
| PROD-02 | Owner pilih outlet | Pilih outlet aktif | List produk termuat |
| PROD-03 | Admin buka products | Login admin outlet-bound | List termuat tanpa harus pilih outlet manual |
| PROD-04 | Create product valid | Tambah produk baru | Produk tersimpan |
| PROD-05 | Edit product | Ubah nama/harga/unit | Perubahan tersimpan |
| PROD-06 | Delete product | Hapus produk | Produk hilang atau dinonaktifkan sesuai backend |
| PROD-07 | Duplicate SKU | Buat produk dengan SKU sama | Error validasi backend tampil |
| PROD-08 | Duplicate barcode | Buat produk dengan barcode sama | Error validasi backend tampil |
| PROD-09 | Consignment label | Buat/edit produk konsinyasi | Badge tipe tampil benar |
| PROD-10 | Stock display | Lihat stok di list | Qty per outlet tampil sesuai backend |

## 8.7 Cashier Session

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| SESSION-01 | Open session owner | Owner pilih outlet lalu buka sesi | Sesi aktif dibuat |
| SESSION-02 | Open session admin/kasir | Login admin/kasir lalu buka sesi | Sesi aktif dibuat untuk outlet user |
| SESSION-03 | Duplicate active session | Coba buka sesi kedua pada kondisi masih aktif | Backend menolak atau tetap menampilkan sesi aktif |
| SESSION-04 | Redirect POS without session | Tutup sesi lalu buka `/pos` | Redirect ke `/cashier/session` |
| SESSION-05 | Close session valid | Isi kas aktual dan tutup sesi | Sesi berubah closed |
| SESSION-06 | Close session invalid | Tutup sesi tanpa kas aktual | Muncul validasi form |

## 8.8 POS Kasir

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| POS-01 | Buka POS dengan sesi aktif | Dari sesi aktif buka `/pos` | Halaman POS tampil |
| POS-02 | Search product | Cari dengan nama/SKU/barcode | Filtering client-side bekerja |
| POS-03 | Add item to cart | Klik produk stok tersedia | Item masuk keranjang |
| POS-04 | Merge same item | Klik produk yang sama lagi | Qty bertambah, bukan item baru |
| POS-05 | Out-of-stock disabled | Klik produk stok 0 | Produk tidak bisa ditambahkan |
| POS-06 | Edit qty valid | Ubah qty item | Total berubah benar |
| POS-07 | Edit qty beyond stock | Set qty melebihi stok | Warning tampil, qty tidak diterapkan |
| POS-08 | Item discount valid | Isi diskon item | Grand total berkurang sesuai nilai |
| POS-09 | Item discount invalid | Isi diskon melebihi nilai item | Warning tampil |
| POS-10 | Single payment | Bayar penuh dengan Cash | Checkout aktif |
| POS-11 | Mixed payment | Tambah metode lalu bagi nominal | Checkout aktif jika balance |
| POS-12 | Unbalanced payment | Total payment tidak sama grand total | Tombol checkout disabled atau submit ditolak |
| POS-13 | Checkout success | Checkout valid | Redirect ke detail transaksi |
| POS-14 | Realtime stock same outlet | Dua browser outlet sama, browser A checkout | Browser B melihat stok berubah atau refetch berhasil |

## 8.9 Transactions, Void, Refund, Print

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| TX-01 | Recent transactions list | Buka `/transactions` | Histori tampil |
| TX-02 | Owner filter outlet | Owner pilih outlet di histori | Histori mengikuti outlet aktif |
| TX-03 | Open transaction detail | Klik detail transaksi | Detail tampil |
| TX-04 | Print receipt | Klik `Print struk` | Dialog print browser muncul |
| TX-05 | Void by owner/admin | Isi alasan lalu void transaksi completed | Status menjadi `voided`, stok kembali |
| TX-06 | Void by kasir | Login kasir lalu buka detail | Tombol void tidak usable |
| TX-07 | Refund partial | Refund sebagian qty item | Histori refund bertambah, remaining qty berkurang |
| TX-08 | Refund full | Refund semua qty seluruh item | Status transaksi dapat berubah `refunded` |
| TX-09 | Refund over remaining | Refund melebihi sisa qty | Backend menolak |
| TX-10 | Void after refund | Coba void transaksi yang sudah ada refund | Backend menolak |

## 8.10 Consignments

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-01 | Open consignments list | Buka `/consignments` | Tabel tanda terima tampil |
| CON-02 | Open create receipt | Klik `Buat tanda terima` | Masuk ke `/consignments/create` |
| CON-03 | Create receipt success | Isi form valid lalu submit | Redirect ke detail receipt |
| CON-04 | Receive receipt | Proses status `received` | Status berubah dan receipt final |
| CON-05 | Open settlements | Klik `Settlement` | Masuk ke `/consignment-settlements` |
| CON-06 | Create settlement | Pilih supplier dengan unpaid sales | Draft settlement berhasil dibuat |
| CON-07 | Settle supplier | Proses status `settled` | Status settlement menjadi `settled` |

## 8.11 Placeholder Modules

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PH-01 | Future placeholder check | Buka modul yang memang belum aktif di roadmap setelah fase 6 | Tampil placeholder sesuai role |

---

## 9. Regression Order yang Disarankan

Jika waktu sempit, jalankan urutan ini:

1. `AUTH-01` sampai `AUTH-05`
2. `OUTLET-01` sampai `OUTLET-03`
3. `CAT-01` sampai `CAT-04`
4. `PROD-01` sampai `PROD-05`
5. `SESSION-01`
6. `POS-03`, `POS-06`, `POS-10`, `POS-13`
7. `TX-01`, `TX-03`, `TX-04`
8. `TX-05` atau `TX-07`
9. `CON-01` sampai `CON-04`

---

## 10. Known Behavior yang Bukan Bug

Hal berikut saat ini dianggap expected:

- owner harus memilih outlet di beberapa halaman operasional
- POS saat ini memakai pencarian client-side, bukan search endpoint khusus
- print struk masih memakai `window.print()` browser
- refund saat ini masih `refund dasar`, belum ada refund nominal per payment method
- void dan refund belum punya approval flow terpisah

Panduan detail frontend fase 6:

- `docs/manual_testing_phase_6.md`

---

## 11. Hubungan dengan Automation Testing

Frontend sudah punya automation testing Playwright dasar.

Suite E2E yang sudah ada saat ini mencakup:

- auth guard guest
- login sukses
- owner wajib pilih outlet sebelum load products
- procurement owner wajib pilih outlet sebelum load PO/debt

Jalankan dengan:

```bash
npm run test:e2e
```

Dokumen ini tetap penting karena:

- Playwright saat ini baru menutup sebagian flow
- banyak skenario bisnis masih perlu validasi manual
- cross-browser, popup print, dan UX error masih lebih aman dicek manual

---

## 12. Format Pelaporan Bug

Saat menemukan bug, catat minimal:

- ID test case
- role yang dipakai
- URL halaman
- data input
- langkah reproduksi singkat
- actual result
- expected result
- screenshot atau video
- log console/network jika relevan

Contoh singkat:

```text
ID: POS-12
Role: Kasir
URL: /pos
Data: Grand total 18.000, payment 10.000
Expected: Checkout tetap disabled
Actual: Tombol checkout aktif dan request terkirim
Evidence: screenshot + network log
```

---

## 13. Penutup

Jika ada fitur baru yang diaktifkan:

- tambahkan skenario manual test baru ke dokumen ini
- tandai modul yang berubah dari placeholder menjadi aktif
- sinkronkan dengan suite Playwright agar regression manual dan automation tetap saling melengkapi
