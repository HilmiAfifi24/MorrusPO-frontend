import type { ReactNode } from "react";

interface StorefrontEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onActionClick?: () => void;
}

export function StorefrontEmptyState({
  title,
  description,
  icon,
  actionLabel,
  onActionClick,
}: StorefrontEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center font-outfit min-h-[300px]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
        {icon ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-8 w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{description}</p>

      {actionLabel && onActionClick && (
        <button
          onClick={onActionClick}
          className="mt-6 rounded-2xl bg-storefront-primary-500 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-storefront-primary-600 active:scale-[0.98] shadow-storefront-premium"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default StorefrontEmptyState;
