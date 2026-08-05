import type { LoginFormValues } from "../types/auth";

export type LoginValidationErrors = Partial<Record<keyof LoginFormValues, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(values: LoginFormValues): LoginValidationErrors {
  const errors: LoginValidationErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.password.trim()) {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}
