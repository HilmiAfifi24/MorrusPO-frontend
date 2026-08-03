import type { LoginFormValues } from "../types/auth";

export type LoginValidationErrors = Partial<Record<keyof LoginFormValues, string>>;

export function validateLoginForm(values: LoginFormValues): LoginValidationErrors {
  const errors: LoginValidationErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  }

  if (!values.password.trim()) {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}
