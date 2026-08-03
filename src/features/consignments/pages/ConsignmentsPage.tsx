import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function ConsignmentsPage() {
  return (
    <ProtectedPageShell
      title="Konsinyasi"
      description="Fitur pembeda MorrusPOS untuk barang titipan supplier akan dipusatkan pada halaman ini."
    >
      <PagePlaceholder
        title="Module konsinyasi"
        description="Penerimaan barang titipan, penjualan konsinyasi, dan settlement supplier akan dibangun bertahap di sini."
      />
    </ProtectedPageShell>
  );
}
