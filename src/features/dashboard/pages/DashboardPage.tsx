import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import PagePlaceholder from "../../../components/ui/PagePlaceholder";
import { useAuth } from "../../auth/hooks/useAuth";
import { useOutlet } from "../../outlets/hooks/useOutlet";
import { useRealtime } from "../../../lib/realtime";

export default function DashboardPage() {
  const { session } = useAuth();
  const { selectedOutletId } = useOutlet();
  const { isConnected, lastStockUpdate } = useRealtime();

  return (
    <ProtectedPageShell
      title="Dashboard"
      description="Ringkasan fase awal untuk memverifikasi auth, shell dashboard, dan kesiapan koneksi real-time MorrusPOS."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Current user</p>
          <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
            {session?.name ?? "-"}
          </h3>
        </article>
        <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Current role</p>
          <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
            {session?.role ?? "-"}
          </h3>
        </article>
        <article className="rounded-3xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500">Current outlet</p>
          <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
            {selectedOutletId ?? "Semua outlet"}
          </h3>
        </article>
      </div>

      <PagePlaceholder
        title="Shell dashboard aktif"
        description="Route MorrusPOS baru sudah menggantikan route demo TailAdmin. Modul bisnis berikutnya akan masuk bertahap dari struktur feature baru."
        status={isConnected ? "SignalR connected" : "SignalR standby"}
      >
        <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600 dark:bg-gray-950 dark:text-gray-300">
          <p>Backend connected status belum diukur secara live di Fase 0.</p>
          <p className="mt-2">
            Last stock update:{" "}
            {lastStockUpdate ? JSON.stringify(lastStockUpdate) : "Belum ada event masuk."}
          </p>
        </div>
      </PagePlaceholder>
    </ProtectedPageShell>
  );
}
