import { useContext } from "react";
import { CashierSessionContext } from "../context/CashierSessionContext";

export function useCashierSession() {
  const context = useContext(CashierSessionContext);

  if (!context) {
    throw new Error("useCashierSession must be used within CashierSessionProvider");
  }

  return context;
}
