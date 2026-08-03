export type TransactionListItemDto = {
  id: string;
  transactionNumber: string;
  outletId: string;
  outletName: string;
  userId: string;
  userName: string;
  grandTotal: number;
  status: string;
  channel: string;
  createdAt: string;
  paymentSummary: string;
};

export type TransactionItemDto = {
  productId: string;
  productName: string;
  sku: string;
  qty: number;
  unitPrice: number;
  unitCost: number;
  discountAmount: number;
  lineTotal: number;
};

export type PaymentDto = {
  method: string;
  amount: number;
  referenceNumber: string | null;
  createdAt: string;
};

export type TransactionDto = {
  id: string;
  transactionNumber: string;
  outletId: string;
  outletName: string;
  userId: string;
  userName: string;
  cashierSessionId: string | null;
  channel: string;
  status: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  createdAt: string;
  items: TransactionItemDto[];
  payments: PaymentDto[];
};

export type CheckoutItemRequest = {
  productId: string;
  qty: number;
  unitPrice: number;
  discountAmount: number;
};

export type PaymentRequest = {
  method: string;
  amount: number;
  referenceNumber?: string | null;
};

export type CheckoutRequest = {
  id: string;
  outletId: string;
  cashierSessionId: string;
  channel: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  items: CheckoutItemRequest[];
  payments: PaymentRequest[];
};
