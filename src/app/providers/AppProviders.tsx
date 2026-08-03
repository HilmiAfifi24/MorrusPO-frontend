import type { ReactNode } from "react";
import { RootProviders } from "./AuthProvider";
import OutletProvider from "./OutletProvider";
import RealtimeProvider from "./RealtimeProvider";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <RootProviders>
      <OutletProvider>
        <RealtimeProvider>{children}</RealtimeProvider>
      </OutletProvider>
    </RootProviders>
  );
}
