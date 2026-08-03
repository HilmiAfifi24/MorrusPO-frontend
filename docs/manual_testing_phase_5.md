# MorrusPOS Frontend Manual Testing - Fase 5

Dokumen ini dipakai sebagai panduan manual testing frontend untuk modul **Supplier, Purchase Order, dan Utang Supplier** pada MorrusPOS per **3 Agustus 2026**.

Fase 5 frontend yang dicakup:

- halaman supplier aktif
- create dan edit supplier
- soft deactivate supplier
- daftar purchase order
- create purchase order
- detail purchase order
- update status purchase order
- daftar utang supplier
- detail utang supplier
- pembayaran utang supplier
- histori pembayaran supplier
- outlet context procurement untuk owner

---

## 1. Tujuan

Tujuan testing fase 5:

- memastikan flow procurement dasar sudah usable dari frontend tanpa Swagger
- memastikan owner multi-outlet bekerja konsisten pada modul procurement
- memastikan `Admin` dan `Keuangan` bisa memakai modul procurement sesuai outlet yang terikat
- memastikan supplier, PO cash/tempo, dan pembayaran utang selaras dengan perilaku backend
- memastikan role yang tidak berhak tidak melihat atau tidak bisa membuka modul procurement

---

## 2. Scope Fase 5

### Fitur aktif yang wajib diuji

- `/suppliers`
- `/purchase-orders`
- `/purchase-orders/create`
- `/purchase-orders/:id`
- `/supplier-debts`
- `/supplier-debts/payments`
- filter status PO
- filter status utang
- outlet selector procurement untuk owner
- modal detail utang
- modal pembayaran utang

### Di luar scope fase 5

Hal-hal berikut bukan target fase ini:

- supplier return
- receiving workflow terpisah selain update status PO
- attachment invoice
- approval multi-level procurement
- hard delete supplier
- konsinyasi

---

## 3. Prasyarat Environment

Pastikan:

- backend berjalan di `https://localhost:7100`
- frontend berjalan di `http://localhost:5173`
- database sudah termigrasi
- akun dan data uji minimum sudah tersedia

Perintah umum:

```bash
# backend
dotnet run --project src/MorrusPOS.Api
```

```bash
# frontend
npm run dev
```

Opsional verifikasi:

```bash
dotnet test
```

```bash
npm run build
```

---

## 4. Akun Uji yang Disarankan

Siapkan minimal:

- `Owner`
- `Admin`
- `Keuangan`
- `Kasir`
- `Gudang`
- `KepalaCabang`

Ekspektasi akses procurement:

- `Owner`: bisa semua flow procurement dan pindah outlet
- `Admin`: bisa supplier, PO, utang supplier pada outlet yang terikat
- `Keuangan`: bisa supplier, PO, utang supplier pada outlet yang terikat
- `Kasir`: tidak boleh melihat menu procurement
- `Gudang`: tidak boleh melihat menu procurement
- `KepalaCabang`: tidak boleh melihat menu procurement

---

## 5. Data Uji Minimum

Sebelum testing, siapkan:

- minimal 2 outlet aktif
- minimal 2 supplier aktif
- minimal 3 produk aktif pada outlet procurement
- minimal 1 produk dengan stok cukup untuk pembelian contoh
- minimal 1 akun `Admin`
- minimal 1 akun `Keuangan`

Contoh setup data yang disarankan:

- Outlet A: `Outlet Utama`
- Outlet B: `Outlet Kedua`
- Supplier 1: `PT Berkah Jaya Abadi`
- Supplier 2: `CV Sinar Pangan`
- Produk 1: `SKU-001 / Nasi Goreng`
- Produk 2: `SKU-002 / Es Teh`
- Produk 3: `SKU-003 / Kerupuk`

---

## 6. Test Strategy

### Smoke test fase 5

Lakukan urutan berikut:

1. login sebagai `Owner`
2. buka `/suppliers`
3. buat 1 supplier baru
4. buka `/purchase-orders`
5. pilih outlet procurement
6. buat 1 PO cash
7. buka detail PO dan ubah ke `completed`
8. buka `/purchase-orders/create`
9. buat 1 PO tempo
10. buka `/supplier-debts`
11. verifikasi utang supplier tampil
12. lakukan pembayaran parsial
13. buka `/supplier-debts/payments`
14. verifikasi histori pembayaran muncul

### Regression test fase 5

Selain smoke test, tambahkan:

- owner pindah outlet berkali-kali
- nonaktifkan supplier lalu pastikan hilang dari list aktif
- create PO tempo tanpa due date
- create PO dengan item duplikat
- create PO dengan qty atau unit cost invalid
- status PO `completed` tidak bisa diproses ulang
- overpayment utang supplier ditolak
- direct URL test untuk role yang tidak berhak

---

## 7. Matrix Akses Role

| Role | Suppliers | Purchase Orders | Debt List | Payment History | Owner Outlet Switch |
|---|---|---|---|---|---|
| Owner | Ya | Ya | Ya | Ya | Ya |
| Admin | Ya | Ya | Ya | Ya | Tidak |
| Keuangan | Ya | Ya | Ya | Ya | Tidak |
| Kasir | Tidak | Tidak | Tidak | Tidak | Tidak |
| Gudang | Tidak | Tidak | Tidak | Tidak | Tidak |
| KepalaCabang | Tidak | Tidak | Tidak | Tidak | Tidak |

Catatan:

- backend tetap sumber kebenaran akhir untuk akses outlet dan validasi status
- owner wajib memilih outlet procurement saat membuka list PO, utang, atau histori pembayaran
- supplier master tidak memakai selector outlet

---

## 8. Checklist Manual Testing

## 8.1 Menu dan Guard

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-AUTH-01 | Owner melihat menu procurement | Login owner | Menu `Supplier`, `Purchase Order`, dan `Utang Supplier` tampil |
| PROC-AUTH-02 | Admin melihat menu procurement | Login admin | Ketiga menu procurement tampil |
| PROC-AUTH-03 | Keuangan melihat menu procurement | Login keuangan | Ketiga menu procurement tampil |
| PROC-AUTH-04 | Kasir tidak melihat menu procurement | Login kasir | Menu procurement tidak tampil |
| PROC-AUTH-05 | Gudang tidak melihat menu procurement | Login gudang | Menu procurement tidak tampil |
| PROC-AUTH-06 | Direct URL role terlarang | Login kasir lalu buka `/purchase-orders` | Tampil `Akses dibatasi` |

## 8.2 Owner Outlet Context

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-OWNER-01 | Owner buka PO tanpa outlet | Login owner dan buka `/purchase-orders` saat belum pilih outlet | Tampil state `Pilih outlet procurement terlebih dahulu` |
| PROC-OWNER-02 | Owner pilih outlet dari PO list | Pilih outlet pada selector | List PO termuat |
| PROC-OWNER-03 | Owner pindah outlet | Ganti outlet A ke B | List PO, debt, dan payment history mengikuti outlet baru |
| PROC-OWNER-04 | Owner buka debt tanpa outlet | Reset outlet lalu buka `/supplier-debts` | Tampil state outlet required |
| PROC-OWNER-05 | Owner buka payment history tanpa outlet | Reset outlet lalu buka `/supplier-debts/payments` | Tampil state outlet required |

## 8.3 Master Supplier

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-SUP-01 | Load supplier list | Buka `/suppliers` | Tabel supplier aktif tampil |
| PROC-SUP-02 | Empty state supplier | Gunakan database baru tanpa supplier | Tampil empty state |
| PROC-SUP-03 | Open create modal | Klik `Tambah supplier` | Modal supplier tampil |
| PROC-SUP-04 | Validasi nama wajib | Submit form kosong | Error `Nama supplier wajib diisi` tampil |
| PROC-SUP-05 | Validasi email | Isi email tidak valid lalu submit | Error email tampil |
| PROC-SUP-06 | Create supplier sukses | Isi form valid lalu submit | Modal tertutup, success message tampil, row baru muncul di list |
| PROC-SUP-07 | Edit supplier | Klik `Edit`, ubah kontak atau alamat, lalu submit | Perubahan tersimpan di list |
| PROC-SUP-08 | Nonaktifkan supplier | Klik `Nonaktifkan` lalu konfirmasi | Success message tampil dan supplier hilang dari list aktif |

## 8.4 Purchase Order List

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-PO-01 | Load PO list | Buka `/purchase-orders` dengan outlet valid | Tabel PO tampil |
| PROC-PO-02 | Empty PO list | Gunakan outlet tanpa PO | Tampil empty state |
| PROC-PO-03 | Filter draft | Ubah filter status ke `Draft` | Hanya PO draft yang tampil |
| PROC-PO-04 | Filter pending | Ubah filter status ke `Pending` | Hanya PO pending yang tampil |
| PROC-PO-05 | Filter completed | Ubah filter status ke `Completed` | Hanya PO completed yang tampil |
| PROC-PO-06 | Filter cancelled | Ubah filter status ke `Cancelled` | Hanya PO cancelled yang tampil |
| PROC-PO-07 | Link create PO | Klik `Buat PO` | Masuk ke `/purchase-orders/create` |
| PROC-PO-08 | Link detail PO | Klik `Detail` pada salah satu row | Masuk ke `/purchase-orders/:id` |

## 8.5 Create Purchase Order

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-CREATE-01 | Load create page | Buka `/purchase-orders/create` | Form create tampil |
| PROC-CREATE-02 | Owner tanpa outlet | Login owner tanpa pilih outlet lalu buka create page | Tampil state outlet required |
| PROC-CREATE-03 | Lookup supplier dan produk | Pilih outlet valid | Dropdown supplier dan produk termuat |
| PROC-CREATE-04 | Tambah item | Klik `Tambah item` | Row item baru tampil |
| PROC-CREATE-05 | Hapus item | Klik `Hapus` pada salah satu row | Row terhapus, minimal 1 row tetap ada |
| PROC-CREATE-06 | Validasi supplier wajib | Submit tanpa supplier | Error supplier tampil |
| PROC-CREATE-07 | Validasi due date tempo | Pilih `tempo` tanpa due date lalu submit | Error due date tampil |
| PROC-CREATE-08 | Validasi produk duplikat | Pilih produk sama di 2 row | Submit ditolak |
| PROC-CREATE-09 | Validasi qty invalid | Isi qty 0 atau negatif | Submit ditolak |
| PROC-CREATE-10 | Validasi unit cost invalid | Isi unit cost 0 atau negatif | Submit ditolak |
| PROC-CREATE-11 | Preview total PO | Isi qty dan unit cost | Total PO berubah sesuai line total |
| PROC-CREATE-12 | Create PO cash sukses | Buat PO cash valid | Redirect ke detail PO dengan success message |
| PROC-CREATE-13 | Create PO tempo sukses | Buat PO tempo valid | Redirect ke detail PO dengan success message |

## 8.6 Detail Purchase Order

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-DETAIL-01 | Load detail PO | Buka `/purchase-orders/:id` | Header dan item PO tampil lengkap |
| PROC-DETAIL-02 | Draft action buttons | Buka PO draft | Tombol `pending`, `completed`, `cancelled` tampil |
| PROC-DETAIL-03 | Pending action buttons | Buka PO pending | Tombol `completed` dan `cancelled` tampil |
| PROC-DETAIL-04 | Completed no action | Buka PO completed | Tombol transisi tidak tampil lagi |
| PROC-DETAIL-05 | Update ke pending | Klik `Kirim ke pending` lalu konfirmasi | Status berubah menjadi `pending` |
| PROC-DETAIL-06 | Update ke completed | Klik `Selesaikan PO` lalu konfirmasi | Status berubah menjadi `completed` |
| PROC-DETAIL-07 | Update ke cancelled | Klik `Batalkan PO` lalu konfirmasi | Status berubah menjadi `cancelled` |
| PROC-DETAIL-08 | Double completion guard | Coba proses ulang PO completed | Error backend tampil rapi |

## 8.7 Daftar Utang Supplier

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-DEBT-01 | Load debt list | Buka `/supplier-debts` dengan outlet valid | Tabel utang supplier tampil |
| PROC-DEBT-02 | Empty debt list | Gunakan outlet tanpa PO tempo completed | Tampil empty state |
| PROC-DEBT-03 | Filter unpaid | Ubah filter ke `unpaid` | Hanya utang unpaid tampil |
| PROC-DEBT-04 | Filter partially paid | Ubah filter ke `partially_paid` | Hanya utang partially paid tampil |
| PROC-DEBT-05 | Filter paid | Ubah filter ke `paid` | Hanya utang paid tampil |
| PROC-DEBT-06 | Open debt detail | Klik `Detail` | Modal detail utang tampil |
| PROC-DEBT-07 | Open pay modal | Klik `Bayar` pada utang unpaid/partial | Modal pembayaran tampil |
| PROC-DEBT-08 | Paid debt button | Lihat row dengan status `paid` | Tombol `Bayar` disabled |

## 8.8 Pembayaran Utang Supplier

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-PAY-01 | Default nominal sisa utang | Buka modal bayar | Field nominal terisi sisa utang saat ini |
| PROC-PAY-02 | Validasi nominal wajib | Kosongkan nominal lalu submit | Error nominal tampil |
| PROC-PAY-03 | Validasi nominal > 0 | Isi 0 lalu submit | Error nominal tampil |
| PROC-PAY-04 | Validasi overpayment | Isi nominal melebihi sisa utang | Error nominal tampil |
| PROC-PAY-05 | Validasi metode pembayaran | Kosongkan metode lalu submit | Error metode pembayaran tampil |
| PROC-PAY-06 | Parsial payment sukses | Bayar kurang dari sisa utang | Success message tampil, row debt berubah ke `partially_paid` |
| PROC-PAY-07 | Full payment sukses | Bayar tepat sebesar sisa utang | Success message tampil, row debt berubah ke `paid` |
| PROC-PAY-08 | Refresh detail debt | Bayar utang saat modal detail PO sama masih terbuka | Nilai paid dan remaining ikut berubah |

## 8.9 Histori Pembayaran Supplier

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| PROC-HIST-01 | Load payment history | Buka `/supplier-debts/payments` | Tabel histori pembayaran tampil |
| PROC-HIST-02 | Empty history | Gunakan outlet tanpa payment | Tampil empty state |
| PROC-HIST-03 | Ordering terbaru | Lihat dua payment berbeda waktu | Payment terbaru muncul lebih atas |
| PROC-HIST-04 | Outlet switch owner | Login owner lalu ganti outlet | Data histori ikut berubah |
| PROC-HIST-05 | Back to debts | Klik `Kembali ke utang` | Kembali ke `/supplier-debts` |

---

## 9. Skenario End-to-End yang Disarankan

### Skenario E2E-1: Supplier → PO Cash → Completed

1. Login sebagai `Owner`
2. Buka `/suppliers`
3. Buat supplier baru
4. Buka `/purchase-orders`
5. Pilih outlet procurement
6. Buat PO `cash`
7. Submit dan masuk ke detail PO
8. Ubah status menjadi `completed`
9. Verifikasi status berubah dan success message tampil

### Skenario E2E-2: PO Tempo → Debt → Partial Payment → Full Payment

1. Login sebagai `Owner` atau `Keuangan`
2. Buka `/purchase-orders/create`
3. Buat PO `tempo` dengan due date valid
4. Dari detail PO, ubah ke `completed`
5. Buka `/supplier-debts`
6. Verifikasi utang baru muncul dengan status `unpaid`
7. Bayar sebagian
8. Verifikasi status menjadi `partially_paid`
9. Bayar sisa utang
10. Verifikasi status menjadi `paid`
11. Buka `/supplier-debts/payments`
12. Verifikasi dua riwayat pembayaran tampil

### Skenario E2E-3: Guard Akses Role

1. Login sebagai `Kasir`
2. Cek sidebar
3. Pastikan menu procurement tidak tampil
4. Coba akses `/suppliers`, `/purchase-orders`, `/supplier-debts`
5. Verifikasi semua diblokir oleh `Akses dibatasi`

---

## 10. Expected Known Behaviors

Perilaku berikut dianggap normal pada fase 5:

- supplier nonaktif hilang dari list aktif
- owner wajib memilih outlet procurement untuk PO/debt/payment history
- supplier master tidak memakai selector outlet
- PO `cash` yang selesai tidak membentuk utang
- PO `tempo` yang selesai membentuk utang otomatis
- histori pembayaran supplier bersifat read-only

---

## 11. Catatan Pelaporan Bug

Saat membuat bug report, sertakan:

- role user yang dipakai
- outlet aktif saat kejadian
- URL halaman
- payload atau input yang dipakai
- expected vs actual result
- screenshot error bila ada

Jika bug terkait outlet context owner, sertakan juga:

- outlet sebelum switch
- outlet setelah switch
- halaman yang dibuka sesudah switch

