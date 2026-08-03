import type { ReactNode } from "react";
import { RootProviders } from "./AuthProvider";
import CashierSessionProvider from "./CashierSessionProvider";
import OutletProvider from "./OutletProvider";
import RealtimeProvider from "./RealtimeProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RootProviders>
      <OutletProvider>
        <CashierSessionProvider>
          <RealtimeProvider>{children}</RealtimeProvider>
        </CashierSessionProvider>
      </OutletProvider>
    </RootProviders>
  );
}
