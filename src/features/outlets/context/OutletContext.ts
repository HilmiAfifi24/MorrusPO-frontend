import { createContext } from "react";

export type OutletContextValue = {
  selectedOutletId: string | null;
  setSelectedOutletId: (outletId: string | null) => void;
  resetSelectedOutletId: () => void;
};

export const OutletContext = createContext<OutletContextValue | undefined>(undefined);
