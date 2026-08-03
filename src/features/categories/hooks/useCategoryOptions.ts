import { useMemo } from "react";
import type { CategoryDto, CategoryOption } from "../types/category";

export function useCategoryOptions(categories: CategoryDto[], excludeId?: string | null) {
  return useMemo<CategoryOption[]>(
    () =>
      categories
        .filter((category) => category.id !== excludeId)
        .map((category) => ({
          value: category.id,
          label: category.parentName ? `${category.parentName} / ${category.name}` : category.name,
          parentId: category.parentId,
        })),
    [categories, excludeId],
  );
}
