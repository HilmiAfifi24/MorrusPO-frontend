import { apiClient } from "../../../api/client";
import type {
  CreateOutletRequest,
  OutletDto,
  UpdateOutletRequest,
} from "../types/outlet";

export function getOutlets() {
  return apiClient.get<OutletDto[]>("/api/outlets");
}

export function getOutletById(id: string) {
  return apiClient.get<OutletDto>(`/api/outlets/${id}`);
}

export function createOutlet(payload: CreateOutletRequest) {
  return apiClient.post<OutletDto>("/api/outlets", payload);
}

export function updateOutlet(id: string, payload: UpdateOutletRequest) {
  return apiClient.put<OutletDto>(`/api/outlets/${id}`, payload);
}
