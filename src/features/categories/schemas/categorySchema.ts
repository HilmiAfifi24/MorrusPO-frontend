import type { CategoryFormValues } from "../types/category";

export type CategoryFieldErrors = Partial<Record<keyof CategoryFormValues, string>>;

export function validateCategoryForm(values: CategoryFormValues) {
  const errors: CategoryFieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Nama kategori wajib diisi.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Nama kategori minimal 3 karakter.";
  } else if (values.name.trim().length > 100) {
    errors.name = "Nama kategori maksimal 100 karakter.";
  }

  return errors;
}
