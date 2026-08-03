import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function OutletsPage() {
  return (
    <ProtectedPageShell
      title="Cabang"
      description="Manajemen outlet dan konteks multi-cabang akan disiapkan dari halaman ini."
    >
      <PagePlaceholder
        title="Module cabang"
        description="Lookup outlet, selector cabang owner, dan visibilitas data per outlet akan dibangun di fase multi-outlet."
      />
    </ProtectedPageShell>
  );
}
