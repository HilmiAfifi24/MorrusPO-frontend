import type { ProductFormValues } from "../types/product";

export type ProductFieldErrors = Partial<Record<keyof ProductFormValues, string>>;

function isValidNonNegativeNumber(value: string) {
  if (!value.trim()) {
    return false;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
}

export function validateProductForm(values: ProductFormValues) {
  const errors: ProductFieldErrors = {};

  if (!values.categoryId) errors.categoryId = "Kategori wajib dipilih.";
  if (!values.sku.trim()) errors.sku = "SKU wajib diisi.";
  if (!values.name.trim()) errors.name = "Nama produk wajib diisi.";
  if (!isValidNonNegativeNumber(values.basePrice)) {
    errors.basePrice = "Harga jual wajib diisi dengan angka 0 atau lebih.";
  }
  if (!isValidNonNegativeNumber(values.costPrice)) {
    errors.costPrice = "Harga modal wajib diisi dengan angka 0 atau lebih.";
  }
  if (!values.unit.trim()) errors.unit = "Unit wajib diisi.";

  return errors;
}
