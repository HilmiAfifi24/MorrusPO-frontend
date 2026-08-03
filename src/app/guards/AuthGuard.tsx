import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import AppLoader from "../../components/ui/AppLoader";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <AppLoader fullScreen label="Menyiapkan sesi MorrusPOS..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
