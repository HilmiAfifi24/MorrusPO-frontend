import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function PosPage() {
  return (
    <ProtectedPageShell
      title="POS Kasir"
      description="Layout kasir sudah disiapkan agar modul checkout bisa dibangun pada fase berikutnya tanpa bergantung lagi pada halaman demo."
    >
      <PagePlaceholder
        title="Module POS"
        description="Keranjang, checkout, sesi kasir, dan stok real-time akan dikerjakan setelah auth dan shell aplikasi stabil."
      />
    </ProtectedPageShell>
  );
}
