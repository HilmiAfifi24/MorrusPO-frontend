export type SupplierDto = {
  id: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  isActive: boolean;
};

export type CreateSupplierRequest = {
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
};

export type UpdateSupplierRequest = CreateSupplierRequest & {
  isActive: boolean;
};

export type SupplierFormValues = {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  isActive: boolean;
};
