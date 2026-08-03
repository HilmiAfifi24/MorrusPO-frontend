import { useMemo } from "react";
import { FieldErrorText, FormCard } from "../../../components/forms";
import InlineAlert from "../../../components/ui/InlineAlert";
import { isOwner } from "../../auth";
import type { RoleLookupDto } from "../../auth/types/role";
import type { OutletLookupDto } from "../../outlets/types/outlet";
import type {
  CreateUserFormValues,
  UpdateUserFormValues,
} from "../types/user";

type SharedValues = CreateUserFormValues | UpdateUserFormValues;
type SharedErrors = Partial<
  Record<
    | keyof CreateUserFormValues
    | keyof UpdateUserFormValues,
    string
  >
>;
type SharedFieldValue = string | boolean;

type UserFormProps = {
  mode: "create" | "edit";
  values: SharedValues;
  errors: SharedErrors;
  roles: RoleLookupDto[];
  outlets: OutletLookupDto[];
  canAssignOwner: boolean;
  canChooseOutlet: boolean;
  isSubmitting: boolean;
  submitError?: string | null;
  onChange: (key: string, value: SharedFieldValue) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function UserForm({
  mode,
  values,
  errors,
  roles,
  outlets,
  canAssignOwner,
  canChooseOutlet,
  isSubmitting,
  submitError,
  onChange,
  onSubmit,
}: UserFormProps) {
  const selectableRoles = useMemo(
    () => roles.filter((role) => canAssignOwner || role.name !== "Owner"),
    [canAssignOwner, roles],
  );

  const selectedRoleName =
    roles.find((role) => role.id === values.roleId)?.name ?? null;

  return (
    <FormCard
      title={mode === "create" ? "Tambah pengguna" : "Edit pengguna"}
      description="Kelola akun user MorrusPOS sesuai outlet dan hak akses yang tersedia."
    >
      <form className="space-y-5" onSubmit={onSubmit}>
        <InlineAlert tone="error" message={submitError} />

        <div className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Nama
            </span>
            <input
              value={values.name}
              onChange={(event) => onChange("name", event.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
            <FieldErrorText message={errors.name} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </span>
            <input
              type="email"
              value={values.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            />
            <FieldErrorText message={errors.email} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Role
            </span>
            <select
              value={values.roleId}
              onChange={(event) => onChange("roleId", event.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
            >
              <option value="">Pilih role</option>
              {selectableRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <FieldErrorText message={errors.roleId} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Outlet
            </span>
            <select
              value={values.outletId}
              disabled={!canChooseOutlet || isOwner(selectedRoleName)}
              onChange={(event) => onChange("outletId", event.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:disabled:bg-gray-900"
            >
              <option value="">
                {isOwner(selectedRoleName) ? "Tidak perlu outlet untuk Owner" : "Pilih outlet"}
              </option>
              {outlets.map((outlet) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </option>
              ))}
            </select>
            <FieldErrorText message={errors.outletId} />
          </label>

          {"password" in values ? (
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </span>
              <input
                type="password"
                value={values.password}
                onChange={(event) => onChange("password", event.target.value)}
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <FieldErrorText message={errors.password} />
            </label>
          ) : null}

          {"isActive" in values ? (
            <label className="inline-flex items-center gap-3 md:col-span-2">
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(event) => onChange("isActive", event.target.checked)}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Pengguna aktif
              </span>
            </label>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-theme-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? "Memproses..."
              : mode === "create"
                ? "Simpan pengguna"
                : "Perbarui pengguna"}
          </button>
        </div>
      </form>
    </FormCard>
  );
}
