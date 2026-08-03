# MorrusPOS Role Access Matrix

Dokumen ini menjadi sumber referensi implementasi akses menu, route guard, dan placeholder module di frontend MorrusPOS per **3 Agustus 2026**.

## Prinsip

- Backend adalah sumber kebenaran utama untuk permission.
- Frontend memakai policy terpusat untuk menentukan:
  - menu terlihat atau tidak
  - halaman aktif atau placeholder
  - fallback role saat permission belum tersedia atau session lama belum memuat permission
- Modul fase 4-6 yang belum aktif tetap boleh muncul jika memang termasuk scope role tersebut, tetapi harus tampil sebagai placeholder, bukan forbidden.

## Permission Backend

- `transaction.create`
- `transaction.void`
- `product.manage`
- `stock.manage`
- `supplier.manage`
- `consignment.manage`
- `report.view`

## Status Modul Frontend Saat Ini

### Active

- Dashboard
- Sesi Kasir
- POS Kasir
- Transaksi
- Produk
- Kategori
- Pengguna
- Cabang

### Placeholder

- Stok
- Transfer Stok
- Supplier
- Purchase Order
- Utang Supplier
- Konsinyasi

## Matrix Menu Per Role

| Role | Dashboard | Sesi Kasir | POS Kasir | Transaksi | Produk | Kategori | Stok | Transfer Stok | Supplier | Purchase Order | Utang Supplier | Konsinyasi | Pengguna | Cabang |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Owner | Active | Active | Active | Active | Active | Active | Placeholder | Placeholder | Placeholder | Placeholder | Placeholder | Placeholder | Active | Active |
| Admin | Active | Active | Active | Active | Active | Active | Placeholder | Placeholder | Placeholder | Placeholder | Placeholder | Placeholder | Active | Active |
| Kasir | Active | Active | Active | Active | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden |
| Gudang | Active | Hidden | Hidden | Hidden | Active | Active | Placeholder | Placeholder | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden |
| Keuangan | Active | Hidden | Hidden | Active | Hidden | Hidden | Hidden | Hidden | Placeholder | Placeholder | Placeholder | Placeholder | Hidden | Hidden |
| KepalaCabang | Active | Active | Active | Active | Active | Active | Placeholder | Placeholder | Hidden | Hidden | Hidden | Hidden | Hidden | Hidden |

## Matrix Aksi Per Role

| Aksi | Owner | Admin | Kasir | Gudang | Keuangan | KepalaCabang |
|---|---|---|---|---|---|---|
| Login & Dashboard | Ya | Ya | Ya | Ya | Ya | Ya |
| Buka sesi kasir | Ya | Ya | Ya | Tidak | Tidak | Ya |
| Checkout POS | Ya | Ya | Ya | Tidak | Tidak | Ya |
| Lihat histori transaksi | Ya | Ya | Ya | Tidak | Ya | Ya |
| Void transaksi | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Refund dasar | Ya | Ya | Ya | Tidak | Tidak | Ya |
| Kelola produk/kategori | Ya | Ya | Tidak | Ya | Tidak | Ya |
| Kelola stok/transfer | Ya | Ya | Tidak | Ya | Tidak | Ya |
| Kelola supplier/PO/utang | Ya | Ya | Tidak | Tidak | Ya | Tidak |
| Kelola konsinyasi | Ya | Ya | Tidak | Tidak | Ya | Tidak |
| Kelola user | Ya | Ya | Tidak | Tidak | Tidak | Tidak |
| Kelola cabang | Ya | Ya (view only di UI saat ini) | Tidak | Tidak | Tidak | Tidak |

## Policy Frontend yang Dipakai

Sumber policy ada di:

- `frontend/src/app/router/navigation.tsx`
- `frontend/src/app/guards/PermissionGuard.tsx`
- `frontend/src/features/auth/utils/access.ts`

Setiap menu memakai kombinasi:

- `requiredPermissions`
- `fallbackRoles`
- `status: "active" | "placeholder"`

## Aturan Perilaku UI

### Hidden

- Menu tidak muncul di sidebar.
- Direct URL akan diblok oleh `PermissionGuard`.

### Active

- Menu muncul.
- Halaman aktif penuh sesuai implementasi frontend saat ini.

### Placeholder

- Menu muncul dengan badge `Soon`.
- Halaman boleh dibuka jika role/permission cocok.
- Isi halaman menampilkan placeholder modul, bukan akses ditolak.

## Catatan Implementasi

- `Pengguna` dan `Cabang` tetap admin-only secara praktis memakai fallback role `Owner/Admin`.
- `Transaksi` belum punya permission view khusus, jadi sementara mengandalkan fallback role operasional/keuangan.
- `Void transaksi` tetap dikontrol backend oleh permission `transaction.void`.
- `KepalaCabang` sudah diposisikan sebagai role operasional cabang:
  - bisa sesi kasir
  - bisa POS
  - bisa melihat transaksi
  - bisa kelola produk dan konteks stok
  - tidak bisa user/outlet

## Checklist QA Singkat

- Owner/Admin melihat semua menu sesuai matrix.
- Kasir hanya melihat `Dashboard`, `Sesi Kasir`, `POS Kasir`, `Transaksi`.
- Gudang melihat `Produk`, `Kategori`, `Stok`, `Transfer Stok`, tanpa POS.
- Keuangan melihat `Transaksi`, `Supplier`, `Purchase Order`, `Utang Supplier`, `Konsinyasi`.
- KepalaCabang melihat menu operasional cabang tanpa `Pengguna` dan `Cabang`.
- Modul placeholder tetap terbuka normal untuk role yang berhak.
- Direct URL ke modul yang tidak berhak harus menampilkan `Akses dibatasi`.
