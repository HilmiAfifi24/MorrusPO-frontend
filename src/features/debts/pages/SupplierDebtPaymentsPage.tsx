import { useEffect, useState } from "react";
import { Link } from "react-router";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { AppTableShell } from "../../../components/tables";
import { AppLoader, InlineAlert, PagePlaceholder } from "../../../components/ui";
import { getErrorMessage } from "../../../utils/errors";
import ProcurementOutletSelector from "../../procurement/components/ProcurementOutletSelector";
import { useProcurementOutletScope } from "../../procurement/hooks/useProcurementOutletScope";
import { formatCurrency, formatDateTime } from "../../procurement/utils/formatters";
import { getSupplierPayments } from "../api/debtsApi";
import type { SupplierPaymentDto } from "../types/debt";

export default function SupplierDebtPaymentsPage() {
  const { ownerMode, activeOutlets, effectiveOutletId, selectedOutletId, setSelectedOutletId } =
    useProcurementOutletScope();
  const [payments, setPayments] = useState<SupplierPaymentDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPayments() {
    if (!effectiveOutletId) {
      setPayments([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setPayments(await getSupplierPayments({ outletId: effectiveOutletId }));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Gagal memuat histori pembayaran supplier."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPayments();
  }, [effectiveOutletId]);

  const shouldShowOutletPrompt = ownerMode && !effectiveOutletId;

  return (
    <ProtectedPageShell
      title="Histori Pembayaran Supplier"
      description="Lihat seluruh pembayaran utang supplier terbaru per outlet procurement aktif."
    >
      <InlineAlert tone="error" message={error} />

      <AppTableShell
        title="Histori pembayaran"
        description={`Total pembayaran: ${payments.length}`}
        actions={
          <>
            <ProcurementOutletSelector
              ownerMode={ownerMode}
              value={selectedOutletId}
              onChange={setSelectedOutletId}
              outlets={activeOutlets}
            />
            <Link
              to="/supplier-debts"
              className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-200"
            >
              Kembali ke utang
            </Link>
          </>
        }
      >
        {isLoading ? (
          <AppLoader label="Memuat histori pembayaran supplier..." />
        ) : shouldShowOutletPrompt ? (
          <div className="p-6">
            <PagePlaceholder
              title="Pilih outlet procurement terlebih dahulu"
              description="Owner perlu memilih outlet aktif sebelum memuat histori pembayaran supplier."
              status="Outlet required"
            />
          </div>
        ) : payments.length === 0 ? (
          <div className="p-6">
            <PagePlaceholder
              title="Belum ada histori pembayaran"
              description="Belum ada pembayaran utang supplier pada outlet procurement aktif."
              status="Empty"
            />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-950">
              <tr>
                {["Tanggal", "Supplier", "No. PO", "Metode", "Nominal", "Reference Number", "Status"].map((column) => (
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
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDateTime(payment.paymentDate)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{payment.supplierName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{payment.poNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{payment.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(payment.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{payment.referenceNumber ?? "-"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-300">
                      {payment.status}
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
