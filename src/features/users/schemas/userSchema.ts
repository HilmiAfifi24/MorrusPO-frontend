import { isOwner } from "../../auth";
import type {
  ChangePasswordFormValues,
  CreateUserFormValues,
  UpdateUserFormValues,
} from "../types/user";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[a-zA-Z\s\.\']+$/;

export function validateCreateUserForm(
  values: CreateUserFormValues,
  selectedRoleName: string | null,
): FieldErrors<CreateUserFormValues> {
  const errors: FieldErrors<CreateUserFormValues> = {};

  if (!values.name.trim()) {
    errors.name = "Nama wajib diisi.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Nama minimal 3 karakter.";
  } else if (values.name.trim().length > 100) {
    errors.name = "Nama maksimal 100 karakter.";
  } else if (!namePattern.test(values.name)) {
    errors.name = "Nama hanya boleh berisi huruf, spasi, titik (.), dan tanda petik tunggal (').";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.roleId) errors.roleId = "Role wajib dipilih.";

  if (!values.password.trim()) {
    errors.password = "Password wajib diisi.";
  } else {
    if (values.password.length < 8) {
      errors.password = "Password minimal 8 karakter.";
    } else {
      const hasUpper = /[A-Z]/.test(values.password);
      const hasLower = /[a-z]/.test(values.password);
      const hasDigit = /[0-9]/.test(values.password);
      const hasSpecial = /[^A-Za-z0-9]/.test(values.password);
      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        errors.password = "Password harus mengandung minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 simbol.";
      }
    }
  }

  if (!isOwner(selectedRoleName) && !values.outletId) {
    errors.outletId = "Outlet wajib dipilih untuk role selain Owner.";
  }

  return errors;
}

export function validateUpdateUserForm(
  values: UpdateUserFormValues,
  selectedRoleName: string | null,
): FieldErrors<UpdateUserFormValues> {
  const errors: FieldErrors<UpdateUserFormValues> = {};

  if (!values.name.trim()) {
    errors.name = "Nama wajib diisi.";
  } else if (values.name.trim().length < 3) {
    errors.name = "Nama minimal 3 karakter.";
  } else if (values.name.trim().length > 100) {
    errors.name = "Nama maksimal 100 karakter.";
  } else if (!namePattern.test(values.name)) {
    errors.name = "Nama hanya boleh berisi huruf, spasi, titik (.), dan tanda petik tunggal (').";
  }

  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!values.roleId) errors.roleId = "Role wajib dipilih.";
  if (!isOwner(selectedRoleName) && !values.outletId) {
    errors.outletId = "Outlet wajib dipilih untuk role selain Owner.";
  }

  return errors;
}

export function validateChangePasswordForm(
  values: ChangePasswordFormValues,
): FieldErrors<ChangePasswordFormValues> {
  const errors: FieldErrors<ChangePasswordFormValues> = {};

  if (!values.currentPassword.trim()) {
    errors.currentPassword = "Password saat ini wajib diisi.";
  }

  if (!values.newPassword.trim()) {
    errors.newPassword = "Password baru wajib diisi.";
  } else {
    if (values.newPassword.length < 8) {
      errors.newPassword = "Password baru minimal 8 karakter.";
    } else {
      const hasUpper = /[A-Z]/.test(values.newPassword);
      const hasLower = /[a-z]/.test(values.newPassword);
      const hasDigit = /[0-9]/.test(values.newPassword);
      const hasSpecial = /[^A-Za-z0-9]/.test(values.newPassword);
      if (!hasUpper || !hasLower || !hasDigit || !hasSpecial) {
        errors.newPassword = "Password baru harus mengandung minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 simbol.";
      }
    }
  }

  if (values.newPassword && values.currentPassword && values.newPassword === values.currentPassword) {
    errors.newPassword = "Password baru tidak boleh sama dengan password lama.";
  }

  if (!values.confirmNewPassword.trim()) {
    errors.confirmNewPassword = "Konfirmasi password baru wajib diisi.";
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = "Konfirmasi password harus sama.";
  }

  return errors;
}
