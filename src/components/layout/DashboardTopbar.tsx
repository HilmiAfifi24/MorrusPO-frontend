import { ThemeToggleButton } from "../common/ThemeToggleButton";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useOutlet } from "../../features/outlets/hooks/useOutlet";

function formatOutletLabel(outletId: string | null) {
  if (!outletId) {
    return "Semua outlet";
  }

  return `Outlet ${outletId.slice(0, 8)}`;
}

export default function DashboardTopbar({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  const { session, logout } = useAuth();
  const { selectedOutletId } = useOutlet();

  return (
    <header className="sticky top-0 z-999 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-200 lg:hidden"
            aria-label="Toggle navigation"
          >
            <span className="space-y-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              MorrusPOS
            </p>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dashboard Shell
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <div className="hidden rounded-2xl border border-gray-200 px-4 py-2 text-right dark:border-gray-800 sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {session?.name ?? "Unknown User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {session?.role ?? "Guest"} · {formatOutletLabel(selectedOutletId)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex items-center rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-theme-sm transition hover:bg-brand-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
