import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function ProductsPage() {
  return (
    <ProtectedPageShell
      title="Produk"
      description="Halaman master produk MorrusPOS akan dipindahkan ke feature baru ini pada fase berikutnya."
    >
      <PagePlaceholder
        title="Module produk"
        description="CRUD produk, pencarian, status aktif, dan integrasi stok per outlet akan dibangun setelah Fase 0 shell selesai."
      />
    </ProtectedPageShell>
  );
}
