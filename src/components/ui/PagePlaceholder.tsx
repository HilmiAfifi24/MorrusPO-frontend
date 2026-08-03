export default function PagePlaceholder({
  title,
  description,
  status = "Coming in next phase",
  children,
}: {
  title: string;
  description: string;
  status?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        <span className="rounded-full bg-warning-50 px-3 py-1 text-xs font-semibold text-warning-700 dark:bg-warning-500/10 dark:text-warning-300">
          {status}
        </span>
      </div>
      {children}
    </div>
  );
}
