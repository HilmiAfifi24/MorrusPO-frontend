# MorrusPOS Frontend Manual Testing - Fase 4

Dokumen ini dipakai sebagai panduan manual testing frontend untuk modul **Inventory, Stock Opname, dan Transfer Cabang** pada MorrusPOS per **3 Agustus 2026**.

Fase 4 frontend yang dicakup:

- halaman inventory aktif
- histori stock opname
- create stock opname
- detail stock opname
- outgoing stock transfer
- incoming stock transfer
- detail stock transfer
- outlet context global untuk owner
- realtime refresh stok berbasis event SignalR

---

## 1. Tujuan

Tujuan testing fase 4:

- memastikan modul stok sudah usable tanpa Swagger
- memverifikasi flow owner multi-outlet di frontend
- memastikan stock opname dan transfer stok selaras dengan perilaku backend
- memastikan role `Owner`, `Admin`, `Gudang`, dan `KepalaCabang` mendapat akses yang benar
- memastikan user yang tidak berhak tidak melihat atau tidak bisa membuka modul stok

---

## 2. Scope Fase 4

### Fitur aktif yang wajib diuji

- `/inventory`
- `/stock-opnames`
- `/stock-opnames/create`
- `/stock-opnames/:id`
- `/stock-transfers/outgoing`
- `/stock-transfers/incoming`
- `/stock-transfers/:id`
- filter stok rendah
- outlet selector untuk owner
- approve/reject transfer

### Di luar scope fase 4

Hal-hal berikut bukan target fase ini:

- ubah nilai `minStockAlert` dari UI
- stock opname edit/delete
- cancel transfer dari UI
- supplier, PO, utang supplier, konsinyasi
- realtime sinkronisasi semua halaman secara granular selain refresh stok yang relevan

---

## 3. Prasyarat Environment

Pastikan:

- backend berjalan di `https://localhost:7100`
- frontend berjalan di `http://localhost:5173`
- database sudah ter-migrate
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
- `Gudang`
- `KepalaCabang`
- `Kasir`
- `Keuangan`

Ekspektasi akses stok:

- `Owner`: bisa semua flow stok dan pindah outlet
- `Admin`: bisa semua flow stok pada outlet yang terikat
- `Gudang`: bisa inventory, opname, transfer
- `KepalaCabang`: bisa inventory, opname, transfer
- `Kasir`: tidak boleh melihat menu stok/transfer
- `Keuangan`: tidak boleh melihat menu stok/transfer

---

## 5. Data Uji Minimum

Sebelum testing, siapkan:

- minimal 2 outlet aktif
- minimal 1 user `Gudang` atau `Admin` di outlet A
- minimal 1 user `Admin`, `Gudang`, atau `KepalaCabang` di outlet B untuk approval transfer
- minimal 3 produk aktif
- minimal 1 produk dengan stok aman
- minimal 1 produk dengan stok rendah
- minimal 1 produk dengan stok 0

Contoh setup data yang disarankan:

- Outlet A: `Outlet Utama`
- Outlet B: `Outlet Kedua`
- Produk 1: `SKU-001 / Nasi Goreng / qty 20 / min alert 5`
- Produk 2: `SKU-002 / Es Teh / qty 3 / min alert 5`
- Produk 3: `SKU-003 / Kerupuk / qty 0 / min alert 2`

---

## 6. Test Strategy

### Smoke test fase 4

Lakukan urutan berikut:

1. login sebagai `Owner`
2. buka `/inventory`
3. pilih outlet
4. cek list stok tampil
5. aktifkan filter stok rendah
6. buka `/stock-opnames`
7. buat stock opname 1 item
8. buka `/stock-transfers/outgoing`
9. buat transfer stok 1 item
10. login user outlet tujuan
11. buka `/stock-transfers/incoming`
12. approve transfer

### Regression test fase 4

Selain smoke test, tambahkan:

- direct URL test per role
- owner pindah outlet berkali-kali
- reject transfer
- approve transfer dengan stok kurang
- realtime refresh stok setelah opname/approve transfer
- validasi produk duplikat pada form opname/transfer

---

## 7. Matrix Akses Role

| Role | Inventory | Stock Opnames | Transfer Outgoing | Transfer Incoming | Approve/Reject | Owner Outlet Switch |
|---|---|---|---|---|---|---|
| Owner | Ya | Ya | Ya | Ya | Ya | Ya |
| Admin | Ya | Ya | Ya | Ya | Ya | Tidak |
| Gudang | Ya | Ya | Ya | Ya | Ya, jika outlet tujuan | Tidak |
| KepalaCabang | Ya | Ya | Ya | Ya | Ya, jika outlet tujuan | Tidak |
| Kasir | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |
| Keuangan | Tidak | Tidak | Tidak | Tidak | Tidak | Tidak |

Catatan:

- frontend boleh menampilkan tombol approve/reject pada incoming transfer yang `pending`, tetapi backend tetap sumber kebenaran akhir
- `Owner/Admin` boleh approve/reject lintas outlet sesuai policy backend saat ini
- role outlet-bound tidak boleh mengakses outlet lain lewat direct URL/query

---

## 8. Checklist Manual Testing

## 8.1 Menu dan Guard

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-AUTH-01 | Owner melihat menu stok | Login owner | Menu `Stok` dan `Transfer Stok` tampil di sidebar |
| INV-AUTH-02 | Gudang melihat menu stok | Login gudang | Menu `Stok` dan `Transfer Stok` tampil |
| INV-AUTH-03 | Kasir tidak melihat menu stok | Login kasir | Menu `Stok` dan `Transfer Stok` tidak tampil |
| INV-AUTH-04 | Keuangan tidak melihat menu stok | Login keuangan | Menu `Stok` dan `Transfer Stok` tidak tampil |
| INV-AUTH-05 | Direct URL role terlarang | Login kasir lalu buka `/inventory` | Tampil `Akses dibatasi` |

## 8.2 Owner Outlet Context

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-OWNER-01 | Owner buka inventory tanpa outlet | Login owner dan buka `/inventory` saat belum pilih outlet | Tampil state `Pilih outlet terlebih dahulu` |
| INV-OWNER-02 | Owner pilih outlet dari inventory | Pilih outlet pada selector | List inventory termuat |
| INV-OWNER-03 | Owner pindah outlet | Ganti outlet A ke B | List inventory, histori opname, dan transfer mengikuti outlet baru |
| INV-OWNER-04 | Owner buka histori opname tanpa outlet | Reset outlet lalu buka `/stock-opnames` | Tampil state outlet required |
| INV-OWNER-05 | Owner buka transfer outgoing tanpa outlet | Reset outlet lalu buka `/stock-transfers/outgoing` | Tampil state outlet required |

## 8.3 Inventory Listing

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-LIST-01 | Load inventory sukses | Buka `/inventory` dengan outlet valid | Tabel inventory tampil |
| INV-LIST-02 | Search by name | Cari nama produk | Hasil terfilter benar |
| INV-LIST-03 | Search by SKU | Cari SKU produk | Hasil terfilter benar |
| INV-LIST-04 | Search by barcode | Cari barcode produk | Hasil terfilter benar bila barcode ada |
| INV-LIST-05 | Filter stok rendah | Ubah filter ke `stok rendah` | Hanya item rendah/habis yang tampil |
| INV-LIST-06 | Toggle stok 0 off | Matikan checkbox `Tampilkan stok 0` | Produk qty 0 hilang dari list |
| INV-LIST-07 | Badge status aman | Lihat produk stok aman | Badge `Aman` tampil |
| INV-LIST-08 | Badge status rendah | Lihat produk stok rendah | Badge `Rendah` tampil |
| INV-LIST-09 | Badge status habis | Lihat produk qty 0 | Badge `Habis` tampil |
| INV-LIST-10 | Empty result | Gunakan search yang tidak match | Tampil empty state inventory |

## 8.4 Histori Stock Opname

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-OPN-01 | Load histori opname | Buka `/stock-opnames` | List histori tampil |
| INV-OPN-02 | Empty histori | Gunakan outlet tanpa opname | Tampil empty state |
| INV-OPN-03 | Detail link | Klik tombol `Detail` pada salah satu opname | Masuk ke `/stock-opnames/:id` |
| INV-OPN-04 | Detail menampilkan item | Lihat detail opname | Item, system qty, physical qty, variance tampil |

## 8.5 Create Stock Opname

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-CRT-01 | Buka form create | Buka `/stock-opnames/create` | Form tampil |
| INV-CRT-02 | Tambah item opname | Klik `Tambah item` | Row baru tampil |
| INV-CRT-03 | Hapus item opname | Klik `Hapus` pada row | Row terhapus, minimal 1 row tersisa |
| INV-CRT-04 | System qty readonly | Pilih produk | System qty tampil readonly |
| INV-CRT-05 | Variance preview | Isi physical qty berbeda | Variance preview berubah sesuai selisih |
| INV-CRT-06 | Produk duplikat | Pilih produk yang sama di 2 row | Submit ditolak dengan error validasi |
| INV-CRT-07 | Physical qty invalid | Isi physical qty negatif atau kosong semua | Submit ditolak |
| INV-CRT-08 | Submit sukses variance positif | Buat opname physical qty > system qty | Redirect ke detail opname dengan success message |
| INV-CRT-09 | Submit sukses variance negatif | Buat opname physical qty < system qty | Redirect ke detail dan variance negatif tampil |
| INV-CRT-10 | Verifikasi update inventory | Setelah opname sukses, kembali ke `/inventory` | Qty produk berubah sesuai hasil opname |

## 8.6 Transfer Outgoing

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-TRF-01 | Load outgoing list | Buka `/stock-transfers/outgoing` | List outgoing tampil |
| INV-TRF-02 | Open create modal | Klik `Buat transfer` | Modal form transfer tampil |
| INV-TRF-03 | Outlet tujuan tidak boleh sama | Cek dropdown outlet tujuan | Outlet asal tidak tersedia di dropdown |
| INV-TRF-04 | Tambah item transfer | Klik `Tambah item` | Row item baru tampil |
| INV-TRF-05 | Produk duplikat transfer | Pilih produk sama di 2 row | Submit ditolak |
| INV-TRF-06 | Qty invalid | Isi qty 0 atau negatif | Submit ditolak |
| INV-TRF-07 | Submit transfer sukses | Isi form valid dan submit | Modal tertutup, success message tampil, row baru muncul di list |
| INV-TRF-08 | Status pending | Lihat row transfer baru | Status `pending` tampil |
| INV-TRF-09 | Stok asal belum berubah saat pending | Kembali ke `/inventory` outlet asal | Qty belum berubah sebelum approve |

## 8.7 Transfer Incoming dan Approval

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-INC-01 | Load incoming list | Login user outlet tujuan lalu buka `/stock-transfers/incoming` | Transfer incoming tampil |
| INV-INC-02 | Tombol approve/reject | Lihat transfer berstatus pending | Tombol `Approve` dan `Reject` tampil |
| INV-INC-03 | Detail transfer | Klik `Detail` | Halaman detail transfer tampil |
| INV-INC-04 | Reject transfer | Klik `Reject` lalu konfirmasi | Status berubah ke `rejected` |
| INV-INC-05 | Stok tidak berubah setelah reject | Cek inventory outlet asal dan tujuan | Qty kedua outlet tetap |
| INV-INC-06 | Approve transfer sukses | Buat transfer baru lalu approve | Status berubah ke `approved` |
| INV-INC-07 | Stok outlet asal berkurang | Buka inventory outlet asal setelah approve | Qty berkurang sesuai transfer |
| INV-INC-08 | Stok outlet tujuan bertambah | Buka inventory outlet tujuan setelah approve | Qty bertambah sesuai transfer |
| INV-INC-09 | Approve stok kurang | Ajukan transfer melebihi stok, lalu approve | Error backend tampil jelas dan status tetap pending |

## 8.8 Detail Transfer

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-DTL-01 | Load detail transfer | Buka `/stock-transfers/:id` | Ringkasan transfer tampil |
| INV-DTL-02 | Item transfer tampil | Lihat tabel item | SKU, nama produk, qty tampil |
| INV-DTL-03 | Approve dari detail | Klik approve pada transfer pending | Status berubah ke approved |
| INV-DTL-04 | Reject dari detail | Klik reject pada transfer pending | Status berubah ke rejected |
| INV-DTL-05 | Tombol aksi hilang setelah selesai | Buka transfer approved/rejected | Tombol approve/reject tidak tampil lagi |

## 8.9 Realtime Stok

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| INV-RT-01 | Realtime inventory setelah opname | Browser A buka inventory, browser B submit opname pada outlet sama | Browser A melihat stok ter-refresh |
| INV-RT-02 | Realtime inventory setelah approve transfer | Browser A buka inventory outlet tujuan, browser B approve incoming transfer outlet tujuan yang sama | Browser A melihat qty bertambah |
| INV-RT-03 | Warning realtime di form opname | Buka form create opname, lalu ubah stok dari browser lain pada outlet sama | Muncul warning bahwa stok sistem berubah |

---

## 9. Skenario End-to-End yang Disarankan

### Skenario E2E-01: Owner Multi-Outlet

1. Login sebagai `Owner`
2. Buka `/inventory`
3. Pilih `Outlet A`
4. Catat stok produk tertentu
5. Ganti ke `Outlet B`
6. Pastikan stok produk yang sama berubah mengikuti outlet B

Expected:

- outlet context global bekerja
- inventory tidak tercampur antar outlet

### Skenario E2E-02: Stock Opname Lengkap

1. Login sebagai `Gudang`
2. Buka `/stock-opnames/create`
3. Pilih 1 produk dengan system qty yang sudah diketahui
4. Isi physical qty berbeda
5. Submit
6. Buka detail opname
7. Kembali ke `/inventory`

Expected:

- detail opname memuat variance yang benar
- qty inventory sudah menyesuaikan hasil opname

### Skenario E2E-03: Transfer Antarcabang

1. Login user outlet A
2. Buka `/stock-transfers/outgoing`
3. Ajukan transfer ke outlet B
4. Logout
5. Login user outlet B
6. Buka `/stock-transfers/incoming`
7. Approve transfer
8. Verifikasi inventory outlet B
9. Login kembali ke outlet A dan verifikasi inventory outlet A

Expected:

- status transfer berubah dari `pending` ke `approved`
- stok outlet asal turun
- stok outlet tujuan naik

---

## 10. Risiko / Catatan yang Bukan Bug

Temuan berikut tidak selalu bug:

- owner melihat state `Pilih outlet terlebih dahulu` sebelum memilih outlet
- list kosong karena outlet aktif memang belum punya histori opname/transfer
- warning realtime di form opname saat stok berubah dari browser lain
- transfer pending belum mengubah stok

Yang harus dianggap bug:

- role yang tidak berhak bisa masuk modul stok
- transfer rejected tetap mengubah stok
- approve transfer tidak mengubah stok
- stock opname sukses tetapi inventory tidak berubah
- owner pindah outlet tetapi list tetap outlet lama

---

## 11. Ringkasan Exit Criteria

Fase 4 frontend dianggap lolos manual testing bila:

- inventory tampil benar untuk role yang berhak
- owner multi-outlet bekerja konsisten
- stock opname bisa dibuat dan hasilnya benar
- transfer outgoing/incoming bisa dijalankan end-to-end
- approve/reject sesuai policy dan efek stoknya benar
- realtime refresh stok minimal bekerja pada inventory
- role terlarang tidak bisa mengakses modul stok
