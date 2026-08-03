import { Link, Outlet } from "react-router";
import MorrusLogo from "./MorrusLogo";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useCashierSession } from "../../features/pos/hooks/useCashierSession";

export default function CashierLayout() {
  const { session } = useAuth();
  const { currentSession } = useCashierSession();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-4">
            <MorrusLogo />
            <div className="hidden text-sm text-gray-500 dark:text-gray-400 md:block">
              <p className="font-medium text-gray-900 dark:text-white">
                {currentSession?.outletName ?? "POS Kasir MorrusPOS"}
              </p>
              <p>{currentSession ? `Kasir aktif: ${currentSession.userName}` : "Sesi kasir belum aktif"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/cashier/session"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200"
            >
              Sesi kasir
            </Link>
            <Link
              to="/transactions"
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 dark:border-gray-800 dark:text-gray-200"
            >
              Histori
            </Link>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              {session?.name ?? "User"} · {session?.role ?? "-"}
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <Outlet />
      </main>
    </div>
  );
}
