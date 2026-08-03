import { isOwner } from "../../auth";
import type {
  ChangePasswordFormValues,
  CreateUserFormValues,
  UpdateUserFormValues,
} from "../types/user";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateUserForm(
  values: CreateUserFormValues,
  selectedRoleName: string | null,
): FieldErrors<CreateUserFormValues> {
  const errors: FieldErrors<CreateUserFormValues> = {};

  if (!values.name.trim()) errors.name = "Nama wajib diisi.";
  if (!values.email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!emailPattern.test(values.email)) {
    errors.email = "Format email tidak valid.";
  }
  if (!values.roleId) errors.roleId = "Role wajib dipilih.";
  if (!values.password.trim()) {
    errors.password = "Password wajib diisi.";
  } else if (values.password.length < 8) {
    errors.password = "Password minimal 8 karakter.";
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

  if (!values.name.trim()) errors.name = "Nama wajib diisi.";
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
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "Password baru minimal 8 karakter.";
  }
  if (!values.confirmNewPassword.trim()) {
    errors.confirmNewPassword = "Konfirmasi password baru wajib diisi.";
  } else if (values.confirmNewPassword !== values.newPassword) {
    errors.confirmNewPassword = "Konfirmasi password harus sama.";
  }

  return errors;
}
