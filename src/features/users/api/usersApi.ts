import { apiClient } from "../../../api/client";
import type {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserDto,
} from "../types/user";

export function getUsers(outletId?: string | null) {
  const search = outletId ? `?outletId=${encodeURIComponent(outletId)}` : "";
  return apiClient.get<UserDto[]>(`/api/users${search}`);
}

export function getUserById(id: string) {
  return apiClient.get<UserDto>(`/api/users/${id}`);
}

export function createUser(payload: CreateUserRequest) {
  return apiClient.post<UserDto>("/api/users", payload);
}

export function updateUser(id: string, payload: UpdateUserRequest) {
  return apiClient.put<UserDto>(`/api/users/${id}`, payload);
}

export function deleteUser(id: string) {
  return apiClient.delete<void>(`/api/users/${id}`);
}

export function changePassword(id: string, payload: ChangePasswordRequest) {
  return apiClient.post<void>(`/api/users/${id}/change-password`, payload);
}
