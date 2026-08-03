import type { ReactNode } from "react";

export default function FormCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-theme-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description ? (
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
