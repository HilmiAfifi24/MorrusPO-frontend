export type CategoryDto = {
  id: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryRequest = {
  name: string;
  parentId: string | null;
};

export type UpdateCategoryRequest = CreateCategoryRequest;

export type CategoryFormValues = {
  name: string;
  parentId: string;
};

export type CategoryOption = {
  value: string;
  label: string;
  parentId?: string | null;
};
