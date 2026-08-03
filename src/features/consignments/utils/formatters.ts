import { formatCurrency, formatDateOnly, formatDateTime } from "../../procurement/utils/formatters";

export { formatCurrency, formatDateOnly, formatDateTime };

export function getConsignmentStatusClasses(status: string) {
  if (status === "received") {
    return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300";
  }

  if (status === "cancelled") {
    return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300";
  }

  return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300";
}

export function getSettlementStatusClasses(status: string) {
  if (status === "settled") {
    return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300";
  }

  if (status === "cancelled") {
    return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300";
  }

  return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300";
}
