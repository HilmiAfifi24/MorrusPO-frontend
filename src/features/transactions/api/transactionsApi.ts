import { apiClient } from "../../../api/client";
import type {
  CheckoutRequest,
  RefundTransactionRequest,
  TransactionDto,
  TransactionListItemDto,
  VoidTransactionRequest,
} from "../types/transaction";

export function getRecentTransactions(outletId: string, take = 20) {
  const params = new URLSearchParams({
    outletId,
    take: String(take),
  });

  return apiClient.get<TransactionListItemDto[]>(`/api/transactions?${params.toString()}`);
}

export function getTransactionById(id: string) {
  return apiClient.get<TransactionDto>(`/api/transactions/${id}`);
}

export function checkoutTransaction(payload: CheckoutRequest) {
  return apiClient.post<TransactionDto>("/api/transactions/checkout", payload);
}

export function voidTransaction(id: string, payload: VoidTransactionRequest) {
  return apiClient.post<TransactionDto>(`/api/transactions/${id}/void`, payload);
}

export function refundTransaction(id: string, payload: RefundTransactionRequest) {
  return apiClient.post<TransactionDto>(`/api/transactions/${id}/refund`, payload);
}
