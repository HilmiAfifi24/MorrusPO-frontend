import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";

export default function InventoryPage({ mode = "inventory" }: { mode?: "inventory" | "transfers" }) {
  const isTransfers = mode === "transfers";

  return (
    <ProtectedPageShell
      title={isTransfers ? "Transfer Stok" : "Stok"}
      description={
        isTransfers
          ? "Halaman pengajuan dan persetujuan transfer stok antar cabang akan dipasang di sini."
          : "Halaman inventory, stok minimum, dan stok opname akan dipasang di sini."
      }
    >
      <PagePlaceholder
        title={isTransfers ? "Module transfer stok" : "Module inventory"}
        description={
          isTransfers
            ? "Daftar transfer incoming/outgoing dan alur approve-reject akan dibangun setelah modul stok dasar siap."
            : "Listing stok per outlet, indikator stok minimum, dan opname akan dikerjakan pada fase inventory."
        }
      />
    </ProtectedPageShell>
  );
}
