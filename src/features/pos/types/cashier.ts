export type CashierSessionDto = {
  id: string;
  outletId: string;
  outletName: string;
  userId: string;
  userName: string;
  openingTime: string;
  closingTime: string | null;
  openingCash: number;
  expectedCash: number;
  actualCash: number | null;
  variance: number | null;
  status: string;
};

export type OpenSessionRequest = {
  openingCash: number;
  outletId?: string | null;
};

export type CloseSessionRequest = {
  actualCash: number;
};
