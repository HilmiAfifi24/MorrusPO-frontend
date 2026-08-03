import { useCallback, useEffect, useMemo, useState } from "react";
import { CashierSessionContext } from "../../features/pos/context/CashierSessionContext";
import {
  closeCashierSession,
  getCurrentCashierSession,
  openCashierSession,
} from "../../features/pos/api/cashierSessionsApi";
import type { CashierSessionDto } from "../../features/pos/types/cashier";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { isOwner, isOperationalPosRole } from "../../features/auth/utils/access";
import { useOutlet } from "../../features/outlets/hooks/useOutlet";

export default function CashierSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, session } = useAuth();
  const { selectedOutletId } = useOutlet();
  const [currentSession, setCurrentSession] = useState<CashierSessionDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetOutletId = isOwner(session?.role) ? selectedOutletId : session?.outletId ?? null;

  const refreshCurrentSession = useCallback(async () => {
    if (!isAuthenticated || !isOperationalPosRole(session?.role)) {
      setCurrentSession(null);
      setIsLoading(false);
      return null;
    }

    if (isOwner(session?.role) && !targetOutletId) {
      setCurrentSession(null);
      setIsLoading(false);
      return null;
    }

    setIsLoading(true);

    try {
      const nextSession = await getCurrentCashierSession(targetOutletId);
      setCurrentSession(nextSession);
      return nextSession;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, session?.role, targetOutletId]);

  useEffect(() => {
    void refreshCurrentSession();
  }, [refreshCurrentSession]);

  const openSession = useCallback(
    async (openingCash: number) => {
      const nextSession = await openCashierSession({
        openingCash,
        outletId: isOwner(session?.role) ? targetOutletId : undefined,
      });
      setCurrentSession(nextSession);
      return nextSession;
    },
    [session?.role, targetOutletId],
  );

  const closeSession = useCallback(
    async (actualCash: number) => {
      if (!currentSession) {
        throw new Error("Tidak ada sesi aktif untuk ditutup.");
      }

      const nextSession = await closeCashierSession(currentSession.id, { actualCash });
      setCurrentSession(null);
      return nextSession;
    },
    [currentSession],
  );

  const value = useMemo(
    () => ({
      currentSession,
      isLoading,
      refreshCurrentSession,
      openSession,
      closeSession,
    }),
    [closeSession, currentSession, isLoading, openSession, refreshCurrentSession],
  );

  return (
    <CashierSessionContext.Provider value={value}>{children}</CashierSessionContext.Provider>
  );
}
