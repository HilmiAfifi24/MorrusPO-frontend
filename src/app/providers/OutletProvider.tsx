import { useMemo, useState } from "react";
import { OutletContext } from "../../features/outlets/context/OutletContext";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function OutletProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [manualSelectedOutletId, setManualSelectedOutletId] = useState<string | null>(null);

  const selectedOutletId = manualSelectedOutletId ?? session?.outletId ?? null;

  const value = useMemo(
    () => ({
      selectedOutletId,
      setSelectedOutletId: setManualSelectedOutletId,
      resetSelectedOutletId: () => setManualSelectedOutletId(null),
    }),
    [selectedOutletId]
  );

  return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>;
}
