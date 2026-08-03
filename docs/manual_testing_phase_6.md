# Manual Testing Frontend Fase 6: Konsinyasi & Settlement Supplier

Dokumen ini fokus pada pengujian frontend untuk modul:

- `/consignments`
- `/consignments/create`
- `/consignments/:id`
- `/consignment-settlements`
- `/consignment-settlements/:id`

Tanggal acuan dokumen ini: **3 Agustus 2026**.

## 1. Tujuan

Memastikan flow konsinyasi frontend MorrusPOS usable untuk:

- `Owner`
- `Admin`
- `Keuangan`

Dan memverifikasi alur bisnis:

1. buat tanda terima konsinyasi
2. terima barang titipan menjadi stok konsinyasi
3. lihat unpaid sales konsinyasi
4. buat settlement supplier
5. settle atau cancel draft settlement

## 2. Prasyarat

- Backend berjalan di `https://localhost:7100`
- Frontend berjalan di `http://localhost:5173`
- Database sudah ter-migrate terbaru
- Sudah ada:
  - minimal 1 outlet aktif
  - minimal 1 supplier aktif
  - minimal 1 produk aktif
- Akun test tersedia:
  - `Owner`
  - `Admin`
  - `Keuangan`
  - 1 role non-allowed, misalnya `Kasir` atau `Gudang`

## 3. Data Uji yang Disarankan

- Outlet: `Outlet Utama`
- Supplier: `Supplier Konsinyasi A`
- Produk:
  - `SKU-KON-001`
  - nama produk bebas
  - stok awal boleh `0`

## 4. Skenario Menu & Akses

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-ACL-01 | Owner lihat menu | Login Owner | Menu `Konsinyasi` terlihat |
| CON-ACL-02 | Admin lihat menu | Login Admin | Menu `Konsinyasi` terlihat |
| CON-ACL-03 | Keuangan lihat menu | Login Keuangan | Menu `Konsinyasi` terlihat |
| CON-ACL-04 | Role non-allowed hidden | Login Kasir/Gudang | Menu `Konsinyasi` tidak terlihat |
| CON-ACL-05 | Direct URL blocked | Login role non-allowed lalu buka `/consignments` | Tampil `Akses dibatasi` |

## 5. Skenario Outlet Context

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-OUT-01 | Owner without outlet | Login Owner, buka `/consignments` tanpa outlet terpilih | Tampil state `Pilih outlet...` |
| CON-OUT-02 | Owner select outlet | Pilih outlet aktif | List konsinyasi termuat |
| CON-OUT-03 | Owner switch outlet | Ganti outlet dari A ke B | Data list dan settlement mengikuti outlet baru |
| CON-OUT-04 | Outlet-bound user | Login Admin/Keuangan outlet-bound | Data langsung termuat tanpa perlu pilih outlet manual |

## 6. Tanda Terima Konsinyasi

### 6.1 List

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-RCPT-01 | Open list | Buka `/consignments` | Tabel daftar konsinyasi tampil |
| CON-RCPT-02 | Empty state | Pastikan belum ada data pada outlet | Empty state tampil |
| CON-RCPT-03 | Link create | Klik `Buat tanda terima` | Masuk ke `/consignments/create` |
| CON-RCPT-04 | Link settlement | Klik `Settlement` | Masuk ke `/consignment-settlements` |

### 6.2 Create page

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-RCPT-05 | Open create page | Buka `/consignments/create` | Form tampil |
| CON-RCPT-06 | Required supplier | Submit tanpa supplier | Error validasi supplier tampil |
| CON-RCPT-07 | Required product | Submit tanpa memilih produk | Error validasi produk tampil |
| CON-RCPT-08 | Qty invalid | Isi qty `0` atau negatif | Error validasi qty tampil |
| CON-RCPT-09 | Unit cost invalid | Isi unit cost `0` | Error validasi unit cost tampil |
| CON-RCPT-10 | Unit price invalid | Isi unit price `0` | Error validasi unit price tampil |
| CON-RCPT-11 | Duplicate product | Tambahkan 2 row dengan produk sama | Error duplikat tampil |
| CON-RCPT-12 | Add row | Klik `Tambah item` | Row baru muncul |
| CON-RCPT-13 | Remove row | Hapus 1 row | Row terhapus, minimal 1 row tetap tersisa |
| CON-RCPT-14 | Success create | Isi form valid lalu submit | Redirect ke detail tanda terima |

### 6.3 Detail page

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-RCPT-15 | Open detail | Buka `/consignments/:id` | Header, status, dan item tampil |
| CON-RCPT-16 | Draft actions visible | Detail masih `draft` | Tombol `Terima barang` dan `Batalkan` tampil |
| CON-RCPT-17 | Receive receipt | Klik `Terima barang` lalu confirm | Status menjadi `received` |
| CON-RCPT-18 | Cancel receipt | Buat receipt baru, klik `Batalkan` | Status menjadi `cancelled` |
| CON-RCPT-19 | Final status locked | Buka receipt `received/cancelled` | Tombol aksi status tidak muncul lagi |

## 7. Settlement Konsinyasi

### 7.1 List & unpaid sales preview

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-SET-01 | Open list | Buka `/consignment-settlements` | Halaman settlement tampil |
| CON-SET-02 | Empty settlement list | Belum ada settlement | Empty state settlement tampil |
| CON-SET-03 | Select supplier | Pilih supplier | Preview unpaid sales dimuat |
| CON-SET-04 | No unpaid sales | Supplier belum punya unpaid sales | Placeholder `No unpaid sales` tampil |
| CON-SET-05 | Preview totals | Supplier punya unpaid sales | Jumlah sales dan total hak supplier tampil benar |

### 7.2 Create settlement

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-SET-06 | Create without supplier | Klik `Buat settlement` tanpa supplier | Error tampil |
| CON-SET-07 | Create disabled when no unpaid sales | Supplier tidak punya unpaid sales | Tombol create disabled |
| CON-SET-08 | Success create | Pilih supplier dengan unpaid sales lalu klik create | Redirect ke detail settlement |

### 7.3 Settlement detail

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-SET-09 | Open detail | Buka `/consignment-settlements/:id` | Header, total, dan daftar sales tampil |
| CON-SET-10 | Draft actions visible | Detail masih `draft` | Tombol `Settle pembayaran` dan `Batalkan draft` tampil |
| CON-SET-11 | Settle draft | Klik `Settle pembayaran` lalu confirm | Status menjadi `settled` |
| CON-SET-12 | Cancel draft | Buat draft baru lalu batalkan | Status menjadi `cancelled` |
| CON-SET-13 | Final status locked | Buka settlement final | Tombol aksi status tidak muncul lagi |

## 8. Integrasi dengan POS / Sales Konsinyasi

| ID | Skenario | Langkah | Expected Result |
|---|---|---|---|
| CON-POS-01 | Product consignment sold | Jual produk konsinyasi lewat POS | Penjualan tercatat sebagai unpaid sales |
| CON-POS-02 | Unpaid sales visible | Buka `/consignment-settlements`, pilih supplier terkait | Sales hasil POS muncul di preview |
| CON-POS-03 | Settled sales removed from unpaid | Settlement di-settled | Sales tersebut tidak muncul lagi di preview unpaid |
| CON-POS-04 | Cancelled settlement releases sales | Settlement di-cancelled | Sales muncul kembali di preview unpaid |

## 9. Regression yang Perlu Dicek

- Sidebar tetap normal setelah aktivasi menu konsinyasi
- Route procurement lain tetap berjalan:
  - `/suppliers`
  - `/purchase-orders`
  - `/supplier-debts`
- Route POS tetap berjalan:
  - `/cashier/session`
  - `/pos`
  - `/transactions`

## 10. Known Behavior yang Saat Ini Expected

- Owner wajib memilih outlet aktif sebelum memuat data konsinyasi
- Settlement dibuat per supplier dan per outlet
- Create settlement tidak punya route terpisah; flow dilakukan dari halaman list settlement
- Status final `received`, `cancelled`, `settled` tidak dapat diubah lagi
