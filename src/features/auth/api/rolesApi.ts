import { apiClient } from "../../../api/client";
import type { RoleLookupDto } from "../types/role";

export function getRoles() {
  return apiClient.get<RoleLookupDto[]>("/api/roles");
}
