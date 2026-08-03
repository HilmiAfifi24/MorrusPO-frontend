export default function AppLoader({
  label = "Memuat MorrusPOS...",
  fullScreen = false,
}: {
  label?: string;
  fullScreen?: boolean;
}) {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[240px]"} flex items-center justify-center bg-gray-50 dark:bg-gray-950`}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
      </div>
    </div>
  );
}
