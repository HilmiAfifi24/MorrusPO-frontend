import { useMemo, useState } from "react";
import { ConfirmDialog, InlineAlert } from "../../../components/ui";
import { useAuth } from "../../auth/hooks/useAuth";
import { refundTransaction, voidTransaction } from "../api/transactionsApi";
import type {
  RefundTransactionRequest,
  TransactionDto,
} from "../types/transaction";
import { getErrorMessage } from "../../../utils/errors";

type TransactionActionPanelProps = {
  transaction: TransactionDto;
  onUpdated: (transaction: TransactionDto) => void;
};

export default function TransactionActionPanel({
  transaction,
  onUpdated,
}: TransactionActionPanelProps) {
  const { session } = useAuth();
  const [voidReason, setVoidReason] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundMethod, setRefundMethod] = useState<"refund" | "exchange">("refund");
  const [refundQtyByProductId, setRefundQtyByProductId] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [confirmVoidOpen, setConfirmVoidOpen] = useState(false);

  const canVoid = session?.role === "Owner" || session?.role === "Admin";
  const canRefund =
    session?.role === "Owner" ||
    session?.role === "Admin" ||
    session?.role === "Kasir";
  const hasReturns = transaction.returns.length > 0;
  const hasRefundableItems = useMemo(
    () => transaction.items.some((item) => item.remainingQty > 0),
    [transaction.items],
  );
  const voidDisabled = transaction.status !== "completed" || hasReturns;
  const refundDisabled =
    transaction.status === "voided" || !hasRefundableItems;

  async function handleVoidConfirm() {
    setIsBusy(true);
    setError(null);
    setFeedback(null);

    try {
      const updated = await voidTransaction(transaction.id, {
        reason: voidReason.trim(),
      });
      onUpdated(updated);
      setFeedback("Transaksi berhasil di-void dan stok sudah dikembalikan.");
      setVoidReason("");
      setConfirmVoidOpen(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Gagal melakukan void transaksi."));
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRefundSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError(null);
    setFeedback(null);

    const items = transaction.items
      .map((item) => ({
        productId: item.productId,
        qty: Number(refundQtyByProductId[item.productId] || 0),
      }))
      .filter((item) => item.qty > 0);

    if (items.length === 0) {
      setError("Isi minimal satu qty refund sebelum memproses refund.");
      setIsBusy(false);
      return;
    }

    const payload: RefundTransactionRequest = {
      refundMethod,
      reason: refundReason.trim() || null,
      items,
    };

    try {
      const updated = await refundTransaction(transaction.id, payload);
      onUpdated(updated);
      setRefundQtyByProductId({});
      setRefundReason("");
      setRefundMethod("refund");
      setFeedback("Refund berhasil diproses dan stok sudah dikembalikan.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Gagal memproses refund transaksi."));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Aksi transaksi
          </h4>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Void dipakai untuk membatalkan seluruh transaksi. Refund dasar dipakai untuk pengembalian sebagian atau seluruh item.
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="app-no-print rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200"
        >
          Print struk
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <InlineAlert tone="success" message={feedback} />
        <InlineAlert tone="error" message={error} />
      </div>

      {transaction.voidedReason ? (
        <div className="mt-5 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700 dark:bg-error-500/10 dark:text-error-300">
          Void reason: {transaction.voidedReason}
          {transaction.voidedByName ? ` · oleh ${transaction.voidedByName}` : ""}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
          <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Void transaksi
          </h5>
          <textarea
            value={voidReason}
            onChange={(event) => setVoidReason(event.target.value)}
            rows={4}
            placeholder="Alasan pembatalan transaksi"
            className="mt-3 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setConfirmVoidOpen(true)}
            disabled={!canVoid || voidDisabled || !voidReason.trim() || isBusy}
            className="mt-4 inline-flex items-center rounded-xl bg-error-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Void transaksi
          </button>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Hanya Owner/Admin. Void tidak tersedia jika transaksi sudah refund atau bukan status completed.
          </p>
        </div>

        <form
          onSubmit={handleRefundSubmit}
          className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800"
        >
          <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Refund dasar
          </h5>
          <div className="mt-3 space-y-3">
            <select
              value={refundMethod}
              onChange={(event) =>
                setRefundMethod(event.target.value as "refund" | "exchange")
              }
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            >
              <option value="refund">Refund</option>
              <option value="exchange">Exchange</option>
            </select>
            <textarea
              value={refundReason}
              onChange={(event) => setRefundReason(event.target.value)}
              rows={3}
              placeholder="Catatan refund (opsional)"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
          </div>

          <div className="mt-4 space-y-3">
            {transaction.items.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 rounded-2xl border border-gray-200 p-3 dark:border-gray-800"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.productName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Terjual {item.qty} · Sudah refund {item.returnedQty} · Sisa {item.remainingQty}
                    </p>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max={item.remainingQty}
                    step="1"
                    value={refundQtyByProductId[item.productId] ?? ""}
                    onChange={(event) =>
                      setRefundQtyByProductId((current) => ({
                        ...current,
                        [item.productId]: event.target.value,
                      }))
                    }
                    disabled={item.remainingQty <= 0}
                    className="h-11 w-28 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none disabled:opacity-60 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={!canRefund || refundDisabled || isBusy}
            className="mt-4 inline-flex items-center rounded-xl bg-warning-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proses refund
          </button>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Refund mengembalikan stok dan mencatat histori return per item.
          </p>
        </form>
      </div>

      <ConfirmDialog
        open={confirmVoidOpen}
        title="Void transaksi ini?"
        description="Seluruh stok akan dikembalikan dan transaksi tidak bisa diproses ulang sebagai penjualan aktif."
        confirmLabel="Ya, void transaksi"
        isBusy={isBusy}
        onCancel={() => setConfirmVoidOpen(false)}
        onConfirm={() => void handleVoidConfirm()}
      />
    </section>
  );
}
