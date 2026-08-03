# MorrusPOS Frontend Structure

Struktur frontend baru disiapkan untuk migrasi bertahap dari template TailAdmin ke aplikasi MorrusPOS.

## Target Struktur

```text
src/
├── app/
│   ├── guards/
│   ├── providers/
│   └── router/
├── api/
│   ├── client/
│   ├── modules/
│   └── types/
├── components/
│   ├── forms/
│   ├── layout/
│   ├── tables/
│   └── ui/
├── features/
│   ├── auth/
│   ├── categories/
│   ├── consignments/
│   ├── dashboard/
│   ├── debts/
│   ├── inventory/
│   ├── outlets/
│   ├── pos/
│   ├── products/
│   ├── purchase-orders/
│   ├── suppliers/
│   └── users/
├── hooks/
├── lib/
├── styles/
└── utils/
```

## Catatan Migrasi

- Folder lama seperti `pages/`, `layout/`, `context/`, dan beberapa `components/*` masih dipertahankan sementara.
- Migrasi dilakukan bertahap per fitur agar template lama tetap bisa dijalankan.
- Folder baru ini menjadi standar penempatan kode baru mulai sekarang.
