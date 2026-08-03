import { Outlet } from "react-router";
import MorrusLogo from "./MorrusLogo";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center gap-10 lg:flex-row lg:items-center lg:gap-16">
        <section className="max-w-xl">
          <MorrusLogo />
          <div className="mt-8 space-y-5">
            <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
              Sistem operasional UMKM dalam satu shell
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Masuk ke <span className="text-brand-500">MorrusPOS</span>
            </h1>
            <p className="max-w-lg text-base leading-7 text-gray-600 dark:text-gray-300">
              Frontend fase awal untuk POS, stok real-time, supplier, dan konsinyasi.
              Login akan membawa Anda ke dashboard shell baru yang siap dihubungkan
              ke modul bisnis berikutnya.
            </p>
          </div>
        </section>

        <section className="w-full max-w-md">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
