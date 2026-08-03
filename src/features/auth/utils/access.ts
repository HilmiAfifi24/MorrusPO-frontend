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
  return role === "Owner" || role === "Admin" || role === "Kasir";
}
