import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../auth/hooks/useAuth";
import { isOwner } from "../../auth/utils/access";
import { getOutlets } from "../../outlets/api/outletsApi";
import { useOutlet } from "../../outlets/hooks/useOutlet";
import type { OutletLookupDto } from "../../outlets/types/outlet";

export function useProcurementOutletScope() {
  const { session } = useAuth();
  const { selectedOutletId, setSelectedOutletId } = useOutlet();
  const [outlets, setOutlets] = useState<OutletLookupDto[]>([]);
  const [isLoadingOutlets, setIsLoadingOutlets] = useState(false);

  const ownerMode = isOwner(session?.role);
  const effectiveOutletId = ownerMode ? selectedOutletId : session?.outletId ?? null;

  useEffect(() => {
    async function loadOutlets() {
      if (!(ownerMode || session?.role === "Admin" || session?.role === "Keuangan")) {
        return;
      }

      setIsLoadingOutlets(true);

      try {
        setOutlets(await getOutlets());
      } finally {
        setIsLoadingOutlets(false);
      }
    }

    void loadOutlets();
  }, [ownerMode, session?.role]);

  const activeOutlets = useMemo(() => outlets.filter((outlet) => outlet.isActive), [outlets]);

  return {
    ownerMode,
    effectiveOutletId,
    selectedOutletId,
    setSelectedOutletId,
    activeOutlets,
    isLoadingOutlets,
    sessionOutletId: session?.outletId ?? null,
  };
}
