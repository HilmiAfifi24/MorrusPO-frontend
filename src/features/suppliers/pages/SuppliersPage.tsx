import { useEffect, useMemo, useState } from "react";
import ProtectedPageShell from "../../../components/layout/ProtectedPageShell";
import { AppTableShell } from "../../../components/tables";
import { AppLoader, ConfirmDialog, InlineAlert, PagePlaceholder } from "../../../components/ui";
import { getErrorMessage } from "../../../utils/errors";
import { createSupplier, getSuppliers, updateSupplier } from "../api/suppliersApi";
import SupplierFormModal from "../components/SupplierFormModal";
import type { SupplierDto, SupplierFormValues } from "../types/supplier";

type ModalState =
  | { open: false; mode: "create"; supplier: null }
  | { open: true; mode: "create"; supplier: null }
  | { open: true; mode: "edit"; supplier: SupplierDto };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    mode: "create",
    supplier: null,
  });
  const [deactivateTarget, setDeactivateTarget] = useState<SupplierDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function loadSuppliers() {
    setIsLoading(true);
    setError(null);

    try {
      setSuppliers(await getSuppliers());
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Gagal memuat daftar supplier."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadSuppliers();
  }, []);

  const sortedSuppliers = useMemo(
    () => [...suppliers].sort((left, right) => left.name.localeCompare(right.name, "id-ID")),
    [suppliers],
  );

  function openCreateModal() {
    setSubmitError(null);
    setModalState({ open: true, mode: "create", supplier: null });
  }

  function openEditModal(supplier: SupplierDto) {
    setSubmitError(null);
    setModalState({ open: true, mode: "edit", supplier });
  }

  function closeModal() {
    if (isSubmitting) {
      return;
    }

    setModalState({ open: false, mode: "create", supplier: null });
    setSubmitError(null);
  }

  async function handleSubmit(values: SupplierFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (modalState.mode === "create") {
        await createSupplier({
          name: values.name.trim(),
          contactPerson: values.contactPerson.trim() || null,
          phone: values.phone.trim() || null,
          email: values.email.trim() || null,
          address: values.address.trim() || null,
        });
        setSuccessMessage(`Supplier ${values.name.trim()} berhasil dibuat.`);
      } else {
        await updateSupplier(modalState.supplier.id, {
          name: values.name.trim(),
          contactPerson: values.contactPerson.trim() || null,
          phone: values.phone.trim() || null,
          email: values.email.trim() || null,
          address: values.address.trim() || null,
          isActive: values.isActive,
        });
        setSuccessMessage(`Supplier ${values.name.trim()} berhasil diperbarui.`);
      }

      closeModal();
      await loadSuppliers();
    } catch (requestError) {
      setSubmitError(getErrorMessage(requestError, "Gagal menyimpan supplier."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeactivateConfirm() {
    if (!deactivateTarget) {
      return;
    }

    setIsDeactivating(true);
    setError(null);

    try {
      await updateSupplier(deactivateTarget.id, {
        name: deactivateTarget.name,
        contactPerson: deactivateTarget.contactPerson,
        phone: deactivateTarget.phone,
        email: deactivateTarget.email,
        address: deactivateTarget.address,
        isActive: false,
      });
      setSuccessMessage(`Supplier ${deactivateTarget.name} berhasil dinonaktifkan.`);
      setDeactivateTarget(null);
      await loadSuppliers();
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Gagal menonaktifkan supplier."));
    } finally {
      setIsDeactivating(false);
    }
  }

  return (
    <ProtectedPageShell
      title="Supplier"
      description="Kelola master supplier MorrusPOS untuk kebutuhan purchase order, pembelian tempo, dan pembayaran utang supplier."
    >
      <InlineAlert tone="success" message={successMessage} />
      <InlineAlert tone="error" message={error} />

      <AppTableShell
        title="Daftar supplier aktif"
        description="Supplier nonaktif disembunyikan dari list utama agar lookup procurement tetap bersih."
        actions={
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white"
          >
            Tambah supplier
          </button>
        }
      >
        {isLoading ? (
          <AppLoader label="Memuat daftar supplier..." />
        ) : sortedSuppliers.length === 0 ? (
          <div className="p-6">
            <PagePlaceholder
              title="Belum ada supplier"
              description="Tambahkan supplier pertama agar flow purchase order dan utang supplier bisa mulai dipakai."
              status="Empty"
            />
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-950">
              <tr>
                {["Nama", "Kontak", "Telepon", "Email", "Alamat", "Status", "Aksi"].map((column) => (
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
              {sortedSuppliers.map((supplier) => (
                <tr key={supplier.id} className="align-top">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{supplier.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{supplier.contactPerson ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{supplier.phone ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{supplier.email ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{supplier.address ?? "-"}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-success-50 px-3 py-1 text-xs font-semibold text-success-700 dark:bg-success-500/10 dark:text-success-300">
                      Aktif
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(supplier)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 dark:border-gray-800 dark:text-gray-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeactivateTarget(supplier)}
                        className="rounded-xl border border-error-200 px-3 py-2 text-xs font-semibold text-error-700 dark:border-error-500/20 dark:text-error-300"
                      >
                        Nonaktifkan
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </AppTableShell>

      <SupplierFormModal
        open={modalState.open}
        mode={modalState.mode}
        supplier={modalState.supplier}
        isSubmitting={isSubmitting}
        submitError={submitError}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        title="Nonaktifkan supplier"
        description={`Supplier ${deactivateTarget?.name ?? ""} akan disembunyikan dari list aktif dan tidak bisa dipilih lagi pada form purchase order baru.`}
        confirmLabel="Nonaktifkan supplier"
        isBusy={isDeactivating}
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={() => void handleDeactivateConfirm()}
      />
    </ProtectedPageShell>
  );
}
