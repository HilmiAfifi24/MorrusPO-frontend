import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { AppTableShell } from "../../../components/tables";
import { AppLoader, InlineAlert, PagePlaceholder } from "../../../components/ui";
import { getErrorMessage } from "../../../utils/errors";
import ProcurementOutletSelector from "../../procurement/components/ProcurementOutletSelector";
import { useProcurementOutletScope } from "../../procurement/hooks/useProcurementOutletScope";
import { formatCurrency, formatDateOnly, formatDateTime, getPoStatusClasses } from "../../procurement/utils/formatters";
import { getPurchaseOrders } from "../api/purchaseOrdersApi";
import type { PurchaseOrderDto } from "../types/purchaseOrder";

type PurchaseOrdersLocationState = {
  successMessage?: string;
};

export default function PurchaseOrdersPage() {
  const location = useLocation();
  const { ownerMode, activeOutlets, effectiveOutletId, selectedOutletId, setSelectedOutletId } =
    useProcurementOutletScope();
  const [orders, setOrders] = useState<PurchaseOrderDto[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage] = useState<string | null>(
    (location.state as PurchaseOrdersLocationState | null)?.successMessage ?? null,
  );

  async function loadOrders() {
    if (!effectiveOutletId) {
      setOrders([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      setOrders(await getPurchaseOrders({ outletId: effectiveOutletId }));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Gagal memuat daftar purchase order."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadOrders();
  }, [effectiveOutletId]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const shouldShowOutletPrompt = ownerMode && !effectiveOutletId;

  return (
    <ProtectedPageShell
      title="Purchase Order"
      description="Kelola pembelian supplier tunai maupun tempo per outlet procurement aktif."
    >
      <InlineAlert tone="success" message={successMessage} />
      <InlineAlert tone="error" message={error} />

      <AppTableShell
        title="Daftar purchase order"
        description={`Total PO: ${orders.length}`}
        actions={
          <>
            <ProcurementOutletSelector
              ownerMode={ownerMode}
              value={selectedOutletId}
              onChange={setSelectedOutletId}
              outlets={activeOutlets}
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            >
              <option value="all">Semua status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Link
              to="/purchase-orders/create"
              className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
            >
              Buat PO
            </Link>
          </>
        }
      >
        {isLoading ? (
          <AppLoader label="Memuat daftar purchase order..." />
        ) : shouldShowOutletPrompt ? (
          <div className="p-6">
            <PagePlaceholder
              title="Pilih outlet procurement terlebih dahulu"
              description="Owner perlu memilih outlet aktif agar daftar purchase order dan utang supplier memakai konteks yang benar."
              status="Outlet required"
            />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-6">
            <PagePlaceholder
              title="Belum ada purchase order"
              description="Buat PO pertama untuk mulai mencatat pembelian supplier pada outlet ini."
              status="Empty"
            />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-950">
              <tr>
                {["No. PO", "Tanggal", "Supplier", "Outlet", "Payment Type", "Due Date", "Total", "Status", "Aksi"].map((column) => (
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{order.poNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDateTime(order.poDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.supplierName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{order.outletName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize dark:text-gray-300">{order.paymentType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDateOnly(order.dueDate)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPoStatusClasses(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/purchase-orders/${order.id}`}
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
