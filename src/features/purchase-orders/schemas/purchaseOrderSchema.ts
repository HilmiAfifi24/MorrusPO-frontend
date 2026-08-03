import type { PurchaseOrderFormValues } from "../types/purchaseOrder";

export function validatePurchaseOrderForm(values: PurchaseOrderFormValues) {
  const errors: Record<string, string> = {};

  if (!values.supplierId) {
    errors.supplierId = "Supplier wajib dipilih.";
  }

  if (values.paymentType === "tempo" && !values.dueDate) {
    errors.dueDate = "Tanggal jatuh tempo wajib diisi untuk PO tempo.";
  }

  if (values.items.length === 0) {
    errors.items = "Minimal satu item wajib diisi.";
    return errors;
  }

  const usedProductIds = new Set<string>();

  values.items.forEach((item, index) => {
    if (!item.productId) {
      errors[`items.${index}.productId`] = "Produk wajib dipilih.";
    } else if (usedProductIds.has(item.productId)) {
      errors[`items.${index}.productId`] = "Produk tidak boleh duplikat.";
    } else {
      usedProductIds.add(item.productId);
    }

    if (!item.qty || Number(item.qty) <= 0) {
      errors[`items.${index}.qty`] = "Qty harus lebih dari 0.";
    }

    if (!item.unitCost || Number(item.unitCost) <= 0) {
      errors[`items.${index}.unitCost`] = "Unit cost harus lebih dari 0.";
    }
  });

  return errors;
}
