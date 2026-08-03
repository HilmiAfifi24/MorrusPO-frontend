import { FieldErrorText, FormCard } from "../../../components/forms";
import InlineAlert from "../../../components/ui/InlineAlert";
import type { ChangePasswordFormValues } from "../types/user";

export default function ChangePasswordForm({
  values,
  errors,
  submitError,
  isSubmitting,
  onChange,
  onSubmit,
}: {
  values: ChangePasswordFormValues;
  errors: Partial<Record<keyof ChangePasswordFormValues, string>>;
  submitError?: string | null;
  isSubmitting: boolean;
  onChange: <K extends keyof ChangePasswordFormValues>(
    key: K,
    value: ChangePasswordFormValues[K],
  ) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <FormCard
      title="Ganti password"
      description="Untuk keamanan, password lama tetap dibutuhkan sesuai kontrak backend saat ini."
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <InlineAlert tone="error" message={submitError} />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Password saat ini
          </span>
          <input
            type="password"
            value={values.currentPassword}
            onChange={(event) => onChange("currentPassword", event.target.value)}
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
          <FieldErrorText message={errors.currentPassword} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Password baru
          </span>
          <input
            type="password"
            value={values.newPassword}
            onChange={(event) => onChange("newPassword", event.target.value)}
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
          <FieldErrorText message={errors.newPassword} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
            Konfirmasi password baru
          </span>
          <input
            type="password"
            value={values.confirmNewPassword}
            onChange={(event) => onChange("confirmNewPassword", event.target.value)}
            className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          />
          <FieldErrorText message={errors.confirmNewPassword} />
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-theme-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Menyimpan..." : "Perbarui password"}
          </button>
        </div>
      </form>
    </FormCard>
  );
}
