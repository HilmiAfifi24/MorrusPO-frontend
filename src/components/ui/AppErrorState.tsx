import { Link } from "react-router";

export default function AppErrorState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-theme-sm dark:border-gray-800 dark:bg-gray-900">
        <span className="inline-flex rounded-full bg-error-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-error-700 dark:bg-error-500/10 dark:text-error-300">
          MorrusPOS
        </span>
        <h1 className="mt-5 text-3xl font-semibold text-gray-900 dark:text-white">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{description}</p>
        {actionHref && actionLabel ? (
          <Link
            to={actionHref}
            className="mt-6 inline-flex items-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
