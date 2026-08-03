import { useEffect, useState } from "react";
import { FieldErrorText } from "../../../components/forms";
import { Modal } from "../../../components/ui/modal";
import InlineAlert from "../../../components/ui/InlineAlert";
import { useCategoryOptions } from "../hooks/useCategoryOptions";
import type {
  CategoryFieldErrors,
} from "../schemas/categorySchema";
import { validateCategoryForm } from "../schemas/categorySchema";
import type { CategoryDto, CategoryFormValues } from "../types/category";

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  categories: CategoryDto[];
  category?: CategoryDto | null;
  isSubmitting: boolean;
  submitError?: string | null;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
};

const initialValues: CategoryFormValues = {
  name: "",
  parentId: "",
};

export default function CategoryFormModal({
  open,
  mode,
  categories,
  category,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const [values, setValues] = useState<CategoryFormValues>(initialValues);
  const [errors, setErrors] = useState<CategoryFieldErrors>({});
  const parentOptions = useCategoryOptions(categories, category?.id);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues(
      category
        ? {
            name: category.name,
            parentId: category.parentId ?? "",
          }
        : initialValues,
    );
    setErrors({});
  }, [category, open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateCategoryForm(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      parentId: values.parentId,
    });
  }

  return (
    <Modal isOpen={open} onClose={onClose} className="max-w-2xl p-6 sm:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600">
            MorrusPOS
          </p>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === "create" ? "Tambah kategori" : "Edit kategori"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Kelola struktur kategori produk agar form produk dan laporan tetap rapi.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <InlineAlert tone="error" message={submitError} />

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nama kategori
            </span>
            <input
              value={values.name}
              onChange={(event) =>
                setValues((current) => ({ ...current, name: event.target.value }))
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
            <FieldErrorText message={errors.name} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Parent kategori
            </span>
            <select
              value={values.parentId}
              onChange={(event) =>
                setValues((current) => ({ ...current, parentId: event.target.value }))
              }
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            >
              <option value="">Tanpa parent</option>
              {parentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Kategori tidak bisa menjadi parent untuk dirinya sendiri.
            </p>
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Menyimpan..."
                : mode === "create"
                  ? "Simpan kategori"
                  : "Perbarui kategori"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
