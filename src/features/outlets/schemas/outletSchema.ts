import type { OutletFormValues } from "../types/outlet";

export type OutletFieldErrors = Partial<Record<keyof OutletFormValues, string>>;

export function validateOutletForm(values: OutletFormValues) {
  const errors: OutletFieldErrors = {};

  if (!values.code.trim()) {
    errors.code = "Kode cabang wajib diisi.";
  } else if (values.code.trim().length > 20) {
    errors.code = "Kode cabang maksimal 20 karakter.";
  }

  if (!values.name.trim()) {
    errors.name = "Nama cabang wajib diisi.";
  } else if (values.name.trim().length > 150) {
    errors.name = "Nama cabang maksimal 150 karakter.";
  }

  if (values.phone.trim().length > 20) {
    errors.phone = "Nomor telepon maksimal 20 karakter.";
  }

  return errors;
}
