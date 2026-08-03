export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID");
}

export function formatPaymentMethod(method: string) {
  switch (method.toLowerCase()) {
    case "cash":
      return "Cash";
    case "qris":
      return "QRIS";
    case "transfer":
      return "Transfer";
    case "edc":
      return "EDC";
    case "refund":
      return "Refund";
    case "exchange":
      return "Exchange";
    default:
      return method;
  }
}

export function getTransactionStatusTone(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return "success";
    case "refunded":
      return "warning";
    case "voided":
      return "error";
    default:
      return "neutral";
  }
}
