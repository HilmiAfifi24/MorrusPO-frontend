import type { ReactNode } from "react";
import AppErrorState from "../../components/ui/AppErrorState";
import { useAuth } from "../../features/auth/hooks/useAuth";

type PermissionGuardProps = {
  children: ReactNode;
  requiredPermissions?: string[];
  requiredRoles?: string[];
};

export default function PermissionGuard({
  children,
  requiredRoles = [],
}: PermissionGuardProps) {
  const { session } = useAuth();

  if (!requiredRoles.length || !session?.role) {
    return <>{children}</>;
  }

  if (requiredRoles.includes(session.role)) {
    return <>{children}</>;
  }

  return (
    <AppErrorState
      title="Akses dibatasi"
      description="Halaman ini belum tersedia untuk role Anda pada Fase 0 MorrusPOS."
      actionLabel="Kembali ke dashboard"
      actionHref="/dashboard"
      fullScreen={false}
    />
  );
}
