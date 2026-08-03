import { Link } from "react-router";

export default function MorrusLogo() {
  return (
    <Link to="/dashboard" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500 text-sm font-bold text-white shadow-theme-sm">
        MP
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white">
          MorrusPOS
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Frontend Phase 0 Shell
        </span>
      </span>
    </Link>
  );
}
