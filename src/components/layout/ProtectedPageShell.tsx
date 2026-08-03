import type { ReactNode } from "react";
import PageMeta from "../common/PageMeta";

export default function ProtectedPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageMeta title={`${title} | MorrusPOS`} description={description} />
      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-600">
            MorrusPOS
          </p>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="max-w-3xl text-sm text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
        {children}
      </section>
    </>
  );
}
