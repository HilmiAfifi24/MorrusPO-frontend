import type { ReactNode } from "react";
import { Navigate } from "react-router";
import AppLoader from "../../components/ui/AppLoader";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <AppLoader fullScreen label="Menyiapkan sesi MorrusPOS..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
