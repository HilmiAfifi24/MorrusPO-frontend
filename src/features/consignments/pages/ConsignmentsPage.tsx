import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { AppTableShell } from "../../../components/tables";
import { AppLoader, InlineAlert, PagePlaceholder } from "../../../components/ui";
import { getErrorMessage } from "../../../utils/errors";
import ProcurementOutletSelector from "../../procurement/components/ProcurementOutletSelector";
import { useProcurementOutletScope } from "../../procurement/hooks/useProcurementOutletScope";
import { getConsignments } from "../api/consignmentsApi";
import type { ConsignmentDto } from "../types/consignment";
import {
  formatDateTime,
  getConsignmentStatusClasses,
} from "../utils/formatters";

type ConsignmentsLocationState = {
  successMessage?: string;
};

export default function ConsignmentsPage() {
  const location = useLocation();
  const { ownerMode, activeOutlets, effectiveOutletId, selectedOutletId, setSelectedOutletId } =
    useProcurementOutletScope();
  const [consignments, setConsignments] = useState<ConsignmentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(
    (location.state as ConsignmentsLocationState | null)?.successMessage ?? null,
  );

  useEffect(() => {
    async function loadConsignments() {
      if (!effectiveOutletId) {
        setConsignments([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        setConsignments(await getConsignments(effectiveOutletId));
      } catch (requestError) {
        setError(getErrorMessage(requestError, "Gagal memuat daftar konsinyasi."));
      } finally {
        setIsLoading(false);
      }
    }

    void loadConsignments();
  }, [effectiveOutletId]);

  const shouldShowOutletPrompt = ownerMode && !effectiveOutletId;

  return (
    <ProtectedPageShell
      title="Konsinyasi"
      description="Kelola tanda terima barang titipan supplier dan settlement hak supplier per outlet aktif."
    >
      <InlineAlert tone="success" message={successMessage} />
      <InlineAlert tone="error" message={error} />

      <AppTableShell
        title="Daftar tanda terima konsinyasi"
        description={`Total tanda terima: ${consignments.length}`}
        actions={
          <>
            <ProcurementOutletSelector
              ownerMode={ownerMode}
              value={selectedOutletId}
              onChange={setSelectedOutletId}
              outlets={activeOutlets}
            />
            <Link
              to="/consignment-settlements"
              className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-200"
            >
              Settlement
            </Link>
            <Link
              to="/consignments/create"
              className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Buat tanda terima
            </Link>
          </>
        }
      >
        {isLoading ? (
          <AppLoader label="Memuat daftar konsinyasi..." />
        ) : shouldShowOutletPrompt ? (
          <div className="p-6">
            <PagePlaceholder
              title="Pilih outlet konsinyasi terlebih dahulu"
              description="Owner perlu memilih outlet aktif agar daftar tanda terima konsinyasi memakai konteks yang benar."
              status="Outlet required"
            />
          </div>
        ) : consignments.length === 0 ? (
          <div className="p-6">
            <PagePlaceholder
              title="Belum ada tanda terima konsinyasi"
              description="Buat tanda terima pertama agar barang titipan supplier bisa diproses menjadi stok konsinyasi."
              status="Empty"
            />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-950">
              <tr>
                {["No. Konsinyasi", "Supplier", "Outlet", "Tanggal", "Status", "Jumlah item", "Aksi"].map((column) => (
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
              {consignments.map((consignment) => (
                <tr key={consignment.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {consignment.consignmentNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-200">
                    {consignment.supplierName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {consignment.outletName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {formatDateTime(consignment.receiveDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getConsignmentStatusClasses(
                        consignment.status,
                      )}`}
                    >
                      {consignment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {consignment.items.length}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/consignments/${consignment.id}`}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-200"
                    >
                      Detail
                    </Link>
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
