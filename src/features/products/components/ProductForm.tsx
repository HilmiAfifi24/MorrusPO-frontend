import type { FormEvent } from "react";
import { Link } from "react-router";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import { FieldErrorText, FormCard } from "../../../components/forms";
import InlineAlert from "../../../components/ui/InlineAlert";
import type { CategoryDto } from "../../categories/types/category";
import type { ProductFieldErrors } from "../schemas/productSchema";
import type { ProductFormValues } from "../types/product";

type ProductFormProps = {
  mode: "create" | "edit";
  values: ProductFormValues;
  errors: ProductFieldErrors;
  categories: CategoryDto[];
  isSubmitting: boolean;
  submitError?: string | null;
  onChange: (key: keyof ProductFormValues, value: string | boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ProductForm({
  mode,
  values,
  errors,
  categories,
  isSubmitting,
  submitError,
  onChange,
  onSubmit,
}: ProductFormProps) {
  const isEditMode = mode === "edit";

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={isEditMode ? "Edit Produk" : "Tambah Produk"} />

      <FormCard
        title={isEditMode ? "Edit produk" : "Tambah produk"}
        description="Simpan master produk MorrusPOS dengan kategori, harga, unit, dan tipe penjualan yang konsisten."
      >
        <form className="space-y-5" onSubmit={onSubmit}>
          <InlineAlert tone="error" message={submitError} />

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Kategori
              </span>
              <select
                value={values.categoryId}
                onChange={(event) => onChange("categoryId", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              >
                <option value="">Pilih kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parentName ? `${category.parentName} / ${category.name}` : category.name}
                  </option>
                ))}
              </select>
              <FieldErrorText message={errors.categoryId} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                SKU
              </span>
              <input
                value={values.sku}
                onChange={(event) => onChange("sku", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <FieldErrorText message={errors.sku} />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Nama produk
              </span>
              <input
                value={values.name}
                onChange={(event) => onChange("name", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <FieldErrorText message={errors.name} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Barcode
              </span>
              <input
                value={values.barcode}
                onChange={(event) => onChange("barcode", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Opsional, tetapi harus unik jika diisi.
              </p>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Unit
              </span>
              <input
                value={values.unit}
                onChange={(event) => onChange("unit", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <FieldErrorText message={errors.unit} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Harga jual
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={values.basePrice}
                onChange={(event) => onChange("basePrice", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <FieldErrorText message={errors.basePrice} />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Harga modal
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={values.costPrice}
                onChange={(event) => onChange("costPrice", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <FieldErrorText message={errors.costPrice} />
              {isEditMode ? (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Backend fase ini belum mengirim harga modal saat detail produk dibuka, jadi isi
                  kembali nilainya saat memperbarui produk.
                </p>
              ) : null}
            </label>

            <label className="inline-flex items-center gap-3">
              <input
                type="checkbox"
                checked={values.isConsignment}
                onChange={(event) => onChange("isConsignment", event.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Produk konsinyasi
              </span>
            </label>

            {isEditMode ? (
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={values.isActive}
                  onChange={(event) => onChange("isActive", event.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Produk aktif
                </span>
              </label>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Link
              to="/products"
              className="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200"
            >
              Kembali
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Menyimpan..."
                : isEditMode
                  ? "Perbarui produk"
                  : "Simpan produk"}
            </button>
          </div>
        </form>
      </FormCard>
    </div>
  );
}
