import { createContext } from "react";
import type { CashierSessionDto } from "../types/cashier";

export type CashierSessionContextValue = {
  currentSession: CashierSessionDto | null;
  isLoading: boolean;
  refreshCurrentSession: () => Promise<CashierSessionDto | null>;
  openSession: (openingCash: number) => Promise<CashierSessionDto>;
  closeSession: (actualCash: number) => Promise<CashierSessionDto>;
};

export const CashierSessionContext = createContext<CashierSessionContextValue | undefined>(
  undefined,
);
