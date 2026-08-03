export type ProductDto = {
  id: string;
  categoryId: string;
  sku: string;
  name: string;
  barcode: string | null;
  basePrice: number;
  unit: string;
  isConsignment: boolean;
  qtyOnHand: number;
};

export type CreateProductRequest = {
  categoryId: string;
  sku: string;
  name: string;
  barcode: string | null;
  basePrice: number;
  costPrice: number;
  unit: string;
  isConsignment: boolean;
};

export type UpdateProductRequest = CreateProductRequest & {
  isActive: boolean;
};

export type ProductFilters = {
  outletId?: string;
};

export type ProductFormValues = {
  categoryId: string;
  sku: string;
  name: string;
  barcode: string;
  basePrice: string;
  costPrice: string;
  unit: string;
  isConsignment: boolean;
  isActive: boolean;
};
