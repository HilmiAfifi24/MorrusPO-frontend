import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function PurchaseOrdersPage() {
  return (
    <ProtectedPageShell
      title="Purchase Order"
      description="Frontend fase berikutnya akan menghubungkan halaman ini ke alur pembelian supplier dan penerimaan barang."
    >
      <PagePlaceholder
        title="Module purchase order"
        description="Daftar PO, detail, perubahan status, dan pembelian tempo/tunai akan dibangun di fase procurement."
      />
    </ProtectedPageShell>
  );
}
