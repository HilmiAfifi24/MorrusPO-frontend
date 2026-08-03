import type { ReactNode } from "react";
import {
  BoxCubeIcon,
  DocsIcon,
  GridIcon,
  GroupIcon,
  ListIcon,
  PlugInIcon,
  TableIcon,
  TaskIcon,
} from "../../icons";

export type AppRole = "Owner" | "Admin" | "Kasir" | "Gudang" | "Keuangan" | "Kepala Cabang" | string;

export type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
  allowedRoles?: AppRole[];
};

const adminRoles: AppRole[] = ["Owner", "Admin"];
const posRoles: AppRole[] = ["Owner", "Admin", "Kasir"];

export const appNavigation: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: <GridIcon /> },
  { label: "Sesi Kasir", path: "/cashier/session", icon: <TaskIcon />, allowedRoles: posRoles },
  { label: "POS Kasir", path: "/pos", icon: <PlugInIcon />, allowedRoles: posRoles },
  { label: "Transaksi", path: "/transactions", icon: <DocsIcon />, allowedRoles: posRoles },
  { label: "Produk", path: "/products", icon: <BoxCubeIcon />, allowedRoles: adminRoles },
  { label: "Kategori", path: "/categories", icon: <ListIcon />, allowedRoles: adminRoles },
  { label: "Stok", path: "/inventory", icon: <TableIcon />, allowedRoles: adminRoles },
  { label: "Transfer Stok", path: "/stock-transfers", icon: <DocsIcon />, allowedRoles: adminRoles },
  { label: "Supplier", path: "/suppliers", icon: <GroupIcon />, allowedRoles: adminRoles },
  { label: "Purchase Order", path: "/purchase-orders", icon: <TaskIcon />, allowedRoles: adminRoles },
  { label: "Utang Supplier", path: "/supplier-debts", icon: <DocsIcon />, allowedRoles: adminRoles },
  { label: "Konsinyasi", path: "/consignments", icon: <BoxCubeIcon />, allowedRoles: adminRoles },
  { label: "Pengguna", path: "/users", icon: <GroupIcon />, allowedRoles: adminRoles },
  { label: "Cabang", path: "/outlets", icon: <DocsIcon />, allowedRoles: adminRoles },
];

export function getVisibleNavigation(role: string | null): NavItem[] {
  if (!role) {
    return [];
  }

  return appNavigation.filter((item) => {
    if (!item.allowedRoles?.length) {
      return true;
    }

    return item.allowedRoles.includes(role);
  });
}
