import { apiClient } from "../../../api/client";
import type {
  CheckoutRequest,
  TransactionDto,
  TransactionListItemDto,
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
