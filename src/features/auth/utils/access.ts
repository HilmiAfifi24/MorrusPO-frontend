import type { AuthSession } from "../types/auth";

export function isOwner(role: string | null | undefined) {
  return role === "Owner";
}

export function isAdmin(role: string | null | undefined) {
  return role === "Admin";
}

export function isPrivilegedUser(role: string | null | undefined) {
  return isOwner(role) || isAdmin(role);
}

export function isOperationalPosRole(role: string | null | undefined) {
  return role === "Owner" || role === "Admin" || role === "Kasir" || role === "KepalaCabang";
}

export function hasRole(
  role: string | null | undefined,
  allowedRoles: string[] | undefined,
) {
  if (!allowedRoles?.length || !role) {
    return false;
  }

  return allowedRoles.includes(role);
}

export function hasAnyPermission(
  session: Pick<AuthSession, "permissions"> | null | undefined,
  requiredPermissions: string[] | undefined,
) {
  if (!requiredPermissions?.length) {
    return false;
  }

  const grantedPermissions = session?.permissions ?? [];
  return requiredPermissions.some((permission) => grantedPermissions.includes(permission));
}

export function canAccessByPolicy(
  session: Pick<AuthSession, "role" | "permissions"> | null | undefined,
  options: {
    requiredPermissions?: string[];
    fallbackRoles?: string[];
  },
) {
  const { requiredPermissions, fallbackRoles } = options;

  if (!requiredPermissions?.length && !fallbackRoles?.length) {
    return true;
  }

  return (
    hasAnyPermission(session, requiredPermissions) ||
    hasRole(session?.role, fallbackRoles)
  );
}
