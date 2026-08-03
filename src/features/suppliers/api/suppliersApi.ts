import { apiClient } from "../../../api/client";
import type {
  CreateSupplierRequest,
  SupplierDto,
  UpdateSupplierRequest,
} from "../types/supplier";

export function getSuppliers() {
  return apiClient.get<SupplierDto[]>("/api/suppliers");
}

export function getSupplierById(id: string) {
  return apiClient.get<SupplierDto>(`/api/suppliers/${id}`);
}

export function createSupplier(payload: CreateSupplierRequest) {
  return apiClient.post<SupplierDto>("/api/suppliers", payload);
}

export function updateSupplier(id: string, payload: UpdateSupplierRequest) {
  return apiClient.put<SupplierDto>(`/api/suppliers/${id}`, payload);
}
