export default function InlineAlert({
  tone = "info",
  message,
}: {
  tone?: "info" | "success" | "error";
  message?: string | null;
}) {
  if (!message) {
    return null;
  }

  const toneClasses =
    tone === "success"
      ? "border-success-200 bg-success-50 text-success-700 dark:border-success-500/20 dark:bg-success-500/10 dark:text-success-300"
      : tone === "error"
        ? "border-error-200 bg-error-50 text-error-700 dark:border-error-500/20 dark:bg-error-500/10 dark:text-error-300"
        : "border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300";

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses}`}>{message}</div>;
}
