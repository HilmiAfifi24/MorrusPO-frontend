export type UserDto = {
  id: string;
  outletId: string | null;
  outletName: string | null;
  roleId: string;
  roleName: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRequest = {
  outletId: string | null;
  roleId: string;
  name: string;
  email: string;
  password: string;
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  roleId: string;
  outletId: string | null;
  isActive: boolean;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type CreateUserFormValues = {
  outletId: string;
  roleId: string;
  name: string;
  email: string;
  password: string;
};

export type UpdateUserFormValues = {
  outletId: string;
  roleId: string;
  name: string;
  email: string;
  isActive: boolean;
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
