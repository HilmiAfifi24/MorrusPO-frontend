import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { FieldErrorText, FormCard } from "../../../components/forms";
import { AppLoader, InlineAlert } from "../../../components/ui";
import { useAuth } from "../../auth/hooks/useAuth";
import { isOwner } from "../../auth/utils/access";
import { getOutlets } from "../../outlets/api/outletsApi";
import { useOutlet } from "../../outlets/hooks/useOutlet";
import type { OutletLookupDto } from "../../outlets/types/outlet";
import { getErrorMessage } from "../../../utils/errors";
import { useCashierSession } from "../hooks/useCashierSession";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("id-ID");
}

export default function CashierSessionPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { selectedOutletId, setSelectedOutletId } = useOutlet();
  const { currentSession, isLoading, openSession, closeSession } = useCashierSession();
  const [outlets, setOutlets] = useState<OutletLookupDto[]>([]);
  const [openingCash, setOpeningCash] = useState("0");
  const [actualCash, setActualCash] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ownerMode = isOwner(session?.role);
  const activeOutlets = useMemo(
    () => outlets.filter((outlet) => outlet.isActive),
    [outlets],
  );

  useEffect(() => {
    async function loadOutlets() {
      if (!ownerMode) {
        return;
      }

      try {
        setOutlets(await getOutlets());
      } catch {
        // handled by submit and session errors
      }
    }

    void loadOutlets();
  }, [ownerMode]);

  async function handleOpenSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (ownerMode && !selectedOutletId) {
      setSubmitError("Owner harus memilih outlet kerja sebelum membuka sesi.");
      return;
    }

    const parsedOpeningCash = Number(openingCash);
    if (!Number.isFinite(parsedOpeningCash) || parsedOpeningCash < 0) {
      setSubmitError("Kas awal harus berupa angka 0 atau lebih.");
      return;
    }

    setIsSubmitting(true);

    try {
      const nextSession = await openSession(parsedOpeningCash);
      setSuccessMessage(`Sesi kasir untuk ${nextSession.outletName} berhasil dibuka.`);
      navigate("/pos");
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError, "Gagal membuka sesi kasir."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCloseSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    const parsedActualCash = Number(actualCash);
    if (!Number.isFinite(parsedActualCash) || parsedActualCash < 0) {
      setSubmitError("Kas aktual harus berupa angka 0 atau lebih.");
      return;
    }

    setIsSubmitting(true);

    try {
      const closedSession = await closeSession(parsedActualCash);
      setSuccessMessage(`Sesi kasir ${closedSession.outletName} berhasil ditutup.`);
      setActualCash("");
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError, "Gagal menutup sesi kasir."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedPageShell
      title="Sesi Kasir"
      description="Buka dan tutup shift kasir berdasarkan outlet operasional aktif sebelum masuk ke layar POS."
    >
      <InlineAlert tone="success" message={successMessage} />
      <InlineAlert tone="error" message={submitError} />

      {isLoading ? (
        <AppLoader label="Memuat sesi kasir..." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <FormCard
            title="Outlet kerja"
            description="Owner dapat memilih outlet operasional. Admin dan Kasir memakai outlet yang terikat pada akun."
          >
            {ownerMode ? (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Outlet aktif
                </span>
                <select
                  value={selectedOutletId ?? ""}
                  onChange={(event) => setSelectedOutletId(event.target.value || null)}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                >
                  <option value="">Pilih outlet</option>
                  {activeOutlets.map((outlet) => (
                    <option key={outlet.id} value={outlet.id}>
                      {outlet.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Outlet kerja mengikuti akun login: <span className="font-semibold">{session?.outletId ?? "-"}</span>
              </p>
            )}
          </FormCard>

          <FormCard
            title={currentSession ? "Sesi aktif" : "Buka sesi baru"}
            description="Satu user hanya boleh memiliki satu sesi kasir aktif pada outlet yang sama."
          >
            {currentSession ? (
              <div className="space-y-5">
                <dl className="grid gap-4 md:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">Outlet</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {currentSession.outletName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">Kasir</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {currentSession.userName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">Waktu buka</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {formatDateTime(currentSession.openingTime)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">Kas awal</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(currentSession.openingCash)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">Expected cash</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(currentSession.expectedCash)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.2em] text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm font-medium text-success-700 dark:text-success-300">
                      {currentSession.status}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/pos")}
                    className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Masuk ke POS
                  </button>
                </div>

                <form className="space-y-4 border-t border-gray-200 pt-5 dark:border-gray-800" onSubmit={handleCloseSession}>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Kas aktual saat tutup sesi <span className="text-error-500">*</span>
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={actualCash}
                      onChange={(event) => setActualCash(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-400">Harus berupa angka 0 atau lebih.</p>
                    <FieldErrorText message={!actualCash ? "Kas aktual wajib diisi untuk tutup sesi." : undefined} />
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center rounded-xl border border-error-200 px-4 py-2 text-sm font-semibold text-error-700 disabled:cursor-not-allowed disabled:opacity-70 dark:border-error-500/20 dark:text-error-300"
                  >
                    {isSubmitting ? "Memproses..." : "Tutup sesi"}
                  </button>
                </form>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleOpenSession}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Kas awal <span className="text-error-500">*</span>
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={openingCash}
                    onChange={(event) => setOpeningCash(event.target.value)}
                    className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                  />
                  <p className="mt-1 text-xs text-gray-400">Harus berupa angka 0 atau lebih.</p>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Membuka sesi..." : "Buka sesi kasir"}
                </button>
              </form>
            )}
          </FormCard>
        </div>
      )}
    </ProtectedPageShell>
  );
}
