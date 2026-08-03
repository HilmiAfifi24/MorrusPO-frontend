import { useEffect, useState } from "react";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { AppTableShell } from "../../../components/tables";
import { AppLoader, InlineAlert } from "../../../components/ui";
import { getOutlets } from "../api/outletsApi";
import type { OutletLookupDto } from "../types/outlet";

export default function OutletsPage() {
  const [outlets, setOutlets] = useState<OutletLookupDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOutlets() {
      setIsLoading(true);
      setError(null);

      try {
        setOutlets(await getOutlets());
      } catch (requestError) {
        const message =
          typeof requestError === "object" &&
          requestError &&
          "message" in requestError &&
          typeof requestError.message === "string"
            ? requestError.message
            : "Gagal memuat daftar cabang.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void loadOutlets();
  }, []);

  return (
    <ProtectedPageShell
      title="Cabang"
      description="Fase 1 menampilkan daftar outlet read-only untuk mendukung form pengguna dan konteks multi-cabang awal."
    >
      <InlineAlert tone="error" message={error} />
      <AppTableShell
        title="Daftar cabang"
        description="Lookup outlet ini digunakan oleh frontend untuk create/edit user dan label konteks outlet."
      >
        {isLoading ? (
          <AppLoader label="Memuat daftar cabang..." />
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-950">
              <tr>
                {["Kode", "Nama", "Status"].map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-gray-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {outlets.map((outlet) => (
                <tr key={outlet.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {outlet.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {outlet.name}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        outlet.isActive
                          ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {outlet.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AppTableShell>
    </ProtectedPageShell>
  );
}
