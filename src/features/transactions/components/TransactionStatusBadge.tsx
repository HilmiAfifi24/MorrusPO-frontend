import { getTransactionStatusTone } from "../utils/formatters";

type TransactionStatusBadgeProps = {
  status: string;
};

export default function TransactionStatusBadge({
  status,
}: TransactionStatusBadgeProps) {
  const tone = getTransactionStatusTone(status);

  const className =
    tone === "success"
      ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300"
      : tone === "warning"
        ? "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300"
        : tone === "error"
          ? "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      {status}
    </span>
  );
}
