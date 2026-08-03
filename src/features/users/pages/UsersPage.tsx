import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function UsersPage() {
  return (
    <ProtectedPageShell
      title="Pengguna"
      description="Shell manajemen user sudah disiapkan untuk dihubungkan ke backend users pada fase berikutnya."
    >
      <PagePlaceholder
        title="Module pengguna"
        description="Listing user, create/update user, dan ganti password admin akan diimplementasikan setelah auth base stabil."
      />
    </ProtectedPageShell>
  );
}
