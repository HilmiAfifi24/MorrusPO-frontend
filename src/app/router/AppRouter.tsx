import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ScrollToTop } from "../../components/common/ScrollToTop";
import AppErrorState from "../../components/ui/AppErrorState";
import AuthGuard from "../guards/AuthGuard";
import GuestGuard from "../guards/GuestGuard";
import PermissionGuard from "../guards/PermissionGuard";
import AuthLayout from "../../components/layout/AuthLayout";
import CashierLayout from "../../components/layout/CashierLayout";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SignInPage from "../../features/auth/pages/SignInPage";
import CategoriesPage from "../../features/categories/pages/CategoriesPage";
import ConsignmentsPage from "../../features/consignments/pages/ConsignmentsPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import SupplierDebtsPage from "../../features/debts/pages/SupplierDebtsPage";
import InventoryPage from "../../features/inventory/pages/InventoryPage";
import OutletsPage from "../../features/outlets/pages/OutletsPage";
import PosPage from "../../features/pos/pages/PosPage";
import ProductsPage from "../../features/products/pages/ProductsPage";
import PurchaseOrdersPage from "../../features/purchase-orders/pages/PurchaseOrdersPage";
import SuppliersPage from "../../features/suppliers/pages/SuppliersPage";
import ChangePasswordPage from "../../features/users/pages/ChangePasswordPage";
import UserCreatePage from "../../features/users/pages/UserCreatePage";
import UserEditPage from "../../features/users/pages/UserEditPage";
import UsersPage from "../../features/users/pages/UsersPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/signin"
          element={
            <GuestGuard>
              <AuthLayout />
            </GuestGuard>
          }
        >
          <Route index element={<SignInPage />} />
        </Route>

        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="stock-transfers" element={<InventoryPage mode="transfers" />} />
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="supplier-debts" element={<SupplierDebtsPage />} />
          <Route path="consignments" element={<ConsignmentsPage />} />
          <Route
            path="users"
            element={
              <PermissionGuard requiredRoles={["Owner", "Admin"]}>
                <UsersPage />
              </PermissionGuard>
            }
          />
          <Route
            path="users/create"
            element={
              <PermissionGuard requiredRoles={["Owner", "Admin"]}>
                <UserCreatePage />
              </PermissionGuard>
            }
          />
          <Route
            path="users/:id/edit"
            element={
              <PermissionGuard requiredRoles={["Owner", "Admin"]}>
                <UserEditPage />
              </PermissionGuard>
            }
          />
          <Route path="profile/change-password" element={<ChangePasswordPage />} />
          <Route
            path="outlets"
            element={
              <PermissionGuard requiredRoles={["Owner", "Admin"]}>
                <OutletsPage />
              </PermissionGuard>
            }
          />
        </Route>

        <Route
          path="/pos"
          element={
            <AuthGuard>
              <CashierLayout />
            </AuthGuard>
          }
        >
          <Route index element={<PosPage />} />
        </Route>

        <Route
          path="*"
          element={
            <AppErrorState
              title="Halaman tidak ditemukan"
              description="Rute yang Anda buka belum tersedia di shell MorrusPOS."
              actionLabel="Kembali ke dashboard"
              actionHref="/dashboard"
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
