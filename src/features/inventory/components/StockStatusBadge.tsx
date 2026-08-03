import {
  getInventoryStatus,
  getInventoryStatusTone,
} from "../utils/presentation";

export default function StockStatusBadge({
  qtyOnHand,
  minStockAlert,
  isLowStock,
}: {
  qtyOnHand: number;
  minStockAlert: number;
  isLowStock: boolean;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${getInventoryStatusTone(
        qtyOnHand,
        minStockAlert,
        isLowStock,
      )}`}
    >
      {getInventoryStatus(qtyOnHand, minStockAlert, isLowStock)}
    </span>
  );
}
