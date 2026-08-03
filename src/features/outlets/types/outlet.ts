export type OutletDto = {
  id: string;
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OutletLookupDto = OutletDto;

export type CreateOutletRequest = {
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
};

export type UpdateOutletRequest = {
  code: string;
  name: string;
  address: string | null;
  phone: string | null;
  isActive: boolean;
};

export type OutletFormValues = {
  code: string;
  name: string;
  address: string;
  phone: string;
  isActive: boolean;
};
