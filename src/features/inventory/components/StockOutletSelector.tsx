import type { OutletLookupDto } from "../../outlets/types/outlet";

export default function StockOutletSelector({
  ownerMode,
  value,
  onChange,
  outlets,
  disabled = false,
}: {
  ownerMode: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
  outlets: OutletLookupDto[];
  disabled?: boolean;
}) {
  return (
    <select
      value={value ?? ""}
      disabled={disabled || !ownerMode}
      onChange={(event) => onChange(event.target.value || null)}
      className="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:disabled:bg-gray-900"
    >
      <option value="">{ownerMode ? "Pilih outlet" : "Outlet aktif pengguna"}</option>
      {outlets.map((outlet) => (
        <option key={outlet.id} value={outlet.id}>
          {outlet.name}
        </option>
      ))}
    </select>
  );
}
