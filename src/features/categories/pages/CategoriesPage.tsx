import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function CategoriesPage() {
  return (
    <ProtectedPageShell
      title="Kategori"
      description="Kategori produk akan dikelola melalui halaman ini setelah fondasi routing dan auth stabil."
    >
      <PagePlaceholder
        title="Module kategori"
        description="Tree kategori, create/update/delete, dan sinkron ke produk akan diimplementasikan pada fase modul data master."
      />
    </ProtectedPageShell>
  );
}
