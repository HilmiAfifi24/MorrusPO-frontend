import { apiClient } from "../../../api/client";
import type { OutletLookupDto } from "../types/outlet";

export function getOutlets() {
  return apiClient.get<OutletLookupDto[]>("/api/outlets");
}
