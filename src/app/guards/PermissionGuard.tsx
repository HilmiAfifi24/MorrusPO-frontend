import type { ReactNode } from "react";
import AppErrorState from "../../components/ui/AppErrorState";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { canAccessByPolicy } from "../../features/auth/utils/access";

type PermissionGuardProps = {
  children: ReactNode;
  requiredPermissions?: string[];
  fallbackRoles?: string[];
  allowPlaceholder?: boolean;
};

export default function PermissionGuard({
  children,
  requiredPermissions = [],
  fallbackRoles = [],
}: PermissionGuardProps) {
  const { session } = useAuth();

  if (!requiredPermissions.length && !fallbackRoles.length) {
    return <>{children}</>;
  }

  if (
    canAccessByPolicy(session, {
      requiredPermissions,
      fallbackRoles,
    })
  ) {
    return <>{children}</>;
  }

  return (
    <AppErrorState
      title="Akses dibatasi"
      description="Role atau permission akun Anda belum memenuhi policy akses untuk halaman ini."
      actionLabel="Kembali ke dashboard"
      actionHref="/dashboard"
      fullScreen={false}
    />
  );
}
