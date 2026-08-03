import type { ReactNode } from "react";

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatStockQuantity(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function getConsignmentLabel(isConsignment: boolean) {
  return isConsignment ? "Konsinyasi" : "Reguler";
}

export function getConsignmentTone(isConsignment: boolean) {
  return isConsignment
    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
    : "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300";
}

export function getStockBadgeClasses(qty: number) {
  if (qty <= 0) {
    return "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-300";
  }

  if (qty <= 5) {
    return "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300";
  }

  return "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300";
}

export function buildCategoryLabel(name: string, parentName?: string | null) {
  return parentName ? `${parentName} / ${name}` : name;
}

export function buildTableCell(content: ReactNode, subtext?: ReactNode) {
  return (
    <div className="space-y-1">
      <div className="text-sm font-medium text-gray-900 dark:text-white">{content}</div>
      {subtext ? <div className="text-xs text-gray-500 dark:text-gray-400">{subtext}</div> : null}
    </div>
  );
}
