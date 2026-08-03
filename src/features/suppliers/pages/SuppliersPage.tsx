import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function SuppliersPage() {
  return (
    <ProtectedPageShell
      title="Supplier"
      description="Halaman master supplier MorrusPOS akan dipasang di feature ini."
    >
      <PagePlaceholder
        title="Module supplier"
        description="CRUD supplier dan relasinya ke purchase order akan tersedia pada fase procurement."
      />
    </ProtectedPageShell>
  );
}
