import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function SupplierDebtsPage() {
  return (
    <ProtectedPageShell
      title="Utang Supplier"
      description="Monitoring utang usaha dan pembayaran supplier akan tersedia di halaman ini."
    >
      <PagePlaceholder
        title="Module utang supplier"
        description="Filter utang unpaid, partially paid, paid, dan histori pembayaran akan dikerjakan pada fase supplier debt."
      />
    </ProtectedPageShell>
  );
}
