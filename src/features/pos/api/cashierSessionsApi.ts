import { apiClient } from "../../../api/client";
import type {
  CashierSessionDto,
  CloseSessionRequest,
  OpenSessionRequest,
} from "../types/cashier";

export function getCurrentCashierSession(outletId?: string | null) {
  const search = outletId ? `?outletId=${encodeURIComponent(outletId)}` : "";
  return apiClient.get<CashierSessionDto | null>(`/api/cashier-sessions/current${search}`);
}

export function openCashierSession(payload: OpenSessionRequest) {
  return apiClient.post<CashierSessionDto>("/api/cashier-sessions/open", payload);
}

export function closeCashierSession(id: string, payload: CloseSessionRequest) {
  return apiClient.post<CashierSessionDto>(`/api/cashier-sessions/close/${id}`, payload);
}
