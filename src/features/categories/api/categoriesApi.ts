import { apiClient } from "../../../api/client";
import type {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";

export function getCategories() {
  return apiClient.get<CategoryDto[]>("/api/categories");
}

export function getCategoryById(id: string) {
  return apiClient.get<CategoryDto>(`/api/categories/${id}`);
}

export function createCategory(payload: CreateCategoryRequest) {
  return apiClient.post<CategoryDto>("/api/categories", payload);
}

export function updateCategory(id: string, payload: UpdateCategoryRequest) {
  return apiClient.put<CategoryDto>(`/api/categories/${id}`, payload);
}

export function deleteCategory(id: string) {
  return apiClient.delete<void>(`/api/categories/${id}`);
}
